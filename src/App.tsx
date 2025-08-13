import React, { useEffect, useRef, useState } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import SettingsDialog, { Settings } from './components/SettingsDialog';
import StatusBar from './components/StatusBar';
import ThinkingIndicator from './components/ThinkingIndicator';
import MoveLog from './components/MoveLog';
import { Engine } from './game/engine';
import { GameState, legalMoves } from './game/rules';
import { encode, decode } from './utils/encode';

const defaultSettings: Settings = {
  stones: 4,
  first: 0,
  level: 'medium',
  hints: false
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const engineRef = useRef(new Engine(settings.stones));
  const [state, setState] = useState<GameState>(engineRef.current.state);
  const [log, setLog] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [thinking, setThinking] = useState<{ depth: number; nodes: number } | null>(
    null
  );
  const workerRef = useRef<Worker>();
  const [hints, setHints] = useState<number[]>([]);
  const pendingHint = useRef(false);

  // setup worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('./game/ai/worker.ts', import.meta.url), {
      type: 'module'
    });
    workerRef.current.onmessage = (e) => {
      const { move, info } = e.data;
      if (pendingHint.current) {
        setHints([move]);
        pendingHint.current = false;
      } else {
        setThinking(info);
        applyMove(move);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  // load from URL hash
  useEffect(() => {
    if (location.hash.length > 1) {
      const decoded = decode(location.hash.slice(1));
      if (decoded) {
        engineRef.current.state = decoded;
        setState(decoded);
      }
    }
  }, []);

  // AI move when needed
  useEffect(() => {
    if (settings.level !== 'human' && state.player === 1) {
      workerRef.current?.postMessage({ type: 'bestMove', state, level: settings.level });
      setThinking({ depth: 0, nodes: 0 });
    }
    if (settings.hints && state.player === 0) {
      pendingHint.current = true;
      workerRef.current?.postMessage({ type: 'bestMove', state, level: 'medium' });
    } else {
      setHints([]);
    }
  }, [state, settings]);

  const applyMove = (pit: number) => {
    const res = engineRef.current.move(pit);
    setState(engineRef.current.state);
    setLog((l) => [...l, pit]);
    location.hash = encode(engineRef.current.state);
    if (res.extraTurn || res.sweep) {
      // immediate next turn
      if (settings.level !== 'human' && engineRef.current.state.player === 1) {
        workerRef.current?.postMessage({
          type: 'bestMove',
          state: engineRef.current.state,
          level: settings.level
        });
      }
    }
  };

  const onPit = (pit: number) => {
    if (state.player === 0 && legalMoves(state, 0).includes(pit)) {
      applyMove(pit);
    }
  };

  const restart = (s: Settings) => {
    engineRef.current = new Engine(s.stones);
    engineRef.current.state.player = s.first;
    setState(engineRef.current.state);
    setLog([]);
    location.hash = '';
  };

  const onSettingsClose = (s: Settings | null) => {
    setShowSettings(false);
    if (s) {
      setSettings(s);
      restart(s);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center p-2">
      <h1 className="text-2xl mb-2">Mancala</h1>
      <Board state={state} onPit={onPit} hints={hints} />
      <StatusBar state={state} />
      <ThinkingIndicator info={thinking} />
      <Controls
        onNew={() => restart(settings)}
        onUndo={() => {
          engineRef.current.undo();
          setState(engineRef.current.state);
        }}
        onRedo={() => {
          engineRef.current.redo();
          setState(engineRef.current.state);
        }}
        onSettings={() => setShowSettings(true)}
        onCopy={() => navigator.clipboard.writeText(location.href)}
      />
      <MoveLog log={log} />
      <SettingsDialog show={showSettings} settings={settings} onClose={onSettingsClose} />
    </div>
  );
};

export default App;
