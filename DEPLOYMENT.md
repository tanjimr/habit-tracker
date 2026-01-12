# Habit Tracker - Deployment Guide

## Free Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - RECOMMENDED

#### Step 1: Push to GitHub
1. Create a GitHub account at https://github.com
2. Create a new repository named "habit-tracker"
3. In your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy Backend to Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in:
   - Name: `habit-tracker-api`
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Region: Choose closest to you
6. Click "Create Web Service"
7. Wait for deployment to complete, copy the URL (e.g., `https://habit-tracker-api.onrender.com`)

#### Step 3: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. In Environment Variables, add:
   - Name: `VITE_API_URL`
   - Value: `https://habit-tracker-api.onrender.com/api`
6. Click "Deploy"
7. Your app will be live at the provided URL!

#### Step 4: Share with Friends
Send them the Vercel URL. They can start tracking habits immediately!

---

### Option 2: Fly.io (Both Frontend + Backend in one place)
1. Install Fly CLI
2. Create a `Dockerfile` in your project
3. Run `flyctl launch` and follow prompts
4. Friends access your app via the Fly domain

---

## Local Testing Before Deployment
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server
```

Visit `http://localhost:5173` and test all features before deploying.
