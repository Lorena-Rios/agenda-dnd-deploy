
import { GoogleGenAI, Type } from "@google/genai";
import { AvailabilityMap, Player, OracleSuggestion } from "../types";

export const consultTheOracle = async (
  availability: AvailabilityMap,
  players: Player[]
): Promise<OracleSuggestion | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Encontrar a data com mais jogadores
  let bestDate = "";
  let maxCount = -1;

  Object.entries(availability).forEach(([date, ids]) => {
    if (ids.length > maxCount) {
      maxCount = ids.length;
      bestDate = date;
    }
  });

  if (!bestDate || maxCount === 0) return null;

  const playerNames = availability[bestDate]
    .map(id => players.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const prompt = `
    Estamos organizando uma sessão de RPG em Faerûn (Forgotten Realms).
    A data escolhida é ${bestDate} com os jogadores: ${playerNames}.
    
    Gere um presságio místico curto e impactante em português. Escolha aleatoriamente entre uma destas quatro categorias de destino:
    1. SORTE: Tymora (Senhora da Sorte) sorri para o grupo.
    2. AZAR: Beshaba (A Dama do Infortúnio) ou Talos (O Destruidor) lançam sua sombra.
    3. INDEFINIDO/NEUTRO: Oghma (O Escriba) ou Helm (O Vigilante) observam sem interferir.
    4. MELHOR NÃO SABER: Shar (A Senhora da Noite) ou Cyric (O Príncipe das Mentiras) ocultam o destino com névoas ou avisos sinistros de que a verdade é perigosa demais.

    O texto deve ser curto, poético e usar nomes do panteão de Faerûn.
    Exemplos: 
    - "Tymora abençoa seus dados; a fortuna favorece os audazes nesta jornada."
    - "Beshaba ri nas sombras; o azar espreita cada falha crítica."
    - "Oghma registrou seu destino, mas as páginas permanecem em branco para seus olhos mortais."
    - "Shar estende seu manto sobre esta data; há segredos que é melhor deixar no esquecimento."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            oracleMessage: { type: Type.STRING, description: "A previsão mística de Faerûn" }
          },
          required: ["oracleMessage"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      bestDate,
      playerCount: maxCount,
      oracleMessage: result.oracleMessage
    };
  } catch (error) {
    console.error("Erro ao consultar o Oráculo:", error);
    return null;
  }
};
