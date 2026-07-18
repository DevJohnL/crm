import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey || anonKey.startsWith('cole_aqui')) {
  console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env')
}

// Apenas a chave anon (pública). Nunca use a service_role aqui.
export const supabase = createClient(url, anonKey)

// Estágios do Kanban
export const ESTAGIOS = [
  { id: 'lead',       titulo: 'Lead',       cor: '#64748b' },
  { id: 'contatado',  titulo: 'Contatado',  cor: '#0ea5e9' },
  { id: 'negociando', titulo: 'Negociando', cor: '#f59e0b' },
  { id: 'ganho',      titulo: 'Ganho',      cor: '#22c55e' },
  { id: 'perdido',    titulo: 'Perdido',    cor: '#ef4444' },
]
