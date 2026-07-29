(function () {
  if (typeof mermaid === 'undefined') return;

  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'strict',
    theme: isDark ? 'dark' : 'neutral',
    flowchart: { curve: 'basis', useMaxWidth: true },
    sequence: { useMaxWidth: true },
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  });
})();
