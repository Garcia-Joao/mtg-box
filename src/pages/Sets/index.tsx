import './style.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {Card, CardBody, Divider, Skeleton} from "@heroui/react";

interface Set {
  id: string;
  name: string;
  code: string;
  release_date: string;
  icon_svg_uri: string;
  parent_set_code?: string;
  children: Set[];
}

function Sets() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<Set[]>([]);
  const [loadingSetId, setLoadingSetId] = useState<string | null>(null);

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
      const childItems: Set[] = allSets.filter((element) => !!element.parent_set_code);

      const parentWithChildren = parentItems.map((parent) => {
        const children = childItems.filter((child) => child.parent_set_code === parent.code);
        return { ...parent, children };
      });

      setSets(parentWithChildren);

    } catch (error) {
      console.error('Erro ao buscar sets:', error);
    }
  }

  const handleCardClick = (set: Set) => {
    setLoadingSetId(set.id);
    setTimeout(() => {
      openSetCards(set.code);
      setLoadingSetId(null);
    }, 1000);
  };

  const handleChildClick = (child: Set) => {
    setLoadingSetId(child.id);
    setTimeout(() => {
      openSetCards(child.code);
      setLoadingSetId(null);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <main className="min-h-screen text-foreground flex items-center justify-center py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg: gap-6 max-w-6xl w-full">
          {sets.map((set) => (
            <Card className="transition-transform hover:scale-[1.03] rounded-xl backdrop-blur-sm border border-white/40 bg-white/20 "
              key={set.id}
            >
              <div className="shadow-md border-white/10 p-4 flex flex-row items-start"
              onClick={() => handleCardClick(set)}>
                <img
                  src={set.icon_svg_uri}
                  alt={set.name}
                  className="w-6 object-contain invert mr-2"
                />
                <span className="text-md text-foreground truncate w-full mb-2 cursor-pointer" title={set.name}>
                  {set.name}
                </span>
              </div>
              <Divider />
              {set.children && set.children.length > 0 && (
                <CardBody>
                  {set.children.map((child) => (
                    <div
                      className='flex mb-2'
                      key={child.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChildClick(child);
                      }}
                      title={child.name}
                    >
                      <Skeleton className="rounded-lg" isLoaded={loadingSetId !== child.id}>
                        <div className='flex cursor-pointer hover:text-black text-sm'>
                          <img src={child.icon_svg_uri} className="set-icon child-icon mr-2" alt={child.name} />
                          <span>{child.name}</span>
                        </div>
                      </Skeleton>
                    </div>
                  ))}
                </CardBody>
              )}
            </Card>
          ))}
        </div>
      </main>
    </motion.div>
  );
}

export default Sets;
