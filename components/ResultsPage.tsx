
import React from 'react';
import { GameResult, Team } from '../types';
import Button from './Button';
import Card from './Card';

interface ResultsPageProps {
  lastResult: GameResult | null;
  history: GameResult[];
  onPlayAgain: () => void;
  onHome: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ lastResult, history, onPlayAgain, onHome }) => {
  const winnerText = lastResult
    ? lastResult.winner === 'Draw' ? 'Permainan Seri!' : `Tim ${lastResult.winner === Team.Red ? 'Merah' : 'Biru'} Menang!`
    : 'Riwayat Permainan';
  
  const winnerColor = lastResult
    ? lastResult.winner === Team.Red ? 'text-red-400' : lastResult.winner === Team.Blue ? 'text-blue-400' : 'text-yellow-400'
    : 'text-white';

  const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline">
      <span className="text-white/70">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {lastResult && (
        <Card>
          <h2 className={`text-4xl font-bold text-center mb-2 ${winnerColor}`}>{winnerText}</h2>
          <p className="text-center text-2xl mb-6 font-bold">
            <span className="text-red-400">{lastResult.redScore}</span> - <span className="text-blue-400">{lastResult.blueScore}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <StatItem label="Akurasi" value={`${lastResult.accuracy}%`} />
            <StatItem label="Total Soal" value={`${lastResult.correctAnswers}/${lastResult.totalQuestions}`} />
            <StatItem label="Durasi" value={`${Math.floor(lastResult.duration / 60)}m ${lastResult.duration % 60}d`} />
            <StatItem label="Operasi" value={lastResult.operations.join(', ')} />
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onPlayAgain}>Main Lagi</Button>
        <Button onClick={onHome} variant="secondary">Kembali ke Beranda</Button>
      </div>
      
      {history.length > 0 && (
        <Card>
          <h3 className="text-2xl font-bold text-center mb-4">Riwayat</h3>
           {history.length >= 990 && <p className="text-center text-yellow-400 mb-4">Peringatan: Riwayat permainan hampir penuh ({history.length}/{999}).</p>}
          <div className="max-h-64 overflow-y-auto pr-2">
            <ul className="space-y-2">
              {history.map(game => (
                <li key={game.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center text-sm">
                  <div>
                    <span className={`font-bold ${game.winner === Team.Red ? 'text-red-400' : game.winner === Team.Blue ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {game.winner === 'Draw' ? 'Seri' : `Tim ${game.winner === Team.Red ? 'Merah' : 'Biru'}`}
                    </span>
                    <span className="ml-2 text-white/70">{new Date(game.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="font-mono text-base">
                    <span className="text-red-400">{game.redScore}</span>:<span className="text-blue-400">{game.blueScore}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResultsPage;
