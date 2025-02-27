import express from "express";
import fetch from "node-fetch";
import { ChannelType } from "discord.js";
import { addMessagesToChannel, getMessagesFromChannel } from "./discordMessageStorage";
import client from "./bot";

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

app.post("/api/token", async (req, res) => {
  
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json() as { access_token: string };
  
  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.get("/api/messages", async (req, res) => {
  const channelId = req.query.channelId as string;
  if (!channelId) {
    res.status(400).send({ error: "Channel ID is required" });
    return;
  }
  let messages = await getMessagesFromChannel(channelId);
  if (messages.length === 0) {
    // fetch existing messages from discord if they do not exist in our storage
    const channel = await client.channels.fetch(channelId, {
      force: true,
      cache: true,
    });
    if (!channel) {
      res.status(404).send({ error: "Channel not found" });
      return;
    }
    if (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildText) {
      res.status(400).send({ error: "Channel is not a voice channel or text channel" });
      return;
    }
    const messages = await channel.messages.fetch({
      limit: 100,
    });
    const msgArr = Array.from(messages.values());
    await addMessagesToChannel(channelId, msgArr.reverse());
  }
  res.status(200).send(messages);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
