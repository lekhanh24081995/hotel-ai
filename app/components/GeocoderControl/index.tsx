import { useControl, ControlPosition, MarkerProps, Marker } from 'react-map-gl';
import MapboxGeocoder, { GeocoderOptions } from '@mapbox/mapbox-gl-geocoder';
import { ReactElement, useState } from 'react';

type GeocoderControlProps = Omit<
  GeocoderOptions,
  'accessToken' | 'mapboxgl' | 'marker'
> & {
  markerProps?: boolean | Omit<MarkerProps, 'longitude' | 'latitude'>;
  mapboxAccessToken: string;
  position: ControlPosition;
  onLoading?: (e: object) => void;
  onResults?: (e: object) => void;
  onResult?: (e: object) => void;
  onError?: (e: object) => void;
};

/* eslint-disable complexity,max-statements */
export default function GeocoderControl(props: GeocoderControlProps) {
  const {
    mapboxAccessToken,
    markerProps = true,
    position,
    onLoading,
    onError,
    onResult,
    onResults,
    ...rest
  } = props;
  const [marker, setMarker] = useState<ReactElement | null>(null);
  const geocoder = useControl<any>(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: mapboxAccessToken,
        clearAndBlurOnEsc: true
      });
      ctrl.on('loading', (e) => onLoading?.(e));
      ctrl.on('results', (e) => onResults?.(e));
      ctrl.on('clear', () => setMarker(null));
      ctrl.on('result', (e) => {
        onResult?.(e);

        const { result } = e;
        const location =
          result &&
          (result.center ||
            (result.geometry?.type === 'Point' && result.geometry.coordinates));
        if (location && markerProps) {
          setMarker(
            typeof props.markerProps === 'boolean' ? null : (
              <Marker
                {...(markerProps as Omit<
                  MarkerProps,
                  'longitude' | 'latitude'
                >)}
                longitude={location[0]}
                latitude={location[1]}
                color="red"
              />
            )
          );
        } else {
          setMarker(null);
        }
      });
      ctrl.on('error', (e) => onError?.(e));
      return ctrl;
    },
    {
      position
    }
  );

  // @ts-ignore (TS2339) private member
  if (geocoder._map) {
    if (
      geocoder.getProximity() !== rest.proximity &&
      rest.proximity !== undefined
    ) {
      geocoder.setProximity(rest.proximity);
    }
    if (
      geocoder.getRenderFunction() !== rest.render &&
      rest.render !== undefined
    ) {
      geocoder.setRenderFunction(rest.render);
    }
    if (
      geocoder.getLanguage() !== rest.language &&
      rest.language !== undefined
    ) {
      geocoder.setLanguage(rest.language);
    }
    if (geocoder.getZoom() !== rest.zoom && rest.zoom !== undefined) {
      geocoder.setZoom(rest.zoom);
    }
    if (geocoder.getFlyTo() !== rest.flyTo && rest.flyTo !== undefined) {
      geocoder.setFlyTo(rest.flyTo);
    }
    if (
      geocoder.getPlaceholder() !== rest.placeholder &&
      rest.placeholder !== undefined
    ) {
      geocoder.setPlaceholder(rest.placeholder);
    }
    if (
      geocoder.getCountries() !== rest.countries &&
      rest.countries !== undefined
    ) {
      geocoder.setCountries(rest.countries);
    }
    if (geocoder.getTypes() !== rest.types && rest.types !== undefined) {
      geocoder.setTypes(rest.types);
    }
    if (
      geocoder.getMinLength() !== rest.minLength &&
      rest.minLength !== undefined
    ) {
      geocoder.setMinLength(rest.minLength);
    }
    if (geocoder.getLimit() !== rest.limit && rest.limit !== undefined) {
      geocoder.setLimit(rest.limit);
    }
    if (geocoder.getFilter() !== rest.filter && rest.filter !== undefined) {
      geocoder.setFilter(rest.filter);
    }
    if (geocoder.getOrigin() !== rest.origin && rest.origin !== undefined) {
      geocoder.setOrigin(rest.origin);
    }
    // Types missing from @types/mapbox__mapbox-gl-geocoder
    // if (geocoder.getAutocomplete() !== rest.autocomplete && rest.autocomplete !== undefined) {
    //   geocoder.setAutocomplete(rest.autocomplete);
    // }
    // if (geocoder.getFuzzyMatch() !== rest.fuzzyMatch && rest.fuzzyMatch !== undefined) {
    //   geocoder.setFuzzyMatch(rest.fuzzyMatch);
    // }
    // if (geocoder.getRouting() !== rest.routing && rest.routing !== undefined) {
    //   geocoder.setRouting(rest.routing);
    // }
    // if (geocoder.getWorldview() !== rest.worldview && rest.worldview !== undefined) {
    //   geocoder.setWorldview(rest.worldview);
    // }
  }
  return marker;
}
