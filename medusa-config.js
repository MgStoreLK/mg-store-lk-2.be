const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  // {
  //   resolve: `medusa-file-s3`,
  //   options: {
  //       s3_url: process.env.S3_URL,
  //       bucket: process.env.S3_BUCKET,
  //       region: process.env.S3_REGION,
  //       access_key_id: process.env.S3_ACCESS_KEY_ID,
  //       secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
  //       cache_control: process.env.S3_CACHE_CONTROL,
  //       // optional
  //       download_file_duration:
  //         process.env.S3_DOWNLOAD_FILE_DURATION,
  //       prefix: process.env.S3_PREFIX,
  //   },
  // },
  {
    resolve: `medusa-plugin-wishlist`,
  },
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      applicationId: process.env.ALGOLIA_APP_ID,
      adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
      // other options...
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: ["title", "description"],
            attributesToRetrieve: [
              "id",
              "title",
              "description",
              "handle",
              "thumbnail",
              "variants",
              "variant_sku",
              "options",
              "collection_title",
              "collection_handle",
              "images",
            ],
          },
          transformer: (product) => ({
            objectID: product.id,
            ...product
          }),
        },
      },
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: 
        process.env.SENDGRID_ORDER_PLACED_ID,
      order_canceled_template: 
        process.env.SENDGRID_ORDER_CANCELED_ID,
      order_return_requested_template: 
        process.env.SENDGRID_ORDER_RETURN_REQUESTED_ID,
      order_items_returned_template: 
        process.env.SENDGRID_ORDER_ITEMS_RETURNED_ID,
      customer_password_reset_template: 
        process.env.SENDGRID_CUSTOMER_PASSWORD_RESET_ID,
      user_password_reset_template: 
        process.env.SENDGRID_USER_PASSWORD_RESET_ID
    },
  },
  {
    resolve: `medusa-plugin-contentful`,
    options: {
      space_id: process.env.CONTENTFUL_SPACE_ID,
      access_token: process.env.CONTENTFUL_ACCESS_TOKEN,
      environment: process.env.CONTENTFUL_ENV,
    },
  },
  {
    resolve: `medusa-file-cloudinary`,
    options: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    },
},
];

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  database_extra: 
      process.env.NODE_ENV !== "development"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};

// commented original package json script
// "scripts": {
  //   "clean": "cross-env ./node_modules/.bin/rimraf dist",
  //   "build": "cross-env npm run clean && npm run build:server && npm run build:admin",
  //   "build:server": "cross-env npm run clean && tsc -p tsconfig.server.json",
  //   "build:admin": "cross-env medusa-admin build",
  //   "watch": "cross-env tsc --watch",
  //   "test": "cross-env jest",
  //   "seed": "cross-env medusa seed -f ./data/seed.json",
  //   "start": "cross-env npm run build && medusa start",
  //   "start:custom": "cross-env npm run build && node --preserve-symlinks --trace-warnings index.js",
  //   "dev": "cross-env npm run build:server && medusa develop"
  // },
