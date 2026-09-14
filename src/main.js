import { Chess } from 'chess.js';
import { getPieceSVG } from './pieces.js';
import { getBestMove, getHintOrCommentary } from './aiEngine.js';
import { getTutorResponse, handleGameAnalysisRequest } from './tutorEngine.js';
import { sounds } from './audio.js';

// Game state
let game = new Chess();
let playerColor = 'w'; // 'w' for White, 'b' for Black
let boardFlipped = false;
let selectedSquare = null;
let validMoves = [];
let lastMove = null;
let pendingPromotion = null;

// DOM Elements
const chessboardEl = document.getElementById('chessboard');
const movesListEl = document.getElementById('moves-list');
const playerTurnBadge = document.getElementById('player-turn-badge');
const aiDifficultySelect = document.getElementById('ai-difficulty');
const capturedByWhiteEl = document.getElementById('captured-by-white');
const capturedByBlackEl = document.getElementById('captured-by-black');
const chatMessagesEl = document.getElementById('chat-messages');
const chatFormEl = document.getElementById('chat-form');
const chatInputEl = document.getElementById('chat-input');
const tutorChipsEl = document.getElementById('tutor-chips');
const promotionModalEl = document.getElementById('promotion-modal');
const promotionChoicesEl = document.getElementById('promotion-choices');

// Action Buttons
const btnAnalyzeGame = document.getElementById('btn-analyze-game');
const btnNewGame = document.getElementById('btn-new-game');
const btnFlipBoard = document.getElementById('btn-flip-board');
const btnUndo = document.getElementById('btn-undo');
const btnHint = document.getElementById('btn-hint');
const btnSound = document.getElementById('btn-sound');

// Initialize App
function init() {
  renderBoard();
  updateGameStatus();

  // Button Listeners
  if (btnAnalyzeGame) {
    btnAnalyzeGame.addEventListener('click', triggerGameAnalysis);
  }
  btnNewGame.addEventListener('click', startNewGame);
  btnFlipBoard.addEventListener('click', toggleFlipBoard);
  btnUndo.addEventListener('click', undoMove);
  btnHint.addEventListener('click', showHint);
  btnSound.addEventListener('click', toggleSound);

  chatFormEl.addEventListener('submit', handleChatSubmit);

  // Tutor Chips Click Listeners
  if (tutorChipsEl) {
    tutorChipsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (chip) {
        const query = chip.dataset.query;
        if (query) {
          processUserQuery(query);
        }
      }
    });
  }

  // Keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSelection();
      renderBoard();
    }
  });
}

// Render the 8x8 Chessboard
function renderBoard() {
  chessboardEl.innerHTML = '';

  const isFlipped = boardFlipped;
  const board = game.board();

  // King in check position
  let inCheckSquare = null;
  if (game.inCheck()) {
    const turn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          inCheckSquare = `${String.fromCharCode(97 + c)}${8 - r}`;
        }
      }
    }
  }

  for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
    for (let colIdx = 0; colIdx < 8; colIdx++) {
      // Adjust row & col indices if board is flipped
      const r = isFlipped ? 7 - rowIdx : rowIdx;
      const c = isFlipped ? 7 - colIdx : colIdx;

      const squareName = `${String.fromCharCode(97 + c)}${8 - r}`;
      const isLight = (r + c) % 2 === 0;

      const squareDiv = document.createElement('div');
      squareDiv.className = `square ${isLight ? 'light' : 'dark'}`;
      squareDiv.dataset.square = squareName;

      // Highlights
      if (selectedSquare === squareName) {
        squareDiv.classList.add('selected');
      }
      if (lastMove && (lastMove.from === squareName || lastMove.to === squareName)) {
        squareDiv.classList.add('last-move');
      }
      if (inCheckSquare === squareName) {
        squareDiv.classList.add('in-check');
      }

      // Add Coordinates (File on bottom row, Rank on left col)
      if (colIdx === 0) {
        const rankSpan = document.createElement('span');
        rankSpan.className = 'coord-rank';
        rankSpan.textContent = `${8 - r}`;
        squareDiv.appendChild(rankSpan);
      }
      if (rowIdx === 7) {
        const fileSpan = document.createElement('span');
        fileSpan.className = 'coord-file';
        fileSpan.textContent = String.fromCharCode(97 + c);
        squareDiv.appendChild(fileSpan);
      }

      // Piece rendering
      const piece = board[r][c];
      if (piece) {
        const pieceContainer = document.createElement('div');
        pieceContainer.style.width = '100%';
        pieceContainer.style.height = '100%';
        pieceContainer.style.display = 'flex';
        pieceContainer.style.alignItems = 'center';
        pieceContainer.style.justifyContent = 'center';
        pieceContainer.innerHTML = getPieceSVG(piece.type, piece.color);
        squareDiv.appendChild(pieceContainer);
      }

      // Valid move hints
      const targetMove = validMoves.find(m => m.to === squareName);
      if (targetMove) {
        const hintDiv = document.createElement('div');
        if (targetMove.captured) {
          hintDiv.className = 'move-hint-ring';
        } else {
          hintDiv.className = 'move-hint-dot';
        }
        squareDiv.appendChild(hintDiv);
      }

      // Click Event Listener
      squareDiv.addEventListener('click', () => handleSquareClick(squareName));

      chessboardEl.appendChild(squareDiv);
    }
  }
}

