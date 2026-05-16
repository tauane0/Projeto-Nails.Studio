// Cliente do Supabase: configura a conexão com o banco de dados
// Usa as variáveis de ambiente para se conectar de forma segura
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // URL do seu projeto no Supabase
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Chave anônima (pública, segura para o frontend)

// Cria uma instância do cliente Supabase que será usada em todo o app
// A anonKey permite que usuários não autenticados façam operações permitidas pela RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

//o import.meta.env é para acessar as variáveis de ambiente definidas no arquivo .env.local
