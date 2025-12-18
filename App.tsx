
import React, { useState, useEffect, useMemo } from 'react';
import { PLAYERS, MONTHS, WEEKDAYS } from './constants';
import { PlayerBadge } from './components/PlayerBadge';
import { AvailabilityMap, OracleSuggestion, Player } from './types';
import { consultTheOracle } from './services/geminiService';
import { databaseService } from './services/databaseService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dices, 
  Sparkles, 
  Loader2, 
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Wifi,
  WifiOff,
  Scroll,
  UserPlus
} from 'lucide-react';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [oracleResult, setOracleResult] = useState<OracleSuggestion | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(databaseService.isConfigured());

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const data = await databaseService.fetchAvailability();
      setAvailability(data);
      setIsLoading(false);
    };

    init();

    const unsubscribe = databaseService.subscribe(() => {
      databaseService.fetchAvailability().then(setAvailability);
    });

    return () => { unsubscribe(); };
  }, []);

  const toggleAvailability = async (dateStr: string, isPast: boolean) => {
    if (isPast || !selectedPlayer) return;

    const currentAtDate = availability[dateStr] || [];
    const isAvailable = currentAtDate.includes(selectedPlayer.id);
    
    let newPlayerIds: string[];
    if (isAvailable) {
      newPlayerIds = currentAtDate.filter(id => id !== selectedPlayer.id);
    } else {
      newPlayerIds = [...currentAtDate, selectedPlayer.id];
    }

    setAvailability(prev => ({ ...prev, [dateStr]: newPlayerIds }));
    await databaseService.updateDate(dateStr, newPlayerIds);
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    
    const result = [];
    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }
    for (let i = 1; i <= days; i++) {
      result.push(new Date(year, month, i));
    }
    return result;
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const handleConsultOracle = async () => {
    setIsConsulting(true);
    const result = await consultTheOracle(availability, PLAYERS);
    setOracleResult(result);
    setIsConsulting(false);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1410] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#3E5F4A] animate-spin" />
        <p className="rpg-font text-emerald-500 animate-pulse uppercase tracking-widest text-sm">Acessando os Planos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1410] text-slate-100 pb-24 selection:bg-emerald-900 selection:text-emerald-200">
      <header className="bg-[#121f18] border-b border-[#3E5F4A]/30 p-6 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
                <img
                  src="/d20.png"
                  alt="Dado d20"
                  className="w-8 h-8"
                />
            <h1 className="text-2xl font-bold rpg-font tracking-wider uppercase text-slate-100">Aventura: Dragão do Pico da Ponta Gélida</h1>
          </div>
          
          <div className="flex bg-black/40 rounded-full p-1.5 gap-1 border border-[#3E5F4A]/40 shadow-inner">
            {PLAYERS.map(player => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`relative transition-all duration-300 p-0.5 rounded-full ${selectedPlayer?.id === player.id ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#121f18]' : ''}`}
              >
                <PlayerBadge player={player} active={selectedPlayer?.id === player.id} />
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-8 space-y-8">
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-500/60 font-medium text-xs tracking-[0.2em] uppercase">
                <MapPin className="w-3 h-3" />
                Forgotten Realms • Faerûn
            </div>
            
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${isConnected ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : 'bg-amber-950/30 border-amber-500/30 text-amber-500'}`}>
                {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isConnected ? 'Conectado' : 'Modo Offline (LocalStorage)'}
            </div>
        </div>

        <section className={`bg-[#16261d] border border-[#3E5F4A]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all duration-500 ${!selectedPlayer ? 'border-amber-500/30 bg-amber-950/10' : ''}`}>
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${!selectedPlayer ? 'bg-amber-500' : 'bg-[#3E5F4A] group-hover:bg-emerald-400'}`} />
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border transition-colors ${!selectedPlayer ? 'bg-amber-500/10 border-amber-500/20' : 'bg-[#3E5F4A]/10 border-[#3E5F4A]/20'}`}>
                    {!selectedPlayer ? <UserPlus className="w-6 h-6 text-amber-500" /> : <Scroll className="w-6 h-6 text-[#5a876a]" />}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-1 text-slate-200 rpg-font tracking-wide">
                      {!selectedPlayer ? 'Quem é você, viajante?' : `Saudações, ${selectedPlayer.name}!`}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {!selectedPlayer 
                        ? 'Selecione quem você é no menu superior para marcar suas datas.' 
                        : 'Sua disponibilidade será gravada instantaneamente.'}
                    </p>
                </div>
            </div>
        </section>

        <section className={`bg-[#121f18] border border-[#3E5F4A]/20 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-700 ${!selectedPlayer ? 'opacity-50 blur-[1px] pointer-events-none grayscale-[0.5]' : ''}`}>
          {!selectedPlayer && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
               <div className="bg-[#121f18] px-6 py-3 rounded-full border border-amber-500/30 shadow-2xl flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-amber-500 animate-bounce" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-500">Aguardando Escolha</span>
               </div>
            </div>
          )}
          
          <div className="bg-[#1a2b21] p-6 flex items-center justify-between border-b border-[#3E5F4A]/10">
            <h2 className="text-xl font-bold rpg-font flex items-center gap-2 text-slate-200">
              <CalendarIcon className="w-5 h-5 text-[#5a876a]" />
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[#3E5F4A]/20 rounded-lg transition-colors border border-[#3E5F4A]/20">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[#3E5F4A]/20 rounded-lg transition-colors border border-[#3E5F4A]/20">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 bg-gradient-to-b from-[#121f18] to-[#0d1410]">
            <div className="grid grid-cols-7 mb-4">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-xs font-bold text-emerald-800 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {daysInMonth.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;
                
                const dateStr = formatDate(date);
                const availableIds = availability[dateStr] || [];
                const isSelectedPlayerAvailable = selectedPlayer ? availableIds.includes(selectedPlayer.id) : false;
                const isToday = formatDate(today) === dateStr;
                const isPast = date < today;

                return (
                  <button
                    key={dateStr}
                    disabled={isPast || !selectedPlayer}
                    onClick={() => toggleAvailability(dateStr, isPast)}
                    className={`group relative aspect-square rounded-xl md:rounded-2xl transition-all duration-300 border-2 overflow-hidden flex flex-col items-center justify-center p-1 md:p-2
                      ${isPast 
                        ? 'bg-slate-900/10 border-slate-900/10 opacity-20 grayscale cursor-not-allowed' 
                        : isSelectedPlayerAvailable 
                          ? 'bg-[#3E5F4A]/30 border-[#3E5F4A] shadow-[0_0_25px_rgba(62,95,74,0.15)]' 
                          : 'bg-black/20 border-emerald-950/40 hover:border-[#3E5F4A]/50'}
                      ${isToday ? 'ring-2 ring-amber-600/50 scale-105 z-10' : ''}`}
                  >
                    <span className={`text-sm md:text-lg font-bold mb-1 transition-colors ${isPast ? 'text-slate-800' : isSelectedPlayerAvailable ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {date.getDate()}
                    </span>
                    
                    {!isPast && (
                        <div className="flex flex-wrap justify-center gap-0.5 md:gap-1 max-w-full">
                        {availableIds.map(id => {
                            const p = PLAYERS.find(pl => pl.id === id);
                            return p ? <PlayerBadge key={id} player={p} size="sm" /> : null;
                        })}
                        </div>
                    )}

                    {isToday && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <button
            onClick={handleConsultOracle}
            disabled={isConsulting || Object.keys(availability).length === 0}
            className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#3E5F4A] to-[#1a2b21] border border-emerald-500/30 rounded-full font-bold text-white shadow-xl hover:shadow-[#3E5F4A]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {isConsulting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:animate-pulse" />
            )}
            <span className="rpg-font tracking-widest uppercase">Consultar Oráculo de Faerûn</span>
          </button>
        </div>

        {oracleResult && (
          <div className="animate-in fade-in zoom-in-95 duration-700 pb-12">
            <div className="bg-[#121f18] border border-[#3E5F4A]/40 rounded-3xl p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3E5F4A] via-emerald-400 to-[#3E5F4A]" />
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="bg-[#3E5F4A]/10 p-6 rounded-3xl border border-[#3E5F4A]/20 shrink-0">
                  <Sparkles className="w-10 h-10 text-emerald-500" />
                </div>
                
                <div className="space-y-6 w-full">
                    <div>
                        <h3 className="text-3xl font-bold rpg-font text-emerald-100 mb-2">Presságio Divino</h3>
                        <p className="text-slate-400 text-sm italic">
                            O Oráculo teve uma visão para a sua próxima sessão. O encontro de {oracleResult.playerCount} aventureiros.
                        </p>
                    </div>

                    <div className="p-8 bg-black/40 rounded-2xl border border-emerald-900/50 relative shadow-inner">
                        <div className="absolute -top-4 left-6 bg-[#121f18] px-3 py-1 border border-emerald-900/50 rounded-full text-[10px] uppercase tracking-widest text-emerald-500/70 font-bold">
                            Vontade dos Deuses
                        </div>
                        <p className="text-xl leading-relaxed text-slate-200 rpg-font leading-9 italic">
                            "{oracleResult.oracleMessage}"
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center md:text-left">Destinados a esta data:</span>
                        <div className="flex gap-2 justify-center md:justify-start">
                            {availability[oracleResult.bestDate]?.map(id => {
                                const p = PLAYERS.find(pl => pl.id === id);
                                return p ? <PlayerBadge key={id} player={p} size="md" /> : null;
                            })}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none z-40">
        <div className="max-w-4xl mx-auto flex justify-center">
            <div className="bg-[#0d1410]/95 border border-[#3E5F4A]/30 backdrop-blur-md px-6 py-2 rounded-full shadow-2xl pointer-events-auto flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Base de Dados • {Object.values(availability).flat().length} Datas Registradas
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
