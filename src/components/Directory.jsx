import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

const UFS = ['', 'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const PAGINA = 25

export default function Directory({ aoAdicionar, irParaBoard }) {
  const [termo, setTermo] = useState('')
  const [uf, setUf] = useState('')
  const [linhas, setLinhas] = useState([])
  const [noBoard, setNoBoard] = useState(new Set())
  const [carregando, setCarregando] = useState(false)
  const [msg, setMsg] = useState('')

  async function buscar(e) {
    e?.preventDefault()
    setCarregando(true)
    setMsg('')
    let q = supabase
      .from('empresas_varejo')
      .select('cnpj, razao_social, nome_fantasia, telefone, email, cnae_descricao, uf, municipio')
      .limit(PAGINA)
    if (uf) q = q.eq('uf', uf)
    if (termo.trim()) {
      const t = `%${termo.trim()}%`
      q = q.or(`razao_social.ilike.${t},nome_fantasia.ilike.${t},municipio.ilike.${t}`)
    }
    const { data, error } = await q
    if (error) setMsg('Erro na busca: ' + error.message)
    setLinhas(data || [])
    // marca quais já estão no board
    if (data?.length) {
      const cnpjs = data.map((d) => d.cnpj)
      const { data: cards } = await supabase.from('crm_cards').select('cnpj').in('cnpj', cnpjs)
      setNoBoard(new Set((cards || []).map((c) => c.cnpj)))
    }
    setCarregando(false)
  }

  useEffect(() => { buscar() }, []) // eslint-disable-line

  async function adicionar(empresa) {
    const { error } = await supabase.from('crm_cards').insert({ cnpj: empresa.cnpj, status: 'lead' })
    if (error) { setMsg('Não foi possível adicionar: ' + error.message); return }
    setNoBoard((s) => new Set(s).add(empresa.cnpj))
    aoAdicionar?.()
    setMsg(`"${empresa.razao_social}" adicionada ao pipeline.`)
  }

  return (
    <div className="dir">
      <form className="busca" onSubmit={buscar}>
        <input
          placeholder="Buscar por razão social, nome fantasia ou município…"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <select value={uf} onChange={(e) => setUf(e.target.value)}>
          {UFS.map((u) => <option key={u} value={u}>{u || 'UF'}</option>)}
        </select>
        <button type="submit">Buscar</button>
      </form>

      {msg && <p className="msg">{msg}</p>}
      {carregando && <p className="msg">Carregando…</p>}

      <div className="tabela">
        {linhas.map((l) => (
          <div className="linha" key={l.cnpj}>
            <div className="linha-info">
              <strong>{l.razao_social}</strong>
              {l.nome_fantasia && <span className="fantasia"> · {l.nome_fantasia}</span>}
              <div className="sub">
                {l.telefone} {l.email && `· ${l.email}`} · {l.municipio}/{l.uf}
              </div>
              <div className="cnae">{l.cnae_descricao}</div>
            </div>
            {noBoard.has(l.cnpj) ? (
              <button className="add feito" disabled>No pipeline ✓</button>
            ) : (
              <button className="add" onClick={() => adicionar(l)}>+ Adicionar</button>
            )}
          </div>
        ))}
        {!carregando && !linhas.length && <p className="msg">Nenhuma empresa encontrada.</p>}
      </div>
    </div>
  )
}
