// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import {
  apply,
  translatePhrase,
  translateDomTree,
  startDomTranslator,
  stopDomTranslator,
} from '../src/client/index.ts'

describe('dsh-client-locale-ru', () => {
  let ctx: Context
  let locale: LocaleRuntime

  beforeEach(() => {
    ctx = new Context()
    locale = new LocaleRuntime(ctx)
    ctx.provide('locale', locale)
  })

  afterEach(() => {
    stopDomTranslator()
  })

  it('should register Russian dictionaries and set active locale to ru', () => {
    apply(ctx)

    // Check active locale
    expect(locale.getLocale().active).toBe('ru')
    expect(document.documentElement.lang).toBe('ru')

    // Test common
    const tCommon = locale.bind('common')
    expect(tCommon('ok')).toBe('OK')
    expect(tCommon('cancel')).toBe('Отмена')
    expect(tCommon('copy')).toBe('Копировать')
    expect(tCommon('copied')).toBe('Скопировано')

    // Test task-board
    const tTaskBoard = locale.bind('task-board')
    expect(tTaskBoard('entry.label')).toBe('Канбан-доска')
    expect(tTaskBoard('board.new')).toBe('Новая задача')

    // Test pet
    const tPet = locale.bind('pet')
    expect(tPet('pet.feed')).toBe('Покормить')
    expect(tPet('settings.title')).toBe('Виртуальный питомец')

    // Test community-plugins
    const tCommunity = locale.bind('community-plugins')
    expect(tCommunity('settings.title')).toBe('Плагины сообщества')

    // Test skill-explorer (Image 1)
    const tSkill = locale.bind('dsh-skill-explorer' as any)
    expect(tSkill('entry.label' as any)).toBe('Центр навыков')
    expect(tSkill('tab.list' as any)).toBe('Навыки')
    expect(tSkill('tab.create' as any)).toBe('Создать')
    expect(tSkill('refresh' as any)).toBe('Обновить')
    expect(tSkill('close' as any)).toBe('Закрыть')
    expect(tSkill('groupHint.user-dsh' as any)).toBe('Все проекты на этой машине')

    // Test archive-manager (Image 2 & 3)
    const tArchive = locale.bind('archive-manager' as any)
    expect(tArchive('title' as any)).toBe('Управление архивом')
    expect(tArchive('description' as any)).toBe('Просмотр, восстановление или полное физическое удаление архивированных сессий.')
    expect(tArchive('searchPlaceholder' as any)).toBe('Поиск по архивированным чатам')
    expect(tArchive('deleteAll' as any)).toBe('Удалить все')
    expect(tArchive('allProjects' as any)).toBe('Все проекты')

    // Test plugin-manager (Image 5)
    const tPluginManager = locale.bind('settings.pluginManager' as any)
    expect(tPluginManager('tab' as any)).toBe('Управление плагинами')
    expect(tPluginManager('userPlugins' as any)).toBe('Пользовательские плагины')
    expect(tPluginManager('install' as any)).toBe('Установить')
    expect(tPluginManager('enabled' as any)).toBe('Включен')
    expect(tPluginManager('uninstall' as any)).toBe('Удалить')

    // Test market (Image 2 & 4)
    const tMarket = locale.bind('dsh-web-ui-market' as any)
    expect(tMarket('settings.title' as any)).toBe('Мастерская')
    expect(tMarket('settings.notExposed' as any)).toBe('Этот раздел настроек не предоставлен (отсутствует пространство имен хоста)')
    expect(tMarket('install' as any)).toBe('Установить')

    // Test better-sidebar
    const tSidebar = locale.bind('betterSidebar' as any)
    expect(tSidebar('files' as any)).toBe('Файлы')
    expect(tSidebar('terminal' as any)).toBe('Терминал')
    expect(tSidebar('editor' as any)).toBe('Редактор')
    expect(tSidebar('git' as any)).toBe('Управление версиями')

    // Test desktop-launcher
    const tLauncher = locale.bind('desktop-launcher' as any)
    expect(tLauncher('settings.title' as any)).toBe('Лаунчер рабочего стола')
    expect(tLauncher('settings.create' as any)).toBe('Создать ярлык на рабочем столе')

    // Test doctor
    const tDoctor = locale.bind('doctor' as any)
    expect(tDoctor('settings.title' as any)).toBe('Консоль восстановления Doctor')
    expect(tDoctor('host.available' as any)).toBe('Doctor онлайн')

    // Test chat-recovery
    const tRecovery = locale.bind('chat-recovery' as any)
    expect(tRecovery('edit.button' as any)).toBe('Редактировать')
    expect(tRecovery('retry.button' as any)).toBe('Повторить')

    // Test core namespaces
    const tCordis = locale.bind('cordis')
    expect(tCordis('status.active')).toBe('Смонтирован')

    const tSessionLog = locale.bind('session-log-download' as any)
    expect(tSessionLog('button.label' as any)).toBe('Скачать лог сессии')

    const tConv = locale.bind('conversation')
    expect(tConv('hint.plan')).toBe('Опишите задачу для составления плана')
    expect(tConv('placeholder.default')).toBe('Отправить сообщение агенту')

    const tSettingsModels = locale.bind('settings.models')
    expect(tSettingsModels('title')).toBe('Модели')
    expect(tSettingsModels('welcomeTitle')).toBe('Уведомление о внутреннем тестировании')
  })

  it('should test translatePhrase exact and pattern matches', () => {
    expect(translatePhrase('复制')).toBe('Копировать')
    expect(translatePhrase('复制成功')).toBe('Скопировано')
    expect(translatePhrase('Save')).toBe('Сохранить')
    expect(translatePhrase('Cancel')).toBe('Отмена')
    expect(translatePhrase('技能中心')).toBe('Центр навыков')
    expect(translatePhrase('归档管理')).toBe('Управление архивом')
    expect(translatePhrase('创意工坊')).toBe('Мастерская')
    expect(translatePhrase('插件管理')).toBe('Управление плагинами')
    expect(translatePhrase('34 个聊天')).toBe('34 чатов')
    expect(translatePhrase('用户技能 (~/.dsh/skills) 5 个')).toBe('Пользовательские навыки (~/.dsh/skills) 5 шт.')
    expect(translatePhrase('已安装 0.1.9')).toBe('Установлено 0.1.9')
    expect(translatePhrase('展开其余 12 行差异')).toBe('Развернуть оставшиеся 12 строк различий')
    expect(translatePhrase('退出码 1')).toBe('Код возврата 1')
  })

  it('should translate complex DOM structures matching user UI screenshots', () => {
    const container = document.createElement('div')
    container.innerHTML = `
      <div class="header">
        <span>技能中心</span>
        <button>刷新</button>
        <button>关闭</button>
      </div>
      <div class="tabs">
        <button class="tab">技能</button>
        <button class="tab">创建</button>
      </div>
      <div class="section">
        <span>用户技能 (~/.dsh/skills) 5 个</span>
        <span>本机所有项目</span>
      </div>
      <div class="item">
        <span class="badge">可用: 模型 / 用户</span>
        <button class="delete-btn">删除</button>
      </div>
      <div class="archive-section">
        <h2>归档管理</h2>
        <input placeholder="搜索已归档聊天" />
        <button>全部删除</button>
        <span>34 个聊天</span>
      </div>
      <div class="plugin-section">
        <span class="tab">插件管理</span>
        <input placeholder="npm 包名 (如 @scope/name) 或 git 仓库 URL" />
        <button>安装</button>
        <span class="status">已开启</span>
        <span class="version">已安装 0.3.3</span>
        <button>卸载</button>
      </div>
    `
    document.body.appendChild(container)

    translateDomTree(container)

    expect(container.querySelector('.header span')!.textContent).toBe('Центр навыков')
    expect(container.querySelectorAll('.header button')[0].textContent).toBe('Обновить')
    expect(container.querySelectorAll('.header button')[1].textContent).toBe('Закрыть')
    expect(container.querySelectorAll('.tabs button')[0].textContent).toBe('Навыки')
    expect(container.querySelectorAll('.tabs button')[1].textContent).toBe('Создать')
    expect(container.querySelectorAll('.section span')[0].textContent).toBe('Пользовательские навыки (~/.dsh/skills) 5 шт.')
    expect(container.querySelectorAll('.section span')[1].textContent).toBe('Все проекты на этой машине')
    expect(container.querySelector('.badge')!.textContent).toBe('Доступно: Модель / Пользователь')
    expect(container.querySelector('.delete-btn')!.textContent).toBe('Удалить')
    expect(container.querySelector('.archive-section h2')!.textContent).toBe('Управление архивом')
    expect(container.querySelector('.archive-section input')!.getAttribute('placeholder')).toBe('Поиск по архивированным чатам')
    expect(container.querySelector('.archive-section button')!.textContent).toBe('Удалить все')
    expect(container.querySelector('.archive-section span')!.textContent).toBe('34 чатов')
    expect(container.querySelector('.plugin-section .tab')!.textContent).toBe('Управление плагинами')
    expect(container.querySelector('.plugin-section input')!.getAttribute('placeholder')).toBe('Имя пакета npm (например @scope/name) или URL git-репозитория')
    expect(container.querySelector('.plugin-section button')!.textContent).toBe('Установить')
    expect(container.querySelector('.plugin-section .status')!.textContent).toBe('Включен')
    expect(container.querySelector('.plugin-section .version')!.textContent).toBe('Установлено 0.3.3')

    document.body.removeChild(container)
  })
})
