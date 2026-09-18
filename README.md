# dsh-locale-ru

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: DeepSeek Harness](https://img.shields.io/badge/Platform-DeepSeek%20Harness-blue.svg)](https://github.com/dataelement/dsh-desktop)
[![Cordis Runtime](https://img.shields.io/badge/Runtime-Cordis%204.0-purple.svg)](https://cordis.moe)

Комплексный плагин русской локализации для **DeepSeek Harness (DSH)** и десктопного клиента **DSH Desktop**.

Плагин построен на базе микроядерной архитектуры **Cordis** и объединяет статическую инжекцию словарей в рантайм `@deepseek-ai/dsh-client-locale` с динамическим DOM-транслятором.

---

## Возможности

- **Глубокий охват интерфейса (34 словаря):**
  - **Ядро DSH:** Чат, Планы, Цели, Сессии, Модели, Настройки, Разрешения, Рабочие области, Подтверждения, Задачи и Субагенты.
  - **Плагины экосистемы маркета:**
    - `dsh-better-sidebar` (Улучшенная боковая панель)
    - `@nanmicoder/dsh-agent-teams` (Команды агентов)
    - `@liustack/modlens` (Анализатор модулей)
    - `dshmarket` (Магазин плагинов DSH Market)
    - `dsh-client-ui-task-board` (Доска задач)
    - `dsh-client-ui-git-graph` (Git-граф)
    - `dsh-client-ui-skill-explorer` (Проводник навыков)
    - `dsh-univer-office` (Офисные документы)
    - `pet` (Ассистент-маскот)
    - и другие.
- **Штатная регистрация языка:** Официально регистрирует язык `Русский` (`ru`) в каталоге локалей с цепочкой фоллбека на английский (`fallback: en`). Пункт «Русский» отображается в меню выбора языка: **Настройки → Общие → Язык**.
- **Динамический DOM-транслятор:** Перехватывает новые текстовые узлы через `MutationObserver` и переводит оставшиеся нелокализованные фразы на лету.
- **Хук загрузчика модулей:** Перехватывает внешние плагины через `window.__ModuleLoader__`, подгружаемые после инициализации ядра.

---

## Установка

### Вариант 1. Через командную строку DeepSeek Harness (Рекомендуемый)

Выполните команду в терминале вашего профиля DSH:

```bash
dsh plugin --profile web add github:solodov123123-blip/dsh-locale-ru
```

После установки перезапустите DSH Desktop.

---

### Вариант 2. Ручная установка в профиль

1. Клонируйте репозиторий в каталог локальных плагинов профиля (`%APPDATA%\dsh-desktop\harness\profiles\web\local_plugins\dsh-locale-ru`):
   ```bash
   git clone https://github.com/solodov123123-blip/dsh-locale-ru.git
   ```

2. В файле `package.json` профиля добавьте зависимость и бандл:
   ```json
   {
     "dependencies": {
       "dsh-locale-ru": "link:./local_plugins/dsh-locale-ru"
     },
     "dsh": {
       "profile": {
         "bundles": [
           "@deepseek-ai/dsh-base",
           "@deepseek-ai/dsh-web-app",
           "dsh-locale-ru"
         ]
       }
     }
   }
   ```

3. В файле `settings.yaml` (в каталоге `$DSH_HOME`) задайте предпочтительный язык:
   ```yaml
   locale:
     preference: ru
   ```

4. Перезапустите DSH Desktop.

---

## Сборка из исходников

Если вы хотите доработать TypeScript-код или дополнить словари:

```bash
# Установка зависимостей
pnpm install

# Сборка клиентского и хостового бандлов
pnpm run bundle

# Режим наблюдения при разработке
pnpm run watch
```

---

## Участие в разработке (Contributing)

Если вы заметили непереведенную строку или хотите добавить словарь для нового плагина:
1. Сделайте Fork репозитория.
2. Добавьте фразы в `src/client/dictionaries/` или дополните регулярные выражения в `src/client/dictionaries/phrases.ts`.
3. Создайте Pull Request — любые улучшения приветствуются!

---

## Лицензия

Распространяется под лицензией [MIT](LICENSE).
