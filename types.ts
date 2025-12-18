
export interface Player {
  id: string;
  name: string;
  color: string;
  initial: string;
}

export type AvailabilityMap = Record<string, string[]>; // YYYY-MM-DD -> Array of Player IDs

export interface OracleSuggestion {
  bestDate: string;
  playerCount: number;
  oracleMessage: string;
}
