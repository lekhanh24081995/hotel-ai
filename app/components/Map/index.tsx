'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  FullscreenControl,
  GeolocateControl,
  LayerProps,
  Map,
  Marker,
  NavigationControl,
  ScaleControl
} from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import GeocoderControl from '../GeocoderControl';
import { Button } from '../ui/button';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { cn } from '@/app/lib/utils/common';
import NetworkGraph from '../NetworkGraph/NetworkGraph';
import ReChart from '../Rechart';
import { Card } from '../ui/card';

const initCoor: Point = {
  longitude: 107.58592685189807,
  latitude: 16.46260559492077
};

const items = [
  {
    type: 'Feature',
    text: 'Hanoi',
    place_name: 'Hanoi, Vietnam',
    center: [105.8544441, 21.0294498],
    geometry: { type: 'Point', coordinates: [105.8544441, 21.0294498] },
    id: 'place.17652',
    place_type: ['region', 'place']
  },
  {
    type: 'Feature',
    text: 'Hoa Lư',
    place_name: 'Hoa Lư, Ninh Bình, Vietnam',
    center: [105.952817, 20.299218],
    geometry: { type: 'Point', coordinates: [105.952817, 20.299218] },
    id: 'place.7432436',
    place_type: ['place']
  },
  {
    type: 'Feature',
    text: 'Haiphong',
    place_name: 'Haiphong, Vietnam',
    center: [106.6749591, 20.858864],
    geometry: { type: 'Point', coordinates: [106.6749591, 20.858864] },
    id: 'place.509172',
    place_type: ['region', 'place']
  },
  {
    type: 'Feature',
    text: 'Da Nang',
    place_name: 'Da Nang, Vietnam',
    center: [108.212, 16.068],
    geometry: { type: 'Point', coordinates: [108.212, 16.068] },
    id: 'place.50420',
    place_type: ['region', 'place']
  },
  {
    type: 'Feature',
    text: 'Quảng Ngãi',
    place_name: 'Quảng Ngãi, Quảng Ngãi, Vietnam',
    center: [108.802335, 15.119295],
    geometry: { type: 'Point', coordinates: [108.802335, 15.119295] },
    id: 'place.4974836',
    place_type: ['place']
  },
  {
    type: 'Feature',
    text: 'Vũng Tàu',
    place_name: 'Vũng Tàu, Bà Rịa-Vũng Tàu, Vietnam',
    center: [107.076476, 10.345796],
    geometry: { type: 'Point', coordinates: [107.076476, 10.345796] },
    id: 'place.5703924',
    place_type: ['place']
  }
];

