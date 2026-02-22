import { app } from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected successfully");

    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
      console.log(`📋 Health check: http://localhost:${env.port}/api/health`);
    });
  })
  .catch((error) => {
    console.error("❌ Error connecting to database:", error);
    process.exit(1);
  });
