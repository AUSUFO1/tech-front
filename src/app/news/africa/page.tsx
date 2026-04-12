import {NewsCategoryPage} from '@/components/NewsCategoryPage'

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{page?: string}>
}) {
  const params = (await searchParams) ?? {}
  return <NewsCategoryPage slug="africa" page={params.page} />
}
