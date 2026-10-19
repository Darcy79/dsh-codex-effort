#!/usr/bin/env node
/**
 * Dependency-free build for dsh-codex-effort.
 *
 * The client half is a hand-authored Cordis/client bundle body. This script
 * wraps it in the exact `window.__ModuleLoader__.load({ id, factory })`
 * envelope the DSH shell expects, and inlines the stylesheet so the bundle
 * stays a single self-contained file.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const normalizeEol = (text) => text.replace(/\r\n?/g, '\n')
const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'))
const id = pkg.name
const body = normalizeEol(await readFile(join(ROOT, 'src', 'client', 'index.js'), 'utf8'))
const css = normalizeEol(await readFile(join(ROOT, 'src', 'client', 'styles.css'), 'utf8'))
const host = normalizeEol(await readFile(join(ROOT, 'src', 'index.js'), 'utf8'))

const banner = [
  'window.__ModuleLoader__.load({',
  `\tid: ${JSON.stringify(id)},`,
  '\tfactory: (require) => {',
  '\t\tvar module = { exports: {} };',
  '\t\tvar exports = module.exports;',
  '',
].join('\n')

const footer = [
  '',
  '\t\treturn module.exports;',
  '\t}',
  '});',
  '',
].join('\n')

const styles = `const DCE_STYLES = ${JSON.stringify(css)};\n\n`
const bundle = banner + styles + body + footer

await mkdir(join(ROOT, 'lib'), { recursive: true })
await writeFile(join(ROOT, 'lib', 'client.js'), bundle, 'utf8')
await writeFile(join(ROOT, 'lib', 'index.js'), host, 'utf8')
console.log(`built ${id}: lib/index.js + lib/client.js (${Buffer.byteLength(bundle)} bytes)`)
