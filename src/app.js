import compression from 'compression';
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
  compression({
    threshold: 0, // Compress all responses regardless of size
    filter: (req, res) => {
      // console.log(`Compressing: ${req.url} - ${res.getHeader('Content-Type')}`);
      return true;
    },
  }),
);

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

app.get('/', async (req, res) => {
  if (req.accepts('html')) {
    // Render view for browser requests
    return res.render('welcome', {
      title: 'WELL TEA',
      currentYear: new Date().getFullYear(),
    });
  } else {
    // Return JSON for API requests
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WELCOME TO WELL TEA PRODUCTION!!',
      meta: null,
      data: null,
    });
  }
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
