function getAllowedOrigins() {
  const configured = [
    process.env.FRONTEND_URL,
    process.env.CORS_ALLOWED_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = [
    'https://mentor-mentee-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  return [...new Set([...configured, ...defaults])];
}

function createCorsOriginValidator() {
  const allowedOrigins = getAllowedOrigins();
  const vercelPreviewPattern =
    /^https:\/\/mentor-mentee-frontend(?:-git-[a-z0-9-]+)?-018vishnuteja-7545s-projects\.vercel\.app$/i;

  return function validateOrigin(origin, callback) {
    // Allow non-browser clients and same-origin server-to-server calls.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  };
}

module.exports = {
  getAllowedOrigins,
  createCorsOriginValidator,
};
