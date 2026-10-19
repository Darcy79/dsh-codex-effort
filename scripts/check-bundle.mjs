#!/usr/bin/env node
/**
 * Offline contract checks for the DSH client module registry.
 * Run after `node scripts/build.mjs`.
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const failures = []
const check = (condition, message) => {
  if (!condition) failures.push(message)
}

const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'))
const patch = await readFile(join(ROOT, 'cordis.patch.yml'), 'utf8')
const readme = await readFile(join(ROOT, 'README.md'), 'utf8')
const host = await readFile(join(ROOT, 'lib', 'index.js'), 'utf8')
const client = await readFile(join(ROOT, 'lib', 'client.js'), 'utf8')

// The project author requires this sentence to survive every future release.
const REQUIRED_ACKNOWLEDGEMENT = '感谢小猫c女士提供的审美支持和改动方向引导'

check(pkg.name === 'dsh-codex-effort', 'package name must equal the module-loader id')
check(pkg.dsh?.client?.platform === 'web', 'dsh.client.platform must be "web"')
check(pkg.exports?.['./client'] === './lib/client.js', 'exports["./client"] must point at lib/client.js')
check(pkg.dsh?.bundle?.patch === './cordis.patch.yml', 'dsh.bundle.patch must point at cordis.patch.yml')
check(client.startsWith('window.__ModuleLoader__.load({'), 'client bundle must start with __ModuleLoader__.load')
check(client.includes(`id: ${JSON.stringify(pkg.name)}`), 'bundle id must match the package name')
check(client.trimEnd().endsWith('return module.exports;\n\t}\n});'), 'bundle must close its factory and loader')
check(host.includes('export function apply'), 'host half must export apply')
check(patch.includes('id: dsh-codex-effort'), 'cordis.patch.yml must insert the plugin row')
check(patch.includes('name: dsh-codex-effort'), 'cordis.patch.yml must name the plugin')
check(readme.includes(REQUIRED_ACKNOWLEDGEMENT), `README must keep the required acknowledgment: ${REQUIRED_ACKNOWLEDGEMENT}`)

const platformModules = new Set([
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
  '@deepseek-ai/dsh-client-runtime/client',
])
const required = [...client.matchAll(/\brequire\(\s*["']([^"']+)["']\s*\)/g)].map(match => match[1])
for (const id of required) {
  check(platformModules.has(id), `client bundle requires non-platform module "${id}"`)
}

try {
  new vm.Script(client, { filename: 'lib/client.js' })
} catch (error) {
  failures.push(`client bundle does not parse: ${error.message}`)
}

if (failures.length > 0) {
  console.error('dsh-codex-effort check failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(`ok: ${pkg.name} client bundle (${Buffer.byteLength(client)} bytes), host half, and patch`)
