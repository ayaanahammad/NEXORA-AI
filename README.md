# NEXORA AI Version 1.0

Developer: Dudekula Ayaan ahammad

Responsive AI chat website and Android installable PWA. Includes coding help, multilingual chat, locally stored conversation history and TXT export.

## Deploy with GitHub and Railway / Render
1. Add the contents of this project folder to the root of your GitHub repository (not inside an extra `nexora-ai` directory).
2. Create a Node.js web service connected to the repository.
3. Build command: `npm install`. Start command: `npm start`. Root directory: blank.
4. Add `OPENAI_API_KEY`, `OPENAI_MODEL` (optional), and `NEXORA_ACCESS_PASSWORD` as **private host environment variables**. Never commit secrets.
5. Deploy. Open the HTTPS URL in Android Chrome, then choose **Install app** or **Add to Home screen**.
6. To use `NEXORA.com`, you must first own the domain and configure the hosting provider's custom domain and DNS records. The domain is not registered or connected by this project.

## Local development
Node.js 20+: `npm start` then open `http://localhost:3000`.

## Security / limitations
This is a **private prototype**, not a hardened multi-user SaaS product. Password is shared and held in browser memory for the current page session; IP rate limits are in-memory and may reset across deployments or instances. Add proper account authentication, persistent distributed rate limits, CSRF/origin protections where applicable, monitoring, spending caps, and privacy policies before public access. Chat history is saved in localStorage on the current device and can be lost if browser data is cleared. Export is TXT only. The PWA interface can work offline after caching, but AI chat requires internet and a funded API account. The app does not include a domain registration, live deployment, or APK.
