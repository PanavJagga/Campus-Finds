# Firebase Studio - CampusFinds

This is a NextJS starter for the CampusFinds application, created in Firebase Studio.

To get started, ensure you have Node.js and npm (or yarn) installed.

## Project Structure

- `src/app`: Contains the main application pages and layouts using Next.js App Router.
- `src/components`: Shared UI components, including ShadCN UI elements.
- `src/lib`: Utility functions, Firebase configuration, type definitions, and server actions.
- `src/config`: Site configuration like navigation items.
- `src/hooks`: Custom React hooks.
- `public`: Static assets.

## Environment Variables

For Firebase connectivity, ensure you have a `.env.local` file in the root with your Firebase project configuration (or set these in your deployment environment):

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:9002](http://localhost:9002) (or your configured port) in your browser.

## Building for Production

   ```bash
   npm run build
   ```

## Deployment

This app is configured for easy deployment to platforms like Vercel or Firebase Hosting.
