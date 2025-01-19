#!/usr/bin/env bash
# Start the frontend in preview mode and dali-server
alias python=python3

# Start the frontend:preview in the background
npx nx run frontend:preview &

# Start the dali-server
node dist/apps/dali-server/main.js
