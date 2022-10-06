import { getAllSessions } from '@utils/session';
import { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    me: async (ref, params, ctx) => {
      ctx.auth.assertAuth();
      const user = await ctx.auth.fetchUser();
      return {
        id: user.id,
        discordId: user.discordId,
      };
    },
  },
  User: {
    sessions: async (ref, params, ctx) => {
      ctx.auth.assertAuth();
      const user = await ctx.auth.fetchUser();
      return (await getAllSessions(user.id)).map((v) => ({
        id: v.id,
      }));
    },
  },
};
export default resolvers;
