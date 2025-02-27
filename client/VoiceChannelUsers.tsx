// VoiceChannelUsers.tsx
import React, { useEffect, useState } from 'react';
import { DiscordSDK, EventPayloadData } from "@discord/embedded-app-sdk";
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
        // Get guild members
        const response = await discordSdk.commands.getInstanceConnectedParticipants();
        
        const members = await response.participants;
        
        // Map to user objects
        const usersData = members.map(member => ({
          id: member.id,
          username: member.nickname || member.username,
          avatar: member.avatar ? 
            `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.webp?size=64` : 
            `https://cdn.discordapp.com/embed/avatars/${parseInt(member.discriminator || '0') % 5}.png`,
          isSpeaking: false
        }));
        
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching voice channel users:", error);
      }
    }

    fetchVoiceChannelUsers();

    // Set up speaking event handlers
    discordSdk.subscribe('SPEAKING_START', 
      (event: EventPayloadData<"SPEAKING_START">) => {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === event.user_id ? 
              { ...user, isSpeaking: true } : 
              user
          )
        );
      }, {
        channel_id: discordSdk.channelId,
        lobby_id: discordSdk.instanceId,
      }
    );
    
    discordSdk.subscribe('SPEAKING_STOP', 
      (event: EventPayloadData<"SPEAKING_STOP">) => {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === event.user_id ? 
              { ...user, isSpeaking: false } : 
              user
          )
        );
      }, {
        channel_id: discordSdk.channelId,
        lobby_id: discordSdk.instanceId,
      }
    );
  }, [discordSdk, auth]);

  return (
    <div className="voice-users-container">
      <h3>Users in Activity</h3>
      <div className="voice-users-list">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="voice-user">
              <div className={`avatar-container ${user.isSpeaking ? 'speaking' : ''}`}>
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