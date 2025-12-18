
import { AvailabilityMap } from "../types";

const STORAGE_KEY = 'rpg_quest_grimoire_v1';

export const storageService = {
  save: (data: AvailabilityMap) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  
  load: (): AvailabilityMap => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  },

  // Gera uma string codificada para compartilhar com os outros jogadores
  generateSyncCode: (data: AvailabilityMap): string => {
    return btoa(JSON.stringify(data));
  },

  // Decodifica e valida um código recebido
  parseSyncCode: (code: string): AvailabilityMap | null => {
    try {
      const decoded = atob(code);
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Código místico inválido!");
      return null;
    }
  }
};
