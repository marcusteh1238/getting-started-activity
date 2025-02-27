import { Client, GatewayIntentBits } from "discord.js";
import { addMessagesToChannel } from "./discordMessageStorage";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async message => {
  if (!message.author.bot) {
    console.log(`[${message.channel}] ${message.author.username}: ${message.content}`);
  }
  await addMessagesToChannel(message.channelId, message);
});

client.on('messageCreate', async message => {
  if (message.content === ('peepee')) {
    message.channel.send('poopoo');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

export default client;