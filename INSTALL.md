# Install Stillroom on Android

## First install

Stillroom must be hosted on an HTTPS website before Android can install it. Opening `index.html` directly from a phone's Downloads folder will show the app, but will not enable installation or offline app-shell caching.

1. Publish the files in this folder (`index.html`, `manifest.webmanifest`, `icon.svg`, and `sw.js`) to an HTTPS static host such as GitHub Pages, Cloudflare Pages, or Netlify.
2. Open the resulting HTTPS address in Chrome on your Android phone.
3. Open Chrome's menu and tap **Install app** or **Add to Home screen**. The wording varies by Chrome version.
4. Launch Stillroom from the new home-screen icon.

## Keep it current

When the app is updated, publish the new files to the same host. The service worker caches the app shell and refreshes same-site files when the app is opened online. If an update does not appear, fully close Stillroom and reopen it while connected to the internet. Bump the `CACHE` version in `sw.js` when changing cache behavior.

The current preview uses sample data and remotely hosted sample photos. Google account sign-in, real photo loading, copying between accounts, private storage, and backup are not connected yet. Do not upload private photos to this preview. Before using real accounts, add Google OAuth and an approved Photos integration, then configure HTTPS, consent, and secure token handling.
