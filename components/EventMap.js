import Image from 'next/image'
import { useState, useEffect } from 'react'
import ReactMapGl, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function EventMap({ evt }) {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewport, setViewport] = useState({
    latitude: 40.712772,
    longitude: -73.935242,
    width: '100%',
    height: '500px',
    zoom: 12
  })

  console.log(evt.address)

  useEffect(() => {

    fetch(`https://api.geoapify.com/v1/geocode/search?text=${evt.address}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
      .then(response => response.json())
      .then(result => {
        setLat(result.features[0].properties.lat);
        setLng(result.features[0].properties.lon)
        setViewport({ ...viewport, latitude: lat, longitude: lng })
        setLoading(false)
      })
      .catch(error => console.log('error', error));

  }, [])

  if (loading) return false

  console.log(lat, lng)

  return (
    <ReactMapGl {...viewport} mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN} onViewportChange={(vp) => setViewport(vp)}>
      <Marker key={evt.id} latitude={lat ? lat : 40.712772} longitude={lng ? lng : -73.935242}>
        <Image src='/images/pin.svg' width={30} height={30} />
      </Marker>
    </ReactMapGl>
  )
}