// Handle Square Clicks (Selecting pieces / Making moves)
function handleSquareClick(square) {
  if (game.isGameOver()) return;
  if (game.turn() !== playerColor) return; // Prevent moving during AI turn

  const piece = game.get(square);

  // If clicking on player's own piece, select it
  if (piece && piece.color === playerColor) {
    selectedSquare = square;
    const verboseMoves = game.moves({ square, verbose: true });
    validMoves = verboseMoves;
    renderBoard();
    return;
  }

  // If a piece is already selected and clicking a valid destination
  if (selectedSquare) {
    const move = validMoves.find(m => m.to === square);
    if (move) {
      // Check for pawn promotion
      if (move.flags.includes('p')) {
        pendingPromotion = move;
        showPromotionModal();
        return;
      }
      executeMove(move);
    } else {
      clearSelection();
      renderBoard();
    }
  }
}

// Execute player or AI move
function executeMove(move) {
  const result = game.move(move);
  if (!result) return;

  lastMove = result;
  clearSelection();

  // Play sound effect
  if (game.inCheck()) {
    sounds.playCheck();
  } else if (result.captured) {
    sounds.playCapture();
  } else {
    sounds.playMove();
  }

  renderBoard();
  updateGameStatus();

  // Check Game Over
  if (checkGameOver()) return;

  // Trigger AI move if it's AI turn
  if (game.turn() !== playerColor) {
    setTimeout(makeAIMove, 400);
  }
}

// Computer / AI opponent turn
function makeAIMove() {
  if (game.isGameOver()) return;

  const difficulty = aiDifficultySelect.value;
  const aiMove = getBestMove(game, difficulty);

  if (aiMove) {
    const result = game.move(aiMove);
    lastMove = result;

    if (game.inCheck()) {
      sounds.playCheck();
    } else if (result.captured) {
      sounds.playCapture();
    } else {
      sounds.playMove();
    }

    renderBoard();
    updateGameStatus();
    checkGameOver();
  }
}

// Check for game completion
function checkGameOver() {
  if (game.isGameOver()) {
    let msg = "";
    let isWin = false;

    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Negras' : 'Blancas';
      msg = `¡Jaque Mate! Ganador: ${winner}.`;
      isWin = (game.turn() !== playerColor);
    } else if (game.isDraw()) {
      msg = "¡Empate por tablas / ahogado!";
    }

    sounds.playGameOver(isWin);
    addBotChatMessage(`🏆 ${msg} ¿Deseas jugar otra partida?`);
    return true;
  }
  return false;
}

// Clear Selection
function clearSelection() {
  selectedSquare = null;
  validMoves = [];
}

