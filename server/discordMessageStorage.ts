import { Message } from 'discord.js';
import { DiscordMsgStorage } from './types';

export const channelsAndMessages: DiscordMsgStorage = {};

export async function addMessagesToChannel(
  channelId: string,
  messages: Message | Message[]
) {
  // if the channel does not exist in db, create it
  if (!channelsAndMessages[channelId]) {
    channelsAndMessages[channelId] = [];
  }
  const messagesArray = Array.isArray(messages) ? messages : [messages];
  // convert messages to storage format
  const msgsToStore = messagesArray.map((msg) => ({
    id: msg.id,
    username: msg.author.username,
    content: msg.content,
    timestamp: msg.createdAt.toISOString(),
  }));
  channelsAndMessages[channelId].push(...msgsToStore);
}

export async function getMessagesFromChannel(channelId: string) {
  return channelsAndMessages[channelId] || [];
}
