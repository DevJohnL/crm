import { useState } from 'react'

export default function CardModal({ card, onClose, onSalvar, onRemover }) {
  const [notas, setNotas] = useState(card.notas || '')
  const emp = card.empresa || {}

  return (
    <div className="modal-fundo" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={onClose}>×</button>
        <h2>{emp.razao_social || card.cnpj}</h2>
        {emp.nome_fantasia && <p className="fantasia">{emp.nome_fantasia}</p>}

        <dl className="dados">
          <div><dt>Telefone</dt><dd>{emp.telefone || '—'}</dd></div>
          <div><dt>E-mail</dt><dd>{emp.email || '—'}</dd></div>
          <div><dt>Cidade</dt><dd>{emp.municipio}/{emp.uf}</dd></div>
          <div><dt>CNPJ</dt><dd>{card.cnpj}</dd></div>
        </dl>

        <label className="rotulo">Anotações</label>
        <textarea
          rows={6}
          value={notas}
          placeholder="Histórico de contato, próximos passos…"
          onChange={(e) => setNotas(e.target.value)}
        />

        <div className="modal-acoes">
          <button className="remover" onClick={() => onRemover(card.id)}>
            Remover do pipeline
          </button>
          <button className="salvar" onClick={() => { onSalvar(card.id, notas); onClose() }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
