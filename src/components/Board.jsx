import { useCallback, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { supabase, ESTAGIOS } from '../supabaseClient.js'
import CardModal from './CardModal.jsx'

export default function Board({ refreshKey }) {
  const [cards, setCards] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [selecionado, setSelecionado] = useState(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    const { data, error } = await supabase
      .from('crm_cards')
      .select('id, cnpj, status, notas, updated_at, empresa:empresas_varejo(razao_social, nome_fantasia, telefone, email, uf, municipio)')
      .order('updated_at', { ascending: false })
    if (error) setErro(error.message)
    else setCards(data || [])
    setCarregando(false)
  }, [])

  useEffect(() => { carregar() }, [carregar, refreshKey])

  async function aoSoltar(resultado) {
    const { destination, source, draggableId } = resultado
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const novoStatus = destination.droppableId
    // otimista
    setCards((prev) => prev.map((c) => (c.id === draggableId ? { ...c, status: novoStatus } : c)))
    const { error } = await supabase
      .from('crm_cards')
      .update({ status: novoStatus, updated_at: new Date().toISOString() })
      .eq('id', draggableId)
    if (error) { setErro(error.message); carregar() }
  }

  async function salvarNotas(id, notas) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, notas } : c)))
    await supabase.from('crm_cards').update({ notas, updated_at: new Date().toISOString() }).eq('id', id)
  }

  async function removerCard(id) {
    setCards((prev) => prev.filter((c) => c.id !== id))
    setSelecionado(null)
    await supabase.from('crm_cards').delete().eq('id', id)
  }

  if (carregando) return <p className="msg">Carregando pipeline…</p>
  if (erro) return <p className="msg erro">Erro: {erro}</p>
  if (!cards.length)
    return <p className="msg">Seu pipeline está vazio. Vá em "Buscar empresas" e adicione empresas.</p>

  return (
    <>
      <DragDropContext onDragEnd={aoSoltar}>
        <div className="board">
          {ESTAGIOS.map((est) => {
            const doEstagio = cards.filter((c) => c.status === est.id)
            return (
              <Droppable droppableId={est.id} key={est.id}>
                {(prov, snap) => (
                  <div className={`coluna ${snap.isDraggingOver ? 'sobre' : ''}`}>
                    <div className="coluna-topo" style={{ borderColor: est.cor }}>
                      <span className="ponto" style={{ background: est.cor }} />
                      {est.titulo}
                      <span className="contador">{doEstagio.length}</span>
                    </div>
                    <div className="coluna-corpo" ref={prov.innerRef} {...prov.droppableProps}>
                      {doEstagio.map((c, i) => (
                        <Draggable draggableId={c.id} index={i} key={c.id}>
                          {(p, s) => (
                            <div
                              className={`card ${s.isDragging ? 'arrastando' : ''}`}
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              onClick={() => setSelecionado(c)}
                            >
                              <strong>{c.empresa?.razao_social || c.cnpj}</strong>
                              {c.empresa?.nome_fantasia && (
                                <div className="fantasia">{c.empresa.nome_fantasia}</div>
                              )}
                              <div className="sub">{c.empresa?.telefone}</div>
                              <div className="sub cidade">
                                {c.empresa?.municipio}/{c.empresa?.uf}
                              </div>
                              {c.notas && <div className="tem-nota">📝</div>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {prov.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>

      {selecionado && (
        <CardModal
          card={selecionado}
          onClose={() => setSelecionado(null)}
          onSalvar={salvarNotas}
          onRemover={removerCard}
        />
      )}
    </>
  )
}
