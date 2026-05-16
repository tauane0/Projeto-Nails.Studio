// Componente para seleção de data e hora do agendamento
// Exibido no passo 2 do fluxo de agendamento
// Mostra um calendário e horários disponíveis (consulta banco para horários já agendados)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/api/supabaseClient';
import { cn } from "../../lib/utils";

// Horários disponíveis do salão (não inclui intervalo de almoço)
const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Função para verificar se uma data está indisponível
// (domingos ou datas passadas)
/**
 * @param {Date} date - Data a verificar
 * @returns {boolean} True se a data está indisponível
 */
const isUnavailable = (date) => { // Indisponível se for domingo (getDay() === 0) ou se for antes do dia atual
  const day = getDay(date);
  return day === 0 || isBefore(date, startOfDay(new Date())); // Domingo = 0
};

/**
 * @param {Object} props
 * @param {Date | null} props.selectedDate - Data selecionada
 * @param {string | null} props.selectedTime - Horário selecionado
 * @param {(date: Date) => void} props.onDateSelect - Callback ao selecionar data
 * @param {(time: string) => void} props.onTimeSelect - Callback ao selecionar horário
 */
export default function DateTimeSelector({ selectedDate, selectedTime, onDateSelect, onTimeSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBooked = async () => {
      setLoadingSlots(true);
      try {
        // Busca todos os agendamentos para essa data (excluindo cancelados)
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const { data, error } = await supabase
        .from('available_slots')
        .select('time')
        .eq('date', dateStr);

        if (error) throw error;
        setBookedTimes(data ? data.map(a => a.time) : []); // Extrai apenas os horários dos agendamentos encontrados
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        setBookedTimes([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBooked();
  }, [selectedDate]);

  // Calcula quais dias do mês devem ser exibidos
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = getDay(startOfMonth(currentMonth)); // Dias em branco no início (antes do dia 1)

  return (
    <div className="space-y-6">
      {/* === CALENDÁRIO === */}
      <div className={cn('bg-card', 'border', 'border-border', 'rounded-2xl', 'p-5')}>
        {/* Controles do mês (mês anterior/próximo) */}
        <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className={cn('p-2', 'hover:bg-secondary', 'rounded-lg', 'transition-colors')}>
            <ChevronLeft className={cn('w-4', 'h-4', 'text-muted-foreground')} />
          </button>
          <span className={cn('font-heading', 'text-lg', 'font-semibold', 'capitalize', 'text-foreground')}>
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className={cn('p-2', 'hover:bg-secondary', 'rounded-lg', 'transition-colors')}>
            <ChevronRight className={cn('w-4', 'h-4', 'text-muted-foreground')} />
          </button>
        </div>

        {/* Cabeçalho com nomes dos dias da semana */}
        <div className={cn('grid', 'grid-cols-7', 'mb-2')}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className={cn('text-center', 'text-xs', 'text-muted-foreground', 'py-1', 'font-medium')}>{d}</div>
          ))}
        </div>

        {/* Grid com os dias do mês */}
        <div className={cn('grid', 'grid-cols-7', 'gap-1')}>
          {/* Espaços em branco para dias do mês anterior */}
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
          
          {/* Botões dos dias do mês */}
          {days.map(day => {
            const unavail = isUnavailable(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            return (
              <button
                key={day.toISOString()}
                onClick={() => !unavail && onDateSelect(day)}
                disabled={unavail}
                className={`aspect-square rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground' // Dia selecionado
                    : unavail
                    ? 'text-muted-foreground/30 cursor-not-allowed' // Dia indisponível (domingo ou passado)
                    : 'text-foreground hover:bg-primary/20' // Dia disponível
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* === SELETOR DE HORÁRIOS === */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className={cn('text-sm', 'font-medium', 'text-muted-foreground', 'mb-3', 'tracking-wide', 'uppercase')}>
            Horários para {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </p>

          {loadingSlots ? (
            // Mostra loading enquanto busca horários
            <div className={cn('flex', 'items-center', 'gap-2', 'text-muted-foreground', 'text-sm')}>
              <Loader2 className={cn('w-4', 'h-4', 'animate-spin')} /> Verificando disponibilidade...
            </div>
          ) : (
            <>
              {/* Grid com botões de horários */}
              <div className={cn('grid', 'grid-cols-4', 'gap-2')}>
                {TIME_SLOTS.map(t => {
                  const isBooked = bookedTimes.includes(t); // Horário já tem agendamento
                  const isChosen = selectedTime === t; // Horário foi selecionado pelo cliente
                  return (
                    <button
                      key={t}
                      onClick={() => !isBooked && onTimeSelect(t)}
                      disabled={isBooked}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        isChosen
                          ? 'border-primary bg-primary text-primary-foreground' // Selecionado
                          : isBooked
                          ? 'border-border bg-secondary text-muted-foreground/40 cursor-not-allowed line-through' // Ocupado
                          : 'border-border bg-card text-foreground hover:border-primary/50' // Disponível
                      }`}
                    >
                      {t}
                      {isBooked && <span className={cn('block', 'text-[10px]', 'leading-none', 'mt-0.5', 'no-underline')}>ocupado</span>}
                    </button>
                  );
                })}
              </div>

              {/* Legenda mostrando o significado de cada cor */}
              <div className={cn('flex', 'items-center', 'gap-4', 'mt-3', 'text-xs', 'text-muted-foreground')}>
                <span className={cn('flex', 'items-center', 'gap-1.5')}><span className={cn('w-3', 'h-3', 'rounded', 'bg-card', 'border', 'border-border', 'inline-block')} /> Disponível</span>
                <span className={cn('flex', 'items-center', 'gap-1.5')}><span className={cn('w-3', 'h-3', 'rounded', 'bg-primary', 'inline-block')} /> Selecionado</span>
                <span className={cn('flex', 'items-center', 'gap-1.5')}><span className={cn('w-3', 'h-3', 'rounded', 'bg-secondary', 'inline-block')} /> Ocupado</span>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}