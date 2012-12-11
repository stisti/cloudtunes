@echo off
setlocal

echo define({ api_key: "%1", api_key_secret: "%2" });> Dev.js

node server.js
