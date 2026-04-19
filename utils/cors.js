const envAllowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([
  'https://mentor-mentee-frontend.vercel.app',
  ...envAllowedOrigins,
]));

const isAllowedOrigin = (origin) => (
  !origin ||
  allowedOrigins.includes(origin) ||
  /^https:\/\/mentor-mentee-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin)
);

module.exports = { isAllowedOrigin };
