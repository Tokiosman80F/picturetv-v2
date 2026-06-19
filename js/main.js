// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');

// Nav scroll shadow
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Scroll to booking form — navigates to home if not on home page
function scrollToForm() {
  const form = document.getElementById('bookingForm');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.href = 'index.html#bookingForm';
  }
}

// Form tabs
let currentTab = 'Book Event';
function setTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('on'));
  const active = document.querySelector(`.ftab[data-tab="${tab}"]`);
  if (active) active.classList.add('on');
}

// CRM intake form submission
function submitIntake(e) {
  e.preventDefault();
  const form = document.getElementById('intakeForm');
  const d = new FormData(form);
  const payload = {
    company_name: d.get('company_name'),
    contact_name: d.get('contact_name'),
    email: d.get('email'),
    phone: d.get('phone'),
    website: d.get('website'),
    budget_range: d.get('budget_range'),
    service_interest: d.get('event_type'),
    timeline: d.get('call_time'),
    notes: d.get('notes'),
    source: 'website_' + currentTab.toLowerCase().replace(/\s+/g, '_'),
    status: 'new',
    tags: [currentTab]
  };
  fetch('https://app.base44.com/api/apps/6a07707be6e81724faed56b3/functions/crmIntake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
  form.style.display = 'none';
  document.getElementById('fSuccess').style.display = 'block';
  if (typeof gtag !== 'undefined') gtag('event', 'form_submit', { event_category: 'Lead', event_label: currentTab });
}

// Scroll animations via IntersectionObserver
const _obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });

function observeAll() {
  document.querySelectorAll('.fu').forEach(el => _obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(observeAll, 200);

  // Scroll-to-form buttons
  document.querySelectorAll('.js-scroll-form').forEach(el => {
    el.addEventListener('click', scrollToForm);
  });

  // Form tabs
  document.querySelectorAll('.ftab[data-tab]').forEach(el => {
    el.addEventListener('click', () => setTab(el.dataset.tab));
  });

  // Intake form
  const intakeForm = document.getElementById('intakeForm');
  if (intakeForm) intakeForm.addEventListener('submit', submitIntake);

  // Handle #bookingForm hash from other pages
  if (window.location.hash === '#bookingForm') {
    setTimeout(() => {
      const el = document.getElementById('bookingForm');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }
});
