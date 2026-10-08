# Tartak Sławomir Langier — strona internetowa

Statyczna strona-wizytówka (HTML / CSS / JS, bez bibliotek i bez builda). Gotowa do wgrania na Hostinger (`public_html`).

## Zasada: tylko potwierdzone dane
Na stronie są wyłącznie informacje potwierdzone: nazwa firmy, rodzaj działalności (tartak) oraz lokalizacja (współrzędne i link z Google Maps).
Brak: telefonu, e-maila, adresu, godzin, oferty, zdjęć, opinii, logo — **nie zostały potwierdzone, więc ich nie ma**. Zdjęcia nie są generowane ani stockowe; wzór „słojów” w tle to dekoracja geometryczna.

## Struktura
```
index.html            strona główna (one-page)
404.html              strona błędu
assets/css/style.css  style (fonty, tokeny, komponenty, sekcje)
assets/js/main.js     menu, reveal, formularz
assets/fonts/         Fraunces + Inter (self-hosting, licencja OFL)
assets/img/           favicon, rings.svg (dekoracja), og-image.png
scripts/              set-domain.sh, og-card.html (szablon grafiki OG)
robots.txt, sitemap.xml, .htaccess
```

## Przed publikacją — ustaw domenę
```
./scripts/set-domain.sh https://twoja-domena.pl
```
Podmienia `{{DOMAIN}}` w canonical, Open Graph, JSON-LD, sitemap.xml i robots.txt. Bez tego SEO nie działa poprawnie.

## Uzupełnianie danych od klienta
W `index.html` sloty są ukryte atrybutem `hidden`. Usuń go i wpisz dane:
- **Opis firmy:** `data-fill="o-firmie-opis"` (potem usuń akapit `o-firmie-placeholder`).
- **Adres / telefon / e-mail / godziny:** `<li data-fill="…">` w sekcji Kontakt (telefon: `href="tel:+48…"`, e-mail: `mailto:`).
- **Oferta:** sekcja `#oferta` — odkryj, dodaj link w nawigacji (header + menu mobilne), jedna karta = jedna usługa.
- **Schema.org (JSON-LD):** dodaj `address`, `telephone`, `openingHoursSpecification` — tylko z potwierdzonych danych. Bez `address` Google nie pokaże rozszerzonych wyników.
- **Zdjęcia / logo:** dopiero po otrzymaniu od klienta (prawdziwe materiały); dodaj z `alt`, `width`/`height`, `loading="lazy"`.

## Formularz kontaktowy
Obecnie tylko frontend (walidacja, dostępność, honeypot). Bez `data-endpoint` nic nie jest wysyłane, a użytkownik widzi komunikat. Aby podpiąć backend, wpisz adres w `<form id="formularz" data-endpoint="…">` (POST JSON — np. Formspree lub własny skrypt PHP na Hostingerze). Dodaj też link do polityki prywatności przy zgodzie (treść od klienta).

## Podgląd lokalny
```
npx http-server . -p 8080
```
