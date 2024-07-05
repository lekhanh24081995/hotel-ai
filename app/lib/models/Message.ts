import { model, Schema, models } from 'mongoose';
import { Message } from '../types/chat';

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system', 'function', 'data', 'tool'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: String,
    display: {
      name: {
        type: String,
        required: true
      },
      props: {
        type: Map,
        of: Schema.Types.Mixed
      }
    }
  },
  { timestamps: true }
);

export default models.Message || model<Message>('Message', MessageSchema);
