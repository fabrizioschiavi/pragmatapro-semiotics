function getUserTheme() {
    return localStorage.getItem('theme');
  }

  function setUserTheme(value) {
    localStorage.setItem('theme', value);
  }

  if (!getUserTheme()) {
    setUserTheme('system');
  }

  const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
  systemThemeQuery?.addListener(applyTheme);

  function getSystemTheme() {
    return systemThemeQuery?.matches ? 'dark' : 'light';
  }

  function getEffectiveTheme() {
    const userTheme = getUserTheme();
    switch (userTheme) {
      case 'system': return getSystemTheme();
      default: return userTheme;
    }
  }

  const themeData = {
     dark: { icon: '', label: 'Dark', next: 'light' },
     light: { icon: '', label: 'Light', next: 'system' },
     system: { icon: '󰔎', label: 'System', next: 'dark' },
  };

  function applyTheme() {
    const effectiveTheme = getEffectiveTheme();
    const userTheme = getUserTheme();
    document.body.classList.remove('light', 'dark', 'system');
    document.body.classList.add(effectiveTheme);
    const button = document.querySelector('.theme');
    button.textContent = themeData[userTheme].icon;
    button.setAttribute('data-tooltip', themeData[userTheme].label);
  }

  function toggleTheme() {
    const theme = themeData[getUserTheme()].next;
    setUserTheme(theme);
    applyTheme();
  }

  const url = 'https://raw.githubusercontent.com/fabrizioschiavi/pragmatapro-semiotics/main/Symbols.csv';
  const initialQuery = parseQuery(window.location.search).q;
  let data = [];
  fetch(url).then(response => response.text()).then(text => {
    const lines = text.trim().split('\n');
    const version = lines[0].match(/[0-9]+\.[0-9.]+/)?.[0];
    for (const v of document.querySelectorAll('.version')) {
      v.textContent = version;
    }
    data = lines.splice(1).map(line => line.split(','));
    update(initialQuery);
  });

  function parseQuery(query) {
    const result = {};
    for (const pair of query.slice(1).split('&')) {
      const [key, value] = pair.split('=');
      result[key] = decodeURIComponent(value);
    }
    return result;
  }

  function search(query) {
    if (!query) return data;
    const queryLower = query.toLowerCase();
    const queryUpper = query.toUpperCase();
    return data.filter(row => row[0].includes(queryUpper) || row[1].includes(queryLower) || row[2].includes(queryLower));
  }

  function update(query) {
    const tbody = document.querySelector('tbody');
    const rows = search(query).map(row => {
      const tr = document.createElement('tr');
      for (const cell of row) {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      }
      return tr;
    });
    tbody.replaceChildren(...rows);
  }