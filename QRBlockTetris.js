export default function QRBlockTetris() {
  const container = document.createElement('div');
  container.style.position = 'relative';

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 600;
  canvas.style.border = '2px solid black';
  const ctx = canvas.getContext('2d');

  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.color = 'white';
  overlay.style.display = 'none';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.padding = '20px';
  overlay.style.fontSize = '16px';
  overlay.style.lineHeight = '1.5';
  overlay.style.textAlign = 'center';
  overlay.style.whiteSpace = 'pre-line';
  overlay.innerText = `You scanned. You waited. You believed.
But meaning, like authority, is a performance.
And this one just ended.

No image. No sound. No clarity.
Only your desire to find something where nothing promised it.`;

  container.appendChild(canvas);
  container.appendChild(overlay);

  const img = new Image();
  img.src = './qr_tzhou1121_crown.png';

  let gameOver = false;

  img.onload = () => {
    drawBoard();
    setInterval(() => {
      if (!gameOver) update();
    }, 700);

    canvas.addEventListener('touchstart', handleTouch);
  };

  const COLS = 10;
  const ROWS = 20;
  const SIZE = 30;
  let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const SHAPES = [
    [[1, 1, 1], [0, 1, 0]],
    [[2, 2, 0], [0, 2, 2]],
    [[0, 3, 3], [3, 3, 0]],
    [[4, 4], [4, 4]],
    [[5, 0, 0], [5, 5, 5]],
    [[0, 0, 6], [6, 6, 6]],
    [[7, 7, 7, 7]]
  ];
  let current = randomPiece();

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => row.forEach((val, x) => {
      if (val) ctx.drawImage(img, x * SIZE, y * SIZE, SIZE, SIZE);
    }));
    current.shape.forEach((row, dy) => row.forEach((val, dx) => {
      if (val) ctx.drawImage(img, (current.x + dx) * SIZE, (current.y + dy) * SIZE, SIZE, SIZE);
    }));
  }

  function update() {
    if (!move(0, 1)) {
      place();
      current = randomPiece();
    }
    drawBoard();
  }

  function move(dx, dy) {
    const nx = current.x + dx;
    const ny = current.y + dy;
    if (!valid(nx, ny, current.shape)) return false;
    current.x = nx;
    current.y = ny;
    return true;
  }

  function valid(x, y, shape) {
    return shape.every((row, dy) => row.every((val, dx) => {
      if (!val) return true;
      const nx = x + dx, ny = y + dy;
      return ny < ROWS && nx >= 0 && nx < COLS && !board[ny][nx];
    }));
  }

  function place() {
    current.shape.forEach((row, dy) => row.forEach((val, dx) => {
      if (val) board[current.y + dy][current.x + dx] = 1;
    }));
    clearLines();
  }

  function clearLines() {
    board = board.filter(row => row.some(cell => cell === 0));
    while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
  }

  function randomPiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { shape, x: 3, y: 0 };
  }

  function handleTouch(e) {
    if (gameOver) return;
    const x = e.changedTouches[0].clientX;
    if (x < window.innerWidth / 3) move(-1, 0);
    else if (x > (2 * window.innerWidth) / 3) move(1, 0);
    else rotate();
    drawBoard();
  }

  function rotate() {
    const rotated = current.shape[0].map((_, i) => current.shape.map(r => r[i]).reverse());
    if (valid(current.x, current.y, rotated)) current.shape = rotated;
  }

  return container;
}
