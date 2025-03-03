import React, { useEffect, useState } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';

interface LiveChatProps {
  discordSdk: DiscordSDK;
  auth: any;
}

type DiscordMsgDetails = {
  id: string;
  username: string;
  content: string;
  timestamp: string;
};

function LiveChat({ discordSdk, auth }: LiveChatProps) {
  const [messages, setMessages] = useState<DiscordMsgDetails[]>([]);

  useEffect(() => {
    if (!auth || !discordSdk.channelId) return;

    const fetchMessages = async () => {
      try {
        // TODO: Fetch messages from the channel
        setMessages([]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Fetch messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);

    // Initial fetch
    fetchMessages();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [discordSdk, auth]);

  return (
    <div className="live-chat-container">
      <h3>Live Chat</h3>
      <div className="live-chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="live-chat-message">
            <strong>{message.username}:</strong> {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveChat;
