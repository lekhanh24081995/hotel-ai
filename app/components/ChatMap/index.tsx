'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FullscreenControl,
  LayerProps,
  Map,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl
} from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { BotMessage } from '../message';
import ChatSuggestion from '../ChatSuggestion';
import { searchGeocoderPlaces } from '@/app/lib/utils/common';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

const initCoor = {
  longitude: 107.58592685189807,
  latitude: 16.46260559492077
};

type Props = {
  route: string[];
};

export default function ChatMap({
  route = ['Đà Nẵng, Qui Nhơn, Phú Quốc']
}: Props) {
  const [viewState, setViewState] = useState({
    ...initCoor,
    zoom: 5.5
  });
  const [hotels, setHotels] = useState<IPlace[] | []>([]);
  const [popupInfo, setPopupInfo] = useState<IPlace | null>(null);
  const mapRef = useRef<any>();

  const fetchCityData = useCallback(async (cities: string[]) => {
    const results = await Promise.all(
      cities.map(async (city) => {
        const cityData = await searchGeocoderPlaces(city, {
          params: {
            types: 'place'
          }
        });

        const filteredFeatures = cityData.features.filter(
          (feature: any) =>
            feature.place_type.includes('place') ||
            feature.place_type.includes('region')
        );

        return filteredFeatures.length > 0 ? filteredFeatures[0] : null;
      })
    );

    return results;
  }, []);

  const zoomToBounds = useCallback((lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], duration: 1000, zoom: 18 });
  }, []);

  const { data: cities } = useQuery({
    queryKey: ['hotels', route],
    queryFn: () => fetchCityData(route),
    enabled: route.length > 0
  });

  const filterCities = useMemo(
    () => cities?.filter((location) => location) || [],
    [cities]
  );

  const geojson = useMemo(() => {
    if (filterCities.length === 0) {
      return {
        type: 'FeatureCollection',
        features: []
      };
    }
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: filterCities.map((location) => location.center)
          }
        }
      ]
    };
  }, [filterCities]);

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

  const handleCityClick = useCallback(
    async (location: ILocation) => {
      const longitude = location.center[0];
      const latitude = location.center[1];

      zoomToBounds(longitude, latitude);

      const res = await searchGeocoderPlaces('hotel', {
        proximity: `${longitude},${latitude}`,
        limit: 10
      });
      setHotels(res.features);
    },
    [zoomToBounds]
  );

  const routeMarkers = useMemo(() => {
    return filterCities?.map((location, index) => {
      const isDestination =
        location.text === filterCities[filterCities.length - 1].text &&
        location.text === filterCities[0].text;
      if (isDestination) {
        return (
          <Marker
            key={location.id + index}
            longitude={location.center[0]}
            latitude={location.center[1]}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              handleCityClick(location);
            }}
          >
            <svg
              className="h-6 w-6 cursor-pointer rounded-full bg-red-500 p-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="white"
            >
              <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
            </svg>
          </Marker>
        );
      } else {
        return (
          <Marker
            key={location.id + index}
            longitude={location.center[0]}
            latitude={location.center[1]}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              handleCityClick(location);
            }}
          >
            <div className="cursor-pointer rounded-full bg-blue-700 p-1">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </Marker>
        );
      }
    });
  }, [filterCities, handleCityClick]);

  const hotelMarkers = useMemo(() => {
    return (
      <>
        {hotels.map((hotel, index) => (
          <Marker
            key={hotel.id + index}
            longitude={hotel.center[0]}
            latitude={hotel.center[1]}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              zoomToBounds(hotel.center[0], hotel.center[1]);
              setPopupInfo(hotel);
            }}
          >
            <div className="relative cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50px"
                className="h-6 w-6 rounded-full bg-blue-500 p-[6px]"
                fill="#fff"
              >
                <path d="M2.75 12h18.5c.69 0 1.25.56 1.25 1.25V18l.75-.75H.75l.75.75v-4.75c0-.69.56-1.25 1.25-1.25m0-1.5A2.75 2.75 0 0 0 0 13.25V18c0 .414.336.75.75.75h22.5A.75.75 0 0 0 24 18v-4.75a2.75 2.75 0 0 0-2.75-2.75zM0 18v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 0 18m22.5 0v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-1.5 0m-.75-6.75V4.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 4.5v6.75a.75.75 0 0 0 1.5 0V4.5a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 0 1.5 0m-13.25-3h7a.25.25 0 0 1 .25.25v2.75l.75-.75h-9l.75.75V8.5a.25.25 0 0 1 .25-.25m0-1.5A1.75 1.75 0 0 0 6.75 8.5v2.75c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75V8.5a1.75 1.75 0 0 0-1.75-1.75z"></path>
              </svg>
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            longitude={popupInfo.center[0]}
            latitude={popupInfo.center[1]}
            closeButton={true}
            closeOnClick={true}
            onClose={() => setPopupInfo(null)}
            anchor="top"
            offset={10}
          >
            <XMarkIcon
              className="absolute right-1 top-1 h-4 w-4 cursor-pointer rounded-full bg-gray-200 p-[3px] text-gray-600 hover:bg-gray-300 hover:text-gray-800"
              onClick={() => setPopupInfo(null)}
            />
            <div>
              <h3 className="mb-2 text-lg font-semibold">{popupInfo.text}</h3>
              <p className="text-sm text-gray-600">{popupInfo.place_name}</p>
            </div>
          </Popup>
        )}
      </>
    );
  }, [hotels, popupInfo, zoomToBounds]);

  const handleMapClick = useCallback(
    (event: any) => {
      const { lng, lat } = event.lngLat;

      zoomToBounds(lng, lat);
    },
    [zoomToBounds]
  );

  return (
    <div className="space-y-4">
      <div className="h-full w-full space-y-4 md:max-w-[75%]">
        <BotMessage
          showAvatar={false}
          showAction={false}
          content={`Here's the map of route:\n${route.join(', ')}`}
        />

        <div className="h-[80vh]">
          <Map
            ref={mapRef}
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
            <NavigationControl />
            <ScaleControl />
            <Source id="line" type="geojson" data={geojson}>
              <Layer {...layerStyle} />
            </Source>
            {routeMarkers}
            {hotelMarkers}
          </Map>
        </div>
      </div>

      <ChatSuggestion />
    </div>
  );
}
