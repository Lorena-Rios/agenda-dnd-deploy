import { AvailabilityMap, Player, OracleSuggestion } from "../types";

export const consultTheOracle = async (
  availability: AvailabilityMap,
  players: Player[]
): Promise<OracleSuggestion | null> => {
  // 1️⃣ Encontrar a data com mais jogadores
  let bestDate = "";
  let maxCount = -1;

  Object.entries(availability).forEach(([date, ids]) => {
    if (ids.length > maxCount) {
      maxCount = ids.length;
      bestDate = date;
    }
  });

  if (!bestDate || maxCount === 0) return null;

  // 2️⃣ Resolver nomes dos jogadores
  const playerNames = availability[bestDate]
    .map(id => players.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  // 3️⃣ Criar o prompt
  const prompt = `
Estamos organizando uma sessão de RPG em Faerûn (Forgotten Realms).
A data escolhida é ${bestDate} com os jogadores: ${playerNames}.

Gere um presságio místico curto e impactante em português. Escolha aleatoriamente entre uma destas quatro categorias de destino:
1. SORTE: Tymora (Senhora da Sorte) sorri para o grupo.
2. AZAR: Beshaba (A Dama do Infortúnio) ou Talos (O Destruidor) lançam sua sombra.
3. INDEFINIDO/NEUTRO: Oghma (O Escriba) ou Helm (O Vigilante) observam sem interferir.
4. MELHOR NÃO SABER: Shar (A Senhora da Noite) ou Cyric (O Príncipe das Mentiras) ocultam o destino com névoas ou avisos sinistros de que a verdade é perigosa demais.

O texto deve ser curto, poético e usar nomes do panteão de Faerûn.
`;

  // 4️⃣ Chamar a API (backend)
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar o Oráculo");
    }

    const data = await response.json();

    return {
      bestDate,
      playerCount: maxCount,
      oracleMessage: data.text
    };
  } catch (error) {
    console.error("Erro ao consultar o Oráculo:", error);
    return null;
  }
};
