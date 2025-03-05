import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import httpStatus from 'http-status';
import path from 'path';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import config from './config/index.js';
import { corsOptions } from './constant/common.constant.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import routes from './routes/index.js';
import sendResponse from './shared/sendResponse.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const stripe = new Stripe(config.stripe_secret_key);

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(
  express.json({
    limit: '100mb',
    verify: (req, res, buf) => {
      const url = req.originalUrl;
      if (url.includes('/payment/webhook')) {
        // Preserve the raw body for Stripe verification
        req.rawBody = buf;
      }
    },
  }),
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/v1', routes);

// TESTING...............................................
// Webhook verification (GET request)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'welltea'; // Set this manually

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook Verified!');
    return res.status(200).send(challenge); // Send back the challenge to verify
  } else {
    return res.sendStatus(403); // Forbidden
  }
});

// Webhook event handler (POST request)
app.post('/webhook', (req, res) => {
  console.log('Webhook Event Received:', JSON.stringify(req.body, null, 2));
  return res.sendStatus(200); // Always respond with 200 to acknowledge
});

// TESTING...............................................

app.get('/', async (req, res) => {
  // res.send("WELCOME TO WELL TEA PRODUCTION!!");
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'WELCOME TO WELL TEA PRODUCTION!!',
    meta: null,
    data: null,
  });
});

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', config.frontend_base_url);
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use((req, res) => {
  return res.status(400).json({
    success: false,
    message: 'API not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });
});

app.use(globalErrorHandler);

export default app;
