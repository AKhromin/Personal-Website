import React, { useState, useEffect, useRef, useCallback } from 'react';

const CELL_SIZE = 20;
const GRID_W = 20;
const GRID_H = 20;
const CANVAS_W = GRID_W * CELL_SIZE;
const CANVAS_H = GRID_H * CELL_SIZE;
const INITIAL_SPEED = 120;

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_W),
      y: Math.floor(Math.random() * GRID_H),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function SnakeGame() {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready | playing | paused | over
  const snakeRef = useRef([
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ]);
  const foodRef = useRef(randomFood(snakeRef.current));

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_W; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_H; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(CANVAS_W, y * CELL_SIZE);
      ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const brightness = Math.max(0.4, 1 - i * 0.03);
      if (isHead) {
        ctx.fillStyle = '#50fa7b';
        ctx.shadowColor = '#50fa7b';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(80, 250, 123, ${brightness})`;
        ctx.shadowBlur = 0;
      }
      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL_SIZE + pad,
        seg.y * CELL_SIZE + pad,
        CELL_SIZE - pad * 2,
        CELL_SIZE - pad * 2,
        3
      );
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const snake = [...snakeRef.current];
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
      setGameState('over');
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameState('over');
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    snake.unshift(head);

    // Food collision
    const food = foodRef.current;
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 10);
      foodRef.current = randomFood(snake);
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
  }, [draw, score]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(tick, INITIAL_SPEED);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameState, tick]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  const resetGame = useCallback(() => {
    snakeRef.current = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    setGameState('playing');
    draw();
  }, [draw]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'ready') {
          setGameState('playing');
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        } else if (gameState === 'over') {
          resetGame();
        }
        return;
      }

      const newDir = DIRECTIONS[e.key];
      if (!newDir) return;
      e.preventDefault();

      if (gameState === 'ready') setGameState('playing');

      // Prevent reversing
      const cur = dirRef.current;
      if (newDir.x + cur.x === 0 && newDir.y + cur.y === 0) return;
      nextDirRef.current = newDir;
    },
    [gameState, resetGame]
  );

  return (
    <div
      className="snake-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      <div className="snake-header">
        <span className="snake-score">Score: {score}</span>
        <span className="snake-high-score">Best: {highScore}</span>
      </div>
      <div className="snake-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="snake-canvas"
        />
        {gameState === 'ready' && (
          <div className="snake-overlay">
            <div className="snake-overlay-text">
              <span className="snake-title">🐍 Snake</span>
              <span>Press Space or arrow key to start</span>
            </div>
          </div>
        )}
        {gameState === 'paused' && (
          <div className="snake-overlay">
            <div className="snake-overlay-text">
              <span className="snake-title">⏸ Paused</span>
              <span>Press Space to resume</span>
            </div>
          </div>
        )}
        {gameState === 'over' && (
          <div className="snake-overlay">
            <div className="snake-overlay-text">
              <span className="snake-title">Game Over</span>
              <span>Score: {score}</span>
              <button className="snake-restart-btn" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="snake-footer">
        <span>Arrow Keys: Move</span>
        <span>Space: Pause</span>
      </div>
    </div>
  );
}

export default SnakeGame;
