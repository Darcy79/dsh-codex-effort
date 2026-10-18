const tiers = [
  { name: 'Off', native: 'Off' },
  { name: 'Low', native: 'Low' },
  { name: 'High', native: 'High' },
  { name: 'Max', native: 'Max' },
]

const DEFAULT_INDEX = 2
const DEFAULT_MODEL = 'DeepSeek-V4.1-Flash'
const THUMB_SIZE = 26
const THUMB_TOP = 2
const params = new URLSearchParams(location.search)
const initialTier = Math.max(0, Math.min(tiers.length - 1, Number(params.get('tier') ?? '2') || 0))
const initialTheme = params.get('theme')

const popWrap = document.querySelector('#popWrap')
const popup = document.querySelector('#popup')
const trigger = document.querySelector('#triggerPill')
const slider = document.querySelector('#slider')
const range = document.querySelector('#effortRange')
const fillClip = document.querySelector('#fillClip')
const fill = document.querySelector('#fill')
const thumb = document.querySelector('#thumb')
const thumbRing = document.querySelector('#thumbRing')
const tierTitle = document.querySelector('#tierTitle')
const nativeEffort = document.querySelector('#nativeEffort')
const nativeName = document.querySelector('#nativeName')
const modelName = document.querySelector('#modelName')
const modelBtn = document.querySelector('#modelBtn')
const effortPane = document.querySelector('#effortPane')
const modelPane = document.querySelector('#modelPane')
const effortHead = document.querySelector('.demo-head-effort')
const modelHead = document.querySelector('.demo-head-model')
const resetBtn = document.querySelector('#resetBtn')
const backBtn = document.querySelector('#backBtn')
const closeBtn = document.querySelector('#closeBtn')
const themeToggle = document.querySelector('#themeToggle')
const micBtn = document.querySelector('#micBtn')
const voiceBtn = document.querySelector('#voiceBtn')
const starField = document.querySelector('#starField')
const tickField = document.querySelector('#tickField')
const pillMotes = document.querySelector('#pillMotes')
const pillAura = document.querySelector('#pillAura')
const pillModel = document.querySelector('#pillModel')
const pillLevel = document.querySelector('#pillLevel')
const thumbMotes = document.querySelector('#thumbMotes')

const PILL_AURA = [
  { x: -3, y: 22, size: 3.2, delay: 0, duration: 6.2, color: '#a9c3ff' },
  { x: 101, y: 68, size: 2.8, delay: 1.3, duration: 5.7, color: '#d8b4fe' },
  { x: 18, y: -6, size: 2.4, delay: 2.1, duration: 6.8, color: '#ffffff' },
  { x: 72, y: 104, size: 3, delay: 0.8, duration: 5.9, color: '#b6d2ff' },
  { x: 95, y: 8, size: 2.3, delay: 2.7, duration: 6.4, color: '#c4a7ff' },
]

const THUMB_MOTES = [
  { x: -17, y: -13, size: 3, delay: 0, duration: 5.2 },
  { x: 16, y: -15, size: 2.6, delay: 1.1, duration: 5.8 },
  { x: 19, y: 10, size: 3.4, delay: 2.2, duration: 4.8 },
  { x: -15, y: 15, size: 2.4, delay: 0.7, duration: 5.5 },
  { x: 2, y: -19, size: 2.8, delay: 1.7, duration: 6.1 },
]

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

const BURST_PARTICLES = Array.from({ length: 16 }, (_, particleIndex) => {
  const angle = (particleIndex / 16) * Math.PI * 2 - Math.PI / 2
  const distance = 20 + (particleIndex % 4) * 7
  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    size: 2.4 + (particleIndex % 3) * 1.2,
    delay: (particleIndex % 5) * 24,
    color: particleIndex % 3 === 0 ? '#ffffff' : particleIndex % 2 === 0 ? '#ffd0e4' : '#e84a92',
  }
})

let index = initialTier
let trackWidth = 0
let wasMax = false
let revealTimer = null
let burstTimer = null
let burstElement = null
const dots = []

function makeRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function simplifyModel(value) {
  return value.replace(/^deepseek[-\s_]*/i, '').replace(/[-\s_]+/g, '').slice(0, 16)
}

for (const mote of PILL_AURA) {
  const particle = document.createElement('span')
  particle.className = 'dce-pill-aura-dot'
  particle.style.setProperty('--dce-aura-x', `${mote.x}%`)
  particle.style.setProperty('--dce-aura-y', `${mote.y}%`)
  particle.style.setProperty('--dce-aura-size', `${mote.size}px`)
  particle.style.setProperty('--dce-aura-color', mote.color)
  particle.style.animationDelay = `${mote.delay}s`
  particle.style.animationDuration = `${mote.duration}s`
  pillAura.append(particle)
}

for (const mote of THUMB_MOTES) {
  const particle = document.createElement('span')
  particle.className = 'dce-thumb-mote'
  particle.style.setProperty('--dce-thumb-x', `${mote.x}px`)
  particle.style.setProperty('--dce-thumb-y', `${mote.y}px`)
  particle.style.setProperty('--dce-thumb-size', `${mote.size}px`)
  particle.style.animationDelay = `${mote.delay}s`
  particle.style.animationDuration = `${mote.duration}s`
  thumbMotes.append(particle)
}

for (const mote of PILL_MOTES) {
  const particle = document.createElement('span')
  particle.className = 'dce-pill-particle'
  particle.style.setProperty('--dce-mote-x', `${mote.x}%`)
  particle.style.setProperty('--dce-mote-y', `${mote.y}%`)
  particle.style.setProperty('--dce-mote-size', `${mote.size}px`)
  particle.style.setProperty('--dce-mote-color', mote.color)
  particle.style.animationDelay = `${mote.delay}s`
  particle.style.animationDuration = `${mote.duration}s`
  pillMotes.append(particle)
}

const random = makeRandom(0x9e3779b9)
for (let starIndex = 0; starIndex < 22; starIndex += 1) {
  const star = document.createElement('span')
  star.className = 'dce-star'
  star.style.top = `${10 + random() * 80}%`
  star.style.width = `${1 + random() * 1.7}px`
  star.style.height = star.style.width
  star.style.animationDuration = `${1.45 + random() * 1.15}s`
  star.style.animationDelay = `${-random() * 2.6}s`
  star.style.setProperty('--dce-star-opacity', String(0.38 + random() * 0.62))
  starField.append(star)
}

for (let stop = 1; stop < tiers.length; stop += 1) {
  const dot = document.createElement('span')
  dot.className = 'dce-tick'
  tickField.append(dot)
  dots.push(dot)
}

function thumbCenter() {
  const travel = Math.max(0, trackWidth - THUMB_SIZE)
  const progress = tiers.length > 1 ? index / (tiers.length - 1) : 0
  return Math.round(progress * travel) + THUMB_SIZE / 2
}

function triggerBurst() {
  if (!slider || trackWidth === 0) return
  if (burstElement) burstElement.remove()
  const element = document.createElement('span')
  element.className = 'dce-burst'
  element.style.left = `${thumbCenter()}px`
  element.style.top = `${THUMB_TOP + THUMB_SIZE / 2}px`
  const ring = document.createElement('span')
  ring.className = 'dce-burst-ring'
  element.append(ring)
  for (const particle of BURST_PARTICLES) {
    const dot = document.createElement('span')
    dot.className = 'dce-burst-dot'
    dot.style.setProperty('--dce-burst-x', `${particle.dx.toFixed(1)}px`)
    dot.style.setProperty('--dce-burst-y', `${particle.dy.toFixed(1)}px`)
    dot.style.setProperty('--dce-burst-size', `${particle.size}px`)
    dot.style.animationDelay = `${particle.delay}ms`
    dot.style.background = particle.color
    dot.style.color = particle.color
    element.append(dot)
  }
  slider.append(element)
  burstElement = element
  setTimeout(() => {
    element.remove()
    if (burstElement === element) burstElement = null
  }, 900)
}

