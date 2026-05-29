import { useState, useEffect, useRef, useCallback } from 'react'

// Watches the user's position. `active` toggles the watch on/off so we don't
// drain battery when location isn't needed. Returns {pos, accuracy, status, request}.
export function useGeolocation(active) {
  const [pos, setPos] = useState(null) // {lat, lng}
  const [accuracy, setAccuracy] = useState(null)
  const [status, setStatus] = useState('idle') // idle | prompt | granted | denied | unavailable
  const watchId = useRef(null)

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable')
      return
    }
    if (watchId.current != null) return
    setStatus('prompt')
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
        setAccuracy(p.coords.accuracy)
        setStatus('granted')
      },
      (err) => {
        setStatus(err.code === 1 ? 'denied' : 'unavailable')
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )
  }, [])

  const stop = useCallback(() => {
    if (watchId.current != null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
  }, [])

  useEffect(() => {
    if (active) start()
    else stop()
    return stop
  }, [active, start, stop])

  return { pos, accuracy, status, request: start }
}