// Update turn badges, move history list, and captured pieces
function updateGameStatus() {
  // Turn Badge
  const currentTurn = game.turn() === 'w' ? 'Blancas' : 'Negras';
  playerTurnBadge.textContent = `Turno: ${currentTurn}`;
  if (game.inCheck()) {
    playerTurnBadge.textContent += " (¡Jaque!)";
    playerTurnBadge.style.color = "#ef4444";
  } else {
    playerTurnBadge.style.color = "";
  }

  // Update Moves History List
  const history = game.history({ verbose: true });
  movesListEl.innerHTML = '';

  if (history.length === 0) {
    movesListEl.innerHTML = '<div class="moves-placeholder">No hay movimientos aún</div>';
  } else {
    for (let i = 0; i < history.length; i += 2) {
      const moveRow = document.createElement('div');
      moveRow.className = 'move-row';

      const moveNum = document.createElement('span');
      moveNum.className = 'move-number';
      moveNum.textContent = `${Math.floor(i / 2) + 1}.`;

      const moveWhite = document.createElement('span');
      moveWhite.className = 'move-white';
      moveWhite.textContent = history[i].san;

      const moveBlack = document.createElement('span');
      moveBlack.className = 'move-black';
      moveBlack.textContent = history[i + 1] ? history[i + 1].san : '';

      moveRow.appendChild(moveNum);
      moveRow.appendChild(moveWhite);
      moveRow.appendChild(moveBlack);

      movesListEl.appendChild(moveRow);
    }
    movesListEl.scrollTop = movesListEl.scrollHeight;
  }

  // Update Captured Pieces
  renderCapturedPieces(history);
}

// Render icons for captured pieces
function renderCapturedPieces(history) {
  capturedByWhiteEl.innerHTML = '';
  capturedByBlackEl.innerHTML = '';

  history.forEach(move => {
    if (move.captured) {
      const iconSVG = getPieceSVG(move.captured, move.color === 'w' ? 'b' : 'w');
      const div = document.createElement('div');
      div.className = 'captured-icon';
      div.innerHTML = iconSVG;

      if (move.color === 'w') {
        capturedByWhiteEl.appendChild(div);
      } else {
        capturedByBlackEl.appendChild(div);
      }
    }
  });
}

// Action Button Functions
function startNewGame() {
  game.reset();
  lastMove = null;
  clearSelection();
  renderBoard();
  updateGameStatus();
  addBotChatMessage("¡Nueva partida iniciada! Buena suerte.");

  if (playerColor === 'b') {
    setTimeout(makeAIMove, 500);
  }
}

function toggleFlipBoard() {
  boardFlipped = !boardFlipped;
  playerColor = boardFlipped ? 'b' : 'w';
  renderBoard();
  addBotChatMessage(`Tablero volteado. Ahora juegas con las ${playerColor === 'w' ? 'Blancas' : 'Negras'}.`);

  if (game.turn() !== playerColor && !game.isGameOver()) {
    setTimeout(makeAIMove, 500);
  }
}

function undoMove() {
  if (game.history().length === 0) return;
  
  // Undo computer move and player move
  game.undo();
  if (game.turn() !== playerColor && game.history().length > 0) {
    game.undo();
  }
  
  lastMove = null;
  clearSelection();
  renderBoard();
  updateGameStatus();
  addBotChatMessage("Movimiento deshecho.");
}

function triggerGameAnalysis() {
  const analysisResult = handleGameAnalysisRequest(game);
  addBotChatMessage(analysisResult);
}

function showHint() {
  if (game.isGameOver()) return;
  const hintText = getHintOrCommentary(game);
  addBotChatMessage(`💡 ${hintText}`);
}

function toggleSound() {
  const isMuted = sounds.toggleMute();
  btnSound.style.opacity = isMuted ? '0.5' : '1';
}

// Pawn Promotion Modal
function showPromotionModal() {
  promotionChoicesEl.innerHTML = '';
  const pieces = ['q', 'r', 'b', 'n'];

  pieces.forEach(pType => {
    const btn = document.createElement('button');
    btn.className = 'promo-piece-btn';
    btn.innerHTML = getPieceSVG(pType, playerColor);
    btn.addEventListener('click', () => {
      promotionModalEl.classList.add('hidden');
      if (pendingPromotion) {
        pendingPromotion.promotion = pType;
        executeMove(pendingPromotion);
        pendingPromotion = null;
      }
    });
    promotionChoicesEl.appendChild(btn);
  });

  promotionModalEl.classList.remove('hidden');
}

// Chat Assistant & Tutor Functions
function handleChatSubmit(e) {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;

  processUserQuery(text);
  chatInputEl.value = '';
}

function processUserQuery(text) {
  addUserChatMessage(text);

  // Process using tutor engine
  setTimeout(() => {
    const response = getTutorResponse(text, game);
    addBotChatMessage(response);
  }, 350);
}

function addUserChatMessage(text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user-bubble';
  bubble.textContent = text;
  chatMessagesEl.appendChild(bubble);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function addBotChatMessage(text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot-bubble';
  bubble.textContent = text;
  chatMessagesEl.appendChild(bubble);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Start application
init();
