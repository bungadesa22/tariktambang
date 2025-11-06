
import React from 'react';
import Button from './Button';
import Card from './Card';

interface HomePageProps {
  onStart: () => void;
  onResults: () => void;
  hasHistory: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onResults, hasHistory }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold mb-2 tracking-tighter">
        Tarik Tambang <span className="text-yellow-400">Matematika</span>
      </h1>
      <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl">
        Uji kecepatan berhitungmu dalam pertarungan sengit! Jawab soal dengan benar untuk menarik tali dan menangkan permainan.
      </p>
      <Card className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Button onClick={onStart}>Mulai Permainan</Button>
          {hasHistory && <Button onClick={onResults} variant="secondary">Hasil Permainan</Button>}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
