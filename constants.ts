
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

  "O riso de Tymora dança nos fios do destino. Hoje, o acaso se inclina levemente a seu favor.",

  "Mesmo os deuses se surpreendem às vezes. Um sopro de fortuna escapa das mãos de Tymora e toca seu caminho.",

  "Selûne observa em silêncio, mas a lua ainda lança sua luz sobre você. Caminhe — nem tudo está perdido.",

  "Lathander não promete vitória, apenas um novo começo. O resto depende de você.",

  "Beshaba sorri onde outros desviam o olhar. Se algo der errado hoje… lembre-se de quem estava observando.",

  "Talos não profere avisos. Ele apenas destrói. Se o caos vier, saiba que não foi por acaso.",

  "O mar dos deuses está agitado. Umberlee exige tributo, e o destino cobra sem piedade.",

  "A sorte virou o rosto. O que vier agora será aprendizado — ou punição.",

  "Helm vigia, mas não interfere. Seu destino segue intacto, nem favorecido, nem condenado.",

  "Oghma registra, observa e espera. Nada foi decidido, mas nada foi esquecido.",

  "Kelemvor não julga intenções, apenas consequências. Prossiga com cuidado.",

  "O equilíbrio permanece. Hoje não é dia de glória, nem de ruína.",

  "Shar sussurra onde a luz não alcança. Há verdades que você não deveria buscar — e outras que já o encontraram.",

  "Cyric ri. E quando ele ri, ninguém ganha. Nem mesmo quem acredita ter vencido.",

  "Algo observa por trás do véu. Vecna não fala… mas seu silêncio nunca é inocente.",

  "O futuro treme, mas não se revela. Há olhos que se fecham para protegê-lo — ou condená-lo.",
  
  "Nem todo presságio é dado em palavras. Às vezes, o silêncio dos deuses é o maior aviso de todos.",

  "👁",

  "O silêncio também é um presságio.",

  "Algo observou. Nada respondeu.",

  "Os deuses desviaram o olhar."
];

export function drawDivineSilence(): string {
  const index = Math.floor(Math.random() * DIVINE_SILENCE_MESSAGES.length);
  return DIVINE_SILENCE_MESSAGES[index];
}
