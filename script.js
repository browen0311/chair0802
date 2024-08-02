let board = ['X', 'X', 'X', 'X', '-', '-', '-', 'O', 'O', 'O', 'O'];
let moves = 0;
let history = [];

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((piece, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (index >= 4 && index <= 6) {
            cell.classList.add('middle');
        }
        cell.dataset.index = index;
        if (piece !== '-') {
            const pieceElement = document.createElement('div');
            pieceElement.className = `piece ${piece}`;
            pieceElement.draggable = true;
            pieceElement.textContent = piece;
            pieceElement.addEventListener('dragstart', dragStart);
            pieceElement.addEventListener('dragend', dragEnd);
            cell.appendChild(pieceElement);
        }
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', drop);
        boardElement.appendChild(cell);
    });
    updateMoves();
    updateHistory();
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.parentNode.dataset.index);
    showValidMoves(parseInt(e.target.parentNode.dataset.index));
}

function dragEnd() {
    clearValidMoves();
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text'));
    const toIndex = parseInt(e.target.dataset.index);
    
    if (isValidMove(fromIndex, toIndex)) {
        history.push([...board]);
        board[toIndex] = board[fromIndex];
        board[fromIndex] = '-';
        moves++;
        createBoard();
    }
    clearValidMoves();
}

function isValidMove(from, to) {
    if (board[to] !== '-') return false;
    if (board[from] === 'X' && to < from) return false;
    if (board[from] === 'O' && to > from) return false;
    return Math.abs(to - from) <= 2;
}

function showValidMoves(index) {
    const cells = document.querySelectorAll('.cell');
    const piece = board[index];
    const direction = piece === 'X' ? 1 : -1;
    
    for (let i = 1; i <= 2; i++) {
        const newIndex = index + i * direction;
        if (newIndex >= 0 && newIndex < board.length && board[newIndex] === '-') {
            cells[newIndex].classList.add('valid-move');
        }
    }
}

function clearValidMoves() {
    document.querySelectorAll('.valid-move').forEach(cell => {
        cell.classList.remove('valid-move');
    });
}

function updateMoves() {
    document.getElementById('moves').textContent = `移動次數: ${moves}`;
}

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '移動歷史：<br>' + history.map((state, index) => 
        `${index + 1}. ${state.join('')}`
    ).join('<br>');
}

function reset() {
    board = ['X', 'X', 'X', 'X', '-', '-', '-', 'O', 'O', 'O', 'O'];
    moves = 0;
    history = [];
    createBoard();
}

function undo() {
    if (history.length > 0) {
        board = history.pop();
        moves--;
        createBoard();
    }
}

document.getElementById('reset').addEventListener('click', reset);
document.getElementById('undo').addEventListener('click', undo);

createBoard();