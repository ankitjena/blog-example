const express = require('express')
const { altairExpress } = require('altair-express-middleware')
const { VoyagerServer, gql } = require('@aerogear/voyager-server')
const { prisma } = require('./generated/prisma-client')

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(userId: ID!): User
    posts: [Post!]!
    post(postId: ID!): Post
    postsByUser(userId: ID!): [Post!]!
    postComments(postId: ID!): [Comment!]!
  }

  type Mutation {
    createUser(username: String!, password: String!): User
    createPost(title: String!, content: String!, userId: ID!): Post
    createComment(text: String!, userId: ID!, postId: ID!): Comment
  }

  type User {
    id: ID!
    username: String!
    name: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    writtenBy: User
    post: Post
  }
`

// Resolver functions. This is our business logic
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

// Initialize the voyager server with our schema and context
const server = VoyagerServer({
  typeDefs,
  resolvers,
  playground: false,
  context: {
    prisma
  }
})

const app = express()
app.use('/graphql', altairExpress({
  endpoint: 'graphql'
}))
server.applyMiddleware({ app })

const port = 4000
app.get('/', (req, res) => res.send('ok'))
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)