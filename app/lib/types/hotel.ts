interface Hotel {
  _id: string;
  vietnamese_name: string;
  english_name: string;
  url_web: string;
  address: string;
  province: string;
  country: string;
  phone: string;
  currency: string;
  contact: string;
  contract_agreement: string[];
  offers: string[];
  surcharge: string[];
  applied_period: string;
  terms_and_conditions: string[];
  room_rate_image_indices: number[];
  room_rate: {
    room_type: string;
    price: number;
    price_type: string;
    no_of_rooms: number;
    area: null;
    period: {
      start_date: string;
      end_date: string;
    };
  }[];
  converted_validity_period: {
    [key: number]: {
      start_date: string;
      end_date: string;
    }[];
  };
  decoded_validity_periods: {
    [key: number]: {
      start_date: string;
      end_date: string;
    }[];
  };
  created_at: string;
  source: string;
  image_paths: string[];
  room_rate_image_paths: string[];
  is_embedded: boolean;
  summary: string;
}

interface IPlace {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    mapbox_id: string;
    wikidata: string;
  };
  text: string;
  place_name: string;
  bbox: number[];
  center: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  context: Array<{
    id: string;
    mapbox_id: string;
    wikidata: string;
    short_code: string;
    text: string;
  }>;
}

interface ILocation {
  text: string;
  place_name: string;
  center: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  id: string;
  place_type: string[];
}
interface Point {
  longitude: number;
  latitude: number;
}

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  [key: string]: any;
}
