import { useState } from 'react'
import Board from './components/Board.jsx'
import Directory from './components/Directory.jsx'

export default function App() {
  const [aba, setAba] = useState('board')
  const [refreshKey, setRefreshKey] = useState(0)

  // chamado ao adicionar uma empresa ao board (na busca) -> atualiza o board
  const aoAdicionar = () => setRefreshKey((k) => k + 1)

  return (
    <div className="app">
      <header className="topbar">
        <h1>CRM Varejo</h1>
        <nav>
          <button className={aba === 'board' ? 'ativo' : ''} onClick={() => setAba('board')}>
            Pipeline
          </button>
          <button className={aba === 'busca' ? 'ativo' : ''} onClick={() => setAba('busca')}>
            Buscar empresas
          </button>
        </nav>
      </header>

      <main>
        {aba === 'board' ? (
          <Board refreshKey={refreshKey} />
        ) : (
          <Directory aoAdicionar={aoAdicionar} irParaBoard={() => setAba('board')} />
        )}
      </main>
    </div>
  )
}
