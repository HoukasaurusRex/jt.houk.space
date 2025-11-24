import { getDirname, path } from 'vuepress/utils'
import type { Theme } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'

const __dirname = getDirname(import.meta.url)

const localTheme = (): Theme => {
  return {
    name: 'vuepress-theme-local',
    extends: defaultTheme({}),
    clientConfigFile: path.resolve(__dirname, 'clientConfig.ts'),
  }
}

export default localTheme
