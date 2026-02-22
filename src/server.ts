import { app } from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import { Logger } from "./config/logger";

AppDataSource.initialize()
  .then(() => {
    Logger.log("TypeORM", `Database connected — ${env.db.database}@${env.db.host}:${env.db.port}`);

    app.listen(env.port, () => {
      Logger.banner();
    });
  })
  .catch((error) => {
    Logger.error("TypeORM", `Failed to connect to database: ${error.message}`);
    process.exit(1);
  });
