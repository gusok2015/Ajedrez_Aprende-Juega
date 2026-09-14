// Chess AI Engine using Minimax with Alpha-Beta Pruning and Piece-Square Tables (PST)

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (from White's perspective; flipped for Black)
const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 27, 27, 10,  5,  5],
    [ 0,  0,  0, 25, 25,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-25,-25, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

// Evaluate position from White's perspective (+ values benefit White, - values benefit Black)
function evaluateBoard(game) {
  const board = game.board();
  let totalEval = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type];
        const pstTable = PST[piece.type];
        
        let pstVal = 0;
        if (pstTable) {
          pstVal = piece.color === 'w' ? pstTable[r][c] : pstTable[7 - r][c];
        }

        const pieceTotal = val + pstVal;
        totalEval += piece.color === 'w' ? pieceTotal : -pieceTotal;
      }
    }
  }
  return totalEval;
}

// Order moves to optimize Alpha-Beta pruning (captures first)
function orderMoves(moves) {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += 10 * PIECE_VALUES[a.captured] - PIECE_VALUES[a.piece];
    if (b.captured) scoreB += 10 * PIECE_VALUES[b.captured] - PIECE_VALUES[b.piece];
    if (a.promotion) scoreA += 900;
    if (b.promotion) scoreB += 900;
    return scoreB - scoreA;
  });
}

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(game.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(game, difficulty = 'medium') {
  const possibleMoves = game.moves({ verbose: true });
  if (possibleMoves.length === 0) return null;

  // Easy mode: 70% random move, 30% shallow evaluation
  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  const isMaximizing = game.turn() === 'w';
  const depth = difficulty === 'hard' ? 3 : (difficulty === 'medium' ? 2 : 1);

  let bestMove = null;
  let bestEval = isMaximizing ? -Infinity : Infinity;

  const orderedMoves = orderMoves(possibleMoves);

  for (const move of orderedMoves) {
    game.move(move);
    const evalVal = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing) {
      if (evalVal > bestEval) {
        bestEval = evalVal;
        bestMove = move;
      }
    } else {
      if (evalVal < bestEval) {
        bestEval = evalVal;
        bestMove = move;
      }
    }
  }

  return bestMove || possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

// Generate smart commentary/hint for chat assistant
export function getHintOrCommentary(game) {
  if (game.isCheckmate()) {
    return "¡Jaque mate! ¡La partida ha terminado!";
  }
  if (game.inCheck()) {
    return "¡Atención! ¡El Rey está en jaque!";
  }
  const turnColor = game.turn() === 'w' ? 'Blancas' : 'Negras';
  const bestMove = getBestMove(game, 'hard');
  if (bestMove) {
    return `Pista para las ${turnColor}: Considera mover la pieza de ${bestMove.from} a ${bestMove.to}.`;
  }
  return "¡Mantén el control del centro del tablero y desarrolla tus piezas!";
}
