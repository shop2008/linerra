import serverless from "serverless-http";
import express from "express";
import expressWinston from "express-winston";
import dotenv from 'dotenv';
import agentRoutes from "./routes/agentRoutes";
import { errorHandler } from "../../backend-service/src/middlewares/errorHandler";
import logger from "../../backend-service/src/utils/logger";
import { performanceMonitor } from "../../backend-service/src/middlewares/performanceMonitor";
import { trace } from "../../backend-service/src/middlewares/trace";
import { Request, Response } from 'express';
import { ErrorShowType } from "../../backend-service/src/enum/errorShowType";

dotenv.config();

const app = express();

app.use(express.json());

// 请求日志记录
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

app.use(trace);
app.use((req: Request, res: Response, next) => {
  res.ok = function (data?: any) {
    return this.status(200).json({
      success: true,
      data,
      //traceId: res.getHeader('X-Trace-Id'),
      //host: req.hostname,
    });
  };

  res.fail = function (errorMessage?: string, errorCode?: string, showType?: ErrorShowType, statusCode?: number) {
    return this.status(statusCode || 500).json({
      success: false,
      errorMessage,
      errorCode: errorCode || 'InternalServerError',
      showType: showType || ErrorShowType.ERROR_MESSAGE,
      traceId: res.getHeader('X-Trace-Id'),
      host: req.hostname,
    });
  };
  next();
});


app.use(performanceMonitor);

app.use("/api/agents", agentRoutes);

// 错误日志记录
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}));

app.use(errorHandler);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// app.get("/", (req, res, next) => {
//   console.log(process.env.AGENT_USER_POOL_REGION);
//   console.log(process.env.AGENT_USER_POOL_CLIENT_ID);
//   return res.status(200).send({
//     message: "Hello from root!",
//   });
// });

// app.get("/hello", (req, res, next) => {
//   return res.status(200).json({
//     message: "Hello from path!",
//   });
// });

// app.use((req, res, next) => {
//   return res.status(404).json({
//     error: "Not Found",
//   });
// });

export const handler = serverless(app);
