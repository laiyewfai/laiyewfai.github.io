/* Tic Tac Toe — all game logic. No inline event handlers — CSP-safe. */

(function () {
  'use strict';

  /* ----- DOM refs ----- */
  var board   = document.getElementById('board');
  var status  = document.getElementById('status');
  var scoreX  = document.getElementById('scoreX');
  var scoreO  = document.getElementById('scoreO');
  var scoreD  = document.getElementById('scoreDraw');
  var newBtn  = document.getElementById('newGameBtn');
  var resetBtn = document.getElementById('resetScoreBtn');
  var cells   = board.querySelectorAll('.cell');

  /* ----- state ----- */
  var grid       = Array(9).fill('');
  var current    = 'X';          // who moves now
  var gameOver   = false;
  var winLine    = null;         // indices of winning 3
  var wins = { X: 0, O: 0, draw: 0 };

  var winCombos = [
    [0,1,2], [3,4,5], [6,7,8],  // rows
    [0,3,6], [1,4,7], [2,5,8],  // cols
    [0,4,8], [2,4,6]            // diags
  ];

  /* ----- load / save scores (localStorage) ----- */
  function loadScores() {
    try {
      var raw = localStorage.getItem('ttt-scores');
      if (raw) {
        var s = JSON.parse(raw);
        wins.X = s.X || 0;
        wins.O = s.O || 0;
        wins.draw = s.draw || 0;
      }
    } catch (_) { /* private browsing — ignore */ }
  }

  function saveScores() {
    try { localStorage.setItem('ttt-scores', JSON.stringify(wins)); } catch (_) {}
  }

  /* ----- helpers ----- */
  function cellEl(idx) { return cells[idx]; }

  function updateUI() {
    scoreX.textContent = wins.X;
    scoreO.textContent = wins.O;
    scoreD.textContent = wins.draw;
  }

  function setStatus(msg, cls) {
    status.textContent = msg;
    status.className = 'status ' + (cls || '');
  }

  function resetBoard() {
    grid     = Array(9).fill('');
    current  = 'X';
    gameOver = false;
    winLine  = null;
    cells.forEach(function (c) {
      c.textContent = '';
      c.className  = 'cell';
    });
    setStatus("X's turn", 'turn-x');
  }

  function checkWin() {
    for (var i = 0; i < winCombos.length; i++) {
      var c = winCombos[i];
      if (grid[c[0]] && grid[c[0]] === grid[c[1]] && grid[c[0]] === grid[c[2]]) {
        return c; // winning indices
      }
    }
    return null;
  }

  function isDraw() {
    return grid.every(function (v) { return v !== ''; });
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
    el.textContent = current;
    el.classList.add('taken', current.toLowerCase());

    var line = checkWin();

    if (line) {
      gameOver = true;
      winLine  = line;
      highlightWin(line);
      wins[current]++;
      saveScores();
      updateUI();
      setStatus(current + ' wins!', 'win-' + current.toLowerCase());
      return;
    }

    if (isDraw()) {
      gameOver = true;
      wins.draw++;
      saveScores();
      updateUI();
      setStatus("It's a draw!", 'draw');
      return;
    }

    current = current === 'X' ? 'O' : 'X';
    setStatus(current + "'s turn", 'turn-' + current.toLowerCase());
  }

  /* ----- click handler (binding, not inline onclick) ----- */
  function onCellClick(e) {
    var idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
    placeMark(idx);
  }

  /* ----- button handlers ----- */
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

    cells.forEach(function (c) {
      c.addEventListener('click', onCellClick);
    });

    newBtn.addEventListener('click', onNewGame);
    resetBtn.addEventListener('click', onResetScore);
  }

  /* kick off when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
