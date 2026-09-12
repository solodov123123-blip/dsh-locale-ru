/** Aggregated export of all Russian dictionaries. */
import { coreDictionaries } from './core.ts'
import { taskBoardRu } from './task-board.ts'
import { aionuiPanelRu } from './aionui-panel.ts'
import { petRu } from './pet.ts'
import { sshRu } from './ssh.ts'
import { gitGraphRu } from './git-graph.ts'
import { skinCenterRu } from './skin-center.ts'
import { webUiSettingsRu } from './web-ui-settings.ts'
import { liveStatsRu } from './live-stats.ts'
import { describeImageRu } from './describe-image.ts'
import { remoteWebUiRu } from './remote-web-ui.ts'
import { dshmarketRu } from './dshmarket.ts'
import { agentTeamsRu } from './agent-teams.ts'
import { modlensRu } from './modlens.ts'
import { communityPluginsRu } from './community-plugins.ts'
import { cordisRu } from './cordis.ts'
import { sessionLogDownloadRu } from './session-log-download.ts'
import { antigravityRu } from './antigravity.ts'
import { animeVfxRu } from './anime-vfx.ts'
import { skillExplorerRu } from './skill-explorer.ts'
import { archiveManagerRu } from './archive-manager.ts'
import { pluginManagerRu } from './plugin-manager.ts'
import { marketRu } from './market.ts'
import { betterSidebarRu } from './better-sidebar.ts'
import { desktopLauncherRu } from './desktop-launcher.ts'
import { doctorRu } from './doctor.ts'
import { chatRecoveryRu } from './chat-recovery.ts'

export {
  coreDictionaries,
  taskBoardRu,
  aionuiPanelRu,
  petRu,
  sshRu,
  gitGraphRu,
  skinCenterRu,
  webUiSettingsRu,
  liveStatsRu,
  describeImageRu,
  remoteWebUiRu,
  dshmarketRu,
  agentTeamsRu,
  modlensRu,
  communityPluginsRu,
  cordisRu,
  sessionLogDownloadRu,
  antigravityRu,
  animeVfxRu,
  skillExplorerRu,
  archiveManagerRu,
  pluginManagerRu,
  marketRu,
  betterSidebarRu,
  desktopLauncherRu,
  doctorRu,
  chatRecoveryRu,
}

export const ALL_RUSSIAN_DICTIONARIES: Record<string, Record<string, string>> = {
  ...coreDictionaries,
  'task-board': taskBoardRu,
  'aionui-panel': aionuiPanelRu,
  'pet': petRu,
  'dsh-ssh': sshRu,
  'git-graph': gitGraphRu,
  'skinCenter': skinCenterRu,
  'web-ui-plugins': webUiSettingsRu,
  'live-stats': liveStatsRu,
  'describe-image': describeImageRu,
  'remote': remoteWebUiRu,
  'dsh-market': marketRu,
  'dshmarket': marketRu,
  'dsh-web-ui-market': marketRu,
  'market': marketRu,
  '@linxin666/dsh-client-ui-market': marketRu,
  'agent-teams': agentTeamsRu,
  'modlens': modlensRu,
  'community-plugins': communityPluginsRu,
  'dsh-community-plugins': communityPluginsRu,
  '@linxin666/dsh-client-ui-community-plugins': communityPluginsRu,
  'cordis': cordisRu,
  'ui-cordis': cordisRu,
  'session-log-download': sessionLogDownloadRu,
  'antigravity': antigravityRu,
  'anime-vfx': animeVfxRu,
  'anime-response-vfx': animeVfxRu,
  'dsh-skill-explorer': skillExplorerRu,
  'skill-explorer': skillExplorerRu,
  '@linxin666/dsh-client-ui-skill-explorer': skillExplorerRu,
  'archive-manager': archiveManagerRu,
  'dsh-archive-manager': archiveManagerRu,
  '@mlgbnb/dsh-archive-manager': archiveManagerRu,
  'settings.pluginManager': pluginManagerRu,
  'plugin-manager': pluginManagerRu,
  'family-plugins': pluginManagerRu,
  '@linxin666/dsh-client-ui-plugin-manager': pluginManagerRu,
  'betterSidebar': betterSidebarRu,
  'dsh-better-sidebar': betterSidebarRu,
  'desktop-launcher': desktopLauncherRu,
  '@linxin666/dsh-desktop-launcher': desktopLauncherRu,
  'doctor': doctorRu,
  'dsh-doctor': doctorRu,
  '@linxin666/dsh-doctor': doctorRu,
  'chat-recovery': chatRecoveryRu,
  '@linxin666/dsh-chat-recovery': chatRecoveryRu,
}
