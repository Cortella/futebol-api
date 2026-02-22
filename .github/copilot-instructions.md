# Copilot Instructions — FutManager API

> Instruções para construção de uma API REST que reproduz a experiência completa do jogo **Brasfoot**, renomeado como **FutManager**.
> O frontend será React (fora deste repositório). Este projeto é **exclusivamente a API**.

---

## 1. Visão Geral do Jogo

**FutManager** é um simulador de gerenciamento de futebol brasileiro onde o jogador assume o papel de técnico de um clube. Ele compete contra a máquina (IA controla os demais times) em campeonatos no formato de pontos corridos, gerencia elenco, finanças, táticas e busca títulos, acessos e evita rebaixamentos — exatamente como o Brasfoot original.

### Fluxo Principal do Jogo

```
1. Usuário cria conta → Faz login
2. Inicia "Nova Carreira" → Escolhe um campeonato (ex: Brasileirão Série A)
3. Escolhe um time dentro daquele campeonato
4. Gerencia elenco (escalar titulares, reservas, tática, formação)
5. Avança rodada por rodada (cada avanço simula TODAS as partidas da rodada)
6. Entre rodadas: pode comprar/vender jogadores, alterar tática
7. Ao final do campeonato: promoção, rebaixamento, fim de temporada
8. Pode iniciar nova temporada com o mesmo time
```

### Stack Tecnológica

- **Runtime:** Node.js + TypeScript (strict mode)
- **Framework HTTP:** Express
- **ORM:** TypeORM (PostgreSQL)
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Validação:** Zod v4
- **Documentação:** Swagger UI (`/api/docs`)
- **Testes:** Jest + ts-jest (meta: 100% coverage)
- **Lint/Format:** ESLint 10 (flat config) + Prettier
- **Hooks:** Husky (commit-msg pattern: `FUTEBOL-<num>-<feat|fix>-<msg>`, pre-push coverage ≥ 90%)

---

## 2. Arquitetura

### Estrutura de Pastas

```
src/
├── config/            # DataSource, env, swagger, jwt config
├── entities/          # Entidades TypeORM
├── schemas/           # Schemas Zod (input validation)
├── services/          # Lógica de negócio (1 por domínio)
├── controllers/       # Controllers HTTP
│   └── AdminController.ts  # Classe abstrata para rotas admin
├── routes/            # Express Router (1 por domínio + index)
├── middlewares/       # authGuard, adminGuard, errorHandler
├── errors/            # AppError customizado
├── engine/            # Motor de simulação de partidas (CORE do jogo)
│   ├── MatchEngine.ts
│   ├── SeasonEngine.ts
│   ├── TransferAI.ts
│   └── PlayerGenerator.ts
├── utils/             # Helpers (cálculos, random, formatação)
├── seeds/             # Dados iniciais (times, jogadores reais brasileiros)
├── migrations/        # TypeORM migrations
└── __tests__/         # Testes espelhando src/
```

### Fluxo de Request

```
Request → helmet, cors, json
        → authGuard (JWT) [rotas protegidas]
        → adminGuard [rotas admin]
        → Router → Controller → Zod validation → Service → Repository
        → Response JSON
        → errorHandler (AppError/ZodError/401/403/500)
```

---

## 3. Entidades do Banco de Dados

### Diagrama de Relações

```
User ──1:N──> Career
Career ──1:1──> Team (time escolhido pelo user)
Career ──M:1──> Season

Championship ──1:N──> Division
Division ──1:N──> DivisionTeam (times naquela divisão/temporada)
Division ──M:1──> Season

Team ──1:N──> Player
Team ──1:N──> DivisionTeam

Season ──1:N──> Division
Season ──1:N──> Round
Round ──1:N──> Match
Match ──M:1──> Division
Match ──M:1──> Team (home)
Match ──M:1──> Team (away)

Standing ──M:1──> Division
Standing ──M:1──> Team

Transfer ──M:1──> Player
Transfer ──M:1──> Team (from)
Transfer ──M:1──> Team (to)
Transfer ──M:1──> Season

Tactic ──M:1──> Career (tática do user para seu time)
Lineup ──M:1──> Career (escalação salva)
Lineup ──1:N──> LineupPlayer
LineupPlayer ──M:1──> Player
```

### Entidade: `User`

| Campo     | Tipo      | Regras                                                |
| --------- | --------- | ----------------------------------------------------- |
| id        | UUID PK   | Auto-gerado                                           |
| username  | string    | Único, 3-20 chars, alfanumérico                       |
| email     | string    | Único, formato email válido                           |
| password  | string    | Hash bcrypt, salt 10, mínimo 6 chars, `select: false` |
| createdAt | timestamp | Auto                                                  |

