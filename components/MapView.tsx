'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Event } from '@prisma/client'

interface MapViewProps {
  events: Event[]
}

export function MapView({ events }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error('Mapbox token missing')
      return
    }

    mapboxgl.accessToken = token
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [0, 0],
      zoom: 1,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    const markers = document.querySelectorAll('.mapboxgl-marker')
    markers.forEach((el) => el.remove())

    events.forEach((event) => {
      if (event.lat == null || event.lng == null) return

      const isQuestEvent = event.sideQuestStepId !== null
      const color = isQuestEvent ? '#8b5cf6' : '#f97316'

      const el = document.createElement('div')
      el.className = 'w-6 h-6 rounded-full border-2 border-white shadow-lg'
      el.style.backgroundColor = color
      el.style.cursor = 'pointer'

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${event.title}</strong><br>${event.description || ''}<br><small>${new Date(event.startDate).toLocaleString()}</small>`
      )

      new mapboxgl.Marker(el)
        .setLngLat([event.lng, event.lat])
        .setPopup(popup)
        .addTo(map.current!)
    })

    const validEvents = events.filter((e) => e.lat != null && e.lng != null)
    if (validEvents.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      validEvents.forEach((e) => {
        bounds.extend([e.lng!, e.lat!])
      })
      map.current.fitBounds(bounds, { padding: 40, maxZoom: 15 })
    }
  }, [events])

  return <div ref={mapContainer} className="w-full h-full" />
}