# Discord Activity: Getting Started Guide

This template is used in the [Building An Activity](https://discord.com/developers/docs/activities/building-an-activity) tutorial in the Discord Developer Docs.

Read more about building Discord Activities with the Embedded App SDK at [https://discord.com/developers/docs/activities/overview](https://discord.com/developers/docs/activities/overview).

# Repository Setup

Pre-requisites
1. [Volta](https://volta.sh/)
1. [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) or [ngrok](https://ngrok.com/)

1. Go to client folder and run `yarn install`
1. Go to server folder and run `yarn install`

Running client side:
1. `cloudflared tunnel --url http://localhost:5173` or `ngrok https 5173`
1. `yarn dev`