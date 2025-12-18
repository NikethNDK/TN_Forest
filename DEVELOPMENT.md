# Development Guide

Quick reference for local development with Cloudinary and Firebase Functions.

> **📖 For complete setup instructions, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)**

## Quick Start

### 1. Setup Environment Variables

Create `.env` file in project root:
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_USE_FIREBASE_EMULATOR=true
# ... other Firebase variables
```

### 2. Setup Functions Config

Create `functions/.runtimeconfig.json`:
```json
{
  "cloudinary": {
    "cloud_name": "your-cloud-name",
    "api_key": "your-api-key",
    "api_secret": "your-api-secret"
  }
}
```

**Copy from example:**
```bash
cp functions/.runtimeconfig.json.example functions/.runtimeconfig.json
# Then edit with your actual credentials
```

### 3. Start Development

**Terminal 1 - Emulators:**
```bash
cd functions
npm install  # First time only
npm run serve:all
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Access Points

- **Frontend**: http://localhost:5173
- **Emulator UI**: http://localhost:4000
- **Functions**: http://localhost:5001

## Development Workflow

### Testing File Uploads

1. Start emulators (Terminal 1)
2. Start frontend (Terminal 2)
3. Log in to admin panel
4. Navigate to any page with file upload
5. Upload a file - it will:
   - ✅ Call local Functions emulator for signature
   - ✅ Upload to real Cloudinary
   - ✅ Save URL to Firestore emulator

### Viewing Emulator Data

Open http://localhost:4000 to:
- See function logs
- View Firestore data
- Manage Auth users
- Test functions

### Making Changes

**Functions Code:**
1. Edit `functions/src/index.ts`
2. Emulator auto-reloads (or restart: `npm run serve:all`)

**Frontend Code:**
1. Edit files in `src/`
2. Vite auto-reloads

## Common Issues

### "Cloudinary configuration not found"
- Check `functions/.runtimeconfig.json` exists
- Verify credentials are correct
- Restart emulators

### "Cannot connect to emulator"
- Verify `VITE_USE_FIREBASE_EMULATOR=true` in `.env`
- Check emulators are running on correct ports
- Restart frontend dev server

### "Function not found"
- Build functions: `cd functions && npm run build`
- Restart emulators

## Switching to Production

1. Set `VITE_USE_FIREBASE_EMULATOR=false` (or remove from `.env`)
2. Deploy functions: `firebase deploy --only functions`
3. Frontend will automatically use deployed functions

## Notes

- **Cloudinary**: Always uses real API (even in development)
- **Auth/Firestore**: Uses emulators in dev, real services in production
- **Functions**: Uses emulator in dev, deployed in production

