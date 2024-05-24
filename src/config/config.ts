export default () => ({
  port: parseInt(process.env.APP_PORT) || 3000,
  auth: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    issuerURL: process.env.AUTH0_ISSUER_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    connections: process.env.AUTH0_CONNECTIONS,
  },
  awsS3: {
    region: process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  localStack: {
    endpoint: process.env.LOCALSTACK_HOST,
  },
});
