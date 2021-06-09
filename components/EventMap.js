import Image from 'next/image'
import { useState, useEffect } from 'react'
import ReactMapGl, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { NEXT_URL } from 'config/index'

export default function EventMap({ evt }) {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewport, setViewport] = useState({
    latitude: 40.712772,
    longitude: -73.935242,
    width: '100%',
    height: '500px',
    zoom: 12
  })

  useEffect(() => {
    getGeocode(evt.address)

  }, [])

  const getGeocode = async (address) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/map`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: address
        })
      })

      const response = await res.json()

      await setLat(response[1])
      await setLng(response[0])

      setViewport({ ...viewport, latitude: response[1], longitude: response[0] })
      setLoading(false)
    } catch (error) {
      console.log('ERROR', error)
    }
  }

  if (loading) return false

  return (
    <ReactMapGl {...viewport} mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN} onViewportChange={(vp) => setViewport(vp)}>
      <Marker key={evt.id} latitude={lat} longitude={lng}>
        <Image src='/images/pin.svg' width={30} height={30} />
      </Marker>
    </ReactMapGl>
  )
}


