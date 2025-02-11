import path from 'path';
import process from 'process';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Destructure required formats from the 'format' module
const { combine, timestamp, label, printf /* prettyPrint */ } = format;

// Custom log message format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  return `${date.toDateString()} [${label}] ${level}: ${message}`;
});

// Create the main logger instance
const logger = createLogger({
  level: 'info', // Set the log level to 'info'
  format: combine(
    label({ label: 'WT' }), // Add a label 'WT' to the logs
    timestamp(), // Add a timestamp to the logs
    myFormat, // Apply the custom log message format
    // prettyPrint() // Enable pretty printing of log objects
  ),
  transports: [
    new transports.Console(), // Output logs to the console
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'success',
        'WT-%DATE%-success.log',
      ), // Set the log file path
      datePattern: 'YYYY-DD-MM-HH', // Use the specified date pattern for log rotation
      zippedArchive: true, // Enable log file archiving
      maxSize: '20m', // Set the maximum size for a log file
      maxFiles: '14d', // Set the maximum number of log files to retain
    }),
  ],
});

// Create the error logger instance
const errorLogger = createLogger({
  level: 'error', // Set the log level to 'error'
  format: combine(
    label({ label: 'WT' }), // Add a label 'WT' to the logs
    timestamp(), // Add a timestamp to the logs
    myFormat, // Apply the same format as the main logger
    // prettyPrint() // Enable pretty printing of log objects
  ),
  transports: [
    new transports.Console(), // Output logs to the console
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'error',
        'WT-%DATE%-error.log',
      ), // Set the log file path for error logs
      datePattern: 'YYYY-DD-MM-HH', // Use the specified date pattern for log rotation
      zippedArchive: true, // Enable log file archiving
      maxSize: '20m', // Set the maximum size for a log file
      maxFiles: '14d', // Set the maximum number of log files to retain
    }),
  ],
});

export { errorLogger, logger };
