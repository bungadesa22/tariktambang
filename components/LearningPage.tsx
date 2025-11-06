
import React from 'react';
import Button from './Button';
import Card from './Card';

interface LearningPageProps {
  onBack: () => void;
}

const learningMaterials = [
  {
    title: 'Strategi "Buat 10"',
    description: 'Pecah angka untuk membuat 10, lalu tambahkan sisanya. Contoh: 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.',
    icon: '💡',
  },
  {
    title: 'Garis Bilangan Mental',
    description: 'Bayangkan sebuah garis bilangan. Saat menambah, bergerak ke kanan. Saat mengurangi, bergerak ke kiri.',
    icon: '↔️',
  },
  {
    title: 'Kelompok Benda',
    description: 'Visualisasikan soal sebagai kelompok benda. Contoh: 5 apel ditambah 3 apel menjadi 8 apel.',
    icon: '🍎',
  },
  {
    title: 'Fakta Dasar',
    description: 'Hafalkan pasangan angka penting, seperti pasangan yang jumlahnya 10 (1+9, 2+8, dst.) untuk mempercepat perhitungan.',
    icon: '🧠',
  },
];

const LearningPage: React.FC<LearningPageProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">Materi Pembelajaran</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {learningMaterials.map((item) => (
          <Card key={item.title} className="flex flex-col items-start">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">{item.title}</h3>
            <p className="text-white/80">{item.description}</p>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button onClick={onBack} variant="secondary">Kembali ke Beranda</Button>
      </div>
    </div>
  );
};

export default LearningPage;
