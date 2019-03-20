const resolvers = {
  Query: {
    users(root, args, { prisma }) {
      return prisma.users()
    },
    user(root, { userId }, { prisma }) {
      return prisma.user({ id: userId })
    },
    posts(root, args, { prisma }) {
      return prisma.posts()
    },
    post(root, { postId }, { prisma }) {
      return prisma.post({ id: postId })
    },
    postsByUser(root, { userId }, { prisma }) {
      return prisma.user({
        id: userId
      }).posts()
    },
    postComments(root, { postId }, { prisma }) {
      return prisma.post({
        id: postId
      }).comments()
    }
  },
  Mutation: {
    createPost(root, { title, content, userId }, { prisma }) {
      return prisma.createPost(
        {
          title,
          content,
          author: {
            connect: { id: userId }
          }
        },

      )
    },
    createUser(root, { username, password }, { prisma }) {
      return prisma.createUser(
        { username, password },
      )
    },
    createComment(root, { text, userId, postId }, { prisma }) {
      return prisma.createComment(
        {
          text,
          writtenBy: {
            connect: { id: userId }
          },
          post: {
            connect: { id: postId }
          }
        }
      )
    }
  },
  User: {
    posts(root, args, context) {
      return context.prisma.user({
        id: root.id
      }).posts()
    }
  },
  Post: {
    author(root, args, context) {
      return context.prisma.post({
        id: root.id
      }).author()
    },
    comments(root, args, { prisma }) {
      return prisma.post({
        id: root.id
      }).comments()
    }
  },
  Comment: {
    writtenBy(root, args, { prisma }) {
      return prisma.comment({
        id: root.id
      }).writtenBy()
    },
    post(root, args, { prisma }) {
      return prisma.comment({
        id: root.id
      }).post()
    }
  }
}

module.exports = resolvers