function scheduleBurst() {
  if (burstTimer !== null) clearTimeout(burstTimer)
  burstTimer = setTimeout(() => {
    burstTimer = null
    triggerBurst()
  }, 440)
}

function layout() {
  const travel = Math.max(0, trackWidth - THUMB_SIZE)
  const progress = tiers.length > 1 ? index / (tiers.length - 1) : 0
  const left = Math.round(progress * travel)
  const fillWidth = index === 0 || trackWidth === 0 ? 0 : Math.round(left + THUMB_SIZE / 2)
  const max = index === tiers.length - 1
  const tier = tiers[index].name.toLowerCase()

  fillClip.style.width = `${fillWidth}px`
  fillClip.style.setProperty('--dce-fill-width', `${fillWidth}px`)
  fill.style.width = `${trackWidth}px`
  thumb.style.left = `${left}px`
  thumb.style.setProperty('--dce-thumb-left', `${left}px`)

  dots.forEach((dot, dotIndex) => {
    const stop = dotIndex + 1
    dot.style.left = `${THUMB_SIZE / 2 + (stop / (tiers.length - 1)) * travel}px`
    dot.classList.toggle('is-filled', stop <= index)
  })

  slider.dataset.tier = tier
  slider.dataset.max = String(max)
  slider.dataset.revealing = slider.dataset.revealing ?? 'false'
  thumb.dataset.tier = tier
  thumb.dataset.max = String(max)
  popup.dataset.tier = tier
  popup.dataset.max = String(max)
}

function measure() {
  trackWidth = slider.clientWidth
  layout()
}

function animateRing() {
  if (typeof thumbRing.animate !== 'function') return
  thumbRing.getAnimations().forEach(animation => animation.cancel())
  thumbRing.animate([
    { opacity: 0.7, transform: 'scale(.72)' },
    { opacity: 0, transform: 'scale(1.42)' },
  ], { duration: 480, easing: 'cubic-bezier(.22, 1, .36, 1)' })
}

function cancelReveal() {
  if (revealTimer !== null) {
    clearTimeout(revealTimer)
    revealTimer = null
  }
  slider.dataset.revealing = 'false'
}

function reveal() {
  cancelReveal()
  void slider.offsetWidth
  slider.dataset.revealing = 'true'
  revealTimer = setTimeout(() => {
    revealTimer = null
    slider.dataset.revealing = 'false'
  }, 520)
}

function render(nextIndex, animate = true) {
  const previousName = tierTitle.textContent
  const previousTier = tierTitle.dataset.tier
  index = Math.max(0, Math.min(tiers.length - 1, nextIndex))
  const tier = tiers[index]
  const tierKey = tier.name.toLowerCase()
  const max = index === tiers.length - 1

  tierTitle.textContent = tier.name
  tierTitle.dataset.tier = tierKey
  nativeEffort.textContent = tier.native
  range.value = String(index)
  range.setAttribute('aria-valuetext', tier.name)
  pillLevel.textContent = tier.name
  pillLevel.dataset.tier = tierKey
  layout()

  if (animate && (previousName !== tier.name || previousTier !== tierKey)) {
    tierTitle.classList.remove('dce-title-in')
    void tierTitle.offsetWidth
    tierTitle.classList.add('dce-title-in')
    animateRing()
  }

  if (max && !wasMax) scheduleBurst()
  if (!max && burstTimer !== null) {
    clearTimeout(burstTimer)
    burstTimer = null
  }
  wasMax = max
}

function openPopup() {
  popWrap.classList.add('is-open')
  trigger.setAttribute('aria-expanded', 'true')
  requestAnimationFrame(() => {
    measure()
    reveal()
    if (index === tiers.length - 1) scheduleBurst()
  })
}

function closePopup() {
  popWrap.classList.remove('is-open')
  trigger.setAttribute('aria-expanded', 'false')
  cancelReveal()
}

