# Deploying to Vercel

## 1. Prerequisites
- Create a Vercel account.
- Install Vercel CLI: `npm i -g vercel`
- Login: `vercel login`

## 2. Environment Variables
In your Vercel Project Settings > Environment Variables, add the following based on your Supabase project:

**Frontend (Client-side):**
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

**Backend (Serverless Functions - Optional):**
- `SUPABASE_URL`: Same as above
- `SUPABASE_KEY`: Same as above (or Service Role Key if needing higher privileges)

## 3. Deployment Methods

### Option A: Automatic Git Deployment (CI/CD) - Recommended
This method automatically deploys your site whenever you push changes to your Git repository.

1.  Push your code to a Git provider (GitHub, GitLab, or Bitbucket).
2.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
3.  Select your Git provider and import the `mental-math` repository.
4.  Vercel will detect correct settings automatically. Just add your Environment Variables (Step 2) during the import process.
5.  Click **Deploy**.

Now, every time you run `git push`, Vercel will automatically obtain the changes and deploy them!
- Pushes to `main` branch = **Production Deployment**
- Pushes to other branches = **Preview Deployment**

### Option B: Manual CLI Deployment
Use this if you don't want to connect a Git repository or need to deploy a specific local version manually.

```bash
# For Preview Deployment (test changes)
npx vercel

# For Production Deployment (live site)
npx vercel --prod
```

v2. Follow the prompts. Vercel will auto-detect the Vite project and build settings. Use the default settings (Output Directory: `dist`).

## 4. Verification
Once deployed, verify that the application loads and fetches data correctly. The `/api` rewrites are configured in `vercel.json` to handle any backend requests if needed.
