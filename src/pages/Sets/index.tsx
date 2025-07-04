import './style.css';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";

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

      console.log('Parent Sets:', parentItems);
      console.log('Child Sets:', childItems);

      const parentWithChildren = parentItems.map((parent) => {
        const children = childItems.filter((child) => child.parent_set_code === parent.code);
        return { ...parent, children };
      });

      setSets(parentWithChildren);
      console.log('parentWithChildren:', parentWithChildren);

    } catch (error) {
      console.error('Erro ao buscar sets:', error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <main className="dark min-h-screen bg-gradient-to-br from-blue-800 via-gray-600 to-purple-800 text-foreground flex items-center justify-center py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          {sets.map((set) => (
            <Card
              key={set.id}
              onClick={() => openSetCards(set.code)}
              className="cursor-pointer transition-transform hover:scale-[1.03]"
            >
              <div className="bg-background/70 backdrop-blur rounded-xl shadow-md border border-white/10 p-4 h-full flex flex-col items-center text-center">
                <img
                  src={set.icon_svg_uri}
                  alt={set.name}
                  className="w-16 h-16 object-contain invert"
                />
                <span className="text-sm font-medium text-foreground truncate w-full mb-2" title={set.name}>
                  {set.name}
                </span>
                <Divider />
                {set.children && set.children.length > 0 && (
                  <div className="flex flex-col items-center mt-2">
                  {set.children.map((child) => (
                    <div
                    className='flex mb-2'
                    key={child.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      openSetCards(child.code);
                    }}
                    title={child.name}
                    >
                      <img src={child.icon_svg_uri} className="set-icon child-icon" alt={child.name} />
                      <span>{child.name}</span>
                    </div>
                  ))}
                  </div>  
              )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </motion.div>
  );
}

export default Sets;
