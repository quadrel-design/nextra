import { notFound } from 'next/navigation'
import { getRouteToFilepath } from '../server/page-map/get.js'
import { logger } from '../server/utils.js'

export async function importPage(pathSegments: string[] = [], lang = '') {
  const RouteToFilepath = await getRouteToFilepath(lang)

  const pagePath = RouteToFilepath[pathSegments.join('/')]
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Require statement enables Fast Refresh
    return require(`private-next-content-dir/${lang && `${lang}/`}${pagePath}`)
  } catch (error) {
    logger.error('Error while loading', { pathSegments }, error)
    notFound()
  }
}

export const generateStaticParamsFor =
  (segmentKey: string, localeSegmentKey = 'lang') =>
  async () => {
    const locales = JSON.parse(process.env.NEXTRA_LOCALES!) as string[]
    const result = []

    for (const locale of locales) {
      const RouteToFilepath = await getRouteToFilepath(locale)
      const routes = Object.keys(RouteToFilepath)

      result.push(
        ...routes.map(route => ({
          ...(locale && { [localeSegmentKey]: locale }),
          [segmentKey]: route.split('/')
        }))
      )
    }
    return result
  }
