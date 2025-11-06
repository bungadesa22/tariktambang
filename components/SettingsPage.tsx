
import React from 'react';
import { GameSettings, Operation } from '../types';
import Button from './Button';
import Card from './Card';

interface SettingsPageProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onStartGame: () => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings, onStartGame, onBack }) => {
  const handleOperationToggle = (op: Operation) => {
    const newOps = settings.operations.includes(op)
      ? settings.operations.filter((o) => o !== op)
      : [...settings.operations, op];
    if (newOps.length > 0) {
      setSettings({ ...settings, operations: newOps });
    }
  };
  
  const handleRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
        let newRange = { ...settings.numberRange, [field]: numValue };
        if (newRange.min > newRange.max) {
            newRange = field === 'min' ? { min: numValue, max: numValue } : { min: newRange.min, max: newRange.min };
        }
        setSettings({ ...settings, numberRange: newRange });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Pengaturan Permainan</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-2">Operasi Matematika</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(Operation).map((op) => (
              <button
                key={op}
                onClick={() => handleOperationToggle(op)}
                className={`p-4 rounded-lg text-2xl font-bold transition-all ${
                  settings.operations.includes(op) ? 'bg-yellow-400 text-indigo-900 ring-2 ring-white' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Rentang Angka (0-100)</label>
          <div className="flex items-center gap-4">
            <input type="number" min="0" max="100" value={settings.numberRange.min} onChange={(e) => handleRangeChange('min', e.target.value)} className="w-full bg-white/20 p-2 rounded-md text-center"/>
            <span>sampai</span>
            <input type="number" min="1" max="100" value={settings.numberRange.max} onChange={(e) => handleRangeChange('max', e.target.value)} className="w-full bg-white/20 p-2 rounded-md text-center"/>
          </div>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-lg font-semibold mb-2">Durasi Game (menit)</label>
          <select id="duration" value={settings.duration / 60} onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value) * 60})} className="w-full bg-white/20 p-3 rounded-md">
            {[1, 2, 5, 10, 15, 30].map(m => <option key={m} value={m}>{m} menit</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="questionCount" className="block text-lg font-semibold mb-2">Jumlah Soal</label>
           <select id="questionCount" value={settings.questionCount} onChange={(e) => setSettings({...settings, questionCount: parseInt(e.target.value)})} className="w-full bg-white/20 p-3 rounded-md">
            {[5, 10, 20, 30, 50].map(m => <option key={m} value={m}>{m} soal</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button onClick={onBack} variant="secondary" className="w-full">Kembali</Button>
        <Button onClick={onStartGame} className="w-full">Mulai!</Button>
      </div>
    </Card>
  );
};

export default SettingsPage;
