# Set up Stillroom with your Google Drive accounts

Stillroom is a browser app that reads photo and video files directly from Google Drive. It does not import or keep a second copy of your files. Google Drive and Google Photos are different services: this app shows files stored in Drive.

## 1. Publish the app

The app must be hosted at an HTTPS address. You can use GitHub Pages:

1. Make a GitHub repository named `stillroom`.
2. Upload the files from this folder to the top level of the repository: `index.html`, `app.js`, `manifest.webmanifest`, `icon.svg`, and `sw.js`. Keep `thumbnail-worker.js` and this guide somewhere safe for the next section; they do not need to be in the GitHub repository.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
5. Wait for GitHub to show your website address. It will look like `https://YOUR-GITHUB-NAME.github.io/stillroom/`.

## 2. Create Google sign-in for your own accounts

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project named `Stillroom`.
2. In **APIs & Services → Library**, find and enable **Google Drive API**.
3. Open **Google Auth Platform** and set up the app. Choose **External** if asked who can use it, then keep its publishing status in **Testing** for personal use.
4. In **Audience**, add each of your Google account email addresses as a test user.
5. In **Clients**, create an OAuth client with application type **Web application**.
6. Add your website origin under **Authorized JavaScript origins**. Enter only the origin, for example `https://YOUR-GITHUB-NAME.github.io` (do not add `/stillroom/`).
7. Save and copy the **Client ID**. The app does not need a client secret.

Google may show an unverified-app warning during personal testing. Only continue if the screen names your own Stillroom project and you are signing in to your own app. OAuth testing mode is intended for the test users you added; Google may require verification before broader use.

## 3. Connect the app

1. Open your Stillroom website.
2. Tap **Settings**, paste the OAuth **Client ID**, then tap **Save**.
3. Tap **Connect Google Drive** and choose one of your test accounts. Repeat for each account you want to use.
4. Allow the requested Drive access. The app needs read access to list and preview photos and videos across Drive, and file creation access so you can copy selected files to another account.

The account list and OAuth Client ID are saved in this browser. Access tokens are held only in memory and are discarded when you close the app. After reopening Stillroom, tap an account to sign in again and load its files.

## 4. Enable private thumbnails (recommended)

Google Drive's private thumbnail URLs are blocked from direct use by browsers. Stillroom includes a small Cloudflare Worker that relays thumbnails without saving them. It receives the current short-lived Google access token and photo thumbnail request, fetches the thumbnail, then immediately returns it. Cloudflare processes these requests in transit.

1. Create a free account at [Cloudflare](https://dash.cloudflare.com/).
2. Open **Workers & Pages → Create application → Create Worker**.
3. Give it a name such as `stillroom-thumbnails`, then choose **Deploy**.
4. Click **Edit code**. Replace the sample code with the contents of `thumbnail-worker.js`, then click **Deploy**.
5. Open the Worker **Settings → Variables and Secrets**. Add a text variable named `APP_ORIGIN` and set it to your site origin, such as `https://YOUR-GITHUB-NAME.github.io` (no path or trailing slash). Save and deploy the change.
6. Copy the Worker address, such as `https://stillroom-thumbnails.YOUR-SUBDOMAIN.workers.dev`.
7. In Stillroom, open **Settings** and paste this address into **Private thumbnail proxy URL**. Save.

The Worker code does not log or save tokens, file names, or image bytes, and sets thumbnails to `no-store`. The token is still transmitted to Cloudflare as part of the request, so use a Worker in your own Cloudflare account. Without this Worker, Google Drive thumbnails may not load in the browser, although the app can still list files and open their Drive page.

## Copying between accounts

Select files in the library and tap **Copy to account**. Stillroom downloads the selected file into temporary browser memory and uploads it to the destination account's My Drive. It does not keep the file after that operation. The original remains in the source account. Large videos can take time and use mobile data; use Wi-Fi for large transfers.

## Privacy and limits

- Stillroom has no app server or photo database. It requests file listings and full-size content directly from Google Drive in your browser. The optional Worker only relays thumbnail requests.
- Do not enter a Google password into Stillroom. Sign in only on Google's own sign-in screen.
- Do not share your OAuth client setup or grant access to accounts you don't intend to connect.
- Google Drive files are not the same as Google Photos library items. Photos that exist only in Google Photos will not appear here.
- If your accounts contain many files, Stillroom loads the library in pages. Search applies to items loaded so far.
- This personal version has not been through Google's OAuth verification for general public use.

## Update Stillroom

Upload revised app files to the same GitHub repository and commit the changes. GitHub Pages publishes them automatically. If your phone still shows an older version, close the app fully and reopen it while online.
