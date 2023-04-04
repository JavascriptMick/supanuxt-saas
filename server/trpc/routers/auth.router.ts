import { protectedProcedure, router } from '../trpc'

export const authRouter = router({
  getDBUser: protectedProcedure
    .query(({ ctx }) => {
      return {
        dbUser: ctx.dbUser,
      }
    }),
})