function showEffortPane() {
  effortHead.hidden = false
  modelHead.hidden = true
  effortPane.hidden = false
  modelPane.hidden = true
}

function showModelPane() {
  effortHead.hidden = true
  modelHead.hidden = false
  effortPane.hidden = true
  modelPane.hidden = false
}

trigger.addEventListener('pointermove', (event) => {
  const rect = trigger.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  trigger.style.setProperty('--dce-pill-x', `${x.toFixed(1)}%`)
  trigger.style.setProperty('--dce-pill-y', `${y.toFixed(1)}%`)
})

range.addEventListener('input', () => {
  cancelReveal()
  render(Number(range.value), true)
})

range.addEventListener('pointerdown', () => {
  cancelReveal()
  slider.dataset.dragging = 'true'
  thumb.dataset.dragging = 'true'
})

window.addEventListener('pointerup', () => {
  slider.dataset.dragging = 'false'
  thumb.dataset.dragging = 'false'
})

trigger.addEventListener('click', (event) => {
  event.stopPropagation()
  const wave = document.createElement('span')
  wave.className = 'dce-pill-wave'
  trigger.append(wave)
  setTimeout(() => wave.remove(), 700)
  if (popWrap.classList.contains('is-open')) closePopup()
  else {
    showEffortPane()
    openPopup()
  }
})

resetBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  render(DEFAULT_INDEX)
})

modelBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  showModelPane()
})

backBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  showEffortPane()
})

closeBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  closePopup()
})

for (const row of document.querySelectorAll('.dce-model-row')) {
  row.addEventListener('click', (event) => {
    event.stopPropagation()
    const selectedModel = row.dataset.model
    modelName.textContent = selectedModel
    nativeName.textContent = selectedModel
    pillModel.textContent = simplifyModel(selectedModel)
    for (const candidate of document.querySelectorAll('.dce-model-row')) {
      const selected = candidate === row
      candidate.dataset.selected = String(selected)
      candidate.setAttribute('aria-selected', String(selected))
      const check = candidate.querySelector('.dce-check')
      if (check) check.style.visibility = selected ? 'visible' : 'hidden'
    }
    showEffortPane()
  })
}

document.addEventListener('click', (event) => {
  if (!popWrap.contains(event.target) && event.target !== trigger && !trigger.contains(event.target)) {
    closePopup()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!effortPane.hidden) closePopup()
    else showEffortPane()
  }
})

function readTheme() {
  try {
    return localStorage.getItem('dce-demo-theme')
  } catch {
    return null
  }
}

function saveTheme(value) {
  try {
    localStorage.setItem('dce-demo-theme', value)
  } catch {
    // file:// and privacy modes may disable storage; the toggle still works.
  }
}

if (initialTheme === 'dark' || initialTheme === 'light') {
  document.documentElement.dataset.theme = initialTheme
  saveTheme(initialTheme)
} else if (readTheme() === 'dark') {
  document.documentElement.dataset.theme = 'dark'
}

themeToggle.addEventListener('click', (event) => {
  event.stopPropagation()
  const dark = document.documentElement.dataset.theme === 'dark'
  if (dark) delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = 'dark'
  saveTheme(dark ? 'light' : 'dark')
})

micBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  micBtn.classList.toggle('is-recording')
  micBtn.setAttribute('aria-pressed', String(micBtn.classList.contains('is-recording')))
})

voiceBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  voiceBtn.classList.toggle('is-listening')
  voiceBtn.setAttribute('aria-pressed', String(voiceBtn.classList.contains('is-listening')))
})

pillModel.textContent = simplifyModel(DEFAULT_MODEL)

if (typeof ResizeObserver !== 'undefined') {
  const observer = new ResizeObserver(measure)
  observer.observe(slider)
}

render(initialTier, false)
requestAnimationFrame(() => {
  measure()
  reveal()
  animateRing()
  if (initialTier === tiers.length - 1) scheduleBurst()
})
