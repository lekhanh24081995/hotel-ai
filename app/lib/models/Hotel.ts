import { model, Schema, models } from 'mongoose';

const RoomRateSchema = new Schema({
  room_type: { type: String, required: true },
  price: { type: Number, required: true },
  price_type: { type: String, required: true },
  no_of_rooms: { type: Number, required: true },
  area: { type: Schema.Types.Mixed, default: null },
  period: {
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
  }
});

const ValidityPeriodSchema = new Schema({
  start_date: { type: String, required: true },
  end_date: { type: String, required: true }
});

const HotelSchema = new Schema({
  vietnamese_name: { type: String, required: true },
  english_name: { type: String, required: true },
  url_web: { type: String, required: true },
  address: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  currency: { type: String, required: true },
  contact: { type: String, required: true },
  contract_agreement: { type: [String], required: true },
  offers: { type: [String], required: true },
  surcharge: { type: [String], required: true },
  applied_period: { type: String, required: true },
  terms_and_conditions: { type: [String], required: true },
  room_rate_image_indices: { type: [Number], required: true },
  room_rate_bf_rm: { type: [RoomRateSchema], required: true },
  converted_validity_period: {
    type: Map,
    of: [ValidityPeriodSchema],
    required: true
  },
  decoded_validity_periods: {
    type: Map,
    of: [ValidityPeriodSchema],
    required: true
  },
  created_at: { type: Date, required: true },
  source: { type: String, required: true },
  image_paths: { type: [String], required: true },
  room_rate_image_paths: { type: [String], required: true },
  is_embedded: { type: Boolean, required: true },
  summary: { type: String, required: true }
});

export default models.Hotel ||
  model<Hotel>('Hotel', HotelSchema, 'hotels_dev_1');
