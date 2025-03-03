import { useState } from 'react';
import { DiscordSDK, type CommandResponse } from '@discord/embedded-app-sdk';
import rocketLogo from '/rocket.png';
import VoiceChannelUsers from './VoiceChannelUsers';
import LiveChat from './LiveChat';

type Auth = CommandResponse<'authenticate'>;
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

function App() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [channelName, setChannelName] = useState<string>('Unknown');
  const [guildIcon, setGuildIcon] = useState<string | null>(null);

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
