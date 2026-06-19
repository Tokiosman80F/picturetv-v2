const CHECKOUT_URL = 'https://app.base44.com/api/apps/6a07707be6e81724faed56b3/functions/stripeCheckout';
let _currentPkgId = '';
let _currentPkgName = '';
let _currentPkgPrice = '';

function openCheckout(pkgId, pkgName, pkgPrice) {
  _currentPkgId = pkgId;
  _currentPkgName = pkgName;
  _currentPkgPrice = pkgPrice;
  var nameEl = document.getElementById('checkoutPkgName');
  var priceEl = document.getElementById('checkoutPkgPrice');
  if (nameEl) nameEl.textContent = pkgName;
  if (priceEl) priceEl.textContent = pkgPrice;
  var modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  var errEl = document.getElementById('checkoutError');
  if (errEl) errEl.style.display = 'none';
  var btn = document.getElementById('checkoutSubmitBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = '🔒 Proceed to Secure Payment →';
  }
}

function closeCheckout() {
  var modal = document.getElementById('checkoutModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

async function submitCheckout(e) {
  e.preventDefault();
  var btn = document.getElementById('checkoutSubmitBtn');
  var errEl = document.getElementById('checkoutError');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Redirecting to Stripe...';
  }
  if (errEl) errEl.style.display = 'none';

  var payload = {
    package_id: _currentPkgId,
    package_name: _currentPkgName,
    package_price: _currentPkgPrice,
    customer_name: (document.getElementById('checkoutName') || {}).value || '',
    customer_email: (document.getElementById('checkoutEmail') || {}).value || '',
    company_name: (document.getElementById('checkoutCompany') || {}).value || '',
    success_url: window.location.origin + '/thank-you.html?pkg=' + encodeURIComponent(_currentPkgName) + '&price=' + encodeURIComponent(_currentPkgPrice),
    cancel_url: window.location.href,
  };

  try {
    var res = await fetch(CHECKOUT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Checkout session failed to initialize.');
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🔒 Proceed to Secure Payment →';
    }
    if (errEl) {
      errEl.textContent = 'Something went wrong: ' + err.message + '. Please try again or contact media@picturetv.net';
      errEl.style.display = 'block';
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.js-checkout').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openCheckout(btn.dataset.pkgId, btn.dataset.pkgName, btn.dataset.pkgPrice);
    });
  });

  var modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeCheckout(); });
  }

  var closeBtn = document.getElementById('checkoutCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckout);

  var form = document.getElementById('checkoutForm');
  if (form) form.addEventListener('submit', submitCheckout);
});
