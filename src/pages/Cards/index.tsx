import './style.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Cards() {

    const { setCode } = useParams<{ setCode: string }>();

    useEffect(() => {
        if (setCode) {
            fetchSetCards(setCode);
        }
    }, [setCode]);

    const [cards, setCards] = useState<Card[]>([]);

    interface Card {
        id: string;
        name: string;
        image_uris: {
            small: string;
            normal: string;
            large: string;
            png: string;
        }
    }

    async function fetchSetCards(setCode : string): Promise<void> {
        try {
            const response = await api.get(`/cards/${setCode}`);
            setCards(response.data);
        } catch (error) {
            console.error('Erro ao buscar cartas:', error);
        }
    }


    return (
        <>
            <header>
                <div className="container">
                    {cards.map((card) => (
                        <div key={card.id} className="card">
                            <div className="card-item" title={card.name}>
                                <img src={card.image_uris?.png? card.image_uris.large : 'https://repositorio.sbrauble.com/arquivos/in/magic/480630/679c18c746aa0-m04qn-wujz4-2dce3521b28f6b3bde8cebfbcf519c1d.jpg'}
                                     className="card-image" alt="Test" />
                                <span className="card-name">{card.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </header>
        </>
    );
}

export default Cards;