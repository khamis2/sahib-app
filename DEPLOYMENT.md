# Deployment Guide for Sahib Services

To use the app on your iPhone, we need to deploy it to the internet. Since this is a full-stack app (Frontend + Backend), we will host them separately:

1.  **Backend** (Logic & Data) -> **Render** (Free & easy for Node.js)
2.  **Frontend** (UI) -> **Vercel** (Best for Next.js)

> [!WARNING]
> **Data Reset Warning**: The current backend uses a local file system ("SimpleJsonDb") to store data. On hosting services like Render (Free Tier) or Vercel, the file system is ephemeral. **Code updates or server restarts will likely wipe your data (users, requests).** For a real production app, we should switch to a database like Supabase later.

## Step 1: Push Code to GitHub
Run the deployment script to push your latest code to GitHub.
1.  Double-click `deployment_script.bat` in your project folder.
2.  Wait for it to finish and say "Deployment Script Finished!".

## Step 2: Deploy Backend to Render
1.  Go to [dashboard.render.com/new/web-service](https://dashboard.render.com/new/web-service).
2.  Connect your GitHub repository (`khamis2/sahib-app`).
3.  **Root Directory**: `backend` (Important!)
4.  **Name**: `sahib-backend`
5.  **Build Command**: `npm install && npm run build`
6.  **Start Command**: `npm run start:prod`
7.  Click **Create Web Service**.
8.  Wait for it to deploy. Copy the **Service URL** (e.g., `https://sahib-backend.onrender.com`). You will need this for the frontend.

## Step 3: Deploy Frontend to Vercel
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Import your GitHub repository (`sahib-app`).
3.  **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: Paste your **Render Backend URL** (e.g., `https://sahib-backend.onrender.com`). **Remove any trailing slash (`/`)**.
5.  Click **Deploy**.

## Step 4: Add to iPhone
1.  Once Vercel finishes, open the **Domain** (e.g., `https://sahib-app.vercel.app`) on your iPhone Safari.
2.  Tap the **Share** button (box with arrow up).
3.  Scroll down and tap **Add to Home Screen**.
4.  Launch the app from your home screen!

## Troubleshooting
-   **404: NOT_FOUND (Automatic Fix)**:
    1.  I have created a special `vercel.json` at the root of your project to fix this automatically.
    2.  Double-click `deployment_script.bat` to push this new file to GitHub.
    3.  Go to Vercel -> **Deployments** tab -> click `...` -> **Redeploy**.
    4.  Vercel will now automatically find the `frontend` folder using the new settings.
-   **"Network Error"**: Make sure your `NEXT_PUBLIC_API_URL` in Vercel is correct and starts with `https://`.
-   **Data Disappeared**: As mentioned, the free hosting resets the "file-based database". This is expected for now.
