import React, { useEffect, useState } from 'react';
import {
  DiscordSDK,
  type CommandResponse,
  Responses,
  EventPayloadData,
} from '@discord/embedded-app-sdk';
import { type APIGuild } from 'discord-api-types/v10';
import rocketLogo from '/rocket.png';
import VoiceChannelUsers from './VoiceChannelUsers';
import LiveChat from './LiveChat';

type Auth = CommandResponse<'authenticate'>;
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

function App() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [channelName, setChannelName] = useState<string>('Unknown');
  const [guildIcon, setGuildIcon] = useState<string | null>(null);

  useEffect(() => {
    async function setupDiscordSdk() {
      await discordSdk.ready();
      console.log('Discord SDK is ready');

      // Authorize with Discord Client
      const { code } = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: 'code',
        state: '',
        prompt: 'none',
        scope: [
          'identify',
          'guilds',
          'applications.commands',
          'guilds.members.read',
          'rpc.voice.read',
        ],
      });

      // Retrieve an access_token
      const response = await fetch('/.proxy/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const { access_token } = await response.json();

      // Authenticate with Discord client
      const authResponse = await discordSdk.commands.authenticate({
        access_token,
      });

      if (authResponse == null) {
        throw new Error('Authenticate command failed');
      }

      setAuth(authResponse);
      fetchChannelName();
      fetchGuildAvatar(authResponse);

      discordSdk.subscribe(
        'SPEAKING_START',
        (event: EventPayloadData<'SPEAKING_START'>) => {
          console.log('Speaking start:', event);
        },
        {
          channel_id: discordSdk.channelId,
          lobby_id: discordSdk.instanceId,
        }
      );
      discordSdk.subscribe(
        'SPEAKING_STOP',
        (event: EventPayloadData<'SPEAKING_STOP'>) => {
          console.log('Speaking stop:', event);
        },
        {
          channel_id: discordSdk.channelId,
          lobby_id: discordSdk.instanceId,
        }
      );
    }

    setupDiscordSdk().catch(console.error);
  }, []);

  async function fetchChannelName() {
    if (discordSdk.channelId != null && discordSdk.guildId != null) {
      const channel = await discordSdk.commands.getChannel({
        channel_id: discordSdk.channelId,
      });
      if (channel.name != null) {
        setChannelName(channel.name);
      }
    }
  }

  async function fetchGuildAvatar(authData: Auth) {
    const guilds = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json() as Promise<APIGuild[]>);

    const currentGuild = guilds.find((g) => g.id === discordSdk.guildId);

    if (currentGuild?.icon) {
      setGuildIcon(
        `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`
      );
    }
  }

  return (
    <div>
      <img src={rocketLogo} className="logo" alt="Discord" />
      <h1>Hello, World!</h1>

      {channelName !== 'Unknown' && <p>Activity Channel: "{channelName}"</p>}

      {guildIcon && (
        <img
          src={guildIcon}
          width="128px"
          height="128px"
          style={{ borderRadius: '50%' }}
          alt="Guild Icon"
        />
      )}
      {auth && <VoiceChannelUsers discordSdk={discordSdk} auth={auth} />}
      {auth && <LiveChat discordSdk={discordSdk} auth={auth} />}
    </div>
  );
}

export default App;