### Entidade: `Career` (Carreira / Partida Salva)

Uma carreira é uma "save" — o usuário pode ter múltiplas carreiras simultâneas.

| Campo        | Tipo      | Regras                                              |
| ------------ | --------- | --------------------------------------------------- |
| id           | UUID PK   |                                                     |
| userId       | UUID FK   | → User                                              |
| teamId       | UUID FK   | → Team (time que o user escolheu gerenciar)         |
| seasonId     | UUID FK   | → Season (temporada atual da carreira)              |
| divisionId   | UUID FK   | → Division (divisão atual do time do user)          |
| currentRound | int       | Rodada atual (1 a totalRounds)                      |
| budget       | bigint    | Orçamento em centavos (ex: 500000000 = R$5.000.000) |
| reputation   | int       | 1-100, afeta contratações e propostas               |
| status       | enum      | `active`, `finished`, `relegated`, `champion`       |
| createdAt    | timestamp |                                                     |

### Entidade: `Championship` (Campeonato)

Representa um campeonato fixo (ex: "Campeonato Brasileiro", "Campeonato Inglês").

| Campo   | Tipo    | Regras                      |
| ------- | ------- | --------------------------- |
| id      | UUID PK |                             |
| name    | string  | Ex: "Campeonato Brasileiro" |
| country | string  | Ex: "Brasil"                |
| logo    | string? | URL do logo                 |

### Entidade: `Division` (Divisão dentro de um campeonato + temporada)

| Campo           | Tipo    | Regras                                   |
| --------------- | ------- | ---------------------------------------- |
| id              | UUID PK |                                          |
| championshipId  | UUID FK | → Championship                           |
| seasonId        | UUID FK | → Season                                 |
| name            | string  | Ex: "Série A", "Série B"                 |
| level           | int     | 1 = Série A, 2 = Série B, 3 = C, 4 = D   |
| totalTeams      | int     | Normalmente 20                           |
| promotionSlots  | int     | Quantos sobem (ex: 4)                    |
| relegationSlots | int     | Quantos descem (ex: 4)                   |
| totalRounds     | int     | Calculado: (totalTeams - 1) \* 2         |
| status          | enum    | `not_started`, `in_progress`, `finished` |

### Entidade: `Season` (Temporada)

| Campo | Tipo    | Regras   |
| ----- | ------- | -------- |
| id    | UUID PK |          |
| year  | int     | Ex: 2026 |

### Entidade: `Team`

| Campo           | Tipo    | Regras                                            |
| --------------- | ------- | ------------------------------------------------- |
| id              | UUID PK |                                                   |
| name            | string  | Ex: "Palmeiras"                                   |
| shortName       | string  | 3 chars uppercase. Ex: "PAL"                      |
| city            | string  | Ex: "São Paulo"                                   |
| state           | string  | Ex: "SP" (UF, 2 chars)                            |
| stadium         | string  | Ex: "Allianz Parque"                              |
| stadiumCapacity | int     | Capacidade do estádio (afeta renda de bilheteria) |
| colors          | string  | Ex: "Verde e Branco"                              |
| logo            | string? | URL                                               |
| prestige        | int     | 1-100 (força histórica do clube, afeta IA)        |
| baseWage        | bigint  | Folha salarial base mensal (centavos)             |

### Entidade: `DivisionTeam` (vínculo Time ↔ Divisão em uma temporada)

| Campo      | Tipo    | Regras                                  |
| ---------- | ------- | --------------------------------------- |
| id         | UUID PK |                                         |
| divisionId | UUID FK | → Division                              |
| teamId     | UUID FK | → Team                                  |
| isUserTeam | boolean | `true` se é o time controlado pelo user |

### Entidade: `Player`

