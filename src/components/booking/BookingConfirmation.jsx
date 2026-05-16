// Tela final de confirmação do agendamento
// Exibida no passo 4 (último) do fluxo de agendamento
// Mostra um resumo dos dados do agendamento confirmado
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BookingConfirmation({ appointment, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-6"
    >
      {/* Ícone animado de sucesso */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Mensagem de sucesso */}
      <h3 className="font-heading text-3xl font-bold text-foreground mb-2">Agendamento Confirmado!</h3>
      <p className="text-muted-foreground mb-8">
        Enviamos os detalhes para <span className="text-foreground font-medium">{appointment.client_email}</span>
      </p>

      {/* Card com resumo dos dados do agendamento */}
      <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4 mb-8">
        {/* Serviço selecionado */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Serviço</p>
            <p className="text-foreground font-medium">{appointment.service}</p>
          </div>
        </div>

        {/* Data do agendamento (formatada em português) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Data</p>
            <p className="text-foreground font-medium capitalize">
              {format(new Date(appointment.date + 'T12:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Horário do agendamento */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Horário</p>
            <p className="text-foreground font-medium">{appointment.time}</p>
          </div>
        </div>
      </div>

      {/* Botão para voltar à home */}
      <button
        onClick={onClose}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold tracking-wide hover:bg-primary/90 transition-colors"
      >
        Fechar
      </button>
    </motion.div>
  );
}