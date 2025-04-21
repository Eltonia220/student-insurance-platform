// services/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug', // You can change this to 'info' or 'error' based on your needs
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }) // Optional: Save logs to a file
  ],
});

export default logger;
