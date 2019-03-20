const { gql } = require('@aerogear/voyager-server')

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

module.exports = typeDefs