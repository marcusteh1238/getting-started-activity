import { DiscordSDK, type CommandResponse } from '@discord/embedded-app-sdk';
import { type APIGuild } from 'discord-api-types/v10';
import rocketLogo from '/rocket.png';
import './style.css';

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

type Auth = CommandResponse<'authenticate'>;

// Will eventually store the authenticated user's access_token
let auth: Auth;

setupDiscordSdk().then(() => {
  console.log('Discord SDK is authenticated');
  // We can now make API calls within the scopes we requested in setupDiscordSDK()
  // Note: the access_token returned is a sensitive secret and should be treated as such
  appendVoiceChannelName();
});

async function setupDiscordSdk() {}

async function appendVoiceChannelName() {
  const app = document.querySelector('#app') as Element;

  let activityChannelName = 'Unknown';

  // Update the UI with the name of the current voice channel
  const textTagString = `Activity Channel: "${activityChannelName}"`;
  const textTag = document.createElement('p');
  textTag.textContent = textTagString;
  app.appendChild(textTag);
}

if (document.querySelector('#app') !== null) {
  document.querySelector('#app')!.innerHTML = `
      <div>
      <img src="${rocketLogo}" class="logo" alt="Discord" />
      <h1>Hello, World!</h1>
    </div>
  `;
}
