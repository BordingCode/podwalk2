import { useEffect, useState } from 'react'
import { speak, pause, resume, stop, subscribeSpeech, hasVoiceFor, voicesReady } from '../lib/speech.js'
import { useI18n } from '../lib/i18n.js'
import Icon from './Icon.jsx'

// A narration bar that reads a location's text aloud using the device voice.
export default function AudioPlayer({ id, text, autoStart }) {
  const { t, lang } = useI18n()
  const [s, setS] = useState({ speaking: false, paused: false, id: null })
  const [hasVoice, setHasVoice] = useState(true)

  useEffect(() => subscribeSpeech(setS), [])
  useEffect(() => {
    voicesReady().then(() => setHasVoice(hasVoiceFor(lang === 'en' ? 'en' : 'da')))
  }, [lang])

  // Stop narration whenever we leave / change location.
  useEffect(() => () => stop(), [id])

  // Auto-start when the walk's geofence asks for it (still inside a user gesture
  // chain because walk mode was started by a tap).
  useEffect(() => {
    if (autoStart) speak(text, lang, id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  const mine = s.id === id && s.speaking
  const onPlay = () => {
    if (!mine) speak(text, lang, id)
    else if (s.paused) resume()
    else pause()
  }

  return (
    <>
      <div className={'audiobar' + (mine && !s.paused ? '' : ' idle')}>
        <button className="play" onClick={onPlay} aria-label={t('listen')}>
          {mine && !s.paused ? <Icon name="pause" size={18} stroke={2.5} /> : <Icon name="play" size={18} fill />}
        </button>
        <div>
          <div className="lbl">{mine ? (s.paused ? t('resume') : t('listen')) : t('listen')}</div>
          <div className="sub">{lang === 'en' ? 'Narration' : 'Oplæsning'}</div>
        </div>
        <div className="eq" aria-hidden><i></i><i></i><i></i><i></i></div>
        {mine && (
          <div className="small">
            <button onClick={() => stop()}>{t('stopAudio')}</button>
          </div>
        )}
      </div>
      {!hasVoice && <div className="banner-note">{t('noAudioVoice')}</div>}
    </>
  )
}
