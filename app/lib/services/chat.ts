'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import User from '@/app/lib/models/User';
import { Chat } from '../types/chat';
import { mongooseConnect } from '../mongoose';
import ChatModel from '../models/Chat';
import { LIST_ROUTER } from '../constants/common';
import { auth } from '@/auth';

export async function getChats(userId: string) {
  await mongooseConnect();

  if (!userId) {
    return [];
  }
  try {
    const chats: Chat[] = await ChatModel.find({
      userId
    }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(chats)) as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId: string) {
  await mongooseConnect();
  const chat = await ChatModel.findOne({
    $and: [{ id }, { userId }]
  });

  if (!chat) {
    return null;
  }

  return JSON.parse(JSON.stringify(chat)) as Chat;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  await mongooseConnect();
  const session = await auth();

  if (!session?.user.id) {
    return {
      error: 'Unauthorized'
    };
  }

  const uid = String(await ChatModel.findOne({ id }).select('userId'));

  if (uid !== session?.user.id) {
    return {
      error: 'Unauthorized'
    };
  }

  await ChatModel.findByIdAndDelete(id);

  revalidatePath(LIST_ROUTER.CHATBOT);
  return revalidatePath(path);
}

export async function clearChats() {
  await mongooseConnect();
  const session = await auth();

  if (!session?.user.id) {
    return {
      error: 'Unauthorized'
    };
  }

  const chats = await ChatModel.find({ userId: session?.user.id });

  if (!chats.length) {
    return redirect(LIST_ROUTER.CHATBOT);
  }

  const chatIds = chats.map((chat) => chat.id);
  await ChatModel.deleteMany({ id: { $in: chatIds } });

  await User.updateOne(
    { _id: session?.user.id },
    { $pull: { chatIds: { $in: chatIds } } }
  ).exec();

  revalidatePath(LIST_ROUTER.CHATBOT);
  return redirect(LIST_ROUTER.CHATBOT);
}

export async function getSharedChat(id: string) {
  await mongooseConnect();
  const chat = await ChatModel.findOne({ id });

  if (!chat || !chat.sharePath) {
    return null;
  }

  return JSON.parse(JSON.stringify(chat)) as Chat;
}

export async function shareChat(id: string) {
  await mongooseConnect();
  const session = await auth();

  if (!session?.user.id) {
    return {
      error: 'Unauthorized'
    };
  }

  const chat = await ChatModel.findOne({ id, userId: session.user.id });

  if (!chat) {
    return {
      error: 'Something went wrong'
    };
  }

  chat.sharePath = `${LIST_ROUTER.SHARE}/${chat.id}`;

  await chat.save();

  return JSON.parse(JSON.stringify(chat));
}

export async function saveChat(chat: Chat) {
  await mongooseConnect();
  const session = await auth();

  if (session && session.user) {
    const isExist = await ChatModel.findOne({ id: chat.id });

    let updatedChat: Chat | null;

    if (isExist) {
      updatedChat = await ChatModel.findOneAndUpdate({ id: chat.id }, chat, {
        new: true
      });
    } else {
      updatedChat = await ChatModel.create(chat);
    }

    await User.findOneAndUpdate(
      { _id: session?.user.id },
      { $addToSet: { chatIds: updatedChat?.id } },
      {
        new: true
      }
    );

    return JSON.parse(JSON.stringify(chat));
  } else {
    return;
  }
}

export async function refreshHistory(path: string) {
  await mongooseConnect();
  redirect(path);
}

export async function getMissingKeys() {
  await mongooseConnect();
  const keysRequired = ['GOOGLE_GENERATIVE_AI_API_KEY'];
  return keysRequired
    .map((key) => (process.env[key] ? '' : key))
    .filter((key) => key !== '');
}
