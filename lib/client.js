window.__ModuleLoader__.load({
	id: "dsh-codex-effort",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
const DCE_STYLES = "/* ─────────────────────────────────────────────────────────────\n   dsh-codex-effort — Codex-flavoured reasoning effort control\n   All selectors live under the plugin's own namespace.\n   ───────────────────────────────────────────────────────────── */\n\n.dce-root,\n.dce-portal,\n.dce-pop {\n  --dce-blue: #2f6bff;\n  --dce-blue-fill: #3a83f7;\n  --dce-violet: #8b5cf6;\n  --dce-violet-deep: #6d3ff5;\n  --dce-violet-light: #c084fc;\n  --dce-max-rose: #e83e8c;\n  --dce-max-rose-deep: #d81b60;\n  --dce-surface: var(--dsw-alias-bg-layer-1, #ffffff);\n  --dce-surface-soft: var(--dsw-specific-selector, #f5f6f7);\n  --dce-text: var(--dsw-alias-label-primary, #0f1115);\n  --dce-text-secondary: var(--dsw-alias-label-secondary, #61666b);\n  --dce-text-caption: var(--dsw-alias-label-caption, #adb2b8);\n  --dce-line: var(--dsw-alias-border-l2, rgba(15, 17, 21, 0.1));\n  --dce-line-soft: var(--dsw-alias-border-l1, rgba(15, 17, 21, 0.04));\n  --dce-hover: var(--dsw-alias-interactive-bg-hover, rgba(38, 49, 72, 0.06));\n  --dce-track: var(--dsw-alias-bg-overlay, #e9e8ea);\n  --dce-font: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, \"Segoe UI\",\n    \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif);\n}\n\n.dce-root {\n  display: inline-flex;\n  align-items: center;\n  font-family: var(--dce-font);\n  line-height: 1;\n}\n\n/* ── composer trigger ───────────────────────────────────────── */\n\n.dce-pill {\n  position: relative;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  width: 144px;\n  min-width: 144px;\n  height: 28px;\n  padding: 0 10px;\n  border: 1px solid color-mix(in srgb, var(--dce-surface) 46%, var(--dce-line));\n  border-radius: 999px;\n  background:\n    radial-gradient(\n      120% 160% at 15% 0%,\n      color-mix(in srgb, var(--dce-surface) 48%, transparent),\n      transparent 62%\n    ),\n    radial-gradient(\n      90% 140% at 90% 110%,\n      color-mix(in srgb, var(--dce-violet) 18%, transparent),\n      transparent 64%\n    ),\n    color-mix(in srgb, var(--dce-surface-soft) 52%, transparent);\n  color: var(--dce-text-secondary);\n  font: 500 12.5px/1 var(--dce-font);\n  letter-spacing: 0.005em;\n  white-space: nowrap;\n  cursor: pointer;\n  outline: none;\n  isolation: isolate;\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.58),\n    0 1px 2px rgba(20, 30, 60, 0.04),\n    0 5px 16px -8px rgba(64, 92, 255, 0.34),\n    0 0 28px -8px rgba(88, 112, 255, 0.6),\n    0 0 7px rgba(146, 126, 255, 0.16);\n  transition:\n    background-color 180ms ease,\n    color 180ms ease,\n    border-color 180ms ease,\n    box-shadow 220ms ease,\n    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.dce-pill:hover {\n  color: var(--dce-text);\n  border-color: color-mix(in srgb, var(--dce-blue) 16%, var(--dce-line));\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.66),\n    0 2px 4px rgba(20, 30, 60, 0.05),\n    0 9px 24px -9px rgba(64, 92, 255, 0.42);\n  transform: translateY(-1px);\n}\n\n.dce-pill:active {\n  transform: scale(0.975);\n}\n\n.dce-pill:focus-visible {\n  box-shadow:\n    0 0 0 2px var(--dce-surface),\n    0 0 0 4px rgba(58, 131, 247, 0.34),\n    inset 0 1px 0 rgba(255, 255, 255, 0.66);\n}\n\n.dce-pill[aria-expanded=\"true\"] {\n  color: var(--dce-text);\n  border-color: color-mix(in srgb, var(--dce-blue) 20%, var(--dce-line));\n  background:\n    radial-gradient(\n      120% 160% at 15% 0%,\n      color-mix(in srgb, var(--dce-surface) 55%, transparent),\n      transparent 62%\n    ),\n    radial-gradient(\n      90% 140% at 90% 110%,\n      color-mix(in srgb, var(--dce-violet) 20%, transparent),\n      transparent 64%\n    ),\n    color-mix(in srgb, var(--dce-surface-soft) 58%, transparent);\n}\n\n.dce-pill-bloom {\n  position: absolute;\n  inset: -8px;\n  z-index: 0;\n  border-radius: 999px;\n  background:\n    radial-gradient(58% 110% at 18% 50%, rgba(120, 154, 255, 0.4), transparent 68%),\n    radial-gradient(56% 110% at 82% 52%, rgba(184, 132, 255, 0.32), transparent 68%);\n  filter: blur(6px);\n  opacity: 0.78;\n  pointer-events: none;\n  animation: dce-pill-bloom 5.8s ease-in-out infinite;\n}\n\n.dce-pill-surface {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n}\n\n.dce-pill-sweep {\n  position: absolute;\n  top: -80%;\n  bottom: -80%;\n  left: -65%;\n  width: 46%;\n  background: linear-gradient(\n    90deg,\n    transparent 0%,\n    rgba(255, 255, 255, 0.64) 50%,\n    transparent 100%\n  );\n  transform: rotate(18deg);\n  opacity: 0.7;\n  animation: dce-pill-sweep 5.8s ease-in-out infinite;\n}\n\n.dce-pill-light {\n  position: absolute;\n  inset: 0;\n  background: radial-gradient(\n    86px circle at var(--dce-pill-x, 50%) var(--dce-pill-y, 50%),\n    rgba(104, 134, 255, 0.34) 0%,\n    rgba(160, 120, 255, 0.16) 38%,\n    transparent 70%\n  );\n  opacity: 0.52;\n  transition: opacity 220ms ease;\n}\n\n.dce-pill:hover .dce-pill-light,\n.dce-pill[aria-expanded=\"true\"] .dce-pill-light {\n  opacity: 1;\n}\n\n.dce-pill-motes {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n\n.dce-pill-particle {\n  position: absolute;\n  left: var(--dce-mote-x);\n  top: var(--dce-mote-y);\n  display: block;\n  width: var(--dce-mote-size);\n  height: var(--dce-mote-size);\n  border-radius: 50%;\n  background: var(--dce-mote-color);\n  box-shadow:\n    0 0 6px var(--dce-mote-color),\n    0 0 12px color-mix(in srgb, var(--dce-mote-color) 55%, transparent);\n  opacity: 0.25;\n  animation-name: dce-mote-drift;\n  animation-timing-function: ease-in-out;\n  animation-iteration-count: infinite;\n  will-change: transform, opacity;\n}\n\n.dce-pill-aura {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  display: block;\n  pointer-events: none;\n}\n\n.dce-pill-aura-dot {\n  position: absolute;\n  left: var(--dce-aura-x);\n  top: var(--dce-aura-y);\n  display: block;\n  width: var(--dce-aura-size);\n  height: var(--dce-aura-size);\n  border-radius: 50%;\n  background: var(--dce-aura-color);\n  box-shadow:\n    0 0 6px var(--dce-aura-color),\n    0 0 13px color-mix(in srgb, var(--dce-aura-color) 55%, transparent);\n  opacity: 0.3;\n  transform: translate(-50%, -50%);\n  animation-name: dce-aura-float;\n  animation-timing-function: ease-in-out;\n  animation-iteration-count: infinite;\n  will-change: transform, opacity;\n}\n\n.dce-pill-label {\n  position: relative;\n  z-index: 2;\n  display: inline-flex;\n  flex: 1 1 auto;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  min-width: 0;\n}\n\n.dce-pill-model {\n  overflow: hidden;\n  max-width: 64px;\n  color: var(--dce-text-secondary);\n  text-overflow: ellipsis;\n}\n\n.dce-pill-sep {\n  color: var(--dce-text-caption);\n  opacity: 0.66;\n}\n\n.dce-pill-level {\n  color: var(--dce-tier-color, var(--dce-text));\n  font-weight: 650;\n}\n\n.dce-pill-level[data-tier=\"off\"] {\n  color: var(--dce-text-caption);\n}\n\n.dce-pill-level[data-tier=\"low\"] {\n  color: var(--dce-text);\n}\n\n.dce-pill-level[data-tier=\"high\"] {\n  color: #e0447e;\n}\n\n.dce-pill-level[data-tier=\"max\"] {\n  color: var(--dce-max-rose-deep);\n}\n\n.dce-pill-chevron {\n  position: relative;\n  z-index: 2;\n  width: 11px;\n  height: 11px;\n  opacity: 0.7;\n  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.dce-pill[aria-expanded=\"true\"] .dce-pill-chevron {\n  transform: rotate(180deg);\n}\n\n.dce-pill-wave {\n  position: absolute;\n  inset: -1px;\n  z-index: 3;\n  border: 1px solid color-mix(in srgb, var(--dce-blue) 48%, transparent);\n  border-radius: 999px;\n  pointer-events: none;\n  animation: dce-pill-wave 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;\n}\n\n@keyframes dce-pill-sweep {\n  0%,\n  18% {\n    transform: translateX(-30%) rotate(18deg);\n    opacity: 0;\n  }\n  35% {\n    opacity: 0.5;\n  }\n  72% {\n    transform: translateX(340%) rotate(18deg);\n    opacity: 0;\n  }\n  100% {\n    transform: translateX(340%) rotate(18deg);\n    opacity: 0;\n  }\n}\n\n@keyframes dce-mote-drift {\n  0%,\n  100% {\n    opacity: 0.14;\n    transform: translate3d(0, 1px, 0) scale(0.8);\n  }\n  42% {\n    opacity: 0.78;\n    transform: translate3d(2px, -3px, 0) scale(1.15);\n  }\n  68% {\n    opacity: 0.32;\n    transform: translate3d(-1px, -1px, 0) scale(0.92);\n  }\n}\n\n@keyframes dce-pill-wave {\n  0% {\n    opacity: 0.55;\n    transform: scale(0.94);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1.16);\n  }\n}\n\n@keyframes dce-aura-float {\n  0%,\n  100% {\n    opacity: 0.2;\n    transform: translate(-50%, -50%) translateY(1px) scale(0.8);\n  }\n  46% {\n    opacity: 0.92;\n    transform: translate(-50%, -50%) translateY(-3px) scale(1.15);\n  }\n  72% {\n    opacity: 0.4;\n    transform: translate(-50%, -50%) translateY(-1px) scale(0.95);\n  }\n}\n\n@keyframes dce-pill-bloom {\n  0%,\n  100% {\n    opacity: 0.58;\n    transform: scale(0.98);\n  }\n  50% {\n    opacity: 0.94;\n    transform: scale(1.03);\n  }\n}\n\n/* ── portalled layer ────────────────────────────────────────── */\n\n.dce-portal {\n  position: fixed;\n  inset: 0;\n  z-index: 12000;\n  pointer-events: none;\n  font-family: var(--dce-font);\n}\n\n.dce-pop {\n  position: fixed;\n  box-sizing: border-box;\n  width: 292px;\n  min-width: 292px;\n  max-width: 292px;\n  padding: 12px 14px 14px;\n  border: 1px solid var(--dce-line);\n  border-radius: 18px;\n  background: var(--dce-surface);\n  box-shadow:\n    0 0 0 0.5px rgba(15, 17, 21, 0.02),\n    0 2px 6px rgba(20, 20, 35, 0.04),\n    0 18px 44px -14px rgba(44, 26, 96, 0.18),\n    0 30px 72px -34px rgba(44, 26, 96, 0.15);\n  color: var(--dce-text);\n  font-family: var(--dce-font);\n  line-height: normal;\n  pointer-events: auto;\n  transform-origin: 50% 100%;\n  opacity: 0;\n  transform: translateY(6px) scale(0.972);\n  transition:\n    opacity 150ms ease,\n    transform 210ms cubic-bezier(0.22, 1, 0.36, 1);\n  isolation: isolate;\n}\n\n.dce-pop[data-open=\"true\"] {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n}\n\n.dce-pop[data-tier=\"high\"] {\n  border-color: rgba(224, 68, 126, 0.24);\n  box-shadow:\n    0 0 0 0.5px rgba(224, 68, 126, 0.12),\n    0 2px 8px rgba(20, 20, 35, 0.04),\n    0 18px 48px -14px rgba(190, 38, 100, 0.2),\n    0 0 30px -12px rgba(232, 62, 140, 0.24);\n}\n\n.dce-pop[data-tier=\"max\"] {\n  border-color: color-mix(in srgb, var(--dce-max-rose) 28%, var(--dce-line));\n  box-shadow:\n    0 0 0 0.5px color-mix(in srgb, var(--dce-max-rose) 18%, transparent),\n    0 2px 8px rgba(20, 20, 35, 0.04),\n    0 18px 48px -14px rgba(190, 38, 100, 0.24),\n    0 0 34px -12px rgba(232, 62, 140, 0.32);\n}\n\n.dce-pop[data-open=\"false\"] {\n  pointer-events: none;\n}\n\n.dce-pop::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  border-radius: inherit;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);\n  pointer-events: none;\n}\n\n/* ── head row ───────────────────────────────────────────────── */\n\n.dce-head {\n  position: relative;\n  display: grid;\n  grid-template-columns: 28px 1fr 28px;\n  align-items: center;\n  min-height: 28px;\n}\n\n.dce-head-spacer {\n  display: block;\n  width: 28px;\n  height: 28px;\n}\n\n.dce-icon-btn {\n  box-sizing: border-box;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: 9px;\n  background: transparent;\n  color: var(--dce-text-caption);\n  outline: none;\n  cursor: pointer;\n  transition:\n    background-color 150ms ease,\n    color 150ms ease,\n    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.dce-icon-btn:hover {\n  background: var(--dce-hover);\n  color: var(--dce-text-secondary);\n}\n\n.dce-icon-btn:focus-visible {\n  box-shadow: inset 0 0 0 2px rgba(58, 131, 247, 0.4);\n}\n\n.dce-icon-btn svg {\n  width: 15px;\n  height: 15px;\n}\n\n.dce-icon-btn.is-spinning svg {\n  animation: dce-spin 900ms linear infinite;\n}\n\n@keyframes dce-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.dce-title {\n  color: var(--dce-tier-color, var(--dce-blue));\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.008em;\n  line-height: 20px;\n  text-align: center;\n  white-space: nowrap;\n}\n\n.dce-title[data-tier=\"off\"] {\n  color: var(--dce-text-caption);\n}\n\n.dce-title[data-tier=\"low\"] {\n  color: var(--dce-text);\n}\n\n.dce-title[data-tier=\"high\"] {\n  color: #e0447e;\n}\n\n.dce-title[data-tier=\"max\"] {\n  color: var(--dce-max-rose-deep);\n}\n\n.dce-title[data-empty=\"true\"] {\n  color: var(--dce-text-caption);\n}\n\n.dce-title-stack {\n  position: relative;\n  min-width: 0;\n  height: 20px;\n}\n\n.dce-title-stack .dce-title {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n}\n\n.dce-title-in {\n  animation: dce-title-in 110ms cubic-bezier(0.2, 0.8, 0.2, 1) both;\n  will-change: opacity, transform;\n}\n\n@keyframes dce-title-in {\n  from {\n    opacity: 0.35;\n    transform: translateY(2px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n/* ── model row ──────────────────────────────────────────────── */\n\n.dce-model {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  max-width: 100%;\n  min-height: 22px;\n  margin: 2px auto 8px;\n  padding: 0 8px;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--dce-text-secondary);\n  font: 450 12px/1.35 var(--dce-font);\n  letter-spacing: 0.002em;\n  cursor: pointer;\n  outline: none;\n  transition:\n    color 150ms ease,\n    background-color 150ms ease;\n}\n\n.dce-model:hover {\n  background: var(--dce-hover);\n  color: var(--dce-text);\n}\n\n.dce-model:focus-visible {\n  box-shadow: inset 0 0 0 2px rgba(58, 131, 247, 0.36);\n}\n\n.dce-model-name {\n  overflow: hidden;\n  max-width: 220px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  animation: dce-model-in 220ms ease both;\n}\n\n@keyframes dce-model-in {\n  from {\n    opacity: 0.4;\n    transform: translateX(3px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n.dce-model-chevron {\n  flex: none;\n  width: 11px;\n  height: 11px;\n  margin-left: 1px;\n  opacity: 0.62;\n}\n\n/* ── effort slider ──────────────────────────────────────────── */\n\n.dce-slider {\n  position: relative;\n  height: 26px;\n  border-radius: 13px;\n  background: var(--dce-track);\n  touch-action: none;\n  transition:\n    box-shadow 180ms ease,\n    opacity 180ms ease,\n    filter 180ms ease;\n}\n\n.dce-slider[data-disabled=\"true\"] {\n  opacity: 0.48;\n  filter: saturate(0.35);\n}\n\n.dce-track-base {\n  position: absolute;\n  inset: 0;\n  border-radius: 13px;\n  background: var(--dce-track);\n}\n\n/* The color map is fixed to the full track:\n   0–33% black→white (Off→Low), 33–66% white→light pink (Low→High),\n   66–100% light pink→rose (High→Max). Switching tiers only reveals more of\n   the same map; the whole bar never re-gradients. */\n.dce-fill-clip {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  width: var(--dce-fill-width, 0);\n  border-radius: 13px;\n  overflow: hidden;\n  pointer-events: none;\n  transition: width 280ms cubic-bezier(0.22, 1, 0.36, 1);\n  will-change: width;\n}\n\n.dce-fill {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: 13px;\n  background:\n    linear-gradient(\n      90deg,\n      #121216 0%,\n      #4b4b52 10%,\n      #8f8f98 21%,\n      #d9d9df 28%,\n      #f3eff5 33.333%,\n      #f3eff5 36.5%,\n      #fbe6ef 40%,\n      #ffe0ec 46%,\n      #ffd0e2 53%,\n      #ffc2da 60%,\n      #ffb3d1 66.667%,\n      #ff9fc7 72%,\n      #fb82b5 80%,\n      #f268a3 88%,\n      #e8528f 95%,\n      #e83e8c 100%\n    );\n}\n\n.dce-slider[data-tier=\"low\"] .dce-fill {\n  animation: dce-low-breathe 4.6s ease-in-out infinite;\n}\n\n.dce-slider[data-tier=\"high\"] .dce-fill {\n  animation: dce-high-breathe 4.2s ease-in-out infinite;\n}\n\n.dce-slider[data-tier=\"max\"] .dce-fill {\n  animation: dce-max-brightness 3.6s ease-in-out infinite;\n  will-change: filter;\n}\n\n.dce-slider[data-max=\"true\"] .dce-fill::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      transparent 0%,\n      transparent 56%,\n      rgba(255, 159, 199, 0.18) 70%,\n      rgba(232, 62, 140, 0.26) 100%\n    );\n  opacity: 0;\n  pointer-events: none;\n  animation: dce-max-color 4.8s ease-in-out infinite;\n}\n\n.dce-aurora {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  overflow: hidden;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      105deg,\n      transparent 18%,\n      rgba(255, 255, 255, 0.25) 44%,\n      rgba(255, 255, 255, 0.08) 55%,\n      transparent 76%\n    );\n  background-size: 220% 100%;\n  pointer-events: none;\n  animation: dce-sheen 3.6s ease-in-out infinite;\n}\n\n.dce-slider[data-tier=\"high\"] .dce-aurora {\n  background:\n    linear-gradient(\n      105deg,\n      transparent 18%,\n      rgba(255, 208, 230, 0.32) 44%,\n      rgba(255, 176, 214, 0.1) 55%,\n      transparent 76%\n    );\n  background-size: 220% 100%;\n}\n\n.dce-slider[data-tier=\"max\"] .dce-aurora {\n  background:\n    linear-gradient(\n      105deg,\n      transparent 18%,\n      rgba(255, 226, 238, 0.28) 44%,\n      rgba(255, 168, 204, 0.16) 55%,\n      transparent 76%\n    );\n  background-size: 220% 100%;\n}\n\n.dce-stars {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n}\n\n.dce-star {\n  position: absolute;\n  left: -6%;\n  display: block;\n  border-radius: 50%;\n  background: #ffffff;\n  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);\n  opacity: 0;\n  animation-name: dce-star-drift;\n  animation-timing-function: linear;\n  animation-iteration-count: infinite;\n  will-change: left, opacity, transform;\n}\n\n.dce-slider[data-tier=\"low\"] .dce-star {\n  background: #f4f4f6;\n  box-shadow: 0 0 5px rgba(255, 255, 255, 0.72);\n}\n\n.dce-slider[data-tier=\"high\"] .dce-star {\n  background: #ffe4f1;\n  box-shadow: 0 0 6px rgba(255, 190, 220, 0.82);\n}\n\n.dce-slider[data-tier=\"max\"] .dce-star {\n  background: #ffe4f1;\n  box-shadow: 0 0 6px rgba(255, 168, 204, 0.9);\n}\n\n.dce-ticks {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  border-radius: inherit;\n  pointer-events: none;\n}\n\n.dce-tick {\n  position: absolute;\n  top: 50%;\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: color-mix(in srgb, var(--dce-text-caption) 58%, transparent);\n  transform: translate(-50%, -50%);\n  transition:\n    background-color 240ms ease,\n    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.dce-tick.is-filled {\n  background: rgba(255, 255, 255, 0.86);\n  box-shadow: 0 0 0 1px rgba(20, 20, 28, 0.16);\n}\n\n.dce-range {\n  position: absolute;\n  inset: 0;\n  z-index: 5;\n  box-sizing: border-box;\n  width: 100%;\n  height: 26px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  border-radius: 13px;\n  background: transparent;\n  cursor: pointer;\n  opacity: 0;\n  outline: none;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.dce-range:disabled {\n  cursor: default;\n}\n\n.dce-range::-webkit-slider-runnable-track {\n  height: 26px;\n  border-radius: 13px;\n  background: transparent;\n}\n\n.dce-range::-moz-range-track {\n  height: 26px;\n  border-radius: 13px;\n  background: transparent;\n}\n\n.dce-range::-webkit-slider-thumb {\n  box-sizing: border-box;\n  width: 26px;\n  height: 26px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.dce-range::-moz-range-thumb {\n  box-sizing: border-box;\n  width: 26px;\n  height: 26px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  opacity: 0;\n}\n\n.dce-slider:has(.dce-range:focus-visible) {\n  box-shadow:\n    0 0 0 2px var(--dce-surface),\n    0 0 0 4px rgba(58, 131, 247, 0.3);\n}\n\n.dce-slider[data-tier=\"max\"]:has(.dce-range:focus-visible) {\n  box-shadow:\n    0 0 0 2px var(--dce-surface),\n    0 0 0 4px rgba(232, 62, 140, 0.3);\n}\n\n.dce-slider[data-tier=\"off\"]:has(.dce-range:focus-visible) {\n  box-shadow:\n    0 0 0 2px var(--dce-surface),\n    0 0 0 4px rgba(104, 116, 138, 0.26);\n}\n\n/* custom thumb */\n.dce-thumb {\n  position: absolute;\n  top: 0;\n  z-index: 4;\n  display: block;\n  width: 26px;\n  height: 26px;\n  --dce-thumb-light: #dbe7ff;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  box-shadow: 0 2px 9px rgba(30, 15, 76, 0.14);\n  pointer-events: none;\n  transition:\n    left 280ms cubic-bezier(0.22, 1, 0.36, 1),\n    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),\n    box-shadow 260ms ease;\n}\n\n.dce-thumb::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  border-radius: 50%;\n  background: radial-gradient(\n    circle closest-side at 50% 46%,\n    #ffffff 0%,\n    #ffffff 70%,\n    rgba(255, 255, 255, 0.9) 82%,\n    rgba(255, 255, 255, 0.4) 92%,\n    rgba(255, 255, 255, 0.06) 98%,\n    rgba(255, 255, 255, 0) 100%\n  );\n  pointer-events: none;\n}\n\n.dce-thumb[data-dragging=\"true\"] {\n  transform: scale(1.07);\n}\n\n.dce-thumb-bloom {\n  position: absolute;\n  inset: -8px;\n  z-index: -1;\n  border-radius: 50%;\n  background: radial-gradient(\n    circle,\n    color-mix(in srgb, var(--dce-thumb-light) 52%, transparent) 0%,\n    color-mix(in srgb, var(--dce-thumb-light) 34%, transparent) 56%,\n    transparent 76%\n  );\n  filter: blur(7px);\n  opacity: 0.62;\n  pointer-events: none;\n  animation: dce-thumb-breathe 4.4s ease-in-out infinite;\n}\n\n.dce-thumb[data-dragging=\"true\"] .dce-thumb-bloom {\n  opacity: 1;\n}\n\n.dce-thumb-motes {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  opacity: 0.82;\n  transition: opacity 180ms ease;\n}\n\n.dce-thumb[data-dragging=\"true\"] .dce-thumb-motes {\n  opacity: 1;\n}\n\n.dce-thumb-mote {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  display: block;\n  width: var(--dce-thumb-size);\n  height: var(--dce-thumb-size);\n  border-radius: 50%;\n  background: #ffffff;\n  box-shadow:\n    0 0 5px #ffffff,\n    0 0 12px var(--dce-thumb-light),\n    0 0 18px color-mix(in srgb, var(--dce-thumb-light) 55%, transparent);\n  opacity: 0.25;\n  animation-name: dce-thumb-mote;\n  animation-timing-function: ease-in-out;\n  animation-iteration-count: infinite;\n  will-change: transform, opacity;\n}\n\n.dce-slider[data-tier=\"off\"] .dce-thumb {\n  --dce-thumb-light: #d9e2f2;\n}\n\n.dce-slider[data-tier=\"low\"] .dce-thumb {\n  --dce-thumb-light: #e8e8ef;\n}\n\n.dce-slider[data-tier=\"high\"] .dce-thumb {\n  --dce-thumb-light: #ffe0ec;\n}\n\n.dce-slider[data-tier=\"max\"] .dce-thumb {\n  --dce-thumb-light: #ffc2da;\n}\n\n.dce-slider[data-tier=\"low\"] .dce-thumb {\n  box-shadow: 0 2px 9px rgba(18, 18, 22, 0.16);\n}\n\n.dce-slider[data-tier=\"high\"] .dce-thumb {\n  box-shadow: 0 2px 10px rgba(232, 62, 140, 0.2);\n}\n\n.dce-slider[data-tier=\"max\"] .dce-thumb {\n  box-shadow: 0 2px 10px rgba(216, 27, 96, 0.22);\n  animation: dce-thumb-max-glow 3.4s ease-in-out infinite;\n}\n\n.dce-thumb-ring {\n  position: absolute;\n  inset: -5px;\n  border-radius: 50%;\n  border: 1.5px solid rgba(58, 131, 247, 0.46);\n  opacity: 0;\n  pointer-events: none;\n  animation: dce-thumb-ring 480ms cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\n.dce-slider[data-tier=\"off\"] .dce-thumb-ring {\n  border-color: rgba(104, 116, 138, 0.36);\n}\n\n.dce-slider[data-tier=\"low\"] .dce-thumb-ring {\n  border-color: rgba(28, 28, 34, 0.42);\n}\n\n.dce-slider[data-tier=\"high\"] .dce-thumb-ring {\n  border-color: rgba(232, 62, 140, 0.5);\n}\n\n.dce-slider[data-tier=\"max\"] .dce-thumb-ring {\n  border-color: rgba(232, 62, 140, 0.54);\n}\n\n.dce-slider[data-revealing=\"true\"] .dce-fill-clip {\n  animation: dce-reveal-fill 420ms cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\n.dce-slider[data-revealing=\"true\"] .dce-thumb {\n  animation: dce-reveal-thumb 420ms cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\n/* arrival burst at the final stop */\n.dce-burst {\n  position: absolute;\n  z-index: 7;\n  display: block;\n  width: 0;\n  height: 0;\n  pointer-events: none;\n}\n\n.dce-burst-ring {\n  position: absolute;\n  top: -18px;\n  left: -18px;\n  width: 36px;\n  height: 36px;\n  border: 1.5px solid rgba(255, 180, 212, 0.85);\n  border-radius: 50%;\n  opacity: 0;\n  animation: dce-burst-ring 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards;\n}\n\n.dce-burst-dot {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: block;\n  width: var(--dce-burst-size);\n  height: var(--dce-burst-size);\n  border-radius: 50%;\n  box-shadow: 0 0 7px currentColor;\n  opacity: 0;\n  transform: translate(-50%, -50%);\n  animation: dce-burst-dot 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards;\n}\n\n@keyframes dce-thumb-ring {\n  from {\n    opacity: 0.7;\n    transform: scale(0.72);\n  }\n  to {\n    opacity: 0;\n    transform: scale(1.42);\n  }\n}\n\n@keyframes dce-max-brightness {\n  0%,\n  100% {\n    filter: brightness(1) saturate(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.08);\n  }\n}\n\n@keyframes dce-low-breathe {\n  0%,\n  100% {\n    filter: brightness(1) saturate(0.9);\n  }\n  50% {\n    filter: brightness(1.08) saturate(1);\n  }\n}\n\n@keyframes dce-high-breathe {\n  0%,\n  100% {\n    filter: brightness(1) saturate(1);\n  }\n  50% {\n    filter: brightness(1.1) saturate(1.06);\n  }\n}\n\n/* The max-only overlay only touches the rose→purple tail, so the earlier\n   black/white/pink stops stay intact. */\n@keyframes dce-max-color {\n  0%,\n  100% {\n    opacity: 0.12;\n  }\n  50% {\n    opacity: 0.82;\n  }\n}\n\n@keyframes dce-reveal-fill {\n  from {\n    width: 0;\n  }\n  to {\n    width: var(--dce-fill-width, 0);\n  }\n}\n\n@keyframes dce-reveal-thumb {\n  from {\n    left: 0;\n  }\n  to {\n    left: var(--dce-thumb-left);\n  }\n}\n\n@keyframes dce-thumb-breathe {\n  0%,\n  100% {\n    opacity: 0.48;\n    transform: scale(0.94);\n  }\n  50% {\n    opacity: 0.92;\n    transform: scale(1.06);\n  }\n}\n\n@keyframes dce-thumb-mote {\n  0%,\n  100% {\n    opacity: 0.18;\n    transform: translate(\n      calc(-50% + var(--dce-thumb-x)),\n      calc(-50% + var(--dce-thumb-y))\n    ) scale(0.8);\n  }\n  46% {\n    opacity: 0.95;\n    transform: translate(\n      calc(-50% + var(--dce-thumb-x)),\n      calc(-50% + var(--dce-thumb-y) - 2px)\n    ) scale(1.16);\n  }\n  72% {\n    opacity: 0.36;\n    transform: translate(\n      calc(-50% + var(--dce-thumb-x)),\n      calc(-50% + var(--dce-thumb-y))\n    ) scale(0.92);\n  }\n}\n\n@keyframes dce-sheen {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -90% 0;\n  }\n}\n\n@keyframes dce-star-drift {\n  0% {\n    left: -6%;\n    opacity: 0;\n    transform: translateY(0) scale(0.75);\n  }\n  8% {\n    opacity: var(--dce-star-opacity, 0.6);\n  }\n  50% {\n    transform: translateY(-1.5px) scale(1);\n  }\n  90% {\n    opacity: var(--dce-star-opacity, 0.6);\n  }\n  100% {\n    left: 106%;\n    opacity: 0;\n    transform: translateY(1px) scale(0.85);\n  }\n}\n\n@keyframes dce-burst-dot {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n  16% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n    transform: translate(\n      calc(-50% + var(--dce-burst-x)),\n      calc(-50% + var(--dce-burst-y))\n    ) scale(0.8);\n  }\n}\n\n@keyframes dce-burst-ring {\n  0% {\n    opacity: 0.8;\n    transform: scale(0.45);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1.5);\n  }\n}\n\n@keyframes dce-thumb-max-glow {\n  0%,\n  100% {\n    box-shadow: 0 2px 9px rgba(216, 27, 96, 0.2);\n  }\n  50% {\n    box-shadow: 0 3px 15px rgba(216, 27, 96, 0.3);\n  }\n}\n\n/* ── small states ───────────────────────────────────────────── */\n\n.dce-error {\n  margin-top: 8px;\n  padding: 5px 8px;\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #ec1313) 9%, transparent);\n  color: var(--dsw-alias-state-error-primary, #ec1313);\n  font-size: 10.5px;\n  line-height: 14px;\n}\n\n/* ── model picker pane ──────────────────────────────────────── */\n\n.dce-model-list {\n  max-height: 224px;\n  margin: 8px -4px 0;\n  padding: 1px 4px 3px;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: thin;\n}\n\n.dce-model-group + .dce-model-group {\n  margin-top: 7px;\n  padding-top: 7px;\n  border-top: 1px solid var(--dce-line-soft);\n}\n\n.dce-group-name {\n  padding: 3px 8px 4px;\n  color: var(--dce-text-caption);\n  font-size: 9.5px;\n  font-weight: 600;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\n.dce-model-row {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  width: 100%;\n  min-height: 35px;\n  padding: 4px 8px;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  color: var(--dce-text);\n  font-family: var(--dce-font);\n  text-align: left;\n  cursor: pointer;\n  outline: none;\n  transition: background-color 140ms ease;\n}\n\n.dce-model-row:hover {\n  background: var(--dce-hover);\n}\n\n.dce-model-row:focus-visible {\n  box-shadow: inset 0 0 0 2px rgba(58, 131, 247, 0.36);\n}\n\n.dce-model-row[data-selected=\"true\"] {\n  background: color-mix(in srgb, var(--dce-blue) 7%, transparent);\n}\n\n.dce-model-mark {\n  display: inline-flex;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 7px;\n  background: color-mix(in srgb, var(--dce-blue) 13%, transparent);\n  color: var(--dce-blue);\n}\n\n.dce-model-mark svg {\n  width: 12px;\n  height: 12px;\n}\n\n.dce-model-copy {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n\n.dce-model-label {\n  overflow: hidden;\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 16px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dce-model-meta {\n  overflow: hidden;\n  color: var(--dce-text-caption);\n  font-size: 10px;\n  line-height: 13px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dce-check {\n  flex: none;\n  width: 14px;\n  height: 14px;\n  color: var(--dce-blue);\n}\n\n.dce-empty {\n  padding: 22px 8px;\n  color: var(--dce-text-caption);\n  font-size: 11.5px;\n  line-height: 17px;\n  text-align: center;\n}\n\n.dce-loading-dot {\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  margin-right: 6px;\n  border-radius: 50%;\n  background: var(--dce-blue);\n  animation: dce-pulse 1.1s ease-in-out infinite;\n}\n\n@keyframes dce-pulse {\n  0%,\n  100% {\n    opacity: 0.3;\n    transform: scale(0.8);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n/* ── responsive safety ──────────────────────────────────────── */\n\n@media (max-width: 420px) {\n  .dce-pop {\n    width: min(292px, calc(100vw - 24px));\n    min-width: 0;\n    max-width: calc(100vw - 24px);\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dce-pop,\n  .dce-star,\n  .dce-title,\n  .dce-fill,\n  .dce-fill::after,\n  .dce-aurora,\n  .dce-thumb-ring,\n  .dce-thumb-bloom,\n  .dce-thumb-mote,\n  .dce-burst,\n  .dce-burst-dot,\n  .dce-burst-ring,\n  .dce-slider[data-revealing=\"true\"] .dce-fill-clip,\n  .dce-slider[data-revealing=\"true\"] .dce-thumb,\n  .dce-pill-sweep,\n  .dce-pill-bloom,\n  .dce-pill-particle,\n  .dce-pill-aura-dot,\n  .dce-pill-wave,\n  .dce-icon-btn.is-spinning svg,\n  .dce-loading-dot {\n    animation: none !important;\n  }\n  .dce-pill,\n  .dce-pill-light,\n  .dce-icon-btn,\n  .dce-model,\n  .dce-fill-clip,\n  .dce-thumb,\n  .dce-thumb-motes,\n  .dce-tick {\n    transition: none !important;\n  }\n}\n";

/**
 * dsh-codex-effort — browser half.
 *
 * A compact reasoning-effort pill for the DSH composer. It reads and writes
 * the same per-session model directory as the official model seat, so changing
 * the slider is a real `session.selectModel` call rather than local chrome.
 *
 * The hand-authored bundle keeps a tiny dependency surface: React and
 * react-dom are platform modules supplied by the DSH client loader.
 */
const React = require('react')
const { createPortal } = require('react-dom')

const PLUGIN_ID = 'dsh-codex-effort'
const NS = 'dsh.codex.effort'
const STYLE_ID = 'dsh-codex-effort/styles'
const THUMB_SIZE = 26
const THUMB_TOP = 0

const EMPTY_SNAPSHOT = {
  current: null,
  groups: [],
  failures: [],
  status: 'idle',
  pending: null,
  error: null,
}

/** Deterministic LCG so the star field never jumps between renders. */
function seededRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

const STAR_RANDOM = seededRandom(0x9e3779b9)
const STARS = Array.from({ length: 22 }, () => ({
  top: 10 + STAR_RANDOM() * 80,
  size: 1 + STAR_RANDOM() * 1.7,
  duration: 1.45 + STAR_RANDOM() * 1.15,
  delay: -STAR_RANDOM() * 2.6,
  opacity: 0.38 + STAR_RANDOM() * 0.62,
}))

/** Larger motes floating just outside the pill, so the light reads at 1x. */
const PILL_AURA = [
  { x: -3, y: 22, size: 3.2, delay: 0, duration: 6.2, color: '#a9c3ff' },
  { x: 101, y: 68, size: 2.8, delay: 1.3, duration: 5.7, color: '#d8b4fe' },
  { x: 18, y: -6, size: 2.4, delay: 2.1, duration: 6.8, color: '#ffffff' },
  { x: 72, y: 104, size: 3, delay: 0.8, duration: 5.9, color: '#b6d2ff' },
  { x: 95, y: 8, size: 2.3, delay: 2.7, duration: 6.4, color: '#c4a7ff' },
]

/** Slow luminous motes inside the composer pill (HarmonyOS-style light sense). */
const PILL_MOTES = [
  { x: 10, y: 30, size: 2.8, delay: 0, duration: 5.4, color: '#9bb9ff' },
  { x: 20, y: 70, size: 2.3, delay: 1.2, duration: 6.1, color: '#c4a7ff' },
  { x: 32, y: 24, size: 3, delay: 2.1, duration: 5.8, color: '#ffffff' },
  { x: 44, y: 76, size: 2.1, delay: 0.7, duration: 6.6, color: '#b6d2ff' },
  { x: 56, y: 32, size: 3.2, delay: 1.8, duration: 5.2, color: '#d8b4fe' },
  { x: 68, y: 64, size: 2.5, delay: 2.8, duration: 6.4, color: '#ffffff' },
  { x: 78, y: 36, size: 3.4, delay: 0.3, duration: 5.6, color: '#9bb9ff' },
  { x: 88, y: 58, size: 2.2, delay: 1.5, duration: 6.2, color: '#c4a7ff' },
  { x: 95, y: 30, size: 2.6, delay: 2.4, duration: 5.1, color: '#ffffff' },
]

/** Light-sense motes that orbit the draggable knob. */
const THUMB_MOTES = [
  { x: -17, y: -13, size: 3, delay: 0, duration: 5.2 },
  { x: 16, y: -15, size: 2.6, delay: 1.1, duration: 5.8 },
  { x: 19, y: 10, size: 3.4, delay: 2.2, duration: 4.8 },
  { x: -15, y: 15, size: 2.4, delay: 0.7, duration: 5.5 },
  { x: 2, y: -19, size: 2.8, delay: 1.7, duration: 6.1 },
]

/** One-shot particles when the thumb lands on the final stop. */
const BURST_PARTICLES = Array.from({ length: 16 }, (_, index) => {
  const angle = (index / 16) * Math.PI * 2 - Math.PI / 2
  const distance = 20 + (index % 4) * 7
  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    size: 2.4 + (index % 3) * 1.2,
    delay: (index % 5) * 24,
    color: index % 3 === 0 ? '#ffffff' : index % 2 === 0 ? '#ffd0e4' : '#e84a92',
  }
})

const zh = {
  trigger: '选择推理强度',
  dialogAria: '选择推理强度',
  sliderAria: '推理强度',
  auto: 'Auto',
  reset: '恢复默认强度',
  chooseModel: '选择模型',
  back: '返回推理强度',
  close: '关闭',
  loading: '正在读取模型目录…',
  noModels: '暂无可用模型',
  noSession: '先在输入栏选择模型',
  modelHint: '点击切换模型',
  currentModel: '当前模型',
  error: '切换失败，请重试',
  effortLevels: '{n} 档推理',
  noEffort: '不提供推理档位',
}

const en = {
  trigger: 'Reasoning effort',
  dialogAria: 'Select reasoning effort',
  sliderAria: 'Reasoning effort',
  auto: 'Auto',
  reset: 'Reset to default effort',
  chooseModel: 'Choose model',
  back: 'Back to reasoning effort',
  close: 'Close',
  loading: 'Reading model catalog…',
  noModels: 'No models available',
  noSession: 'Choose a model in the composer first',
  modelHint: 'Change model',
  currentModel: 'Current model',
  error: 'Could not change effort. Try again.',
  effortLevels: '{n} effort levels',
  noEffort: 'No effort levels',
}

function installStyles() {
  if (typeof document === 'undefined') return () => {}
  if (document.getElementById(STYLE_ID) !== null) return () => {}
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.dataset.plugin = PLUGIN_ID
  style.textContent = DCE_STYLES
  document.head.appendChild(style)
  return () => { style.remove() }
}

function Icon({ children, size = 16, className, viewBox = '0 0 24 24' }) {
  return React.createElement(
    'svg',
    {
      className,
      width: size,
      height: size,
      viewBox,
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      'aria-hidden': 'true',
      focusable: 'false',
    },
    children,
  )
}

function HistoryIcon() {
  return React.createElement(
    Icon,
    { size: 15 },
    React.createElement('path', {
      d: 'M4.2 8.4A8.1 8.1 0 1 1 3.9 13',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
    }),
    React.createElement('path', {
      d: 'M4.1 3.6v4.9h4.9',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

function ChevronDownIcon({ className }) {
  return React.createElement(
    Icon,
    { size: 12, className },
    React.createElement('path', {
      d: 'm6.5 9.2 5.5 5.4 5.5-5.4',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

function ChevronRightIcon({ className }) {
  return React.createElement(
    Icon,
    { size: 12, className },
    React.createElement('path', {
      d: 'm9.2 6.5 5.4 5.5-5.4 5.5',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

function ChevronLeftIcon() {
  return React.createElement(
    Icon,
    { size: 15 },
    React.createElement('path', {
      d: 'm14.8 6.5-5.4 5.5 5.4 5.5',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

function CloseIcon() {
  return React.createElement(
    Icon,
    { size: 14 },
    React.createElement('path', {
      d: 'M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
    }),
  )
}

function CheckIcon() {
  return React.createElement(
    Icon,
    { size: 14, className: 'dce-check' },
    React.createElement('path', {
      d: 'm4.8 12.2 4.3 4.2L19.4 5.9',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
  )
}

function SparkIcon() {
  return React.createElement(
    Icon,
    { size: 12 },
    React.createElement('path', {
      d: 'M12 3.2 13.8 8l4.9 1.8-4.9 1.8L12 16.4l-1.8-4.8-4.9-1.8 4.9-1.8L12 3.2Z',
      fill: 'currentColor',
    }),
  )
}

function safeDirectory(getDirectory, sessionId) {
  if (!sessionId) return null
  try {
    return getDirectory(String(sessionId)) ?? null
  } catch {
    return null
  }
}

/** Resolve the four Codex-ish tiers, with a positional fallback for 4-level models. */
function tierOf(level, index, count) {
  const raw = `${level?.id ?? ''} ${level?.name ?? ''}`.toLowerCase()
  if (raw.includes('off') || raw.includes('none') || raw.includes('disabled')) return 'off'
  if (raw.includes('max') || raw.includes('ultra')) return 'max'
  if (raw.includes('high')) return 'high'
  if (raw.includes('low') || raw.includes('min')) return 'low'
  if (count === 4) return ['off', 'low', 'high', 'max'][index] ?? 'other'
  return 'other'
}

/** `DeepSeek-V4.1-Flash` → `V4.1Flash`; used by the closed composer pill. */
function shortModelName(name) {
  if (typeof name !== 'string' || name.length === 0) return null
  let short = name.replace(/^deepseek[-\s_]*/i, '').replace(/[-\s_]+/g, '')
  if (short.length > 16) short = short.slice(0, 16)
  return short
}

function findModel(snapshot) {
  const current = snapshot.current
  if (current === null) return { current: null, group: null, model: null, reasoning: null, efforts: [] }
  const group = snapshot.groups.find(candidate => candidate.id === current.provider) ?? null
  const model = group?.models.find(candidate => candidate.id === current.model) ?? null
  const reasoning = model?.reasoning ?? null
  return {
    current,
    group,
    model,
    reasoning,
    efforts: Array.isArray(reasoning?.efforts) ? reasoning.efforts : [],
  }
}

function EffortControl(props) {
  const { t, sessionId, getDirectory } = props
  const directory = React.useMemo(
    () => safeDirectory(getDirectory, sessionId),
    [getDirectory, sessionId],
  )
  const subscribe = React.useCallback(
    (callback) => directory === null ? () => {} : directory.store.subscribe(callback),
    [directory],
  )
  const readSnapshot = React.useCallback(
    () => directory === null ? EMPTY_SNAPSHOT : directory.store.getSnapshot(),
    [directory],
  )
  const snapshot = React.useSyncExternalStore(subscribe, readSnapshot, () => EMPTY_SNAPSHOT)

  const rootRef = React.useRef(null)
  const triggerRef = React.useRef(null)
  const popRef = React.useRef(null)
  const sliderRef = React.useRef(null)
  const trackRef = React.useRef(null)
  const timerRef = React.useRef(null)
  const closeTimerRef = React.useRef(null)
  const revealTimerRef = React.useRef(null)
  const revealPendingRef = React.useRef(false)
  const revealTokenRef = React.useRef(0)
  const previewRef = React.useRef(0)
  const mountedRef = React.useRef(true)

  const [visible, setVisible] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState('effort')
  const [position, setPosition] = React.useState(null)
  const [previewIndex, setPreviewIndex] = React.useState(0)
  const [error, setError] = React.useState(null)
  const [localBusy, setLocalBusy] = React.useState(false)
  const [trackWidth, setTrackWidth] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [maxBurst, setMaxBurst] = React.useState(0)
  const [pillPulse, setPillPulse] = React.useState(0)
  const [revealing, setRevealing] = React.useState(false)
  const previousMaxRef = React.useRef(false)

  React.useEffect(() => () => {
    mountedRef.current = false
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current)
    if (revealTimerRef.current !== null) clearTimeout(revealTimerRef.current)
  }, [])

  const { current, model, reasoning, efforts } = findModel(snapshot)
  const effortCount = efforts.length
  const activeEffortId = current?.reasoningEffort ?? reasoning?.defaultEffort
  let selectedIndex = efforts.findIndex(level => level.id === activeEffortId)
  if (selectedIndex < 0) selectedIndex = 0
  const safePreviewIndex = Math.min(previewIndex, Math.max(0, effortCount - 1))
  const selectedLevel = efforts[safePreviewIndex]
  const levelName = selectedLevel?.name ?? selectedLevel?.id ?? t('auto')
  const tier = tierOf(selectedLevel, safePreviewIndex, effortCount)
  const currentLevel = efforts[selectedIndex]
  const currentLevelName = currentLevel?.name ?? currentLevel?.id ?? t('auto')
  const currentTier = tierOf(currentLevel, selectedIndex, effortCount)
  const isOff = tier === 'off'
  const isMax = tier === 'max'
  const hasEnergy = !isOff && effortCount > 0
  const interactive = directory !== null && current !== null && effortCount > 0
  const busy = localBusy || snapshot.pending !== null || snapshot.status === 'selecting'
  const modelName = model?.name ?? current?.model ?? null
  const shortModel = shortModelName(modelName)
  const canChooseModel = directory !== null && snapshot.groups.length > 0
  const loadingCatalog = snapshot.status === 'loading' && snapshot.current === null

  const progress = effortCount > 1 ? safePreviewIndex / (effortCount - 1) : 0
  const thumbTravel = Math.max(0, trackWidth - THUMB_SIZE)
  const thumbLeft = Math.round(progress * thumbTravel)
  const fillWidth = hasEnergy && trackWidth > 0 ? Math.round(thumbLeft + THUMB_SIZE / 2) : 0

  React.useEffect(() => {
    previewRef.current = selectedIndex
    setPreviewIndex(selectedIndex)
  }, [selectedIndex, current?.provider, current?.model, effortCount])

  React.useEffect(() => {
    if (visible && !interactive) setMode('effort')
  }, [visible, interactive])

  React.useEffect(() => {
    if (!visible || directory === null) return
    void Promise.resolve().then(() => directory.load()).catch(() => {})
  }, [visible, directory])

  // Place the card above the pill, flipping below when the composer sits near
  // the top of the viewport. The ResizeObserver keeps model mode anchored
  // when its list grows.
  React.useLayoutEffect(() => {
    if (!visible) {
      setPosition(null)
      return
    }
    const place = () => {
      const trigger = triggerRef.current
      const pop = popRef.current
      if (trigger === null) return
      const rect = trigger.getBoundingClientRect()
      const width = pop?.offsetWidth ?? 292
      const height = pop?.offsetHeight ?? 126
      const margin = 12
      const gap = 10
      let left = rect.left + rect.width / 2 - width / 2
      left = Math.min(Math.max(left, margin), window.innerWidth - width - margin)
      let top = rect.top - height - gap
      if (top < margin) top = rect.bottom + gap
      top = Math.min(Math.max(top, margin), window.innerHeight - height - margin)
      setPosition({ left: Math.round(left), top: Math.round(top) })
    }
    place()
    const pop = popRef.current
    const observer = typeof ResizeObserver === 'undefined' || pop === null
      ? null
      : new ResizeObserver(place)
    if (pop !== null) observer?.observe(pop)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [visible, mode, snapshot.status, error, effortCount])

  React.useLayoutEffect(() => {
    if (!visible || mode !== 'effort') return
    const track = trackRef.current
    if (track === null) return
    const measure = () => { setTrackWidth(track.clientWidth) }
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => { window.removeEventListener('resize', measure) }
    }
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => { observer.disconnect() }
  }, [visible, mode])

  React.useLayoutEffect(() => {
    if (!open || !revealPendingRef.current || trackWidth === 0) return
    revealPendingRef.current = false
    const token = revealTokenRef.current + 1
    revealTokenRef.current = token
    setRevealing(false)
    const frame = requestAnimationFrame(() => {
      if (!mountedRef.current || token !== revealTokenRef.current) return
      setRevealing(true)
      if (revealTimerRef.current !== null) clearTimeout(revealTimerRef.current)
      revealTimerRef.current = setTimeout(() => {
        revealTimerRef.current = null
        if (mountedRef.current) setRevealing(false)
      }, 520)
    })
    return () => { cancelAnimationFrame(frame) }
  }, [open, trackWidth])

  React.useEffect(() => {
    if (!open) return
    const closeOutside = (event) => {
      if (rootRef.current?.contains(event.target) === true) return
      if (popRef.current?.contains(event.target) === true) return
      closePanel(false)
    }
    document.addEventListener('mousedown', closeOutside)
    return () => { document.removeEventListener('mousedown', closeOutside) }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closePanel(true)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown) }
  }, [open])

  React.useEffect(() => {
    if (!open || mode !== 'effort') return
    const frame = requestAnimationFrame(() => {
      sliderRef.current?.focus({ preventScroll: true, focusVisible: false })
    })
    return () => { cancelAnimationFrame(frame) }
  }, [open, mode])

  // The burst belongs to the arrival, not to a permanent max state: delay it
  // by the thumb's travel time so particles bloom when the knob lands.
  React.useEffect(() => {
    if (!open || !isMax) {
      previousMaxRef.current = false
      return
    }
    if (previousMaxRef.current) return
    previousMaxRef.current = true
    const timer = setTimeout(() => {
      if (mountedRef.current) setMaxBurst(value => value + 1)
    }, 440)
    return () => { clearTimeout(timer) }
  }, [open, isMax])

  React.useEffect(() => {
    if (maxBurst === 0) return
    const timer = setTimeout(() => {
      if (mountedRef.current) setMaxBurst(0)
    }, 900)
    return () => { clearTimeout(timer) }
  }, [maxBurst])

  const cancelReveal = () => {
    revealPendingRef.current = false
    revealTokenRef.current += 1
    if (revealTimerRef.current !== null) {
      clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    setRevealing(false)
  }

  const openPanel = () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    revealPendingRef.current = true
    previewRef.current = selectedIndex
    setPreviewIndex(selectedIndex)
    setError(null)
    setMode('effort')
    setVisible(true)
    setOpen(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { if (mountedRef.current) setOpen(true) })
    })
  }

  const closePanel = (focusTrigger) => {
    if (!visible) return
    cancelReveal()
    setOpen(false)
    setDragging(false)
    if (focusTrigger) triggerRef.current?.focus()
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null
      if (mountedRef.current) setVisible(false)
    }, 190)
  }

  const reportResult = (result) => {
    if (!mountedRef.current) return
    setLocalBusy(false)
    if (result !== undefined && result.ok === false) {
      setError(result.error?.message ?? t('error'))
    }
  }

  const reportFailure = () => {
    if (!mountedRef.current) return
    setLocalBusy(false)
    setError(t('error'))
  }

  const runSelection = (selection) => {
    if (directory === null) return
    setError(null)
    setLocalBusy(true)
    try {
      directory.select(selection).then(reportResult, reportFailure)
    } catch {
      reportFailure()
    }
  }

  const selectEffort = (index) => {
    if (!interactive) return
    const level = efforts[index]
    if (level === undefined) return
    if (level.id === activeEffortId) return
    runSelection({
      provider: current.provider,
      model: current.model,
      reasoningEffort: level.id,
    })
  }

  const reserveCommit = (index) => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      selectEffort(index)
    }, 260)
  }

  const changePreview = (event) => {
    cancelReveal()
    const index = Number(event.target.value)
    setPreviewIndex(index)
    previewRef.current = index
    reserveCommit(index)
  }

  const flushPreview = () => {
    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
    selectEffort(previewRef.current)
  }

  const resetEffort = () => {
    if (directory === null || current === null) return
    if (current.reasoningEffort === undefined && reasoning?.defaultEffort === undefined) return
    runSelection({
      provider: current.provider,
      model: current.model,
    })
  }

  const chooseModel = (nextGroup, nextModel) => {
    if (directory === null) return
    setError(null)
    setLocalBusy(true)
    try {
      directory.select({
        provider: nextGroup.id,
        model: nextModel.id,
      }).then((result) => {
        if (!mountedRef.current) return
        setLocalBusy(false)
        if (result !== undefined && result.ok === false) {
          setError(result.error?.message ?? t('error'))
          return
        }
        setMode('effort')
      }, reportFailure)
    } catch {
      reportFailure()
    }
  }

  const togglePopup = () => {
    setPillPulse(value => value + 1)
    if (open) closePanel(false)
    else openPanel()
  }

  const movePillLight = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    event.currentTarget.style.setProperty('--dce-pill-x', `${x.toFixed(1)}%`)
    event.currentTarget.style.setProperty('--dce-pill-y', `${y.toFixed(1)}%`)
  }

  const stars = STARS.map((star, index) => React.createElement('span', {
    key: `star-${index}`,
    className: 'dce-star',
    style: {
      top: `${star.top}%`,
      width: star.size,
      height: star.size,
      animationDuration: `${star.duration}s`,
      animationDelay: `${star.delay}s`,
      '--dce-star-opacity': star.opacity,
    },
  }))

  const thumbMotes = THUMB_MOTES.map((mote, index) => React.createElement('span', {
    key: `thumb-mote-${index}`,
    className: 'dce-thumb-mote',
    style: {
      '--dce-thumb-x': `${mote.x}px`,
      '--dce-thumb-y': `${mote.y}px`,
      '--dce-thumb-size': `${mote.size}px`,
      animationDelay: `${mote.delay}s`,
      animationDuration: `${mote.duration}s`,
    },
  }))

  const burst = BURST_PARTICLES.map((particle, index) => React.createElement('span', {
    key: `burst-${index}`,
    className: 'dce-burst-dot',
    style: {
      '--dce-burst-x': `${particle.dx.toFixed(1)}px`,
      '--dce-burst-y': `${particle.dy.toFixed(1)}px`,
      '--dce-burst-size': `${particle.size}px`,
      animationDelay: `${particle.delay}ms`,
      background: particle.color,
      color: particle.color,
    },
  }))

  const ticks = effortCount > 1
    ? Array.from({ length: effortCount - 1 }, (_, index) => {
      const stop = index + 1
      const left = THUMB_SIZE / 2 + (stop / (effortCount - 1)) * thumbTravel
      return React.createElement('span', {
        key: `tick-${stop}`,
        className: `dce-tick${stop <= safePreviewIndex ? ' is-filled' : ''}`,
        style: { left: `${left}px` },
      })
    })
    : []

  const effortPane = React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'dce-model',
        onClick: () => { if (canChooseModel) setMode('model') },
        disabled: !canChooseModel,
        title: canChooseModel ? t('modelHint') : undefined,
        'aria-label': canChooseModel
          ? (modelName === null ? t('chooseModel') : `${t('currentModel')}: ${modelName}`)
          : undefined,
      },
      React.createElement(
        'span',
        { className: 'dce-model-name', key: modelName ?? 'model' },
        modelName ?? (current === null ? t('chooseModel') : t('auto')),
      ),
      canChooseModel ? React.createElement(ChevronRightIcon, { className: 'dce-model-chevron' }) : null,
    ),
    React.createElement(
      'div',
      {
        ref: trackRef,
        className: 'dce-slider',
        'data-tier': tier,
        'data-max': isMax ? 'true' : 'false',
        'data-revealing': revealing ? 'true' : 'false',
        'data-disabled': interactive ? 'false' : 'true',
        'data-dragging': dragging ? 'true' : 'false',
      },
      React.createElement('span', { className: 'dce-track-base', 'aria-hidden': 'true' }),
      React.createElement(
        'span',
        {
          className: 'dce-fill-clip',
          'aria-hidden': 'true',
          style: {
            width: `${fillWidth}px`,
            '--dce-fill-width': `${fillWidth}px`,
          },
        },
        React.createElement('span', {
          className: 'dce-fill',
          style: { width: `${trackWidth}px` },
        }),
        hasEnergy ? React.createElement('span', { className: 'dce-aurora' }) : null,
        hasEnergy ? React.createElement('span', { className: 'dce-stars' }, stars) : null,
      ),
      React.createElement('span', { className: 'dce-ticks', 'aria-hidden': 'true' }, ticks),
      React.createElement('input', {
        ref: sliderRef,
        className: 'dce-range',
        type: 'range',
        min: 0,
        max: Math.max(effortCount - 1, 0),
        step: 1,
        value: effortCount === 0 ? 0 : safePreviewIndex,
        disabled: !interactive,
        'aria-label': t('sliderAria'),
        'aria-valuetext': levelName,
        onChange: changePreview,
        onPointerDown: () => { cancelReveal(); setDragging(true) },
        onPointerUp: () => { setDragging(false); flushPreview() },
        onPointerCancel: () => { setDragging(false); flushPreview() },
        onKeyUp: (event) => {
          if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
            flushPreview()
          }
        },
        onBlur: () => { setDragging(false); flushPreview() },
      }),
      React.createElement(
        'span',
        {
          className: 'dce-thumb',
          'data-tier': tier,
          'data-max': isMax ? 'true' : 'false',
          'data-dragging': dragging ? 'true' : 'false',
          'aria-hidden': 'true',
          style: {
            left: `${thumbLeft}px`,
            '--dce-thumb-left': `${thumbLeft}px`,
          },
        },
        React.createElement('span', { className: 'dce-thumb-bloom', 'aria-hidden': 'true' }),
        React.createElement('span', { className: 'dce-thumb-motes', 'aria-hidden': 'true' }, thumbMotes),
        React.createElement('span', {
          key: `ring-${safePreviewIndex}-${tier}`,
          className: 'dce-thumb-ring',
        }),
      ),
      isMax && maxBurst > 0
        ? React.createElement(
          'span',
          {
            key: `burst-${maxBurst}`,
            className: 'dce-burst',
            'aria-hidden': 'true',
            style: { left: `${thumbLeft + THUMB_SIZE / 2}px`, top: `${THUMB_TOP + THUMB_SIZE / 2}px` },
          },
          React.createElement('span', { className: 'dce-burst-ring' }),
          burst,
        )
        : null,
    ),
    error !== null
      ? React.createElement('div', { className: 'dce-error', role: 'alert' }, error)
      : null,
  )

  const modelPane = React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: 'dce-model-list', role: 'listbox', 'aria-label': t('chooseModel') },
      loadingCatalog
        ? React.createElement(
          'div',
          { className: 'dce-empty' },
          React.createElement('span', { className: 'dce-loading-dot', 'aria-hidden': 'true' }),
          t('loading'),
        )
        : snapshot.groups.length === 0
          ? React.createElement('div', { className: 'dce-empty' }, t('noModels'))
          : snapshot.groups.map((provider) => React.createElement(
            'div',
            { className: 'dce-model-group', key: provider.id },
            React.createElement('div', { className: 'dce-group-name' }, provider.name ?? provider.id),
            provider.models.map((candidate) => {
              const selected = current?.provider === provider.id && current.model === candidate.id
              const levels = Array.isArray(candidate.reasoning?.efforts)
                ? candidate.reasoning.efforts.length
                : 0
              return React.createElement(
                'button',
                {
                  type: 'button',
                  role: 'option',
                  key: candidate.id,
                  className: 'dce-model-row',
                  'data-selected': selected ? 'true' : 'false',
                  'aria-selected': selected,
                  disabled: busy,
                  onClick: () => { chooseModel(provider, candidate) },
                },
                React.createElement('span', { className: 'dce-model-mark', 'aria-hidden': 'true' }, React.createElement(SparkIcon)),
                React.createElement(
                  'span',
                  { className: 'dce-model-copy' },
                  React.createElement('span', { className: 'dce-model-label' }, candidate.name ?? candidate.id),
                  React.createElement(
                    'span',
                    { className: 'dce-model-meta' },
                    levels > 0 ? t('effortLevels', { n: levels }) : t('noEffort'),
                  ),
                ),
                selected ? React.createElement(CheckIcon) : null,
              )
            }),
          )),
    ),
    error !== null
      ? React.createElement('div', { className: 'dce-error', role: 'alert' }, error)
      : null,
  )

  const head = mode === 'model'
    ? React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'dce-icon-btn',
          onClick: () => setMode('effort'),
          'aria-label': t('back'),
          title: t('back'),
        },
        React.createElement(ChevronLeftIcon),
      ),
      React.createElement('span', { className: 'dce-title', 'data-empty': 'true' }, t('chooseModel')),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'dce-icon-btn',
          onClick: () => closePanel(false),
          'aria-label': t('close'),
          title: t('close'),
        },
        React.createElement(CloseIcon),
      ),
    )
    : React.createElement(
      React.Fragment,
      null,
      React.createElement('span', { className: 'dce-head-spacer', 'aria-hidden': 'true' }),
      React.createElement(
        'span',
        { className: 'dce-title-stack' },
        React.createElement(
          'span',
          {
            key: `title-${tier}-${levelName}`,
            className: 'dce-title dce-title-in',
            'data-tier': tier,
            'data-empty': current === null ? 'true' : 'false',
          },
          levelName,
        ),
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          className: `dce-icon-btn${busy ? ' is-spinning' : ''}`,
          onClick: resetEffort,
          disabled: !interactive || busy,
          'aria-label': t('reset'),
          title: t('reset'),
        },
        React.createElement(HistoryIcon),
      ),
    )

  const pillMotes = PILL_MOTES.map((mote, index) => React.createElement('span', {
    key: `mote-${index}`,
    className: 'dce-pill-particle',
    style: {
      '--dce-mote-x': `${mote.x}%`,
      '--dce-mote-y': `${mote.y}%`,
      '--dce-mote-size': `${mote.size}px`,
      '--dce-mote-color': mote.color,
      animationDelay: `${mote.delay}s`,
      animationDuration: `${mote.duration}s`,
    },
  }))

  const pillAura = PILL_AURA.map((mote, index) => React.createElement('span', {
    key: `aura-${index}`,
    className: 'dce-pill-aura-dot',
    style: {
      '--dce-aura-x': `${mote.x}%`,
      '--dce-aura-y': `${mote.y}%`,
      '--dce-aura-size': `${mote.size}px`,
      '--dce-aura-color': mote.color,
      animationDelay: `${mote.delay}s`,
      animationDuration: `${mote.duration}s`,
    },
  }))

  const popup = visible ? createPortal(
    React.createElement(
      'div',
      { className: 'dce-portal', 'data-plugin': PLUGIN_ID },
      React.createElement(
        'div',
        {
          ref: popRef,
          className: 'dce-pop',
          role: 'dialog',
          'aria-modal': 'false',
          'aria-label': t('dialogAria'),
          'data-open': open ? 'true' : 'false',
          'data-tier': tier,
          'data-max': isMax ? 'true' : 'false',
          style: position === null
            ? { left: -9999, top: -9999, visibility: 'hidden' }
            : { left: position.left, top: position.top },
          onMouseDown: (event) => event.stopPropagation(),
        },
        React.createElement('div', { className: 'dce-head' }, head),
        mode === 'model' ? modelPane : effortPane,
      ),
    ),
    document.body,
  ) : null

  return React.createElement(
    'div',
    { ref: rootRef, className: 'dce-root' },
    React.createElement(
      'button',
      {
        ref: triggerRef,
        type: 'button',
        className: 'dce-pill',
        onClick: togglePopup,
        onPointerMove: movePillLight,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-label': current === null
          ? t('trigger')
          : `${t('trigger')}: ${modelName ?? t('auto')}, ${currentLevelName}`,
        title: current === null
          ? t('trigger')
          : `${modelName ?? t('auto')} · ${currentLevelName}`,
      },
      React.createElement('span', { className: 'dce-pill-bloom', 'aria-hidden': 'true' }),
      React.createElement(
        'span',
        { className: 'dce-pill-surface', 'aria-hidden': 'true' },
        React.createElement('span', { className: 'dce-pill-sweep' }),
        React.createElement('span', { className: 'dce-pill-light' }),
        React.createElement('span', { className: 'dce-pill-motes' }, pillMotes),
      ),
      React.createElement('span', { className: 'dce-pill-aura', 'aria-hidden': 'true' }, pillAura),
      React.createElement(
        'span',
        { className: 'dce-pill-label' },
        current === null
          ? t('trigger')
          : React.createElement(
            React.Fragment,
            null,
            React.createElement('span', { className: 'dce-pill-model' }, shortModel ?? t('auto')),
            React.createElement('span', { className: 'dce-pill-sep', 'aria-hidden': 'true' }, '·'),
            React.createElement('span', { className: 'dce-pill-level', 'data-tier': currentTier }, currentLevelName),
          ),
      ),
      React.createElement(ChevronDownIcon, { className: 'dce-pill-chevron' }),
      pillPulse > 0
        ? React.createElement('span', {
          key: `pill-pulse-${pillPulse}`,
          className: 'dce-pill-wave',
          'aria-hidden': 'true',
        })
        : null,
    ),
    popup,
  )
}

exports.name = PLUGIN_ID
// The model-directory service resolves per-session scopes and remote faces
// behind the caller's context, so the caller must declare the same services.
exports.inject = ['slots', 'locale', 'sessions', 'remote', 'remote.session', 'modelDirectories']
exports.apply = function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-codex-effort:dictionaries')
  ctx.effect(installStyles, 'dsh-codex-effort:styles')

  const directoryFor = (sessionId) => {
    const service = ctx.get('modelDirectories')
    if (service === undefined || service === null) return null
    try {
      return service.directoryFor(sessionId)
    } catch {
      // An addressed subagent session is intentionally not model-selectable.
      return null
    }
  }

  ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
    name: 'conversation.input.left',
    id: 'dsh-codex-effort',
    order: 12,
    locale: NS,
    inject: () => ({ getDirectory: directoryFor }),
  }, EffortControl))
}

		return module.exports;
	}
});
