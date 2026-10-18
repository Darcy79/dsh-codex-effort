#!/usr/bin/env node
/**
 * Capture a short motion sequence of the standalone demo.
 *
 * Usage:
 *   node scripts/cdp-motion.mjs <demo-url> <frames-dir>
 *
 * The output is a folder of PNG frames; `scripts/make-motion-gif.mjs` crops
 * and assembles them into the README GIF. This keeps the capture loop
 * dependency-free (no Playwright).
 */
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const EDGE = process.env.EDGE_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const [url, framesDir = 'media/motion-frames'] = process.argv.slice(2)
if (!url) {
  console.error('usage: node scripts/cdp-motion.mjs <demo-url> [frames-dir]')
  process.exit(2)
}

const width = 1200
const height = 800
const port = 9700 + Math.floor(Math.random() * 200)
const userDataDir = await mkdtemp(join(tmpdir(), 'dsh-motion-'))
await mkdir(framesDir, { recursive: true })

const edge = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore', windowsHide: true })

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function getJson(path) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}${path}`)
      if (response.ok) return response.json()
    } catch {}
    await sleep(100)
  }
  throw new Error(`CDP endpoint ${path} did not become ready`)
}

let socket
let nextId = 0
const pending = new Map()

function send(method, params = {}) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
  })
}

let frameIndex = 0

async function capture() {
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    clip: { x: 230, y: 420, width: 740, height: 270, scale: 1 },
  })
  const name = `frame-${String(frameIndex).padStart(3, '0')}.png`
  frameIndex += 1
  await writeFile(join(framesDir, name), Buffer.from(result.data, 'base64'))
}

async function evaluate(expression) {
  return send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
}

async function burst(count, gap = 70) {
  for (let index = 0; index < count; index += 1) {
    await capture()
    await sleep(gap)
  }
}

function setTierScript(value) {
  return `(() => {
    const range = document.querySelector('#effortRange')
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setter.call(range, '${value}')
    range.dispatchEvent(new Event('input', { bubbles: true }))
    return { title: document.querySelector('#tierTitle').textContent }
  })()`
}

try {
  const targets = await getJson('/json/list')
  const page = targets.find(target => target.type === 'page')
  if (!page) throw new Error('no page target')
  socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data))
    if (message.id === undefined) return
    const waiter = pending.get(message.id)
    if (!waiter) return
    pending.delete(message.id)
    if (message.error) waiter.reject(new Error(`${message.error.code}: ${message.error.message}`))
    else waiter.resolve(message.result)
  })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: false,
  })
  await send('Page.navigate', { url })
  await sleep(3200)

  // Medium (blue) → High (blue) → Ultra + Fast (purple) → Low (blue) → Medium.
  await burst(8)
  await evaluate(setTierScript(3))
  await burst(14)
  await evaluate(setTierScript(4))
  await burst(18)
  await evaluate(setTierScript(1))
  await burst(14)
  await evaluate(setTierScript(2))
  await burst(12)

  // Close and reopen the popover so the final GIF also demonstrates motion.
  await evaluate("document.querySelector('#triggerPill').click()")
  await burst(6)
  await evaluate("document.querySelector('#triggerPill').click()")
  await burst(8)

  await writeFile(join(framesDir, 'meta.json'), JSON.stringify({ frames: frameIndex }, null, 2))
  console.log(`captured ${frameIndex} frames in ${framesDir}`)
} finally {
  try { socket?.close() } catch {}
  edge.kill()
  await sleep(250)
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {})
}
