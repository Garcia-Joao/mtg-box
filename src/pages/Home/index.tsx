import './style.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';

interface SetData {
  id: string;
  name: string;
  icon_svg_uri: string;
}

interface ApiResponse {
  data: SetData[];
}

function Home() {
  const [sets, setSets] = useState<SetData[]>([]);

  useEffect(() => {
    fetchSets();
  }, []);

  async function fetchSets(): Promise<void> {
    try {
      const response = await api.get('/sets');
      setSets(response.data);
    } catch (error) {
      console.error('Erro ao buscar sets:', error);
    }
  }

  return (
    <>
      <header>
        <h1>Sets</h1>
      </header>

      <main className="container">
        <br />
        <div className="scroll-container">
          {sets.map((set) => (
            <div key={set.id} className="card">
              <div className="set-item" title={set.name}>
                <img src={set.icon_svg_uri} className="set-icon" alt={set.name} />
                <span className="set-name">{set.name}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;
