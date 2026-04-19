const envAllowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([
  'https://mentor-mentee-frontend.vercel.app',
  ...envAllowedOrigins,
]));

const previewHostSuffix = process.env.VERCEL_PREVIEW_HOST_SUFFIX || '-018vishnuteja-7545s-projects.vercel.app';

const isAllowedVercelPreviewOrigin = (origin) => {
  if (!origin) return false;
  try {
    const { protocol, hostname } = new URL(origin);
    return (
      protocol === 'https:' &&
      hostname.startsWith('mentor-mentee-frontend-') &&
      hostname.endsWith(previewHostSuffix)
    );
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin) => (
  Boolean(origin) &&
  (allowedOrigins.includes(origin) || isAllowedVercelPreviewOrigin(origin))
);

module.exports = { isAllowedOrigin };
