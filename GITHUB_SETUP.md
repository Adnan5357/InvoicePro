# GitHub Setup Guide

Follow these steps to upload your Invoice Pro project to GitHub.

## Step 1: Initialize Git Repository

```bash
cd "c:\Personal Projects\invoice-pro"
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Invoice Pro landing page with MERN stack setup"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Repository name: `invoice-pro` (or your preferred name)
5. Description: "Professional invoice management SaaS application built with MERN stack"
6. Set to **Public**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **Create repository**

## Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/invoice-pro.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 6: Add Screenshots

1. Take screenshots of your landing page:
   - Open http://localhost:5173 in your browser
   - Take screenshots of each section
   - Save them in the `screenshots/` folder with these names:
     - `hero-section.png`
     - `features-section.png`
     - `how-it-works.png`
     - `why-choose.png`
     - `cta-section.png`
     - `full-landing-page.png`

2. After adding screenshots:
   ```bash
   git add screenshots/
   git commit -m "Add landing page screenshots"
   git push
   ```

## Troubleshooting

### If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### If you need to update the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/invoice-pro.git
```

### To check your remote:
```bash
git remote -v
```

## Next Steps After Upload

1. Add a description and topics to your GitHub repository
2. Consider adding:
   - Issues template
   - Pull request template
   - GitHub Actions for CI/CD
   - Deploy to Vercel/Netlify for live demo
