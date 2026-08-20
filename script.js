/* ============ Falling cats ambient animation ============ */
(function catRain() {
  const layer = document.getElementById('cat-rain');
  if (!layer) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function spawnCat() {
    const cat = document.createElement('span');
    cat.className = 'cat-drop';
    cat.textContent = '🐱';

    const size = 14 + Math.random() * 18; // 14px - 32px
    const left = Math.random() * 100; // vw
    const duration = 8 + Math.random() * 9; // 8s - 17s
    const drift = (Math.random() * 120 - 60) + 'px';

    cat.style.left = left + 'vw';
    cat.style.fontSize = size + 'px';
    cat.style.animationDuration = duration + 's';
    cat.style.setProperty('--drift', drift);

    layer.appendChild(cat);
    setTimeout(() => cat.remove(), duration * 1000 + 500);
  }

  // gentle, occasional cats -- not a blizzard
  setInterval(spawnCat, 900);
  for (let i = 0; i < 4; i++) setTimeout(spawnCat, i * 400);
})();

/* ============ Game grid / player ============ */
(function gamesApp() {
  const gridView = document.getElementById('grid-view');
  const playerView = document.getElementById('player-view');
  const gameGrid = document.getElementById('game-grid');
  const emptyMsg = document.getElementById('empty-msg');
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const gameFrame = document.getElementById('game-frame');
  const playerTitle = document.getElementById('player-title');
  const backBtn = document.getElementById('back-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  let games = [];

  function renderGrid(list) {
    gameGrid.innerHTML = '';
    if (list.length === 0) {
      emptyMsg.classList.remove('hidden');
      return;
    }
    emptyMsg.classList.add('hidden');

    list.forEach(game => {
      const card = document.createElement('button');
      card.className = 'game-card';
      card.type = 'button';
      card.setAttribute('aria-label', 'Play ' + game.title);
      card.innerHTML = `
        <div class="game-thumb">${game.icon || '🎮'}</div>
        <div class="game-info">
          <p class="game-title">${escapeHtml(game.title)}</p>
          <p class="game-category">${escapeHtml(game.category || 'Misc')}</p>
        </div>
      `;
      card.addEventListener('click', () => openGame(game));
      gameGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function populateCategories(list) {
    const cats = [...new Set(list.map(g => g.category).filter(Boolean))].sort();
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  }

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;
    const filtered = games.filter(g => {
      const matchesSearch = !q || g.title.toLowerCase().includes(q);
      const matchesCat = cat === 'all' || g.category === cat;
      return matchesSearch && matchesCat;
    });
    renderGrid(filtered);
  }

  function openGame(game) {
    playerTitle.textContent = game.title;
    gameFrame.src = game.src;
    gridView.classList.add('hidden');
    playerView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeGame() {
    gameFrame.src = '';
    playerView.classList.add('hidden');
    gridView.classList.remove('hidden');
  }

  backBtn.addEventListener('click', closeGame);

  fullscreenBtn.addEventListener('click', () => {
    if (gameFrame.requestFullscreen) {
      gameFrame.requestFullscreen();
    } else if (gameFrame.webkitRequestFullscreen) {
      gameFrame.webkitRequestFullscreen();
    }
  });

  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);

  fetch('games.json')
    .then(res => res.json())
    .then(data => {
      games = data;
      populateCategories(games);
      renderGrid(games);
    })
    .catch(err => {
      console.error('Could not load games.json', err);
      emptyMsg.textContent = 'Could not load games.json. Make sure it is in the same folder as index.html.';
      emptyMsg.classList.remove('hidden');
    });
})();
