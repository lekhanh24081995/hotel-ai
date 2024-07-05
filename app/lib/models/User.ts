import { model, Schema, models } from 'mongoose';

const providerSchema = new Schema(
  {
    provider: {
      type: String,
      required: true
    },
    providerAccountId: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    full_name: { type: String },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required']
    },
    image: { type: String, default: '' },
    password: { type: String, default: '' },
    role: { type: String, default: 'user' },
    is_verified: { type: Boolean, default: false },
    chatIds: [
      {
        type: String
      }
    ],
    providers: [providerSchema]
  },
  {
    timestamps: true
  }
);

UserSchema.index({ email: 1 });

export default models.User || model<IUser>('User', UserSchema);
