import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  getDBUser: publicProcedure
    .query(({ ctx }) => {
      return {
        dbUser: ctx.dbUser,
      }
    }),
})
