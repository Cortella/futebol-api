import { Router } from "express";
import { CareerController } from "../controllers/CareerController";
import { CareerGameController } from "../controllers/CareerGameController";
import { authGuard, AuthRequest } from "../middlewares/authGuard";

const careerRouter = Router();
const controller = new CareerController();
const gameController = new CareerGameController();

careerRouter.use(authGuard);

// --- Career CRUD ---
careerRouter.get("/", (req, res) => controller.findAll(req as AuthRequest, res));
careerRouter.get("/:id", (req, res) => controller.findById(req as AuthRequest, res));
careerRouter.post("/", (req, res) => controller.create(req as AuthRequest, res));
careerRouter.delete("/:id", (req, res) => controller.delete(req as AuthRequest, res));

// --- Teams (career-scoped) ---
careerRouter.get("/:cId/teams", (req, res) => gameController.teams(req as AuthRequest, res));
careerRouter.get("/:cId/my-team", (req, res) => gameController.myTeam(req as AuthRequest, res));
careerRouter.get("/:cId/teams/:id", (req, res) => gameController.teamById(req as AuthRequest, res));

// --- Players (career-scoped) ---
careerRouter.get("/:cId/players", (req, res) => gameController.players(req as AuthRequest, res));
careerRouter.get("/:cId/players/:id", (req, res) =>
  gameController.playerById(req as AuthRequest, res),
);

// --- Tactic (career-scoped) ---
careerRouter.get("/:cId/tactic", (req, res) => gameController.getTactic(req as AuthRequest, res));
careerRouter.put("/:cId/tactic", (req, res) =>
  gameController.updateTactic(req as AuthRequest, res),
);

// --- Lineup (career-scoped) ---
careerRouter.get("/:cId/lineup", (req, res) => gameController.getLineup(req as AuthRequest, res));
careerRouter.put("/:cId/lineup", (req, res) =>
  gameController.updateLineup(req as AuthRequest, res),
);

// --- Standings (career-scoped) ---
careerRouter.get("/:cId/standings", (req, res) =>
  gameController.standings(req as AuthRequest, res),
);

// --- Rounds & Matches (career-scoped) ---
careerRouter.get("/:cId/rounds", (req, res) => gameController.rounds(req as AuthRequest, res));
careerRouter.get("/:cId/rounds/:number", (req, res) =>
  gameController.roundByNumber(req as AuthRequest, res),
);
careerRouter.get("/:cId/matches/:id", (req, res) =>
  gameController.matchById(req as AuthRequest, res),
);
careerRouter.get("/:cId/next-match", (req, res) =>
  gameController.nextMatch(req as AuthRequest, res),
);

// --- Market (career-scoped) ---
careerRouter.get("/:cId/market", (req, res) => gameController.market(req as AuthRequest, res));
careerRouter.post("/:cId/market/sell", (req, res) =>
  gameController.sellPlayer(req as AuthRequest, res),
);
careerRouter.delete("/:cId/market/sell/:playerId", (req, res) =>
  gameController.removeSale(req as AuthRequest, res),
);

// --- Transfers (career-scoped) ---
careerRouter.get("/:cId/transfers", (req, res) =>
  gameController.transfers(req as AuthRequest, res),
);

export { careerRouter };
