# Deployment Automation Setup

This guide explains how to set up the automated deployment to Vercel via GitHub Actions.

## Security Warning
**CRITICAL:** Never commit your Vercel Personal Access Token to the codebase. The token provided earlier has been used securely to link the project but should be revoked immediately from your Vercel dashboard.

## Setup Instructions

1. **Generate a New Vercel Token:**
   - Go to your Vercel account settings -> Tokens.
   - Generate a new token and copy it.

2. **Retrieve Project and Org IDs:**
   - Run `npx vercel link` locally or check the `.vercel/project.json` file generated in this repository to find your `projectId` and `orgId`.

3. **Configure GitHub Secrets:**
   - Go to your GitHub repository -> Settings -> Secrets and variables -> Actions.
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your newly generated token.
     - `VERCEL_ORG_ID`: Your Vercel Organization ID.
     - `VERCEL_PROJECT_ID`: Your Vercel Project ID.

4. **Deploy:**
   - Every time you push to the `main` branch, the `.github/workflows/deploy.yml` action will run, build the project securely, and deploy it to Vercel.

*Note: Since Vercel automatically deploys connected GitHub repositories, this GitHub Action is optional but gives you full CI/CD control.*
