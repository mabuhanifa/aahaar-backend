export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    uri: process.env.MONGO_URI as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || '60s', // Add JWT expiry
  },
  frontendUrl: process.env.FRONTEND_URL as string,
  stripe: {
    // Add Stripe config
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  },
  // Add other configuration variables here
});