| Campo       | Tipo     | Regras                                                                 |
| ----------- | -------- | ---------------------------------------------------------------------- |
| id          | UUID PK  |                                                                        |
| name        | string   | Nome completo                                                          |
| nickname    | string?  | Apelido (exibição principal, como no Brasfoot)                         |
| teamId      | UUID FK? | → Team (null = sem clube / mercado livre)                              |
| position    | enum     | `GOL`, `ZAG`, `LD`, `LE`, `VOL`, `MC`, `MEI`, `PD`, `PE`, `ATA`, `SA`  |
| age         | int      | 16-40                                                                  |
| nationality | string   | Ex: "Brasileiro"                                                       |
| shirtNumber | int?     | 1-99, único dentro do time                                             |
| force       | int      | **1-100** — Atributo PRINCIPAL (como no Brasfoot)                      |
| velocity    | int      | 1-100                                                                  |
| stamina     | int      | 1-100 — Resistência / condição física                                  |
| technique   | int      | 1-100                                                                  |
| morale      | int      | 0-100 — Sobe com vitórias, desce com derrotas                          |
| condition   | int      | 0-100 — Condição física (desgasta a cada jogo, recupera entre rodadas) |
| injury      | int      | 0 = saudável, >0 = rodadas restantes de lesão                          |
| salary      | bigint   | Salário mensal em centavos                                             |
| marketValue | bigint   | Valor de mercado em centavos (calculado)                               |
| forSale     | boolean  | Se está à venda                                                        |
| askingPrice | bigint?  | Preço pedido (centavos)                                                |
| suspended   | boolean  | Suspenso por cartões                                                   |
| yellowCards | int      | Cartões amarelos acumulados na temporada                               |
| redCards    | int      | Cartões vermelhos na temporada                                         |

#### Posições do Brasfoot (usadas nesta API)

| Sigla | Nome             | Classificação |
| ----- | ---------------- | ------------- |
| GOL   | Goleiro          | Defesa        |
| ZAG   | Zagueiro         | Defesa        |
| LD    | Lateral Direito  | Defesa        |
| LE    | Lateral Esquerdo | Defesa        |
| VOL   | Volante          | Meio-campo    |
| MC    | Meia Central     | Meio-campo    |
| MEI   | Meia Atacante    | Meio-campo    |
| PD    | Ponta Direita    | Ataque        |
| PE    | Ponta Esquerda   | Ataque        |
| ATA   | Atacante         | Ataque        |
| SA    | Segundo Atacante | Ataque        |

### Entidade: `Tactic` (Tática da carreira do usuário)

| Campo     | Tipo    | Regras                                                                     |
| --------- | ------- | -------------------------------------------------------------------------- |
| id        | UUID PK |                                                                            |
| careerId  | UUID FK | → Career                                                                   |
| formation | string  | Ex: "4-4-2". Soma dos números DEVE ser 10                                  |
| style     | enum    | `ultra_defensive`, `defensive`, `moderate`, `offensive`, `ultra_offensive` |
| marking   | enum    | `zone`, `man_to_man`                                                       |
| tempo     | enum    | `slow`, `normal`, `fast`                                                   |
| passing   | enum    | `short`, `mixed`, `long`                                                   |
| pressure  | enum    | `low`, `normal`, `high`                                                    |

#### Formações válidas (como no Brasfoot)

`3-5-2`, `3-4-3`, `4-4-2`, `4-3-3`, `4-5-1`, `4-2-3-1`, `4-3-2-1`, `4-1-3-2`, `5-4-1`, `5-3-2`, `3-4-1-2`, `3-3-3-1`, `4-2-4`, `4-1-4-1`

### Entidade: `Lineup` (Escalação)

| Campo    | Tipo    | Regras                                   |
| -------- | ------- | ---------------------------------------- |
| id       | UUID PK |                                          |
| careerId | UUID FK | → Career                                 |
| name     | string? | Nome opcional (ex: "Titular", "Reserva") |

### Entidade: `LineupPlayer`

| Campo        | Tipo    | Regras                                   |
| ------------ | ------- | ---------------------------------------- |
| id           | UUID PK |                                          |
| lineupId     | UUID FK | → Lineup                                 |
| playerId     | UUID FK | → Player                                 |
| positionSlot | string  | Posição na formação (ex: "ZAG1", "ATA2") |
| isStarter    | boolean | true = titular, false = reserva          |

### Entidade: `Round` (Rodada)

| Campo      | Tipo    | Regras                             |
| ---------- | ------- | ---------------------------------- |
| id         | UUID PK |                                    |
| divisionId | UUID FK | → Division                         |
| seasonId   | UUID FK | → Season                           |
| number     | int     | Número da rodada (1 a totalRounds) |
| status     | enum    | `pending`, `simulated`             |

### Entidade: `Match` (Partida)

| Campo      | Tipo    | Regras                                         |
| ---------- | ------- | ---------------------------------------------- |
| id         | UUID PK |                                                |
| roundId    | UUID FK | → Round                                        |
| divisionId | UUID FK | → Division                                     |
| homeTeamId | UUID FK | → Team                                         |
| awayTeamId | UUID FK | → Team                                         |
| homeGoals  | int?    | null se não jogou ainda                        |
| awayGoals  | int?    | null se não jogou ainda                        |
| attendance | int?    | Público presente (para cálculo de renda)       |
| played     | boolean | default false                                  |
| events     | jsonb?  | Array de eventos do jogo (gols, cartões, etc.) |

