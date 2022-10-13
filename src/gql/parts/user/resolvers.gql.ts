import { ErrorCodes, GraphQLError } from '@gql/errors';
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
    mutualGuilds: async (ref, params, ctx) => {
      ctx.auth.assertAuth();
      const user = await ctx.auth.fetchUser();
      return {
        guilds: await ctx.loaders.user.mutualGuilds.load(user.discordId),
      };
    },
  },
  User: {
    sessions: async (ref, params, ctx) => {
      ctx.auth.assertAuth();
      const user = await ctx.auth.fetchUser();
      // the user can only access their own session list
      if (user.id !== ref.id) throw new GraphQLError(ErrorCodes.NotAllowed);

      return (await getAllSessions(ref.id)).map((v) => ({
        id: v.id,
      }));
    },
    discord: async (ref, params, ctx) => {
      return await ctx.loaders.user.discordUser.load(ref.discordId);
    },
  },
};
export default resolvers;
