import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameSettings, Question, Team, GameResult, Operation } from '../types';
import { generateQuestion } from '../services/gameLogic';
import { audioService } from '../services/audioService';
import { ROPE_MOVEMENT_PERCENT, STREAK_BONUS_PERCENT, STREAK_THRESHOLD, QUESTION_TIMER_SECONDS } from '../constants';

// Define components inside this file to avoid cyclical dependencies and keep related logic together.
// This is a valid pattern for components that are only used by GamePage.

const Rope: React.FC<{ position: number; animationTrigger: { key: number; team: Team } }> = ({ position, animationTrigger }) => {
    const [pullAnimationClass, setPullAnimationClass] = useState('');
    const [joltAnimationClass, setJoltAnimationClass] = useState('');

    useEffect(() => {
        if (animationTrigger.key === 0) return; // Don't run on initial render

        const teamClass = animationTrigger.team === Team.Red ? 'origin-left' : 'origin-right';
        setPullAnimationClass(`animate-pull ${teamClass}`);
        
        const joltClass = animationTrigger.team === Team.Red ? 'animate-rope-jolt-red' : 'animate-rope-jolt-blue';
        setJoltAnimationClass(joltClass);
        
        const timer = setTimeout(() => {
            setPullAnimationClass('');
            setJoltAnimationClass('');
        }, 500); // Animation duration matches CSS
        
        return () => clearTimeout(timer);
    }, [animationTrigger]);

    // Conditional class for the rope paths
    const ropePathClass = joltAnimationClass || 'animate-rope-wobble';

    return (
        <div className="w-full max-w-4xl bg-black/30 p-2 rounded-full mb-4">
            <div className="relative h-6">
                <svg width="100%" height="100%" viewBox="0 0 1000 24" className="absolute top-0 left-0 overflow-visible">
                    <g className={pullAnimationClass}>
                        {/* Shadow */}
                        <path d="M 0 12 C 300 24, 700 0, 1000 12" stroke="rgba(0,0,0,0.2)" strokeWidth="5" fill="none" className={`filter blur-sm ${ropePathClass}`} />
                        {/* Rope */}
                        <path d="M 0 12 C 300 24, 700 0, 1000 12" stroke="url(#ropeGradient)" strokeWidth="4" fill="none" strokeLinecap="round" className={ropePathClass} />
                    </g>
                    <defs>
                        <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Center Marker */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shadow-lg transition-all duration-500 ease-out"
                    style={{ left: `calc(${position}% - 16px)` }}
                />
            </div>
        </div>
    );
};


const Character: React.FC<{ team: Team; status: 'idle' | 'happy' | 'sad' }> = ({ team, status }) => {
    const teamData = {
        [Team.Red]: { emoji: '🔥', baseClass: 'text-red-400' },
        [Team.Blue]: { emoji: '❄️', baseClass: 'text-blue-400' },
    };

    const animationClass = useMemo(() => {
        switch(status) {
            case 'happy': return 'animate-celebrate';
            case 'sad': return 'animate-sad';
            default: return 'animate-float';
        }
    }, [status]);

    return (
        <div className={`text-7xl md:text-8xl ${teamData[team].baseClass} ${animationClass}`}>
            {teamData[team].emoji}
        </div>
    );
};

const Keypad: React.FC<{ onKeyPress: (key: string) => void; team: Team }> = ({ onKeyPress, team }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '-'];
    const teamColors = {
        [Team.Red]: 'bg-red-500/80 hover:bg-red-500',
        [Team.Blue]: 'bg-blue-500/80 hover:bg-blue-500',
    };

    return (
        <div className="grid grid-cols-3 gap-2 p-2">
            {keys.map(key => (
                <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className={`rounded-lg p-3 text-2xl font-bold transition-transform active:scale-95 shadow-md ${teamColors[team]}`}
                >
                    {key === 'C' ? 'Hapus' : key}
                </button>
            ))}
        </div>
    );
};