export default function MapBox() {
  const [viewState, setViewState] = useState<ViewState>({
    ...initCoor,
    zoom: 5.5
  });
  const [locations, setLocations] = useState<ILocation[]>(items);
  const [route, setRoute] = useState<ILocation[]>(items);
  const [showType, setShowType] = useState('Line');

  const renderMarkers = useCallback(() => {
    return route.map((location, index) => {
      const isPoi = location.place_type.includes('poi');
      const markerContent = isPoi ? (
        <svg
          className="h-6 w-6 rounded-full bg-red-500 p-1"
          fill="#fff"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M0 32C0 14.3 14.3 0 32 0H480c17.7 0 32 14.3 32 32s-14.3 32-32 32V448c17.7 0 32 14.3 32 32s-14.3 32-32 32H304V464c0-26.5-21.5-48-48-48s-48 21.5-48 48v48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32V64C14.3 64 0 49.7 0 32zm96 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H112c-8.8 0-16 7.2-16 16zM240 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H240zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16zM112 192c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H112zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H368zM328 384c13.3 0 24.3-10.9 21-23.8c-10.6-41.5-48.2-72.2-93-72.2s-82.5 30.7-93 72.2c-3.3 12.8 7.8 23.8 21 23.8H328z" />
        </svg>
      ) : (
        <div className="rounded-full bg-blue-700 p-1">
          <div className="h-2 w-2 rounded-full bg-white"></div>
        </div>
      );

      return (
        <Marker
          key={location.id + index}
          longitude={location.center[0]}
          latitude={location.center[1]}
          anchor="bottom"
        >
          {markerContent}
        </Marker>
      );
    });
  }, [route]);

  const renderRouteMarkers = useCallback(() => {
    return route.map((location, index) => {
      const isDestination =
        location.text === route[route.length - 1].text &&
        location.text === route[0].text;
      const markerContent = isDestination ? (
        <svg
          className="h-6 w-6 rounded-full bg-red-500 p-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="white"
        >
          <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
        </svg>
      ) : (
        <div className="rounded-full bg-blue-700 p-1">
          <div className="h-2 w-2 rounded-full bg-white"></div>
        </div>
      );

      return (
        <Marker
          key={location.id + index}
          longitude={location.center[0]}
          latitude={location.center[1]}
          anchor="bottom"
        >
          {markerContent}
        </Marker>
      );
    });
  }, [route]);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.map((location) => location.center)
          }
        }
      ]
    }),
    [route]
  );

  const layerStyle: LayerProps = useMemo(
    () => ({
      type: 'line',
      source: 'line',
      id: 'line-background',
      paint: {
        'line-color': '#1399EC',
        'line-width': 4,
        'line-opacity': 0.7
      }
    }),
    []
  );

  const handleAdd = useCallback((location: ILocation) => {
    setRoute((prev) => [...prev, location]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setRoute((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSelect = useCallback((e: any) => {
    const result: IPlace = e.result;
    const { text, place_name, center, geometry, id, place_type, type } = result;

    setLocations((prev) => [
      ...prev,
      {
        type,
        text,
        place_name,
        center,
        geometry,
        id,
        place_type
      }
    ]);
  }, []);

  const netWorkData = useMemo(
    () =>
      route.map((location) => {
        const { center, text, id, place_type } = location;
        return {
          x: center[0],
          y: center[1],
          label: text,
          id,
          size: place_type.includes('poi') ? 10 : 5,
          color: '',
          opacity: 1,
          place_type
        };
      }),
    [route]
  );
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const handleMapClick = useCallback((event: any) => {
    const { lngLat } = event;
    setSelectedPoint({ longitude: lngLat.lng, latitude: lngLat.lat });

    setViewState((prevState) => ({
      ...prevState,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
      zoom: 15 // Adjust the zoom level as desired
    }));
  }, []);

  return (
    <div className="container mx-auto h-full w-full px-4 py-8">
      <div className="my-4 space-y-2">
        <h1 className="text-lg font-medium">List locations</h1>
        <Card className="flex flex-wrap gap-4 rounded  p-6">
          {locations.map((l, index) => (
            <Button key={l.id + index} onClick={() => handleAdd(l)}>
              {l.text}
            </Button>
          ))}
        </Card>
      </div>

      <div className="my-4 space-y-2">
        <h1 className="text-lg font-medium">Selected route</h1>
        <Card className="relative flex flex-wrap gap-4 rounded  p-6 pr-16">
          {route.map((l, index) => (
            <Button key={l.id + index} onClick={() => handleRemove(index)}>
              {l.text}
            </Button>
          ))}
          {route.length > 0 && (
            <Button
              variant={'outline'}
              size={'icon'}
              className="absolute right-2 top-2 h-7 w-7"
              onClick={() => setRoute([])}
            >
              <XMarkIcon className="size-4 text-black" />
            </Button>
          )}
        </Card>
      </div>

      <div className="my-4 space-y-2">
        <h1 className="text-lg font-medium">Display type</h1>
        <Card className="flex min-w-16 flex-wrap gap-3 px-6 py-4">
          {['Line', 'Route', 'Network', 'Graph'].map((text, index) => (
            <Button
              key={index}
              onClick={() => setShowType(text)}
              className={cn({
                'bg-blue-500': showType === text
              })}
            >
              {text}
            </Button>
          ))}
        </Card>
      </div>

      <div className="h-screen">
        {showType === 'Network' ? (
          route.length > 0 && <NetworkGraph items={route} />
        ) : showType === 'Graph' ? (
          <ReChart data={netWorkData} />
        ) : (
          <Map
            reuseMaps
            {...viewState}
            onMove={(event) => setViewState(event.viewState)}
            onClick={handleMapClick}
            style={{
              width: '100%',
              height: '100%'
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          >
            <FullscreenControl />
            <GeolocateControl />
            <NavigationControl />
            <ScaleControl />
            <GeocoderControl
              mapboxAccessToken={
                process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string
              }
              position="top-left"
              onResult={handleSelect}
              proximity={{
                latitude: 21.026037129152332,
                longitude: 105.83197966918473
              }}
              countries="vn"
            />
            <Source id="line" type="geojson" data={geojson}>
              <Layer {...layerStyle} />
            </Source>
            {showType === 'Line' ? renderMarkers() : renderRouteMarkers()}
          </Map>
        )}
      </div>
    </div>
  );
}
