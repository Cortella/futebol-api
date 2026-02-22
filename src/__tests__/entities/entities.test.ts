import { Team } from "../../entities/Team";
import { Player } from "../../entities/Player";

describe("Team entity", () => {
  it("should create a Team instance", () => {
    const team = new Team();
    team.id = "1";
    team.name = "Flamengo";
    team.city = "Rio de Janeiro";
    team.stadium = "Maracanã";
    team.foundedYear = 1895;
    team.logoUrl = "https://example.com/logo.png";
    team.players = [];
    team.createdAt = new Date();
    team.updatedAt = new Date();

    expect(team.id).toBe("1");
    expect(team.name).toBe("Flamengo");
    expect(team.city).toBe("Rio de Janeiro");
    expect(team.stadium).toBe("Maracanã");
    expect(team.foundedYear).toBe(1895);
    expect(team.logoUrl).toBe("https://example.com/logo.png");
    expect(team.players).toEqual([]);
    expect(team.createdAt).toBeInstanceOf(Date);
    expect(team.updatedAt).toBeInstanceOf(Date);
  });
});

describe("Player entity", () => {
  it("should create a Player instance", () => {
    const player = new Player();
    player.id = "1";
    player.name = "Gabigol";
    player.position = "Forward";
    player.number = 9;
    player.nationality = "Brazilian";
    player.birthDate = new Date("1996-08-30");
    player.teamId = "t1";
    player.team = new Team();
    player.createdAt = new Date();
    player.updatedAt = new Date();

    expect(player.id).toBe("1");
    expect(player.name).toBe("Gabigol");
    expect(player.position).toBe("Forward");
    expect(player.number).toBe(9);
    expect(player.nationality).toBe("Brazilian");
    expect(player.birthDate).toBeInstanceOf(Date);
    expect(player.teamId).toBe("t1");
    expect(player.team).toBeInstanceOf(Team);
    expect(player.createdAt).toBeInstanceOf(Date);
    expect(player.updatedAt).toBeInstanceOf(Date);
  });
});
