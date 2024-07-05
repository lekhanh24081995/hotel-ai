import { model, Schema, models } from 'mongoose';
import { Chat } from '../types/chat';

const ChatSchema = new Schema(
  {
    id: { type: String, required: true },
    messages: [
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
            type: String
          },
          props: {
            type: Map,
            of: Schema.Types.Mixed
          }
        }
      }
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: { type: String },
    path: { type: String, required: true },
    sharePath: { type: String }
  },
  { timestamps: true }
);

export default models.Chat || model<Chat>('Chat', ChatSchema);
