import { Router } from "express";
import { authRouter } from "./auth.routes";
import { teamRouter } from "./team.routes";
import { championshipRouter } from "./championship.routes";
import { divisionRouter } from "./division.routes";
import { careerRouter } from "./career.routes";
import { seasonRouter } from "./season.routes";
import { playerRouter } from "./player.routes";
import { divisionTeamRouter } from "./divisionTeam.routes";
import { tacticRouter } from "./tactic.routes";
import { lineupRouter } from "./lineup.routes";
import { lineupPlayerRouter } from "./lineupPlayer.routes";
import { roundRouter } from "./round.routes";
import { matchRouter } from "./match.routes";
import { standingRouter } from "./standing.routes";
import { transferRouter } from "./transfer.routes";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

routes.use("/auth", authRouter);
routes.use("/teams", teamRouter);
routes.use("/championships", championshipRouter);
routes.use("/divisions", divisionRouter);
routes.use("/careers", careerRouter);
routes.use("/seasons", seasonRouter);
routes.use("/players", playerRouter);
routes.use("/division-teams", divisionTeamRouter);
routes.use("/tactics", tacticRouter);
routes.use("/lineups", lineupRouter);
routes.use("/lineup-players", lineupPlayerRouter);
routes.use("/rounds", roundRouter);
routes.use("/matches", matchRouter);
routes.use("/standings", standingRouter);
routes.use("/transfers", transferRouter);

export { routes };
