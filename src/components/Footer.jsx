import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-heading text-xl font-bold text-foreground tracking-wide">
            Nails<span className="text-accent">.</span>Studio
          </div>
          <div className="flex items-center gap-8">
            <a href="#hero" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
              Início
            </a>
            <a href="#cores" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
              Cores
            </a>
            <a href="#servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
              Serviços
            </a>
            <a href="#galeria" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
              Galeria
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Nails Studio. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}