const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "CLIENT_ORIGIN"];

const getClientOrigin = () => process.env.CLIENT_ORIGIN?.trim();

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

const getCorsOrigin = (origin, callback) => {
  const clientOrigin = getClientOrigin();

  if (!clientOrigin) {
    callback(new Error("CLIENT_ORIGIN is not set"));
    return;
  }

  if (!origin || origin === clientOrigin) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} is not allowed by CORS`));
};

module.exports = {
  getClientOrigin,
  getCorsOrigin,
  validateEnv,
};