### Entidade: `Standing` (Classificação)

| Campo          | Tipo    | Regras                                |
| -------------- | ------- | ------------------------------------- |
| id             | UUID PK |                                       |
| divisionId     | UUID FK | → Division                            |
| teamId         | UUID FK | → Team                                |
| position       | int     | Posição na tabela (calculada)         |
| points         | int     | default 0                             |
| played         | int     | default 0                             |
| wins           | int     | default 0                             |
| draws          | int     | default 0                             |
| losses         | int     | default 0                             |
| goalsFor       | int     | default 0                             |
| goalsAgainst   | int     | default 0                             |
| goalDifference | int     | Calculado: goalsFor - goalsAgainst    |
| form           | string  | Últimos 5 resultados: "VVDEV" (V/D/E) |
| streak         | string  | Ex: "3V" (3 vitórias seguidas)        |

### Entidade: `Transfer`

| Campo      | Tipo      | Regras                        |
| ---------- | --------- | ----------------------------- |
| id         | UUID PK   |                               |
| playerId   | UUID FK   | → Player                      |
| fromTeamId | UUID FK?  | → Team (null = mercado livre) |
| toTeamId   | UUID FK   | → Team                        |
| seasonId   | UUID FK   | → Season                      |
| price      | bigint    | Valor em centavos             |
| type       | enum      | `buy`, `sell`, `free`, `loan` |
| date       | timestamp |                               |

### Entidade: `MatchEvent` (evento denormalizado ou dentro de Match.events JSONB)

| Campo    | Tipo    | Notas                                                                   |
| -------- | ------- | ----------------------------------------------------------------------- |
| minute   | int     | 1-90 (+ acréscimos)                                                     |
| type     | enum    | `goal`, `own_goal`, `yellow_card`, `red_card`, `substitution`, `injury` |
| playerId | UUID    | Jogador envolvido                                                       |
| teamId   | UUID    | Time do jogador                                                         |
| assistId | UUID?   | Jogador que deu assistência (só em goals)                               |
| detail   | string? | Ex: "Gol de cabeça", "Falta violenta"                                   |

---

## 4. Motor de Simulação de Partida (CORE)

> Este é o coração do jogo. Reproduz a lógica do Brasfoot onde o resultado depende da **força geral do time**, tática, moral, mando de campo e fator aleatório.

### 4.1 Cálculo de Força do Time

```
forcaTime = médiaForçaTitulares * fatorTático * fatorMoral * fatorCondicao
```

#### Média de Força dos Titulares

Considerar os 11 titulares escalados. Cada jogador contribui com seu atributo `force`.

```ts
const mediaTitulares = titulares.reduce((sum, p) => sum + p.force, 0) / 11;
```

#### Fator Tático (Style)

| Style           | Modificador Ataque | Modificador Defesa |
| --------------- | ------------------ | ------------------ |
| ultra_defensive | -15%               | +15%               |
| defensive       | -8%                | +8%                |
| moderate        | 0%                 | 0%                 |
| offensive       | +8%                | -8%                |
| ultra_offensive | +15%               | -15%               |

#### Fator Moral

```ts
const moralMedia = titulares.reduce((sum, p) => sum + p.morale, 0) / 11;
const fatorMoral = 0.85 + (moralMedia / 100) * 0.3;
// Moral 0 → multiplica por 0.85 (penalidade)
// Moral 50 → multiplica por 1.00 (neutro)
// Moral 100 → multiplica por 1.15 (bônus)
```

#### Fator Condição Física

```ts
const condicaoMedia = titulares.reduce((sum, p) => sum + p.condition, 0) / 11;
const fatorCondicao = 0.9 + (condicaoMedia / 100) * 0.2;
// Condição 0 → 0.90 / Condição 100 → 1.10
```

### 4.2 Algoritmo de Simulação (estilo Brasfoot)

