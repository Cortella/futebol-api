import { Team } from "../../entities/Team";

describe("Team entity", () => {
  it("should create a Team instance with all properties", () => {
    const team = new Team();
    team.id = "test-uuid";
    team.name = "Palmeiras";
    team.shortName = "PAL";
    team.city = "São Paulo";
    team.state = "SP";
    team.stadium = "Allianz Parque";
    team.stadiumCapacity = 43713;
    team.colors = "Verde e Branco";
    team.logo = "https://example.com/logo.png";
    team.prestige = 92;
    team.baseWage = "1500000000";

    expect(team.id).toBe("test-uuid");
    expect(team.name).toBe("Palmeiras");
    expect(team.shortName).toBe("PAL");
    expect(team.city).toBe("São Paulo");
    expect(team.state).toBe("SP");
    expect(team.stadium).toBe("Allianz Parque");
    expect(team.stadiumCapacity).toBe(43713);
    expect(team.colors).toBe("Verde e Branco");
    expect(team.logo).toBe("https://example.com/logo.png");
    expect(team.prestige).toBe(92);
    expect(team.baseWage).toBe("1500000000");
  });

  it("should allow null logo", () => {
    const team = new Team();
    team.logo = null;

    expect(team.logo).toBeNull();
  });

  it("should allow creating Team without setting properties", () => {
    const team = new Team();

    expect(team.id).toBeUndefined();
    expect(team.name).toBeUndefined();
  });
});
