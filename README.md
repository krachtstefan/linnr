# Linnr

A game made by 🎨[Christian Wischnewski](https://wischnik.de/) and 👨‍💻[Stefan Kracht](https://stefankracht.de/)

## start local

For development on your local machine, copy the `.env.example` to `.env.local` and add your firebase credentials to it

## deployment

For deployment with [Now CLI](https://zeit.co/download), you need to add the environment variables with the [now secrets](https://zeit.co/docs/v2/build-step#adding-secrets) command.

`now secrets add <secret-name> <secret-value>`

Secrets are lowercased automatically. Check the `now.json` for all required variables.

# Versions

- 1.0 initial release

# Highscore-Versions

- 0.1 closed beta highscore list
- 1.0 highscore list of game version 1.0
