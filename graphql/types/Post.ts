import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay'
import { extendType, list, nonNull, objectType, stringArg } from 'nexus'
import { getS3SignedUrlById } from '../../services/s3-helper'

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
            skip: offset,
            orderBy: { createdAt: 'asc' }
          })
        ])

        const images = items.map((post) => {
          const { imageUrl, ...rest } = post
          const signedUrl = getS3SignedUrlById(imageUrl)
          return {
            ...rest,
            imageUrl: signedUrl
          }
        })

        return connectionFromArraySlice(
          images,
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
        id: nonNull(stringArg()),
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
          id: args.id,
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

export const UpdatePostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updatePost', {
      type: Post,
      args: {
        id: nonNull(stringArg()),
        description: stringArg(),
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

        return await ctx.prisma.post.update({
          where: {
            id: args.id
          },
          data: {
            description: args.description,
            tags: args.tags
          }
        })
      }
    })
  }
})
