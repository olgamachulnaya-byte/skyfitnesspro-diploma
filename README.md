# SkyFitnessPro

SkyFitnessPro — веб-приложение для онлайн-тренировок, разработанное в рамках дипломного проекта.

Приложение позволяет пользователю зарегистрироваться, авторизоваться, выбирать спортивные курсы, проходить тренировки и сохранять свой прогресс.

## Демо

Приложение опубликовано на Cloudflare Workers:

https://skyfitnesspro-diploma.olga-machulnaya.workers.dev

## Функциональность

- регистрация пользователя;
- авторизация и выход из аккаунта;
- восстановление пользовательской сессии;
- просмотр каталога курсов;
- просмотр подробной информации о курсе;
- добавление курса из каталога;
- добавление курса со страницы курса;
- удаление курса из профиля;
- просмотр выбранных курсов;
- выбор тренировки;
- просмотр видео тренировки;
- заполнение и обновление прогресса упражнений;
- сохранение прогресса;
- сброс прогресса тренировки;
- сброс прогресса курса;
- адаптивный интерфейс для desktop, tablet и mobile.

## Технологии

- Next.js
- React
- TypeScript
- CSS Modules
- Fetch API
- ESLint
- Prettier
- Jest
- React Testing Library
- OpenNext
- Cloudflare Workers
- Wrangler

## Установка и запуск

Клонируйте репозиторий:

```bash
git clone https://github.com/olgamachulnaya-byte/skyfitnesspro-diploma.git
```

Перейдите в папку проекта:

```bash
cd skyfitnesspro-diploma
```

Установите зависимости:

```bash
npm install
```

Запустите проект в режиме разработки:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:3000
```

## Проверка проекта

Проверка ESLint:

```bash
npm run lint
```

Проверка форматирования Prettier:

```bash
npm run format:check
```

Запуск тестов:

```bash
npm test
```

Production-сборка:

```bash
npm run build
```

## Деплой

Проект настроен для публикации в Cloudflare Workers через OpenNext.

Для деплоя используется команда:

```bash
npm run deploy
```

## Структура проекта

```text
app/          — страницы приложения
components/   — переиспользуемые React-компоненты
context/      — контекст авторизации
hooks/        — пользовательские React-хуки
lib/api/      — функции для работы с API
public/       — изображения и статические файлы
types/        — TypeScript-типы
```
