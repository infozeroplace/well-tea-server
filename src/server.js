import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';
// import { errorLogger, logger } from './shared/logger.js';

// Handling uncaught exceptions
/**
 The uncaughtException event in Node.js is emitted when an unhandled exception occurs in the application. It provides a way to catch and handle exceptions that would otherwise cause the Node.js process to terminate abruptly.
 Using this mechanism allows you to catch unhandled exceptions and perform necessary actions, such as logging the error, performing cleanup tasks, or gracefully shutting down the application before it crashes. It helps in preventing the process from hanging or becoming unresponsive due to an unhandled exception.
 */
process.on('uncaughtException', error => {
  // errorLogger.error(error);
  process.exit(1);
});

let server = Server;

const bootstrap = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.database_url);
    console.info('Database is connected successfully ✅✅✅✅✅');

    server = Server(app);

    server.listen(config.port, () => {
      console.info(`Application listening on port ${config.port} ⚡⚡⚡✨✨✨`);
    });
  } catch (error) {
    console.error('❌ Failed to connect database', error);
  }
};

process.on('unhandledRejection', error => {
  if (server) {
    // Close the server and log the error
    server.close(() => {
      // errorLogger.error(error);
      process.exit(1);
    });
  } else {
    // If server is not available, exit the process
    process.exit(1);
  }
});

bootstrap();

process.on('SIGTERM', () => {
  console.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
