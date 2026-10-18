#!/usr/bin/env node
/**
 * Tiny CDP screenshot helper used while developing the plugin.
 *
 * Usage:
 *   node scripts/cdp-shot.mjs <url> <out.png> [width] [height] [waitMs]
 *
 * It launches a private headless Edge instance with remote debugging, navigates,
 * waits for the app to settle, and writes a PNG. Keeping this in-repo makes the
 * visual regression loop reproducible without adding Playwright.
 */
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const EDGE = process.env.EDGE_PATH ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const [url, out = 'shot.png', widthArg = '1440', heightArg = '900', waitArg = '6000'] = process.argv.slice(2)
if (!url) {
  console.error('usage: node scripts/cdp-shot.mjs <url> <out.png> [width] [height] [waitMs]')
  process.exit(2)
}
const width = Number(widthArg)
const height = Number(heightArg)
const waitMs = Number(waitArg)
const port = 9400 + Math.floor(Math.random() * 400)
const userDataDir = await mkdtemp(join(tmpdir(), 'dsh-cdp-'))

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
  for (let i = 0; i < 100; i += 1) {
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
const consoleLines = []

function send(method, params = {}) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
  })
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
    if (message.id === undefined) {
      if (message.method === 'Runtime.consoleAPICalled') {
        const text = (message.params.args ?? []).map((arg) => {
          if (arg.value !== undefined) return typeof arg.value === 'string' ? arg.value : JSON.stringify(arg.value)
          return arg.description ?? arg.type ?? ''
        }).join(' ')
        consoleLines.push(`${message.params.type}: ${text}`)
      }
      return
    }
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
  await sleep(waitMs)
  const expression = process.env.EVAL_FILE
    ? await readFile(process.env.EVAL_FILE, 'utf8')
    : process.env.EVAL
  if (expression) {
    const evaluated = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    console.log(JSON.stringify({ eval: evaluated.result?.value ?? null }))
    await sleep(Number(process.env.EVAL_WAIT ?? '1200'))
  }
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  })
  await writeFile(out, Buffer.from(result.data, 'base64'))
  const title = await send('Runtime.evaluate', { expression: 'document.title', returnByValue: true })
  if (consoleLines.length > 0) console.log(consoleLines.join('\n'))
  console.log(JSON.stringify({ out, title: title.result?.value ?? '' }))
} finally {
  try { socket?.close() } catch {}
  edge.kill()
  await sleep(250)
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {})
}