```ts
function simulateMatch(home: MatchTeamData, away: MatchTeamData): MatchResult {
  // --- Vantagem do mandante (como no Brasfoot: mandante tem bônus significativo) ---
  const HOME_BONUS = 1.12; // +12% de força em casa

  const homeStrength = home.attackPower * HOME_BONUS;
  const awayStrength = away.attackPower;

  // --- Cálculo de gols esperados (lambda para Poisson) ---
  // No Brasfoot, jogos tendem a ter 0-4 gols por time
  // Lambda base: (força ataque / força defesa adversária) * fator de escala
  const homeLambda = Math.max(0.4, (homeStrength / away.defensePower) * 1.3);
  const awayLambda = Math.max(0.3, (awayStrength / home.defensePower) * 1.0);

  // --- Distribuição de Poisson para gols ---
  const homeGoals = poissonRandom(homeLambda);
  const awayGoals = poissonRandom(awayLambda);

  // --- Gerar eventos (gols com minuto e jogador) ---
  const events = generateMatchEvents(home, away, homeGoals, awayGoals);

  return { homeGoals, awayGoals, events, attendance };
}
```

#### Distribuição de Poisson

```ts
function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}
```

### 4.3 Cálculo de Força de Ataque e Defesa

Separar os 11 titulares por setor conforme a formação:

```ts
// Formação 4-4-2:
// Defesa: GOL + 2 ZAG + LD + LE = 5 jogadores
// Meio:   2 VOL/MC + 2 MEI/PD/PE = 4 jogadores
// Ataque: 2 ATA/SA = 2 jogadores

attackPower =
  (mediaForceAtacantes * 0.5 + mediaForceMeias * 0.35 + mediaForceDefensores * 0.15) *
  fatorTatico.ataque *
  fatorMoral *
  fatorCondicao;

defensePower =
  (mediaForceDefensores * 0.5 +
    mediaForceMeias * 0.3 +
    mediaForceAtacantes * 0.05 +
    forceGoleiro * 0.15) *
  fatorTatico.defesa *
  fatorMoral *
  fatorCondicao;
```

### 4.4 Geração de Eventos de Partida

Para cada gol, sortear:

- **Minuto**: `Math.floor(Math.random() * 90) + 1`
- **Autor do gol**: Probabilidade ponderada pela `force` e posição (atacantes têm mais chance)
- **Assistência**: 70% de chance de ter assistência (meio-campistas têm mais chance)

Cartões (independente dos gols):

- Cada jogador tem ~5% de chance de levar amarelo por partida
- Se já tem 1 amarelo no jogo, 2% de chance de segundo amarelo (= vermelho)
- Vermelho direto: ~0.5% por jogador por partida
- **3 amarelos acumulados na temporada = 1 jogo de suspensão** (como no Brasileirão)

Lesões:

- ~2% de chance por jogador por partida
- Duração: 1-8 rodadas (distribuição com peso para lesões curtas)

### 4.5 Pós-Partida

Após CADA partida simulada:

1. **Atualizar Standing** dos dois times (pontos, gols, vitórias, etc.)
2. **Atualizar moral dos jogadores:**
   - Vitória: +8 (titular), +3 (reserva do time)
   - Empate: +1 (todos)
   - Derrota: -8 (titular), -3 (reserva do time)
   - Gol marcado: +5 bônus ao jogador
   - Clamp: 0-100
3. **Atualizar condição física:**
   - Titulares: -15 a -25 (aleatório) por jogo
   - Reservas: +10 de recuperação
   - Entre rodadas: +20 de recuperação para todos
4. **Processar cartões:**
   - Amarelo: acumular. A cada 3 amarelos = 1 jogo suspenso
   - Vermelho: 1-3 jogos de suspensão
5. **Processar lesões:** Definir rodadas de recuperação
6. **Calcular renda de bilheteria:**
   - `renda = público * preçoMédioIngresso`
   - Público = baseado na capacidade do estádio \* fator (posição na tabela, rivalidade, etc.)
   - Renda vai para o orçamento do time MANDANTE

### 4.6 Simulação de Rodada Completa

Quando o usuário clica "Avançar Rodada":

1. Validar que o user escalou 11 titulares
2. IA escala os demais times automaticamente (melhores jogadores disponíveis)
3. Simular TODAS as partidas da rodada (não só a do user)
4. Atualizar standings, morais, condições, cartões, lesões
5. Atualizar `career.currentRound++`
6. Se foi última rodada: finalizar temporada (ver seção 6)
7. Retornar: resultado da partida do user + tabela atualizada + todos os resultados

---

## 5. Transferências e Mercado

### Mercado de Transferências

- **Janela aberta:** Antes da temporada começar + entre a rodada 19 e 20 (meio do campeonato)
- **Fora da janela:** Apenas jogadores sem contrato (free agents)

### Compra de Jogador

