
import { createClient } from '@supabase/supabase-js';
import { AvailabilityMap } from '../types';

// NOTA: Em um ambiente real, substitua pelas suas credenciais do Supabase.
// Se as chaves não forem fornecidas, o sistema usará o localStorage como fallback.
const SUPABASE_URL = 'https://ugyoeencpabplnsmbgbu.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneW9lZW5jcGFicGxuc21iZ2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjUzMjksImV4cCI6MjA4MTY0MTMyOX0.4sz4yWgUU0UKw-CFPPIVa5iGI3YwzP3d0pzUwDzVphE';

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const databaseService = {
  isConfigured: () => !!supabase,

  // Busca todas as datas salvas
  async fetchAvailability(): Promise<AvailabilityMap> {
    if (!supabase) return JSON.parse(localStorage.getItem('rpg_fallback_db') || '{}');

    const { data, error } = await supabase
      .from('availability')
      .select('*');

    if (error) {
      console.error("Erro ao buscar dados do plano astral:", error);
      return {};
    }

    // Converte o formato do banco [{date, player_ids}] para AvailabilityMap
    return data.reduce((acc: AvailabilityMap, curr) => {
      acc[curr.date] = curr.player_ids;
      return acc;
    }, {});
  },

  // Atualiza a disponibilidade de uma data específica
  async updateDate(date: string, playerIds: string[]) {
    if (!supabase) {
      const current = JSON.parse(localStorage.getItem('rpg_fallback_db') || '{}');
      current[date] = playerIds;
      localStorage.setItem('rpg_fallback_db', JSON.stringify(current));
      return;
    }

    const { error } = await supabase
      .from('availability')
      .upsert({ date, player_ids: playerIds }, { onConflict: 'date' });

    if (error) console.error("Erro ao gravar no pergaminho sagrado:", error);
  },

  // Escuta mudanças em tempo real
  subscribe(callback: (payload: any) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
