export type DiscordMsgDetails = {
  id: string;
  username: string;
  content: string;
  timestamp: string;
};

export type DiscordMsgStorage = Record<string, DiscordMsgDetails[]>;
