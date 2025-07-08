import './style.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, Skeleton, Image, CardFooter, Chip, CardHeader, CardBody, Divider, Button } from '@heroui/react';
import type { Set } from '../../types/set';
import { motion } from 'framer-motion';
import turnIcon from '../../assets/turnIcon.svg';

function Cards() {
    const navigate = useNavigate();
    const { setCode } = useParams<{ setCode: string }>();
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();
    const setData: Set = location.state.setData;

    const toggleLoad = () => setIsLoaded(!isLoaded);

    function openSetCards(setCode: string, setData: Set): void {
        navigate(`/cards/${setCode}`, { state: { setData } });
    }

    const handleSetPress = (set: Set) => openSetCards(set.code, set);
    const handleChildPress = (childSet: Set, parentSet: Set) => openSetCards(childSet.code, parentSet);

    useEffect(() => {
        resetScroll();
        if (setCode) fetchSetCards(setCode);
    }, [setCode]);

    function resetScroll() {
        window.scrollTo(0, 0);
    }

    function getRarityColor(rarity: string) {
        switch (rarity.toLowerCase()) {
            case 'common': return 'bg-gray-600';
            case 'uncommon': return 'bg-[#8fabb7]';
            case 'rare': return 'bg-[#b4a165]';
            case 'mythic': return 'bg-[#d46221]';
        }
    }

    const [cards, setCards] = useState<Card[]>([]);

    interface cardImages {
        small: string;
        normal: string;
        large: string;
        png: string;
        border_crop: string;
        art_crop: string;
    }

    interface cardFace {
        image_uris: cardImages;
    }

    interface Card {
        id: string;
        name: string;
        rarity: string;
        image_uris: cardImages;
        card_faces: cardFace[];
        multifaced: boolean;
        currentFace: number;
    }

    function getChildName(childName: string, setName: string): string {
        let baseString = childName;
        if (baseString.includes("Alchemy")) return "Alchemy";
        baseString = baseString.replace(setName, "").replace(":", "");
        return baseString;
    }

    async function fetchSetCards(setCode: string): Promise<void> {
        try {
            const response = await api.get(`/cards/${setCode}`);
            const cardsWithFaces = response.data.map((card: Card) => ({
                ...card,
                multifaced: card.card_faces && card.card_faces.length > 0,
                currentFace: 0,
            }));
            setCards(cardsWithFaces);
            toggleLoad();
        } catch (error) {
            console.error('Erro ao buscar cartas:', error);
        }
    }

    function getCardImage(cardData: Card, faceIndex: number = 0) {
        if (cardData.multifaced) {
            return (
                cardData.card_faces[faceIndex]?.image_uris?.normal ||
                cardData.card_faces[faceIndex]?.image_uris?.small ||
                cardData.card_faces[0]?.image_uris?.normal
            );
        }
        return cardData.image_uris?.png || cardData.image_uris?.normal || "";
    }

    function toggleCardFace(cardToToggle: Card) {
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === cardToToggle.id
                    ? { ...card, currentFace: card.currentFace === 1 ? 0 : 1 }
                    : card
            )
        );
    }

    return (
        <div>
            <div className='flex justify-center items-center'>
                <Card className="max-w-[400px] my-5">
                    <CardHeader className="flex gap-2 px-3">
                        <Image src={setData.icon_svg_uri} className='w-[48px] h-[48px] invert' />
                        <h2 className='text-lg'>{setData.name}</h2>
                    </CardHeader>

                    <Divider />

                    <CardBody>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-auto max-h-[14rem]'>
                            {setData.children.map((childItem) => (
                                <Button
                                    key={childItem.code}
                                    variant="bordered"
                                    className="w-full text-left"
                                    title={getChildName(childItem.name, setData.name)}
                                    onPress={() => handleChildPress(childItem, setData)}
                                >
                                    <span className="block w-full truncate font-semibold">
                                        {getChildName(childItem.name, setData.name)}
                                    </span>
                                </Button>
                            ))}
                            <Button className='bg-gray-100 text-gray-900 font-semibold'
                                onPress={() => handleSetPress(setData)}>
                                Base Set
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="flex justify-center items-center min-h-screen py-4">
                {!isLoaded ? (
                    <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 content-center">
                        {[...Array(40)].map((_, i) => (
                            <Skeleton className='w-[250px] h-[350px] rounded-lg opacity-40' key={i} isLoaded={false} />
                        ))}
                    </div>
                ) : (
                    <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 content-center mx-40">
                        {cards.map((card) => (
                            <Card key={card.id} className="w-[250px] h-[400px] flex flex-col overflow-hidden relative">
                                {/* Card Flip Section */}
                                <div className="relative perspective-1000 w-full h-[350px]">
                                    <motion.div
                                        key={card.id + '-' + card.currentFace}
                                        initial={{ rotateY: card.currentFace === 0 ? 180 : 0 }}
                                        animate={{ rotateY: card.currentFace === 0 ? 0 : 180 }}
                                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            width: '100%',
                                            height: '100%',
                                            position: 'relative'
                                        }}
                                    >
                                        <motion.div
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        >
                                            <Image
                                                src={getCardImage(card, 0)}
                                                alt={card.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </motion.div>

                                        {card.multifaced && (
                                            <motion.div
                                                style={{
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)',
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            >
                                                <Image src={getCardImage(card, 1)}
                                                    alt={card.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Flip Button */}
                                    {card.multifaced && (
                                        <CardBody className="flex justify-end bg-transparent border-0 overflow-hidden py-1 absolute top-1 right-1 w-[calc(100%_-_8px)] rounded-large z-10 items-end">
                                            <Button onPress={() => toggleCardFace(card)}
                                                className="right-1 backdrop-blur-sm bg-black/20 rounded-lg flex items-center justify-center py-4"
                                                color="default"
                                                radius="lg"
                                                size="sm"
                                                variant="flat"
                                                style={{ width: 20, height: 20 }}
                                            >
                                                <Image src={turnIcon} alt="Turn Icon" className="w-[20px] h-[20px] invert" />
                                            </Button>
                                        </CardBody>
                                    )}
                                </div>

                                {/* Static Footer */}
                                <CardFooter className="h-[50px] px-3 py-2 z-10">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-sm font-semibold truncate">{card.name}</span>
                                        <Chip variant="flat" className={getRarityColor(card.rarity)}>
                                            <span className='font-semibold text-xs'>
                                                {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                                            </span>
                                        </Chip>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cards;
