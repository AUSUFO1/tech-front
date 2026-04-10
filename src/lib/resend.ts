import {Resend} from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? 'Techfront <onboarding@resend.dev>'
