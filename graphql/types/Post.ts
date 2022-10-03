import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay'
import { extendType, list, nonNull, objectType, stringArg } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.string('id')
    t.int('index')
    t.string('description')
    t.string('imageUrl')
    t.list.string('tags')
  }
})

export const PostsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('posts', {
      type: Post,
      resolve: async (_, { after, first }, ctx) => {
        //
        //
        const offset = after ? cursorToOffset(after) + 1 : 0
        if (isNaN(offset)) throw new Error('cursor is invalid')

        const [totalCount, items] = await Promise.all([
          ctx.prisma.post.count(),
          ctx.prisma.post.findMany({
            take: first,
            skip: offset
          })
        ])

        return connectionFromArraySlice(
          items,
          { first, after },
          { sliceStart: offset, arrayLength: totalCount }
        )
      }
    })
  }
})

export const CreatePostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createPost', {
      type: Post,
      args: {
        imageUrl: nonNull(stringArg()),
        description: nonNull(stringArg()),
        tags: list(stringArg())
      },
      async resolve(_parent, args, ctx) {
        //
        //
        if (!ctx.user) {
          throw new Error(`You need to be logged in to perform an action`)
        }

        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.user.email
          }
        })

        if (user.role !== 'ADMIN') {
          throw new Error(`You do not have permission to perform action`)
        }

        const newPost = {
          imageUrl: args.imageUrl,
          description: args.description,
          tags: args.tags
        }

        return await ctx.prisma.post.create({
          data: newPost
        })
      }
    })
  }
})
