
import { Player } from './types';

export const PLAYERS: Player[] = [
  { id: 'bea', name: 'Bea', color: '#82b840', initial: 'B' },
  { id: 'alisson', name: 'Alisson', color: '#9b52bf', initial: 'A' },
  { id: 'thales', name: 'Thales', color: '#3f7fcc', initial: 'T' },
  { id: 'kleber', name: 'Kleber', color: '#C2232D', initial: 'K' },
  { id: 'lorena', name: 'Lorena', color: '#C92C66', initial: 'L' },
];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


export const DIVINE_SILENCE_MESSAGES = [
  "O panteão não se move por vontades pequenas. Caminhe mais, sofra mais, só então seu destino talvez seja digno de ser notado.",

  "O panteão ouviu… e escolheu o silêncio. Nem todo destino merece ser iluminado.",

  "Entre eras e cataclismos, sua súplica ecoou fraca demais para despertar um deus.",

  "Os deuses moldam mundos, não conveniências. Retorne quando sua existência pesar sobre a balança do destino.",

  "Nem toda alma merece luz, nem todo futuro deve ser revelado. Hoje, os deuses escolheram esquecer você.",

  "O destino ainda não se moveu por você. E até que o faça, os deuses permanecem imóveis.",

  "👁"
];

export function drawDivineSilence(): string {
  const index = Math.floor(Math.random() * DIVINE_SILENCE_MESSAGES.length);
  return DIVINE_SILENCE_MESSAGES[index];
}
