try {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  if (!baseUrl) {
    process.exit(0);
  }
  const url = new URL(baseUrl);
  process.env.NEXT_PUBLIC_APP_HOSTNAME = url.hostname;
} catch (error) {
  console.error('Error extracting hostname:', error);
  process.exit(1);
} 