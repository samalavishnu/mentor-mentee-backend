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
  allowedOrigins.includes(origin) ||
  /^https:\/\/mentor-mentee-frontend(?:-git-[a-z0-9-]+)?-018vishnuteja-7545s-projects\.vercel\.app$/.test(origin)
);

module.exports = { isAllowedOrigin };
