# Nymfa Expense Tracker

Nymfa Expense Tracker to aplikacja typu monorepo służąca do zarządzania finansami, wyposażona w przejrzysty i nowoczesny interfejs. Aplikacja składa się z:

- **Frontend**: Aplikacja internetowa stworzona we frameworku Nuxt 3, stylizowana przy użyciu Tailwind CSS.
- **Backend**: API zbudowane na bazie NestJS z wykorzystaniem bazy danych PostgreSQL oraz biblioteki Drizzle ORM do obsługi zapytań.

## Uruchomienie projektu lokalnie

1. Uruchom bazę danych przy pomocy Docker Compose:
   ```bash
   docker compose up -d
   ```
2. Zainstaluj pakiety i uruchom API oraz aplikację webową:
   ```bash
   pnpm install
   pnpm --filter api run start:dev
   pnpm --filter web run dev
   ```

## Testowe dane logowania

W celu szybkiego przetestowania aplikacji możesz skorzystać z następującego konta testowego, które jest domyślnie zainicjowane w systemie:

- **Email**: `test@example.com`
- **Hasło**: `password123`

Dane te są domyślnie wypełnione w formularzu logowania ułatwiając szybki dostęp do panelu aplikacji.
