This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

- `NEXT_PUBLIC_APP_BASE_URL`: Required for image optimization and proper routing in ephemeral environments
- `DD_API_KEY`: DataDog API key for monitoring (optional)
- `POST_WORKER_API_KEY`: Required for authenticating the post worker service
- `NEXTAUTH_URL`: Base URL of your application, used by the post worker

## Social Media Post Worker

The application includes a worker service that executes scheduled social media posts. The worker checks for due posts and publishes them to the appropriate social media platforms (Twitter/X and LinkedIn).

### Testing and Development

#### List Scheduled Posts

View all posts that are scheduled and due for posting:

```bash
pnpm post-worker:list
```

#### Dry Run Mode

Test the worker without actually posting to social media:

```bash
pnpm post-worker:dry-run
```

This will:

- Find all posts that would be published
- Simulate the posting process
- Show what would happen without making actual API calls
- Not modify any post statuses in the database

#### Test Posts

You can test posting to social media platforms directly:

```bash
# Test posting to Twitter
pnpm test-post -p twitter -c "This is a test tweet"

# Test posting to LinkedIn
pnpm test-post -p linkedin -c "This is a test LinkedIn post"
```

Note: Both Twitter and LinkedIn do not provide sandbox environments for testing. However:

- Twitter offers a [Developer Environment](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api) that can be used for testing
- LinkedIn provides a [Development Mode](https://www.linkedin.com/developers/apps) for applications

For development, we recommend:

1. Creating development applications in both platforms
2. Using separate development credentials
3. Using the dry-run mode for initial testing
4. Testing with real posts only when ready

### Setup

1. Set the required environment variables:

   ```bash
   POST_WORKER_API_KEY=your-secure-api-key
   NEXTAUTH_URL=http://your-app-url
   ```

2. Run the worker manually:

   ```bash
   pnpm post-worker
   ```

3. Set up a cron job to run the worker periodically:
   ```bash
   # Example cron job to run every 5 minutes
   */5 * * * * cd /path/to/app && pnpm post-worker
   ```

### Worker Behavior

- The worker looks for posts with status 'scheduled' that are due for publication
- For each post:
  - Attempts to publish to the appropriate social media platform
  - Updates the post status to 'posted' on success
  - Updates the post status to 'failed' and records the error message on failure
- Logs results to stdout/stderr for monitoring

### Error Handling

- Failed posts will be marked with status 'failed' and include an error message
- The worker will exit with code 1 if there's an error in the worker itself
- Individual post failures won't cause the worker to exit with an error
- Posts that fail can be retried by updating their status back to 'scheduled'
