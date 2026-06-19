(function () {
  var STORAGE_KEY = 'ptv_newsletter_seen';
  var THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  var lastSeen = localStorage.getItem(STORAGE_KEY);
  if (!lastSeen || (Date.now() - parseInt(lastSeen)) > THIRTY_DAYS) {
    setTimeout(function () {
      var overlay = document.getElementById('nl-overlay');
      var card = document.getElementById('nl-card');
      if (overlay) {
        overlay.style.pointerEvents = 'auto';
        overlay.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    }, 3000);
  }
})();

function dismissNewsletter() {
  var overlay = document.getElementById('nl-overlay');
  var card = document.getElementById('nl-card');
  overlay.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  setTimeout(function () { overlay.style.pointerEvents = 'none'; }, 400);
  localStorage.setItem('ptv_newsletter_seen', Date.now().toString());
}

function submitNewsletter(e) {
  e.preventDefault();
  var name = document.getElementById('nl-name').value;
  var email = document.getElementById('nl-email').value;
  var btn = document.getElementById('nl-btn');
  btn.textContent = 'Subscribing...';
  btn.style.opacity = '0.7';
  fetch('https://app.base44.com/api/apps/6a07707be6e81724faed56b3/functions/crmIntake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contact_name: name, email: email,
      source: 'newsletter_popup', subscribed_newsletter: true, action: 'newsletter_signup'
    })
  }).catch(function () {}).finally(function () {
    var msg = document.getElementById('nl-success-msg');
    var firstName = name.split(' ')[0];
    msg.innerHTML = 'Welcome to the Picture TV community, <strong style="color:#2E7D5B">' + firstName + '</strong>!<br>Check your inbox for a welcome message from Mala.';
    document.getElementById('nl-form-view').style.display = 'none';
    document.getElementById('nl-success-view').style.display = 'block';
    localStorage.setItem('ptv_newsletter_seen', Date.now().toString());
    setTimeout(dismissNewsletter, 3500);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('nl-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === this) dismissNewsletter(); });
  }
  var dismissBtn = document.getElementById('nl-dismiss-btn');
  if (dismissBtn) dismissBtn.addEventListener('click', dismissNewsletter);
  var nlForm = document.getElementById('nl-form');
  if (nlForm) nlForm.addEventListener('submit', submitNewsletter);
});
