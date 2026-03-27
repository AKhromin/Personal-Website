import React, { useState, useCallback, useEffect, useRef } from 'react';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function createBoard() {
  const board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

  // Place mines
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  // Calculate adjacent counts
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].adjacent = count;
    }
  }

  return board;
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function revealCell(board, r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  if (board[r][c].revealed || board[r][c].flagged) return;

  board[r][c].revealed = true;

  if (board[r][c].adjacent === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(board, r + dr, c + dc);
      }
    }
  }
}

function checkWin(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].mine && !board[r][c].revealed) return false;
    }
  }
  return true;
}

const NUM_COLORS = [
  '',
  '#2563eb', // 1 blue
  '#16a34a', // 2 green
  '#dc2626', // 3 red
  '#7c3aed', // 4 purple
  '#b91c1c', // 5 dark red
  '#0891b2', // 6 teal
  '#1e1e2e', // 7 black
  '#6b7280', // 8 gray
];

function MinesweeperGame() {
  const [board, setBoard] = useState(() => createBoard());
  const [gameState, setGameState] = useState('playing'); // playing | won | lost
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && gameState === 'playing') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, gameState]);

  const restart = useCallback(() => {
    setBoard(createBoard());
    setGameState('playing');
    setFlagCount(0);
    setTimer(0);
    setStarted(false);
    clearInterval(timerRef.current);
  }, []);

  const handleClick = useCallback(
    (r, c) => {
      if (gameState !== 'playing') return;
      if (board[r][c].flagged || board[r][c].revealed) return;

      if (!started) setStarted(true);

      const newBoard = cloneBoard(board);

      if (newBoard[r][c].mine) {
        // Reveal all mines
        for (let rr = 0; rr < ROWS; rr++) {
          for (let cc = 0; cc < COLS; cc++) {
            if (newBoard[rr][cc].mine) newBoard[rr][cc].revealed = true;
          }
        }
        newBoard[r][c].exploded = true;
        setBoard(newBoard);
        setGameState('lost');
        return;
      }

      revealCell(newBoard, r, c);
      setBoard(newBoard);

      if (checkWin(newBoard)) {
        setGameState('won');
      }
    },
    [board, gameState, started]
  );

  const handleRightClick = useCallback(
    (e, r, c) => {
      e.preventDefault();
      if (gameState !== 'playing') return;
      if (board[r][c].revealed) return;

      if (!started) setStarted(true);

      const newBoard = cloneBoard(board);
      newBoard[r][c].flagged = !newBoard[r][c].flagged;
      setBoard(newBoard);
      setFlagCount((prev) => prev + (newBoard[r][c].flagged ? 1 : -1));
    },
    [board, gameState, started]
  );

  const smiley = gameState === 'won' ? '😎' : gameState === 'lost' ? '💀' : '🙂';

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-header">
        <div className="minesweeper-counter">💣 {MINES - flagCount}</div>
        <button className="minesweeper-smiley" onClick={restart}>
          {smiley}
        </button>
        <div className="minesweeper-counter">⏱ {String(timer).padStart(3, '0')}</div>
      </div>

      {gameState === 'won' && (
        <div className="minesweeper-banner won">🎉 You Win!</div>
      )}
      {gameState === 'lost' && (
        <div className="minesweeper-banner lost">💥 Game Over</div>
      )}

      <div className="minesweeper-grid">
        {board.map((row, r) => (
          <div key={r} className="minesweeper-row">
            {row.map((cell, c) => {
              let className = 'minesweeper-cell';
              let content = '';

              if (cell.revealed) {
                className += ' revealed';
                if (cell.mine) {
                  content = '💣';
                  if (cell.exploded) className += ' exploded';
                } else if (cell.adjacent > 0) {
                  content = cell.adjacent;
                }
              } else if (cell.flagged) {
                content = '🚩';
              }

              return (
                <button
                  key={c}
                  className={className}
                  onClick={() => handleClick(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  style={
                    cell.revealed && !cell.mine && cell.adjacent > 0
                      ? { color: NUM_COLORS[cell.adjacent], fontWeight: 700 }
                      : undefined
                  }
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="minesweeper-footer">
        <span>Left-click: Reveal</span>
        <span>Right-click: Flag</span>
      </div>
    </div>
  );
}

export default MinesweeperGame;
