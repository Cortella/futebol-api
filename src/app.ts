import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(errorHandler);

export { app };
