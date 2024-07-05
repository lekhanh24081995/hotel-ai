import { model, Schema, models } from 'mongoose';

const AvailableTokensSchema = new Schema(
  {
    refresh_token: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

export default models.Available_Token ||
  model<IAvailableToken>('Available_Token', AvailableTokensSchema);
