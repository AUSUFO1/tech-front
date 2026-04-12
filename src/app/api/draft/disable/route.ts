import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo')
  const targetPath = redirectTo?.startsWith('/') ? redirectTo : '/'

  const draft = await draftMode()
  draft.disable()

  return NextResponse.redirect(new URL(targetPath, origin))
}
