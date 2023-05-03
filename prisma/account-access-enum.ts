// Workaround for prisma issue (https://github.com/prisma/prisma/issues/12504#issuecomment-1147356141)

// Import original enum as type
import type { ACCOUNT_ACCESS as ACCOUNT_ACCESS_ORIGINAL } from '@prisma/client'

// Guarantee that the implementation corresponds to the original type
export const ACCOUNT_ACCESS: { [k in ACCOUNT_ACCESS_ORIGINAL ]: k } = {
  READ_ONLY: 'READ_ONLY',
  READ_WRITE: 'READ_WRITE',
  ADMIN: 'ADMIN',
  OWNER: 'OWNER'
} as const

// Re-exporting the original type with the original name
export type ACCOUNT_ACCESS = ACCOUNT_ACCESS_ORIGINAL