const TeamPanel: React.FC<{
    team: Team;
    score: number;
    streak: number;
    answer: string;
    onKeyPress: (key: string) => void;
    onSubmit: () => void;
    status: 'idle' | 'happy' | 'sad';
    isActive: boolean;
}> = ({ team, score, streak, answer, onKeyPress, onSubmit, status, isActive }) => {
    const teamData = {
        [Team.Red]: {
            name: 'Tim Merah',
            gradient: 'from-red-500 to-orange-500',
            buttonVariant: 'danger' as 'danger',
            borderColor: 'border-red-400'
        },
        [Team.Blue]: {
            name: 'Tim Biru',
            gradient: 'from-blue-500 to-cyan-400',
            buttonVariant: 'primary' as 'primary', // A bit of a trick for colors
             borderColor: 'border-blue-400'
        },
    };
    const { name, gradient, borderColor } = teamData[team];

    return (
        <div className={`bg-white/10 p-4 rounded-2xl flex flex-col items-center gap-4 border-2 ${isActive ? `${borderColor} animate-pulse` : 'border-transparent'}`}>
            <div className={`w-full p-2 rounded-lg bg-gradient-to-r ${gradient} text-center`}>
                <h2 className="text-2xl font-bold">{name}</h2>
            </div>
            <Character team={team} status={status} />
            <div className="text-center">
                <p className="text-lg">Skor: <span className="font-bold text-3xl">{score}</span></p>
                {streak >= STREAK_THRESHOLD && (
                    <p className="text-yellow-400 font-bold animate-pulse">Streak {streak}x! 🔥</p>
                )}
            </div>
            <div className="bg-black/30 w-full h-16 rounded-md flex items-center justify-center text-4xl font-mono tracking-widest">
                {answer || '...'}
            </div>
            <Keypad onKeyPress={onKeyPress} team={team} />
            <button onClick={onSubmit} className={`w-full p-3 text-lg font-bold rounded-lg transition-transform active:scale-95 ${team === Team.Red ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                Kirim Jawaban
            </button>
        </div>
    );
};


interface GamePageProps {
  settings: GameSettings;
  onGameEnd: (result: GameResult) => void;
}

const GamePage: React.FC<GamePageProps> = ({ settings, onGameEnd }) => {
    const [gameState, setGameState] = useState<'playing' | 'paused' | 'finished'>('playing');
    const [question, setQuestion] = useState<Question | null>(null);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // Team states
    const [redScore, setRedScore] = useState(0);
    const [blueScore, setBlueScore] = useState(0);
    const [redStreak, setRedStreak] = useState(0);
    const [blueStreak, setBlueStreak] = useState(0);
    const [redAnswer, setRedAnswer] = useState('');
    const [blueAnswer, setBlueAnswer] = useState('');
    const [redStatus, setRedStatus] = useState<'idle' | 'happy' | 'sad'>('idle');
    const [blueStatus, setBlueStatus] = useState<'idle' | 'happy' | 'sad'>('idle');
    const [activeTeam, setActiveTeam] = useState<Team>(Team.Red);

    // Game mechanics state
    const [ropePosition, setRopePosition] = useState(50); // 50% is center
    const [ropeAnimation, setRopeAnimation] = useState({ key: 0, team: Team.Red as Team });
    const [gameTimer, setGameTimer] = useState(settings.duration);
    const [questionTimer, setQuestionTimer] = useState(QUESTION_TIMER_SECONDS);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);

    const nextQuestion = useCallback(() => {
        if (questionsAnswered >= settings.questionCount) {
            setGameState('finished');
            return;
        }
        setQuestion(generateQuestion(settings));
        setRedAnswer('');
        setBlueAnswer('');
        setQuestionTimer(QUESTION_TIMER_SECONDS);
        setActiveTeam(prev => prev === Team.Red ? Team.Blue : Team.Red);
    }, [settings, questionsAnswered]);
    
    useEffect(() => {
        audioService.playGameStartSound();
        nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Timers
    useEffect(() => {
        if (gameState !== 'playing') return;

        const gameInterval = setInterval(() => {
            setGameTimer(prev => {
                if (prev <= 1) {
                    setGameState('finished');
                    clearInterval(gameInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const questionInterval = setInterval(() => {
            setQuestionTimer(prev => {
                if(prev > 1 && prev <= 6) audioService.playTickSound();
                if (prev <= 1) {
                    // Time's up for the question
                    (activeTeam === Team.Red ? setRedStreak : setBlueStreak)(0);
                    (activeTeam === Team.Red ? setRedStatus : setBlueStatus)('sad');
                    setTimeout(() => (activeTeam === Team.Red ? setRedStatus : setBlueStatus)('idle'), 500);
                    nextQuestion();
                    return QUESTION_TIMER_SECONDS;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(gameInterval);
            clearInterval(questionInterval);
        };
    }, [gameState, nextQuestion, activeTeam]);

    // Game End Logic
    useEffect(() => {
        if (gameState === 'finished' || ropePosition <= 0 || ropePosition >= 100) {
            setGameState('finished');
            let winner: Team | 'Draw';
            if (ropePosition <= 0) winner = Team.Red;
            else if (ropePosition >= 100) winner = Team.Blue;
            else if (redScore > blueScore) winner = Team.Red;
            else if (blueScore > redScore) winner = Team.Blue;
            else winner = 'Draw';

            if(winner !== 'Draw') audioService.playWinSound();

            onGameEnd({
                id: new Date().toISOString(),
                redScore,
                blueScore,
                totalQuestions: questionsAnswered,
                correctAnswers,
                accuracy: questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0,
                duration: settings.duration - gameTimer,
                operations: settings.operations,
                timestamp: Date.now(),
                winner,
            });
        }
    }, [gameState, ropePosition, redScore, blueScore, questionsAnswered, correctAnswers, settings, gameTimer, onGameEnd]);

    const handleAnswerSubmission = (team: Team) => {
        if (team !== activeTeam || gameState !== 'playing') return;

        const answerStr = team === Team.Red ? redAnswer : blueAnswer;
        if (answerStr === '') return;

        const answerNum = parseInt(answerStr, 10);
        const isCorrect = answerNum === question?.answer;
        
        setQuestionsAnswered(prev => prev + 1);

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setRopeAnimation({ key: Date.now(), team });
            const streak = (team === Team.Red ? redStreak : blueStreak) + 1;
            let move = ROPE_MOVEMENT_PERCENT;
            if (streak >= STREAK_THRESHOLD) {
                move += STREAK_BONUS_PERCENT;
                audioService.playStreakSound();
            } else {
                audioService.playCorrectSound();
            }

            setRopePosition(prev => team === Team.Red ? Math.max(0, prev - move) : Math.min(100, prev + move));
            if (team === Team.Red) {
                setRedScore(s => s + 1);
                setRedStreak(streak);
                setRedStatus('happy');
                setBlueStreak(0);
            } else {
                setBlueScore(s => s + 1);
                setBlueStreak(streak);
                setBlueStatus('happy');
                setRedStreak(0);
            }
            setFeedback({ message: 'Benar!', color: 'text-green-400' });
        } else {
            audioService.playWrongSound();
            if (team === Team.Red) {
                setRedStreak(0);
                setRedStatus('sad');
            } else {
                setBlueStreak(0);
                setBlueStatus('sad');
            }
            setFeedback({ message: `Salah! Jawaban: ${question?.answer}`, color: 'text-red-400' });
        }
        
        setTimeout(() => {
            setRedStatus('idle');
            setBlueStatus('idle');
            setFeedback(null);
            nextQuestion();
        }, 1500);
    };

    const handleKeyPress = (team: Team, key: string) => {
        if (team !== activeTeam) return;
        const setAnswer = team === Team.Red ? setRedAnswer : setBlueAnswer;

        setAnswer(prev => {
            if (key === 'C') return '';
            if (key === '-' && prev.length === 0) return '-';
            if (key !== '-' && !isNaN(parseInt(key, 10))) {
                if (prev.length < 4) return prev + key;
            }
            return prev;
        });
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {/* Top Bar */}
            <div className="w-full max-w-4xl grid grid-cols-3 items-center text-center mb-2">
                <div className="text-lg md:text-xl font-bold">Soal: {Math.min(questionsAnswered + 1, settings.questionCount)}/{settings.questionCount}</div>
                <div className="text-2xl md:text-4xl font-bold">{formatTime(gameTimer)}</div>
                <div className={`text-xl md:text-3xl font-bold transition-colors ${questionTimer <= 5 ? 'text-red-500' : ''}`}>
                    00:{questionTimer < 10 ? '0' : ''}{questionTimer}
                </div>
            </div>

            {/* Rope */}
            <Rope position={ropePosition} animationTrigger={ropeAnimation} />

            {/* Question & Feedback */}
            <div className="relative h-24 w-full max-w-md flex items-center justify-center">
                 {feedback ? (
                    <div className={`text-4xl font-bold text-center ${feedback.color} transition-opacity`}>
                        {feedback.message}
                    </div>
                ) : (
                    <div className="text-4xl md:text-5xl font-bold text-center">
                        {question?.text}
                    </div>
                )}
            </div>

            {/* Team Panels */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
                <TeamPanel
                    team={Team.Red}
                    score={redScore}
                    streak={redStreak}
                    answer={redAnswer}
                    onKeyPress={(key) => handleKeyPress(Team.Red, key)}
                    onSubmit={() => handleAnswerSubmission(Team.Red)}
                    status={redStatus}
                    isActive={activeTeam === Team.Red && gameState === 'playing'}
                />
                <TeamPanel
                    team={Team.Blue}
                    score={blueScore}
                    streak={blueStreak}
                    answer={blueAnswer}
                    onKeyPress={(key) => handleKeyPress(Team.Blue, key)}
                    onSubmit={() => handleAnswerSubmission(Team.Blue)}
                    status={blueStatus}
                    isActive={activeTeam === Team.Blue && gameState === 'playing'}
                />
            </div>
        </div>
    );
};

export default GamePage;