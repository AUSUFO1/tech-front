import {Resend} from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? 'GizPulse <onboarding@resend.dev>'
export const resendReplyToEmail = process.env.RESEND_REPLY_TO_EMAIL?.trim() || undefined