```
Pré-condições:
1. Janela aberta OU jogador é free agent
2. career.budget >= askingPrice (ou oferta aceita)
3. Elenco do time comprador < 30 jogadores
4. Jogador não pertence ao time do user
```

**Negociação com IA:**

- User faz oferta (valor em centavos)
- Se oferta >= 90% do askingPrice → IA aceita
- Se oferta >= 75% do askingPrice → 50% de chance de aceitar
- Se oferta < 75% → IA recusa
- Time da IA pode fazer contraproposta (askingPrice \* 0.95)

### Venda de Jogador

- User coloca jogador à venda com askingPrice
- IA pode comprar entre rodadas (se time da IA precisa de reforço naquela posição e tem budget)

### IA de Transferências

Entre cada rodada, para cada time da IA:

1. Se tem < 18 jogadores: tenta contratar free agent ou comprar jogador barato
2. Se tem > 28 jogadores: coloca excedentes à venda
3. Se tem posição desfalcada (lesão/suspensão sem reserva): busca contratar

### Cálculo de Valor de Mercado

```ts
function calcMarketValue(player: Player): number {
  const basePorForce = player.force * player.force * 1000; // força² * 1000
  const fatorIdade =
    player.age <= 24
      ? 1.3
      : player.age <= 28
        ? 1.0
        : player.age <= 32
          ? 0.7
          : player.age <= 36
            ? 0.4
            : 0.2;
  return Math.round(basePorForce * fatorIdade);
}
// Jogador force 80, 23 anos: 80² * 1000 * 1.3 = R$ 8.320.000
// Jogador force 50, 35 anos: 50² * 1000 * 0.4 = R$ 1.000.000
```

---

## 6. Temporada e Progressão

### Fim de Temporada

Quando a última rodada é simulada:

1. **Campeão:** 1º colocado da Série A
2. **Promoção:** Top N sobem (configurável, padrão: top 4 da Série B sobem para A)
3. **Rebaixamento:** Bottom N descem (padrão: últimos 4 da Série A descem para B)
4. **Atualizar career.status** conforme resultado do time do user

### Início de Nova Temporada

1. Reorganizar times nas divisões (promoção/rebaixamento)
2. **Envelhecimento:** Todos os jogadores `age += 1`
3. **Aposentadoria:** Jogadores com `age > 38` se aposentam (removidos)
4. **Regens:** Gerar novos jogadores jovens (16-19 anos) para repor vagas
5. Resetar: standings, cartões, suspensões, lesões
6. Moral de todos → 50 (neutro)
7. Condição de todos → 100
8. Gerar novo Calendar (todas as rodadas e partidas do novo campeonato)
9. Abrir janela de transferências

### Geração de Jogadores (Regens)

```ts
function generatePlayer(teamPrestige: number): Player {
  // Force base: entre 30 e 70, influenciado pelo prestígio do time
  const forceBase = 30 + Math.floor(Math.random() * 30) + Math.floor(teamPrestige * 0.1);
  // Idade: 16-19
  // Nome: gerado aleatoriamente de lista de nomes brasileiros
  // Posição: distribuição realista (mais meias e atacantes, menos goleiros)
}
```

---

## 7. Finanças

| Receita             | Cálculo                                           |
| ------------------- | ------------------------------------------------- |
| Bilheteria (jogo)   | público × R$30-80 (varia por divisão e estádio)   |
| Venda de jogador    | Valor da transferência                            |
| Premiação fim temp. | Baseado na posição final (1º = mais, 20º = menos) |

| Despesa            | Cálculo                                              |
| ------------------ | ---------------------------------------------------- |
| Folha salarial     | Soma dos salários de todos os jogadores (por rodada) |
| Compra de jogador  | Valor da transferência                               |
| Manutenção estádio | Custo fixo por rodada (baseado na capacidade)        |

**A cada rodada simulada:** `budget -= folhaSalarial / totalRounds` (proporção por rodada)

**Se budget < 0:** O time não pode contratar. IA pode forçar venda de jogadores caros.

---

## 8. Endpoints da API

### Auth (públicas)

| Método | Rota               | Descrição           |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Criar conta         |
| POST   | /api/auth/login    | Login → retorna JWT |

### Career (protegidas)

| Método | Rota             | Descrição                                       |
| ------ | ---------------- | ----------------------------------------------- |
| POST   | /api/careers     | Criar nova carreira (escolhe campeonato + time) |
| GET    | /api/careers     | Listar carreiras do user                        |
| GET    | /api/careers/:id | Detalhe da carreira ativa                       |
| DELETE | /api/careers/:id | Excluir carreira                                |

