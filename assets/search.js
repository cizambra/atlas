(function () {
  const input = document.getElementById('search');
  const results = document.getElementById('results');
  if (!input || !results) return;

  const prefix = input.dataset.prefix || '';
  let index = null;

  function score(entry, terms) {
    let total = 0;
    for (const term of terms) {
      const title = entry.title.toLowerCase();
      if (title === term) total += 100;
      else if (title.includes(term)) total += 40;
      if (entry.blurb.toLowerCase().includes(term)) total += 12;
      if (entry.kicker.toLowerCase().includes(term)) total += 8;
      if (entry.headings.some((h) => h.toLowerCase().includes(term))) total += 8;
      if (entry.tokens.some((t) => t.startsWith(term))) total += 4;
    }
    return total;
  }

  // Built as DOM nodes rather than an HTML string: titles and blurbs come from
  // page content, and textContent escapes them the same way the server-side
  // renderer does. An innerHTML template would mis-render a title like "Cache & CDN".
  function resultNode(entry) {
    const link = document.createElement('a');
    link.href = `${prefix}${entry.section}/${entry.slug}.html`;
    link.append(entry.title);

    const blurb = document.createElement('span');
    blurb.className = 'r-summary';
    blurb.textContent = entry.blurb;
    link.append(blurb);

    return link;
  }

  function render(matches) {
    results.replaceChildren(...matches.map(resultNode));
    results.hidden = matches.length === 0;
  }

  async function ensureIndex() {
    if (index) return index;
    const response = await fetch(input.dataset.index);
    index = (await response.json()).pages;
    return index;
  }

  input.addEventListener('input', async () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) return render([]);
    const terms = query.split(/\s+/);
    const entries = await ensureIndex();
    const matches = entries
      .map((entry) => ({ entry, value: score(entry, terms) }))
      .filter((m) => m.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 12)
      .map((m) => m.entry);
    render(matches);
  });

  document.addEventListener('click', (event) => {
    if (!results.contains(event.target) && event.target !== input) render([]);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { input.blur(); render([]); }
    if (event.key === '/' && document.activeElement !== input) { event.preventDefault(); input.focus(); }
  });
})();
