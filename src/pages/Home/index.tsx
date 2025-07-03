import './style.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Set {
  id: string;
  name: string;
  code: string;
  release_date: string;
  icon_svg_uri: string;
  parent_set_code?: string;
}

function Home() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<Set[]>([]);

  function openSetCards(setCode: string): void {
    navigate(`/cards/${setCode}`);
  }

  useEffect(() => {
    fetchSets();
  }, []);

  async function fetchSets(): Promise<void> {
    try {
      const response = await api.get('/sets');
      const allSets: Set[] = response.data;

      const parentItems: Set[] = allSets.filter((element) => !element.parent_set_code);

      setSets(parentItems);
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
            <div key={set.id} className="set" onClick={() => openSetCards(set.code)}>
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
