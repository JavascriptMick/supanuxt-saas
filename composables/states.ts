import { Membership, Note } from ".prisma/client"

export type AppState = {
  activeMembership?: Membership
  notes: Note[]
}

export const appState = () => useState<AppState>('appState', () => ({
  notes: []
}));