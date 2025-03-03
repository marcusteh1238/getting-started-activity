// VoiceChannelUsers.tsx
import React, { useEffect, useState } from 'react';
import { DiscordSDK, EventPayloadData } from '@discord/embedded-app-sdk';
import './VoiceChannelUsers.css';

interface User {
  id: string;
  username: string;
  avatar: string;
  isSpeaking: boolean;
}

interface VoiceChannelUsersProps {
  discordSdk: DiscordSDK;
  auth: any;
}

function VoiceChannelUsers({ discordSdk, auth }: VoiceChannelUsersProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!auth || !discordSdk.channelId || !discordSdk.guildId) return;

    // Fetch users in the voice instance
    async function fetchVoiceChannelUsers() {
      try {
        // TODO: Fetch users from the voice channel
        setUsers([]);
      } catch (error) {
        console.error('Error fetching voice channel users:', error);
      }
    }

    fetchVoiceChannelUsers();
    // TODO: subscribe to voice channel events
  }, [discordSdk, auth]);

  return (
    <div className="voice-users-container">
      <h3>Users in Activity</h3>
      <div className="voice-users-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="voice-user">
              <div
                className={`avatar-container ${user.isSpeaking ? 'speaking' : ''}`}
              >
                <img
                  src={user.avatar}
                  alt={`${user.username}'s avatar`}
                  className="user-avatar"
                />
              </div>
              <span className="username">{user.username}</span>
            </div>
          ))
        ) : (
          <p>No users in this voice channel</p>
        )}
      </div>
    </div>
  );
}

export default VoiceChannelUsers;
