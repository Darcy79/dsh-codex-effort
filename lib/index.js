/**
 * Host half of dsh-codex-effort.
 *
 * The plugin is intentionally browser-only. This entry exists so the Host
 * loader can mount the package and the client module registry can discover
 * its `dsh.client` declaration.
 */
export const name = 'dsh-codex-effort'

export function apply() {
  // No host services are needed: reasoning effort is selected through the
  // existing per-session model directory exposed by dsh-client-ui-model-selection.
}
