# Environment Setup for ZIMUSHA

This document explains how to set up environment variables for the ZIMUSHA application.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### API Configuration
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://185.209.228.74:8080/api
NEXT_PUBLIC_BACKEND_URL=http://185.209.228.74:8080
```

### Google OAuth Configuration
```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1039025234941-7aqg74osqoc2nigbjrmqg127ktlc9s3o.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://185.209.228.74:8080/api/oauth/redirect/google
```

### App Configuration
```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=ZIMUSHA
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Development Configuration
```bash
# Development Configuration
NODE_ENV=development
```

## Complete .env.local Example

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://185.209.228.74:8080/api
NEXT_PUBLIC_BACKEND_URL=http://185.209.228.74:8080

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1039025234941-7aqg74osqoc2nigbjrmqg127ktlc9s3o.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://185.209.228.74:8080/api/oauth/redirect/google

# App Configuration
NEXT_PUBLIC_APP_NAME=ZIMUSHA
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
```

## Important Notes

1. **NEXT_PUBLIC_ prefix**: Variables with this prefix are exposed to the browser and can be used in client-side code.

2. **Server-side only**: Variables without `NEXT_PUBLIC_` are only available on the server side.

3. **Google OAuth**: The `GOOGLE_CLIENT_SECRET` should never be exposed to the client side.

4. **API URLs**: Make sure these match your backend server configuration.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set the authorized redirect URIs to: `http://185.209.228.74:8080/api/oauth/redirect/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

## Restart Required

After creating or modifying the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Troubleshooting

- If environment variables are not loading, make sure the file is named exactly `.env.local`
- Check that there are no spaces around the `=` sign
- Ensure the file is in the root directory of your project
- Restart the development server after making changes
