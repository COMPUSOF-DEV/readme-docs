const contentEl = document.getElementById('content');
const tocEl = document.getElementById('toc');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const scrollTopBtn = document.getElementById('scrollTop');

const state = {
  sections: [],
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildSections() {
  const headings = Array.from(contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const sections = [];

  headings.forEach((heading) => {
    const level = Number(heading.tagName.replace('H', ''));
    if (!heading.id) {
      heading.id = slugify(heading.textContent);
    }

    let text = '';
    let node = heading.nextElementSibling;
    while (node && !/^H[1-6]$/.test(node.tagName)) {
      text += ` ${node.textContent}`;
      node = node.nextElementSibling;
    }

    sections.push({
      id: heading.id,
      title: heading.textContent.trim(),
      level,
      text: text.replace(/\s+/g, ' ').trim(),
    });
  });

  state.sections = sections;
}

function renderToc() {
  tocEl.innerHTML = '';
  state.sections
    .filter((section) => section.level <= 3)
    .forEach((section) => {
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.textContent = section.title;
      link.dataset.level = String(section.level);
      tocEl.appendChild(link);
    });
}

function snippet(text, query) {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return text.slice(0, 140);
  const start = Math.max(index - 40, 0);
  const end = Math.min(index + 80, text.length);
  return text.slice(start, end).trim();
}

function renderSearchResults(results, query) {
  searchResults.innerHTML = '';
  if (!query) {
    searchResults.classList.remove('active');
    return;
  }

  if (results.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'search-item';
    empty.textContent = 'Sin resultados.';
    searchResults.appendChild(empty);
    searchResults.classList.add('active');
    return;
  }

  results.slice(0, 12).forEach((result) => {
    const item = document.createElement('div');
    item.className = 'search-item';
    item.innerHTML = `${result.title}<small>${snippet(result.text, query)}</small>`;
    item.addEventListener('click', () => {
      window.location.hash = result.id;
      searchResults.classList.remove('active');
    });
    searchResults.appendChild(item);
  });
  searchResults.classList.add('active');
}

function setupSearch() {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    if (!query) {
      renderSearchResults([], '');
      return;
    }

    const results = state.sections.filter((section) => {
      return (
        section.title.toLowerCase().includes(query) ||
        section.text.toLowerCase().includes(query)
      );
    });

    renderSearchResults(results, query);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('doc-theme', theme);
  themeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function setupTheme() {
  const saved = localStorage.getItem('doc-theme');
  const initial = saved || 'light';
  applyTheme(initial);

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });
}

function setupMobileMenu() {
  if (!menuBtn || !sidebar || !overlay) return;

  const openMenu = () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  };

  const closeMenu = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  };

  menuBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeMenu();
      return;
    }
    openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

function setupScrollTop() {
  if (!scrollTopBtn) return;

  const toggleButton = () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
      return;
    }
    scrollTopBtn.classList.remove('show');
  };

  window.addEventListener('scroll', toggleButton, { passive: true });
  toggleButton();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

async function loadReadme() {
  const response = await fetch('README.md');
  if (!response.ok) {
    contentEl.innerHTML = '<p>No se pudo cargar README.md</p>';
    return;
  }
  const markdown = await response.text();
  const html = marked.parse(markdown, { mangle: false, headerIds: false });
  contentEl.innerHTML = html;

  buildSections();
  renderToc();
  setupSearch();
}

setupTheme();
setupMobileMenu();
setupScrollTop();
loadReadme();
