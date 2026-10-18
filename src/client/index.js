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
