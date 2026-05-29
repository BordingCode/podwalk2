// Narration via the browser's built-in Web Speech API (speechSynthesis).
// Works offline, free, no audio files. Voice quality depends on the device.
// On iOS it must be kicked off by a user gesture (we always start on a tap).

let currentUtterance = null
const listeners = new Set()
let state = { speaking: false, paused: false, id: null }

function emit(next) {
  state = { ...state, ...next }
  listeners.forEach((fn) => fn(state))
}

export function subscribeSpeech(fn) {
  listeners.add(fn)
  fn(state)
  return () => listeners.delete(fn)
}

export function getSpeechState() {
  return state
}

// Some browsers load voices asynchronously.
export function voicesReady() {
  return new Promise((resolve) => {
    const v = window.speechSynthesis?.getVoices() || []
    if (v.length) return resolve(v)
    const handler = () => resolve(window.speechSynthesis.getVoices())
    window.speechSynthesis?.addEventListener('voiceschanged', handler, { once: true })
    setTimeout(() => resolve(window.speechSynthesis?.getVoices() || []), 1000)
  })
}

export function hasVoiceFor(langPrefix) {
  const v = window.speechSynthesis?.getVoices() || []
  return v.some((x) => x.lang?.toLowerCase().startsWith(langPrefix.toLowerCase()))
}

function pickVoice(langCode) {
  const voices = window.speechSynthesis?.getVoices() || []
  return (
    voices.find((v) => v.lang?.toLowerCase() === langCode.toLowerCase()) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase())) ||
    null
  )
}

export async function speak(text, lang, id) {
  if (!('speechSynthesis' in window)) return
  stop()
  await voicesReady()
  const langCode = lang === 'en' ? 'en-GB' : 'da-DK'
  // Break long text into sentence chunks — long single utterances get cut off
  // on some engines.
  const chunks = String(text)
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+[.!?]*/g) || [String(text)]
  const voice = pickVoice(langCode)
  let i = 0
  emit({ speaking: true, paused: false, id })

  const speakChunk = () => {
    if (i >= chunks.length) {
      emit({ speaking: false, paused: false, id: null })
      return
    }
    const u = new SpeechSynthesisUtterance(chunks[i].trim())
    u.lang = langCode
    if (voice) u.voice = voice
    u.rate = 0.98
    u.pitch = 1
    u.onend = () => {
      i++
      speakChunk()
    }
    u.onerror = () => emit({ speaking: false, paused: false, id: null })
    currentUtterance = u
    window.speechSynthesis.speak(u)
  }
  speakChunk()
}

export function pause() {
  if (window.speechSynthesis?.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause()
    emit({ paused: true })
  }
}
export function resume() {
  if (window.speechSynthesis?.paused) {
    window.speechSynthesis.resume()
    emit({ paused: false })
  }
}
export function stop() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  currentUtterance = null
  emit({ speaking: false, paused: false, id: null })
}