### Championship / Division (protegidas)

| Método | Rota                             | Descrição                      |
| ------ | -------------------------------- | ------------------------------ |
| GET    | /api/championships               | Listar campeonatos disponíveis |
| GET    | /api/championships/:id           | Detalhe com divisões           |
| GET    | /api/championships/:id/divisions | Divisões do campeonato         |

### Teams (protegidas, contexto da career)

| Método | Rota                        | Descrição                           |
| ------ | --------------------------- | ----------------------------------- |
| GET    | /api/careers/:cId/teams     | Todos os times da divisão do user   |
| GET    | /api/careers/:cId/my-team   | Time do usuário com elenco completo |
| GET    | /api/careers/:cId/teams/:id | Detalhe de um time + elenco         |

### Players (protegidas)

| Método | Rota                          | Descrição              |
| ------ | ----------------------------- | ---------------------- |
| GET    | /api/careers/:cId/players     | Elenco do time do user |
| GET    | /api/careers/:cId/players/:id | Detalhe do jogador     |

### Tactic & Lineup (protegidas)

| Método | Rota                     | Descrição                    |
| ------ | ------------------------ | ---------------------------- |
| GET    | /api/careers/:cId/tactic | Tática atual                 |
| PUT    | /api/careers/:cId/tactic | Alterar tática               |
| GET    | /api/careers/:cId/lineup | Escalação atual              |
| PUT    | /api/careers/:cId/lineup | Definir titulares e reservas |

### Standings & Matches (protegidas)

| Método | Rota                             | Descrição                        |
| ------ | -------------------------------- | -------------------------------- |
| GET    | /api/careers/:cId/standings      | Tabela de classificação          |
| GET    | /api/careers/:cId/rounds         | Todas as rodadas                 |
| GET    | /api/careers/:cId/rounds/:number | Jogos de uma rodada específica   |
| GET    | /api/careers/:cId/matches/:id    | Detalhe de uma partida + eventos |

### Simulation (protegida — CORE)

| Método | Rota                         | Descrição                                  |
| ------ | ---------------------------- | ------------------------------------------ |
| POST   | /api/careers/:cId/simulate   | Simular próxima rodada (retorna resultado) |
| GET    | /api/careers/:cId/next-match | Prévia da próxima partida do user          |

### Transfers (protegidas)

| Método | Rota                                    | Descrição                   |
| ------ | --------------------------------------- | --------------------------- |
| GET    | /api/careers/:cId/market                | Jogadores à venda           |
| POST   | /api/careers/:cId/market/buy            | Fazer oferta por jogador    |
| POST   | /api/careers/:cId/market/sell           | Colocar jogador à venda     |
| DELETE | /api/careers/:cId/market/sell/:playerId | Retirar jogador do mercado  |
| GET    | /api/careers/:cId/transfers             | Histórico de transferências |

### Admin (AdminController — rotas admin)

| Método | Rota               | Descrição                        |
| ------ | ------------------ | -------------------------------- |
| POST   | /api/admin/seed    | Popular banco com dados iniciais |
| POST   | /api/admin/seasons | Criar nova temporada             |
| GET    | /api/admin/users   | Listar todos os usuários         |

---

## 9. Dados Iniciais (Seed)

O seed deve popular o banco com dados realistas do futebol brasileiro:

### Campeonato Brasileiro

- **Série A:** 20 times (Palmeiras, Flamengo, Corinthians, São Paulo, Santos, Grêmio, Internacional, Atlético-MG, Cruzeiro, Vasco, Botafogo, Fluminense, Bahia, Sport, Vitória, Fortaleza, Ceará, Athletico-PR, Coritiba, Goiás)
- **Série B:** 20 times
- Cada time com elenco de 22-28 jogadores gerados com atributos realistas
- Times grandes (Flamengo, Palmeiras) → prestige 85-95, jogadores force 60-88
- Times menores → prestige 40-60, jogadores force 35-65

### Jogadores

- Nomes brasileiros gerados (lista de ~200 nomes + ~200 sobrenomes)
- Distribuição por posição: ~3 GOL, ~5 ZAG, ~2 LD, ~2 LE, ~3 VOL, ~3 MC/MEI, ~3 PD/PE, ~3 ATA
- Idade distribuída: maioria 22-30, alguns jovens (16-21), alguns veteranos (31-38)

---

## 10. Regras para Geração de Código

### Ao criar Entity

