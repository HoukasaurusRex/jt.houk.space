import { computed } from 'vue'
import { usePageData } from '@vuepress/client'
import { useBlogType } from '@vuepress/plugin-blog/client'

export function useRecommendedArticles(maxResults = 5) {
  const page = usePageData()
  const type = useBlogType('articles')

  return computed(() => {
    const currentPath = page.value.path
    const currentTags: string[] = (page.value.frontmatter.tags as string[]) || []
    const titleWords = new Set(
      (page.value.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 3)
    )

    return type.value.items
      .filter(a => a.path !== currentPath)
      .map(article => {
        const articleTags: string[] = article.info.tag || []
        const sharedTags = articleTags.filter(t => currentTags.includes(t))
        const sharedWords = (article.info.title || '').toLowerCase()
          .split(/\W+/).filter(w => titleWords.has(w)).length
        return { ...article, score: sharedTags.length * 3 + sharedWords, sharedTags }
      })
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
  })
}
