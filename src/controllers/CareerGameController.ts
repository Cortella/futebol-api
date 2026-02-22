import { Response } from "express";
import { CareerService } from "../services/CareerService";
import { PlayerService } from "../services/PlayerService";
import { DivisionTeamService } from "../services/DivisionTeamService";
import { TeamService } from "../services/TeamService";
import { TacticService } from "../services/TacticService";
import { LineupService } from "../services/LineupService";
import { StandingService } from "../services/StandingService";
import { RoundService } from "../services/RoundService";
import { MatchService } from "../services/MatchService";
import { TransferService } from "../services/TransferService";
import { AuthRequest } from "../middlewares/authGuard";
import { AppError } from "../errors/AppError";
import {
  updateCareerTacticSchema,
  updateCareerLineupSchema,
  sellPlayerSchema,
} from "../schemas/careerGame.schema";

export class CareerGameController {
  private careerService = new CareerService();
  private playerService = new PlayerService();
  private divisionTeamService = new DivisionTeamService();
  private teamService = new TeamService();
  private tacticService = new TacticService();
  private lineupService = new LineupService();
  private standingService = new StandingService();
  private roundService = new RoundService();
  private matchService = new MatchService();
  private transferService = new TransferService();

  private getUserId(req: AuthRequest): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Token not provided", 401);
    }

    return userId;
  }

  // ---------- Teams ----------

  async teams(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const divisionTeams = await this.divisionTeamService.findByDivision(career.divisionId);
    const teams = divisionTeams.map((dt) => dt.team);

    res.json(teams);
  }

  async myTeam(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const team = await this.teamService.findById(career.teamId);
    const players = await this.playerService.findByTeam(career.teamId);

    res.json({ ...team, players });
  }

  async teamById(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    await this.careerService.findById(String(req.params.cId), userId);
    const team = await this.teamService.findById(String(req.params.id));
    const players = await this.playerService.findByTeam(team.id);

    res.json({ ...team, players });
  }

  // ---------- Players ----------

  async players(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const players = await this.playerService.findByTeam(career.teamId);

    res.json(players);
  }

  async playerById(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    await this.careerService.findById(String(req.params.cId), userId);
    const player = await this.playerService.findById(String(req.params.id));

    res.json(player);
  }

  // ---------- Tactic ----------

  async getTactic(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const tactic = await this.tacticService.findByCareer(career.id);

    if (!tactic) {
      throw new AppError("Tactic not found for this career", 404);
    }

    res.json(tactic);
  }

  async updateTactic(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const data = updateCareerTacticSchema.parse(req.body);
    const tactic = await this.tacticService.updateByCareer(career.id, data);

    res.json(tactic);
  }

  // ---------- Lineup ----------

  async getLineup(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const result = await this.lineupService.getLineupWithPlayers(career.id);

    if (!result) {
      throw new AppError("Lineup not found for this career", 404);
    }

    res.json(result);
  }

  async updateLineup(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const data = updateCareerLineupSchema.parse(req.body);
    const result = await this.lineupService.setLineup(career.id, data);

    res.json(result);
  }

  // ---------- Standings ----------

  async standings(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const standings = await this.standingService.findByDivision(career.divisionId);

    res.json(standings);
  }

  // ---------- Rounds & Matches ----------

  async rounds(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const rounds = await this.roundService.findByDivision(career.divisionId);

    res.json(rounds);
  }

  async roundByNumber(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const roundNumber = parseInt(String(req.params.number), 10);

    if (isNaN(roundNumber)) {
      throw new AppError("Round number must be an integer", 400);
    }

    const round = await this.roundService.findByDivisionAndNumber(career.divisionId, roundNumber);
    const matches = await this.matchService.findByRound(round.id);

    res.json({ round, matches });
  }

  async matchById(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    await this.careerService.findById(String(req.params.cId), userId);
    const match = await this.matchService.findById(String(req.params.id));

    res.json(match);
  }

  async nextMatch(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const match = await this.matchService.findNextForTeam(
      career.divisionId,
      career.currentRound,
      career.teamId,
    );

    if (!match) {
      throw new AppError("No upcoming match found", 404);
    }

    res.json(match);
  }

  // ---------- Market ----------

  async market(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const players = await this.playerService.findForSaleExcludingTeam(career.teamId);

    res.json(players);
  }

  async sellPlayer(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const data = sellPlayerSchema.parse(req.body);
    const player = await this.playerService.findById(data.playerId);

    if (player.teamId !== career.teamId) {
      throw new AppError("You can only sell players from your own team", 403);
    }

    const updated = await this.playerService.update(player.id, {
      forSale: true,
      askingPrice: data.askingPrice,
    });

    res.json(updated);
  }

  async removeSale(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const player = await this.playerService.findById(String(req.params.playerId));

    if (player.teamId !== career.teamId) {
      throw new AppError("You can only manage players from your own team", 403);
    }

    await this.playerService.update(player.id, {
      forSale: false,
      askingPrice: null,
    });

    res.status(204).send();
  }

  // ---------- Transfers ----------

  async transfers(req: AuthRequest, res: Response): Promise<void> {
    const userId = this.getUserId(req);
    const career = await this.careerService.findById(String(req.params.cId), userId);
    const transfers = await this.transferService.findBySeasonAndTeam(
      career.seasonId,
      career.teamId,
    );

    res.json(transfers);
  }
}
