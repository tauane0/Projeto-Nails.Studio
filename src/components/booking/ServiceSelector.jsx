// Componente para seleção de serviços disponíveis
// Exibido no passo 1 do fluxo de agendamento
// O cliente pode escolher 1 ou mais serviços e vê o preço total
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gem, Palette, Heart, Check } from 'lucide-react';

// Lista de serviços disponíveis com informações (preço, duração, descrição)
const services = [
  { id: 'Manicure Clássica', icon: Sparkles, price: 'R$ 45', value: 45, duration: '1h', desc: 'Cuidado completo com cutículas e esmaltação impecável.' },
  { id: 'Unhas em Gel', icon: Gem, price: 'R$ 120', value: 120, duration: '2h', desc: 'Alongamento em gel com durabilidade excepcional.' },
  { id: 'Nail Art', icon: Palette, price: 'R$ 80', value: 80, duration: '1h30', desc: 'Designs exclusivos feitos à mão.' },
  { id: 'Spa dos Pés', icon: Heart, price: 'R$ 65', value: 65, duration: '1h30', desc: 'Pedicure completa com esfoliação e massagem relaxante.' },
];

export default function ServiceSelector({ selected, onSelect }) {
  // Função para adicionar ou remover um serviço da seleção
  const toggle = (id) => {
    if (selected.includes(id)) {
      onSelect(selected.filter(s => s !== id)); // Remove se já está selecionado
    } else {
      onSelect([...selected, id]); // Adiciona se não está selecionado
    }
  };

  // Calcula o preço total dos serviços selecionados
  const total = services
    .filter(s => selected.includes(s.id))
    .reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">Selecione um ou mais serviços:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s, i) => {
          const isSelected = selected.includes(s.id);
          return (
            <motion.button
              key={s.id}
              onClick={() => toggle(s.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative text-left rounded-2xl border p-5 transition-all duration-300 ${
                isSelected
                  ? 'border-primary bg-primary/10' // Estilo quando selecionado
                  : 'border-border bg-card hover:border-primary/40' // Estilo padrão
              }`}
            >
              {/* Ícone de check quando selecionado */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {/* Ícone do serviço */}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              
              {/* Informações do serviço */}
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{s.id}</h3>
              <p className="text-muted-foreground text-sm mb-3">{s.desc}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-accent font-semibold">{s.price}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{s.duration}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mostra o total apenas se houver 2+ serviços selecionados */}
      {selected.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-2xl px-5 py-4 mt-2"
        >
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total estimado</p>
            <p className="text-sm text-muted-foreground mt-0.5">{selected.length} serviços selecionados</p>
          </div>
          <p className="font-heading text-2xl font-bold text-accent">R$ {total}</p>
        </motion.div>
      )}
    </div>
  );
}