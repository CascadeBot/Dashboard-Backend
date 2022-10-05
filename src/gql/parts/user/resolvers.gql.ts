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
};
export default resolvers;
