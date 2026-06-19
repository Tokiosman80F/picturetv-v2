async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (!res.ok) return;
    el.innerHTML = await res.text();
    if (id === 'nav-placeholder') initNav();
  } catch (e) {}
}

function initNav() {
  // Highlight active nav link by current filename
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.getAttribute('data-page') === page) a.classList.add('act');
  });

  // Hamburger toggle
  const hbg = document.getElementById('hbg');
  if (hbg) {
    hbg.addEventListener('click', () => {
      document.getElementById('mobMenu').classList.toggle('open');
    });
  }

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.mob a').forEach(a => {
    a.addEventListener('click', () => {
      const mob = document.getElementById('mobMenu');
      if (mob) mob.classList.remove('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('nav-placeholder', 'includes/nav.html');
  loadComponent('footer-placeholder', 'includes/footer.html');
});
