const express = require('express')
const { altairExpress } = require('altair-express-middleware')
const { VoyagerServer } = require('@aerogear/voyager-server')
const { prisma } = require('./generated/prisma-client')
const typeDefs = require('./src/schema')
const resolvers = require('./src/resolvers')

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