import { env } from "./env";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

type LogLevel = "LOG" | "ERROR" | "WARN" | "DEBUG";

const levelColors: Record<LogLevel, string> = {
  LOG: colors.green,
  ERROR: colors.red,
  WARN: colors.yellow,
  DEBUG: colors.magenta,
};

function timestamp(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${mm}/${dd}/${yyyy}, ${hh}:${min}:${ss}`;
}

function formatPid(): string {
  return `${colors.dim}${process.pid}  -${colors.reset}`;
}

function formatTimestamp(): string {
  return `${colors.dim}${timestamp()}${colors.reset}`;
}

function formatLevel(level: LogLevel): string {
  const color = levelColors[level];

  return `${color}${colors.bold}${level.padEnd(5)}${colors.reset}`;
}

function formatContext(context: string): string {
  return `${colors.yellow}[${context}]${colors.reset}`;
}

function formatMessage(message: string, level: LogLevel): string {
  const color = levelColors[level];

  return `${color}${message}${colors.reset}`;
}

function print(level: LogLevel, context: string, message: string): void {
  const line = `${formatPid()} ${formatTimestamp()}     ${formatLevel(level)} ${formatContext(context)} ${formatMessage(message, level)}`;

  if (level === "ERROR") {
    console.error(line);
  } else if (level === "WARN") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const Logger = {
  log(context: string, message: string): void {
    print("LOG", context, message);
  },

  error(context: string, message: string): void {
    print("ERROR", context, message);
  },

  warn(context: string, message: string): void {
    print("WARN", context, message);
  },

  debug(context: string, message: string): void {
    if (env.nodeEnv === "development") {
      print("DEBUG", context, message);
    }
  },

  banner(): void {
    const port = env.port;
    const baseUrl = `http://localhost:${port}`;

    console.log();
    console.log(
      `${colors.green}${colors.bold}[FutManager]${colors.reset} ${colors.dim}v1.0.0${colors.reset}`,
    );
    console.log();
    Logger.log("RoutesResolver", `Mapped {/api/auth/register, POST} route`);
    Logger.log("RoutesResolver", `Mapped {/api/auth/login, POST} route`);
    Logger.log("RoutesResolver", `Mapped {/api/teams, GET} route`);
    Logger.log("RoutesResolver", `Mapped {/api/teams/:id, GET} route`);
    Logger.log("RoutesResolver", `Mapped {/api/teams, POST} route`);
    Logger.log("RoutesResolver", `Mapped {/api/teams/:id, PUT} route`);
    Logger.log("RoutesResolver", `Mapped {/api/teams/:id, DELETE} route`);
    Logger.log("RoutesResolver", `Mapped {/api/health, GET} route`);
    console.log();
    Logger.log("NestApplication", `Application is running on: ${baseUrl}`);
    Logger.log(
      "SwaggerModule",
      `Swagger UI: ${colors.cyan}${colors.bold}${baseUrl}/api/docs${colors.reset}`,
    );
    console.log();
  },
};
