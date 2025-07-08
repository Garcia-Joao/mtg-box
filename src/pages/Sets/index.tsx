import './style.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardBody, Divider, Image,
  Popover, PopoverTrigger, PopoverContent, Button,
  Skeleton
} from "@heroui/react";
import type { Set } from '../../types/set';

function Sets() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<Set[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleLoad = () => {
    setIsLoaded(!isLoaded);
  };

  function openSetCards(setCode: string, setData : Set): void {
    navigate(`/cards/${setCode}`,{
        state : {
          setData
        }
      });
  }

  useEffect(() => {
    resetScroll();
    fetchSets();
  }, []);

  function resetScroll() {
    window.scrollTo(0, 0)
  }

  async function fetchSets(): Promise<void> {
    try {
      const response = await api.get('/sets');
      const allSets: Set[] = response.data;

      const parentItems = allSets.filter(element => !element.parent_set_code);
      const childItems = allSets.filter(element => !!element.parent_set_code);

      const parentWithChildren = parentItems.map(parent => ({
        ...parent,
        children: childItems.filter(child => child.parent_set_code === parent.code),
      }));

      setSets(parentWithChildren);

      toggleLoad();

    } catch (error) {
      console.error('Erro ao buscar sets:', error);
    }
  }

  function getChildName(childName: string, setName: string): string {
    let baseString: string
    baseString = childName

    if (baseString.includes("Alchemy"))
      return "Alchemy"

    baseString = baseString.replace(setName, "")
    baseString = baseString.replace(":", "")

    return baseString
  }

  const handleSetClick = (set: Set) => {
    openSetCards(set.code, set);
  };

  const handleChildClick = (childSet : Set, parentSet : Set) => {
    openSetCards(childSet.code, parentSet)
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-4">
      <div>
        {!isLoaded ? (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-center">
            {[...Array(40)].map((_, i) => (
              <Skeleton className='w-[320px] h-[160px] rounded-lg opacity-40' key={i} isLoaded={false} />
            ))}
          </div>
        ) : (
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-center">
            {sets.map((set) => (
              <Popover key={set.id} placement='right' className='bg-none'
                backdrop='blur'>
                <PopoverTrigger>
                  <Card
                    isPressable
                    isBlurred
                    className="border-none bg-background/60 dark:bg-default-100/50 w-80 h-50 
                            ease-in-out 
                            hover:-translate-y-2 
                            hover:shadow-2xl 
                            hover:scale-[1.02] 
                            hover:rotate-[0.5deg]"
                  >
                    <CardBody className="flex justify-center items-center h-40">
                      <div className='opacity-20 relative w-32 h-32'>
                        <Image src={set.icon_svg_uri}
                          alt={set.name}
                          className="w-32 h-32 object-contain" />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-center items-center">
                        <h2 className="text-lg font-semibold align-text-top mt-2 text-white">{set.name}</h2>
                      </div>
                    </CardBody>
                  </Card>
                </PopoverTrigger>

                <PopoverContent className='bg-transparent border-none shadow-none'>
                  <Card className='bg-white/20 border-none px-5 py-5'
                    isBlurred>
                    <div>
                      <h4 className='text-white font-semibold'>
                        {set.name}
                      </h4>
                    </div>

                    <Button className='bg-white font-semibold text-gray-800 justify-start border-transparent max-w-min my-2 px-3'
                      onPress={() => handleSetClick(set)}>
                      Open base set
                    </Button>

                    <Divider className='my-2' />

                    <div className='gap-2 grid grid-cols-3'>
                      {set.children.map((childItem) => (
                        <Button variant='bordered' className='bg-clip-text text-transparent'
                          onPress={() => handleChildClick(childItem, set)}>
                          <span className="text-white bg-clip-text font-semibold">
                            {getChildName(childItem.name, set.name)}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </Card>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sets;