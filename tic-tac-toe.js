/* PAC-TAC-TOE — all game logic. CSP-safe external JS. */
/* Draws Pac-Man and Ghost shapes into DOM cells. */

(function () {
  'use strict';

  /* ----- DOM refs ----- */
  var board      = document.getElementById('board');
  var status     = document.getElementById('status');
  var scoreX     = document.getElementById('scoreX');
  var scoreO     = document.getElementById('scoreO');
  var scoreD     = document.getElementById('scoreDraw');
  var newBtn     = document.getElementById('newGameBtn');
  var resetBtn   = document.getElementById('resetScoreBtn');
  var cellEls    = board.querySelectorAll('.cell');

  /* ----- state ----- */
  var grid       = Array(9).fill('');
  var current    = 'X';
  var gameOver   = false;
  var winLine    = null;
  var wins = { X: 0, O: 0, draw: 0 };

  var winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  /* ----- ghost color rotation ----- */
  var ghostColors = ['#ff0000','#ffb8ff','#00ffff','#ffb852'];
  var ghostIdx    = 0;

  /* ----- build Pac-Man DOM once ----- */
  function pacmanHTML() {
    return '<div class="pacman"><div class="pacman-body"><div class="pacman-eye"></div></div></div>';
  }

  /* ----- build Ghost DOM once (random-ish color) ----- */
  function ghostHTML() {
    var color = ghostColors[ghostIdx % 4];
    ghostIdx++;
    return (
      '<div class="ghost">' +
        '<div class="ghost-body" style="background:' + color + ';box-shadow:0 0 12px ' + color + '">' +
          '<div class="ghost-eye left"><div class="ghost-pupil"></div></div>' +
          '<div class="ghost-eye right"><div class="ghost-pupil"></div></div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ----- localStorage ----- */
  function loadScores() {
    try {
      var raw = localStorage.getItem('ttt-scores');
      if (raw) {
        var s = JSON.parse(raw);
        wins.X = s.X || 0;
        wins.O = s.O || 0;
        wins.draw = s.draw || 0;
      }
    } catch (_) {}
  }

  function saveScores() {
    try { localStorage.setItem('ttt-scores', JSON.stringify(wins)); } catch (_) {}
  }

  /* ----- helpers ----- */
  function cellEl(idx) { return cellEls[idx]; }

  function updateUI() {
    scoreX.textContent = wins.X;
    scoreO.textContent = wins.O;
    scoreD.textContent = wins.draw;
  }

  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className = 'status ' + (cls || '');
  }

  function clearCell(el) {
    el.innerHTML = '';
    el.classList.remove('taken', 'x', 'o', 'win');
  }

  function resetBoard() {
    grid       = Array(9).fill('');
    current    = 'X';
    gameOver   = false;
    winLine    = null;
    ghostIdx   = 0;
    for (var i = 0; i < cellEls.length; i++) {
      clearCell(cellEls[i]);
    }
    setStatus('PAC-MAN MOVES FIRST', 'turn-x');
  }

  function checkWin() {
    for (var i = 0; i < winCombos.length; i++) {
      var c = winCombos[i];
      if (grid[c[0]] && grid[c[0]] === grid[c[1]] && grid[c[0]] === grid[c[2]]) {
        return c;
      }
    }
    return null;
  }

  function isDraw() {
    for (var i = 0; i < grid.length; i++) {
      if (grid[i] === '') return false;
    }
    return true;
  }

  function highlightWin(indices) {
    for (var i = 0; i < indices.length; i++) {
      cellEl(indices[i]).classList.add('win');
    }
  }

  /* ----- game flow ----- */
  function placeMark(idx) {
    if (gameOver || grid[idx] !== '') return;

    grid[idx] = current;
    var el = cellEl(idx);
    el.classList.add('taken', current.toLowerCase());

    if (current === 'X') {
      el.innerHTML = pacmanHTML();
    } else {
      el.innerHTML = ghostHTML();
    }

    var line = checkWin();

    if (line) {
      gameOver = true;
      winLine  = line;
      highlightWin(line);
      wins[current]++;
      saveScores();
      updateUI();
      if (current === 'X') {
        setStatus('PAC-MAN WINS!', 'win-x');
      } else {
        setStatus('GHOSTS WIN!', 'win-o');
      }
      return;
    }

    if (isDraw()) {
      gameOver = true;
      wins.draw++;
      saveScores();
      updateUI();
      setStatus("IT'S A DRAW!", 'draw');
      return;
    }

    current = current === 'X' ? 'O' : 'X';
    if (current === 'X') {
      setStatus("PAC-MAN'S TURN", 'turn-x');
    } else {
      setStatus("GHOSTS' TURN", 'turn-o');
    }
  }

  /* ----- handlers ----- */
  function onCellClick(e) {
    var idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
    placeMark(idx);
  }

  function onNewGame() { resetBoard(); }

  function onResetScore() {
    wins = { X: 0, O: 0, draw: 0 };
    saveScores();
    updateUI();
    resetBoard();
  }

  /* ----- init ----- */
  function init() {
    loadScores();
    updateUI();
    resetBoard();

    for (var i = 0; i < cellEls.length; i++) {
      cellEls[i].addEventListener('click', onCellClick);
    }

    newBtn.addEventListener('click', onNewGame);
    resetBtn.addEventListener('click', onResetScore);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
