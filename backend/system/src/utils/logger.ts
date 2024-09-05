import winston from 'winston';

const transports = [];

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: transports,
});

export default logger;
