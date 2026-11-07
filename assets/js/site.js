(() => {
  'use strict';
  const form = document.querySelector('[data-search-form]');
  if (form) {
    form.hidden = false;
    const input = form.querySelector('input');
    const posts = Array.from(document.querySelectorAll('[data-post]'));
    const status = document.querySelector('[data-search-status]');
    const normalize = value => value.normalize('NFKC').toLocaleLowerCase('ja');
    form.addEventListener('submit', event => event.preventDefault());
    input.addEventListener('input', () => {
      const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
      let count = 0;
      posts.forEach(post => {
        const text = normalize(post.dataset.search || '');
        post.hidden = !terms.every(term => text.includes(term));
        if (!post.hidden) count += 1;
      });
      status.textContent = terms.length ? `${count} 件の記事が見つかりました` : '';
      document.querySelector('[data-no-results]').hidden = count > 0;
    });
  }

  const body = document.querySelector('[data-article-body]');
  const toc = document.querySelector('[data-toc]');
  if (body && toc) {
    const headings = Array.from(body.querySelectorAll('h2, h3'));
    const list = toc.querySelector('ol');
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      const item = document.createElement('li');
      item.className = heading.tagName === 'H3' ? 'toc-sub' : '';
      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(heading.id)}`;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });
    toc.hidden = headings.length === 0;
    if ('IntersectionObserver' in window) {
      const links = Array.from(list.querySelectorAll('a'));
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (!visible.length) return;
        const id = visible[0].target.id;
        links.forEach(link => {
          if (decodeURIComponent(link.hash.slice(1)) === id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-10% 0px -65% 0px' });
      headings.forEach(heading => observer.observe(heading));
    }
  }

  // Clipboard API is available on HTTPS and localhost. Hide controls otherwise.
  if (navigator.clipboard && window.isSecureContext) {
    document.querySelectorAll('.prose pre').forEach(pre => {
      const code = pre.querySelector('code');
      if (!code) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrap';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-button';
      button.textContent = 'コピー';
      button.setAttribute('aria-label', 'コードをコピー');
      button.setAttribute('aria-live', 'polite');
      wrapper.appendChild(button);
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          button.textContent = 'コピーしました';
        } catch {
          button.textContent = 'コピーできませんでした';
        }
        window.setTimeout(() => { button.textContent = 'コピー'; }, 2000);
      });
    });
  }
})();
