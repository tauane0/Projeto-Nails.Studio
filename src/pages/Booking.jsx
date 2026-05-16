import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/api/supabaseClient';
import ServiceSelector from '../components/booking/ServiceSelector';
import DateTimeSelector from '../components/booking/DateTimeSelector';
import ClientForm from '../components/booking/ClientForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import Navbar from '../components/Navbar';
import { cn } from "../lib/utils";

// Define os 4 passos do fluxo de agendamento
const STEPS = ['Serviço', 'Data & Hora', 'Seus Dados', 'Confirmação'];

export default function Booking() {
  // Estados para rastrear o progresso do agendamento
  const [step, setStep] = useState(0); // Qual passo o usuário está (0-3)
  const [service, setService] = useState([]); // Serviços selecionados
  const [selectedDate, setSelectedDate] = useState(null); // Data escolhida
  const [selectedTime, setSelectedTime] = useState(''); // Horário escolhido
  const [clientData, setClientData] = useState({}); // Nome, telefone, notas do cliente
  const [loading, setLoading] = useState(false); // Loading durante envio ao banco
  const [confirmedAppointment, setConfirmedAppointment] = useState(null); // Dados do agendamento confirmado

  const canNext = () => {
    if (step === 0) return service.length > 0;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return !!(clientData.client_name && clientData.client_phone);
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
  };

  // Função para confirmar e salvar o agendamento no Supabase
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Formata a data para o padrão esperado pelo banco
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Monta o objeto com todos os dados do agendamento
      const appointment = {
        service: service.join(', '),
        date: dateStr,
        time: selectedTime,
        ...clientData, // Espalha nome, telefone e notas
        status: 'confirmed',
      };

      console.log('Dados enviados:', appointment);
      
      //  IMPORTANTE: Removi .select().single() porque estava causando erro com RLS
      // Quando você usa .select() após insert com RLS ativado, o Supabase tenta fazer
      // um SELECT implícito que é bloqueado pela política de segurança.
      // A solução é inserir os dados SEM o .select(), que funciona perfeitamente.
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment]); // ← Sem .select().single()

      if (error) {
        console.error('Erro ao inserir:', error);
        alert(`Erro: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('Sucesso! Dados salvos:', data);
      setConfirmedAppointment(appointment);
      setStep(3); // Vai para a tela de confirmação
    } catch (err) {
      console.error('Erro:', err);
      alert(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.location.href = '/';
  };

  const stepContent = [
    <ServiceSelector key="s" selected={service} onSelect={setService} />,
    <DateTimeSelector
      key="dt"
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateSelect={(d) => { setSelectedDate(d); setSelectedTime(''); }}
      onTimeSelect={setSelectedTime}
    />,
    <ClientForm key="cf" data={clientData} onChange={setClientData} />,
    confirmedAppointment && <BookingConfirmation key="conf" appointment={confirmedAppointment} onClose={handleClose} />,
  ];

  // Renderiza a interface de agendamento com base no passo atual
  return (
    <div className={cn('min-h-screen', 'bg-background', 'text-foreground')}>
      <Navbar />

      <div className={cn('max-w-2xl', 'mx-auto', 'px-5', 'pt-32', 'pb-20')}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('text-center', 'mb-12')}
        >
          <p className={cn('text-accent', 'font-medium', 'tracking-[0.3em]', 'uppercase', 'text-sm', 'mb-3')}>
            Nails Studio
          </p>
          <h1 className={cn('font-heading', 'text-4xl', 'sm:text-5xl', 'font-bold', 'text-foreground')}>
            {step < 3 ? 'Agendar Visita' : ''}
          </h1>
        </motion.div>

        {/* Progress */}
        {step < 3 && (
          <div className={cn('flex', 'items-center', 'gap-2', 'mb-10')}>
            {STEPS.slice(0, 3).map((label, i) => (
              <React.Fragment key={label}>
                <div className={cn('flex', 'items-center', 'gap-2')}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    i < step ? 'bg-primary text-primary-foreground' :
                    i === step ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block transition-colors ${i === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`flex-1 h-px transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step < 3 && (
              <h2 className={cn('font-heading', 'text-2xl', 'font-semibold', 'text-foreground', 'mb-6')}>
                {STEPS[step]}
              </h2>
            )}
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className={cn('flex', 'items-center', 'justify-between', 'mt-10')}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className={cn('flex', 'items-center', 'gap-2', 'text-muted-foreground', 'hover:text-foreground', 'transition-colors', 'text-sm', 'font-medium')}
              >
                <ArrowLeft className={cn('w-4', 'h-4')} /> Voltar
              </button>
            ) : (
              <a href="/" className={cn('flex', 'items-center', 'gap-2', 'text-muted-foreground', 'hover:text-foreground', 'transition-colors', 'text-sm', 'font-medium')}>
                <ArrowLeft className={cn('w-4', 'h-4')} /> Início
              </a>
            )}

            {step < 2 ? (
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className={cn('flex', 'items-center', 'gap-2', 'px-8', 'py-3', 'bg-primary', 'text-primary-foreground', 'rounded-full', 'font-semibold', 'text-sm', 'tracking-wide', 'hover:bg-primary/90', 'transition-all', 'disabled:opacity-40', 'disabled:cursor-not-allowed')}
              >
                Continuar <ArrowRight className={cn('w-4', 'h-4')} />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!canNext() || loading}
                className={cn('flex', 'items-center', 'gap-2', 'px-8', 'py-3', 'bg-primary', 'text-primary-foreground', 'rounded-full', 'font-semibold', 'text-sm', 'tracking-wide', 'hover:bg-primary/90', 'transition-all', 'disabled:opacity-40', 'disabled:cursor-not-allowed')}
              >
                {loading ? (
                  <><Loader2 className={cn('w-4', 'h-4', 'animate-spin')} /> Confirmando...</>
                ) : (
                  <>Confirmar Agendamento <ArrowRight className={cn('w-4', 'h-4')} /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}