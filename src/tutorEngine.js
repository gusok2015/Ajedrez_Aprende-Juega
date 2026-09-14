// Concise Chat Tutor Engine & Breakpoint Creativa Assistant

export function getTutorResponse(userInput, game) {
  const query = userInput.toLowerCase();

  // 1. Creator query
  if (query.includes('quien') || query.includes('creo') || query.includes('creó') || query.includes('fundador') || query.includes('creador') || query.includes('dueño') || query.includes('autor')) {
    return "Este juego fue creado por Gustavo Rojas y Carolina Riveros, cofundadores de Breakpoint Creativa.";
  }

  // 2. Contact / location query (Only give website here)
  if (query.includes('contacto') || query.includes('ubicac') || query.includes('ubicar') || query.includes('donde') || query.includes('dónde') || query.includes('contactar') || query.includes('direccion') || query.includes('dirección')) {
    return "Puedes encontrarnos y conocer más sobre nosotros en www.breakpointcreativa.com.";
  }

  // 3. Rules & Movement queries (Short & direct)
  if (query.includes('peon') || query.includes('peón')) {
    return "♟️ **Peón**: Mueve 1 casilla adelante (2 en su primer movimiento) y captura en diagonal 1 casilla.";
  }
  if (query.includes('caballo')) {
    return "♞ **Caballo**: Mueve en 'L' (2 casillas y 1 al lado) y es la única pieza que salta sobre otras.";
  }
  if (query.includes('alfil')) {
    return "♝ **Alfil**: Mueve en diagonal todas las casillas que desee.";
  }
  if (query.includes('torre')) {
    return "♜ **Torre**: Mueve en línea recta (horizontal o vertical) todas las casillas que desee.";
  }
  if (query.includes('reina') || query.includes('dama')) {
    return "♛ **Reina**: Mueve en cualquier dirección (recta o diagonal) cuantas casillas desee.";
  }
  if (query.includes('rey') && !query.includes('reina')) {
    return "♚ **Rey**: Mueve 1 casilla en cualquier dirección. Debes protegerlo para evitar el Jaque Mate.";
  }
  if (query.includes('regla') || query.includes('como se juega') || query.includes('cómo se juega') || query.includes('aprender') || query.includes('enseña')) {
    return "El objetivo es dar Jaque Mate al Rey enemigo. Cada jugador mueve 1 pieza por turno. Toca los botones de Reglas o Movimientos para ver más.";
  }

  // Position analysis request
  if (query.includes('analiz') || query.includes('posicion') || query.includes('posició') || query.includes('estado')) {
    return handleGameAnalysisRequest(game);
  }

  // Short fallback
  return "Concéntrate en dominar el centro del tablero y proteger a tu Rey. ¿Tienes alguna duda específica?";
}

export function handleGameAnalysisRequest(game) {
  if (!game.isGameOver()) {
    return "El análisis completo se generará cuando finalice la partida. ¡Sigue jugando!";
  }

  const history = game.history();
  const movesCount = Math.ceil(history.length / 2);
  const result = game.isCheckmate() ? (game.turn() === 'w' ? 'Ganaron las Negras' : 'Ganaron las Blancas') : 'Empate';

  return `📊 **Análisis Final**: Partida concluida en ${movesCount} jugadas. Resultado: ${result}. ¡Excelente esfuerzo!`;
}
