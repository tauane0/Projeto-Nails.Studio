// Formulário onde o cliente preenche seus dados pessoais antes de confirmar o agendamento
// Coletado no passo 3 do fluxo de agendamento
import React from 'react';

export default function ClientForm({ data, onChange }) {
  // Função auxiliar para criar campos de input reutilizáveis
  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={data[key] || ''}
        onChange={e => onChange({ ...data, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Campo: Nome completo */}
      {field('client_name', 'Nome completo', 'text', 'Seu nome')}
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Telefone / WhatsApp</label>
        <input
          type="tel"
          value={data.client_phone || ''}
          onChange={e => {
            // Remove tudo que não é número (apenas dígitos permitidos)
            const onlyNumbers = e.target.value.replace(/\D/g, '');
            onChange({ ...data, client_phone: onlyNumbers });
          }}
          placeholder="(00) 00000-0000"
          maxLength={11}
          inputMode="numeric"
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Observações <span className="text-muted-foreground font-normal">(opcional)</span></label>
        <textarea
          value={data.notes || ''}
          onChange={e => onChange({ ...data, notes: e.target.value })}
          placeholder="Alguma preferência ou informação adicional?"
          rows={3}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
        />
      </div>
    </div>
  );
}