1. Entity em `src/entities/NomeEntity.ts` com TypeORM decorators
2. Schema Zod em `src/schemas/nomeEntity.schema.ts` (create + update partial)
3. Service em `src/services/NomeEntityService.ts`
4. Controller em `src/controllers/NomeEntityController.ts`
5. Routes em `src/routes/nomeEntity.routes.ts` → registrar em `src/routes/index.ts`
6. Documentar em `src/config/swagger.ts`
7. Testes em `src/__tests__/` (espelhar estrutura)
8. `npm run test:coverage` → manter 100%
9. `npm run lint:fix` antes de commit

### Ao criar funcionalidade do Engine

1. Arquivo em `src/engine/NomeFuncionalidade.ts`
2. Funções puras quando possível (facilita testes)
3. Testes com `jest.spyOn(Math, "random")` para resultados determinísticos
4. Testar edge cases: time com 0 moral, todos lesionados, empate técnico, etc.

---

## 11. O que NÃO fazer

- **Nunca** retornar `password` em responses. Usar `select: false` na entity.
- **Nunca** usar `synchronize: true` em produção.
- **Nunca** commitar sem `npm run test:coverage` e `npm run lint:fix`.
- **Nunca** criar endpoint sem documentar no swagger.
- **Nunca** deixar o usuário manipular times que não são dele.
- **Nunca** simular uma rodada se a anterior tem `status: pending`.
- **Nunca** permitir compra de jogador do próprio time.
- **Nunca** escalar jogador lesionado ou suspenso como titular.
- **Nunca** permitir formação cuja soma ≠ 10.
- **Nunca** permitir mais de 11 titulares ou mais de 30 jogadores no elenco.
- **Nunca** permitir transferência com janela fechada (exceto free agents).

---

## 12. Padrões de Resposta

```jsonc
// Sucesso
{ "id": "uuid", "name": "...", ... }

// Erro genérico
{ "status": "error", "message": "Descrição clara" }

// Validação (422)
{ "status": "validation_error", "errors": [{ "field": "name", "message": "Required" }] }

// Não autenticado (401)
{ "status": "error", "message": "Token not provided" }

// Sem permissão (403)
{ "status": "error", "message": "You can only manage your own career" }

// Resultado de simulação (POST /simulate)
{
  "round": 5,
  "userMatch": {
    "home": "Palmeiras",
    "away": "Flamengo",
    "homeGoals": 2,
    "awayGoals": 1,
    "events": [
      { "minute": 23, "type": "goal", "player": "Dudu", "team": "Palmeiras" },
      { "minute": 55, "type": "yellow_card", "player": "Gabigol", "team": "Flamengo" },
      { "minute": 78, "type": "goal", "player": "Veiga", "team": "Palmeiras" },
      { "minute": 89, "type": "goal", "player": "Gabigol", "team": "Flamengo" }
    ],
    "attendance": 38542
  },
  "otherResults": [
    { "home": "Corinthians", "away": "São Paulo", "homeGoals": 0, "awayGoals": 0 },
    ...
  ],
  "standings": [ ... ],
  "financeSummary": { "matchRevenue": 1156260, "wagesCost": 285000, "newBudget": 485871260 }
}
```

---

## 13. Testes

- Framework: Jest + ts-jest
- Meta: **100% coverage** (statements, branches, functions, lines)
- Engine tests: usar `jest.spyOn(Math, "random").mockReturnValue(...)` para determinismo
- Mocks: `jest.mock("../../config/data-source")` para repositories
- Padrão: `src/__tests__/<pasta>/<Arquivo>.test.ts`
- Rodar: `npm run test:coverage`

---

## 14. Scripts

| Script                       | Descrição                 |
| ---------------------------- | ------------------------- |
| `npm run dev`                | Servidor dev (hot reload) |
| `npm run build`              | Compilar TypeScript       |
| `npm start`                  | Servidor compilado        |
| `npm test`                   | Rodar testes              |
| `npm run test:coverage`      | Testes + cobertura        |
| `npm run lint`               | Verificar lint            |
| `npm run lint:fix`           | Corrigir lint             |
| `npm run format`             | Prettier                  |
| `npm run migration:generate` | Gerar migration           |
| `npm run migration:run`      | Aplicar migrations        |
| `npm run migration:revert`   | Reverter última migration |

---

## 15. Commit Convention (Husky)

Padrão obrigatório: `FUTEBOL-<numero>-<feat|fix>-<mensagem>`

Exemplos:

- `FUTEBOL-1-feat-criar entidade user e auth`
- `FUTEBOL-15-fix-corrigir calculo de forca do time`

Pre-push: Cobertura de testes deve ser ≥ 90%.
