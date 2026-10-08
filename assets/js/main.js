/* Tartak Sławomir Langier — logika interfejsu (bez bibliotek) */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu-mobilne');

  /* --- Nagłówek: tło po przewinięciu --- */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Menu mobilne --- */
  function setMenu(open) {
    if (!toggle || !header) return;
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* --- Reveal on scroll --- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- Formularz kontaktowy (frontend) ---
     Backend nie jest jeszcze podpięty. Gdy data-endpoint w <form> jest pusty,
     wiadomość NIE jest nigdzie wysyłana, a użytkownik dostaje stosowną informację.
     Po ustawieniu data-endpoint (np. adres Formspree / własny skrypt PHP)
     formularz wysyła dane metodą POST jako JSON. */
  var form = document.getElementById('formularz');
  if (!form) return;
  var status = document.getElementById('form-status');

  var MESSAGES = {
    valueMissing: 'To pole jest wymagane.',
    typeMismatch: 'Podaj poprawny adres e-mail.'
  };
  function errorFor(field) {
    return document.getElementById(field.id + '-err');
  }
  function validateField(field) {
    var err = errorFor(field);
    var msg = '';
    if (!field.validity.valid) {
      msg = field.validity.valueMissing ? MESSAGES.valueMissing
          : field.validity.typeMismatch ? MESSAGES.typeMismatch
          : field.validationMessage;
      if (field.type === 'checkbox' && field.validity.valueMissing) {
        msg = 'Zgoda jest wymagana, aby wysłać wiadomość.';
      }
    }
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) {
      err.textContent = msg;
      field.setAttribute('aria-describedby', msg ? err.id : '');
      if (!msg) field.removeAttribute('aria-describedby');
    }
    return !msg;
  }
  function setStatus(state, text) {
    status.dataset.state = state;
    status.textContent = text;
  }

  var fields = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));
  fields.forEach(function (f) {
    f.addEventListener('blur', function () { validateField(f); });
    f.addEventListener('input', function () {
      if (f.getAttribute('aria-invalid') === 'true') validateField(f);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');

    var firstInvalid = null;
    fields.forEach(function (f) {
      if (!validateField(f) && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    if (form.elements._gotcha && form.elements._gotcha.value) return; // bot

    var endpoint = form.dataset.endpoint;
    if (!endpoint) {
      setStatus('error', 'Wysyłanie wiadomości przez formularz nie jest jeszcze dostępne. Skorzystaj z mapy lub danych kontaktowych na tej stronie.');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== '_gotcha') data[k] = v; });

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      setStatus('success', 'Dziękujemy! Wiadomość została wysłana.');
    }).catch(function () {
      setStatus('error', 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.');
    }).finally(function () {
      btn.disabled = false;
    });
  });
})();
