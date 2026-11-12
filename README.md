# NEXORA AI — Android PWA + website
Developer: Dudekula Ayaan ahammad

## Publish from Android
1. Extract this ZIP using Files on Android.
2. On github.com create a private repository named nexora-ai and upload the CONTENTS of the nexora-ai folder (not the folder itself).
3. On dashboard.render.com create a Web Service from that GitHub repository. Runtime Node, build command `npm install`, start command `npm start`.
4. Add environment variable `OPENAI_API_KEY` with your key in Render's Environment settings. Never commit it to GitHub or paste it into chat.
5. Deploy and open the HTTPS onrender.com URL.
6. In Android Chrome, menu > Install app / Add to Home screen.

AI calls require a paid or otherwise funded API account. Public deployment should add authentication, rate limits, usage quotas and abuse protection before sharing widely. Chat history is browser-local; the PWA caches only the interface and requires internet for AI responses.
