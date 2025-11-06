
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SettingsPage from './components/SettingsPage';
import GamePage from './components/GamePage';
import ResultsPage from './components/ResultsPage';
import Footer from './components/Footer';
import { Page, GameSettings, GameResult } from './types';
import { DEFAULT_SETTINGS, MAX_HISTORY_ITEMS } from './constants';
import { getHistory, saveHistory } from './services/storageService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleGameEnd = (result: GameResult) => {
    const newHistory = [result, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(newHistory);
    saveHistory(newHistory);
    setLastGameResult(result);
    setCurrentPage(Page.Results);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Settings:
        return (
          <SettingsPage
            settings={settings}
            setSettings={setSettings}
            onStartGame={() => setCurrentPage(Page.Game)}
            onBack={() => setCurrentPage(Page.Home)}
          />
        );
      case Page.Game:
        return <GamePage settings={settings} onGameEnd={handleGameEnd} />;
      case Page.Results:
        return (
          <ResultsPage
            lastResult={lastGameResult}
            history={history}
            onPlayAgain={() => setCurrentPage(Page.Settings)}
            onHome={() => setCurrentPage(Page.Home)}
          />
        );
      case Page.Home:
      default:
        return (
          <HomePage
            onStart={() => setCurrentPage(Page.Settings)}
            onResults={() => {
              setLastGameResult(null); // No specific result when viewing history from home
              setCurrentPage(Page.Results);
            }}
            hasHistory={history.length > 0}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 selection:bg-yellow-400 selection:text-indigo-900">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
