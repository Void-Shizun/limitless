import {betterAuth} from 'better-auth'
import {prismaAdapter} from 'better-auth/adapters/prisma'
import { PrismaClient } from './generated/prisma/client'

import {nextCookies} from 'better-auth/next-js'

import {Pool} from 'pg'
import {PrismaPg} from '@prisma/adapter-pg'

const pool = new Pool({connectionString: process.env.DATABASE_URL})
const dbAdapter = new PrismaPg(pool)

const prisma = new PrismaClient({adapter: dbAdapter})

export const auth = betterAuth({
    database: prismaAdapter(prisma, {provider: 'postgresql'}),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }
    },
    user: {
        additionalFields: {
            surname: {
                type: 'string',
                required: false,
                input: true
            },

            idNumber: {
                type: 'string',
                required: false,
                input: true
            }
        }
    },
    //trustedOrigins: ["http://localhost:3000"],
    
    plugins: [nextCookies()]
})