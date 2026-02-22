# Guia para escrever Copilot Instructions - v1

> Use este arquivo como referência para preencher o `.github/copilot-instructions.md`.
> Depois de preencher, pode deletar este arquivo.

---

## Como funciona

O arquivo `.github/copilot-instructions.md` é lido automaticamente pelo Copilot em toda interação.
Tudo que estiver lá vira **contexto permanente** — como se você repetisse aquelas instruções em todo prompt.

---

## O que escrever e por quê

### 1. Regras imperativas e curtas (MAIOR IMPACTO)

O Copilot trata cada frase como uma restrição. Quanto mais curta e direta, menos chance de erro.

**Bom:**

```markdown
- Nome do time DEVE ser único no banco.
- Nunca usar cascade delete em times.
```

**Ruim:**

```markdown
- Seria legal se o nome do time fosse único, mas se não for tudo bem também,
  depende do contexto e da situação de uso...
```

---

### 2. Exemplos de código (SEGUNDO MAIOR IMPACTO)

Um bloco de 5 linhas mostrando o padrão que você quer vale mais que 10 linhas de texto.

**Bom:**

````markdown
### Padrão de Service

\```ts
async findById(id: string): Promise<Team> {
const team = await repository.findOne({ where: { id }, relations: ["players"] });
if (!team) throw new AppError("Team not found", 404);
return team;
}
\```
````

**Ruim:**

```markdown
O service deve buscar a entidade no repositório usando findOne passando o id
como filtro e incluindo as relações necessárias, e se não encontrar deve lançar
um AppError com status 404...
```

---

### 3. Lista de "NÃO fazer" (TERCEIRO MAIOR IMPACTO)

Anti-patterns explícitos evitam que o Copilot tome decisões por conta própria.

**Exemplo:**

```markdown
### O que NÃO fazer

- Nunca retornar stack trace em respostas de produção.
- Nunca usar `any` sem justificativa em código de produção.
- Nunca commitar sem `npm run test:coverage` e `npm run lint:fix`.
- Não criar endpoint sem documentar no swagger.ts.
- Não criar entity sem schema Zod correspondente.
- Não usar `synchronize: true` em produção.
```

---

### 4. Regras de negócio (ONDE VOCÊ MAIS DEVE ESCREVER)

É aqui que o Copilot mais erra se não tiver instrução — ele inventa regras de domínio.
Escreva como um contrato: frases declarativas, sem ambiguidade.

**Template para preencher:**

```markdown
## Regras de Negócio

### Regras Gerais

- Um jogador só pode pertencer a um time por vez.
- Ao deletar um time, jogadores ficam sem time (SET NULL). Nunca cascade delete.
- Todos os IDs são UUID v4.

### Regras de Time (Team)

- Nome do time DEVE ser único.
- Ano de fundação: entre 1800 e o ano atual.
- [adicione: limite de jogadores por time? time ativo/inativo? campos obrigatórios extras?]

### Regras de Jogador (Player)

- Posições válidas: Goalkeeper, Defender, Midfielder, Forward.
- Número da camisa (1-99): único DENTRO do mesmo time.
- Jogador sem time pode ter qualquer número.
- [adicione: idade mínima? nacionalidade obrigatória? validação de data de nascimento?]

### Regras de Competição (futuro)

- [formato do campeonato: pontos corridos? mata-mata? grupos?]
- [quantos times por competição?]
- [jogador pode jogar em mais de uma competição ao mesmo tempo?]

### Regras de Transferência (futuro)

- [existe janela de transferência?]
- [registrar valor e data da transferência?]
- [manter histórico de times anteriores?]
```

---

### 5. Formato de resposta padronizado

Se você definir o formato, o Copilot nunca vai inventar um diferente.

````markdown
### Padrão de Resposta — Sucesso

\```json
{ "id": "uuid", "name": "...", ... }
\```

### Padrão de Resposta — Erro

\```json
{ "status": "error", "message": "Descrição clara do problema" }
\```

### Padrão de Resposta — Validação (422)

\```json
{
"status": "validation_error",
"errors": [{ "field": "name", "message": "Required" }]
}
\```
````

---

### 6. Tabelas de referência

Tabelas são fáceis de consultar e mantêm consistência.

```markdown
### Entidades e Relações

| Entity | Tabela  | Relação                     |
| ------ | ------- | --------------------------- |
| Team   | teams   | OneToMany → Player          |
| Player | players | ManyToOne → Team (SET NULL) |

### Posições válidas

| Valor      | Descrição        |
| ---------- | ---------------- |
| Goalkeeper | Goleiro          |
| Defender   | Zagueiro/Lateral |
| Midfielder | Meio-campo       |
| Forward    | Atacante         |
```

---

## Checklist antes de finalizar seu instructions

- [ ] Cada regra é uma frase curta e imperativa?
- [ ] Tem pelo menos 1 exemplo de código por padrão importante?
- [ ] Tem uma seção "NÃO fazer"?
- [ ] As regras de negócio estão escritas (mesmo que parciais)?
- [ ] Os formatos de resposta estão definidos?
- [ ] As entidades e relações estão em tabela?

---

## Dica final

**Pense assim:** se um desenvolvedor novo entrasse no projeto hoje e só pudesse ler
UM arquivo antes de codar, esse arquivo deveria ser o `copilot-instructions.md`.
O que você escreveria pra ele não errar nada? Escreva exatamente isso.
