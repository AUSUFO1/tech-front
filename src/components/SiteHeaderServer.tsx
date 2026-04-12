import {getNavigationQuickLinks} from '@/lib/content'
import {SiteHeader} from '@/components/SiteHeader'

export async function SiteHeaderServer() {
  const quickLinks = await getNavigationQuickLinks()

  return <SiteHeader quickLinks={quickLinks} />
}
