const { ApolloServer, gql } = require('apollo-server')
const db = require('./db.json')



// create the schema . buildSchema replaces with "gql"
const schema = gql(`
    enum CarTypes {
        Sedan
        SUV
        Coupe
    }
    type Car {
        id: ID!
        brand: String!
        color: String!
        doors: Int!
        type: CarTypes!
    }
    type Query {
        carsByType(type:CarTypes!): [Car]
        carsById(id: ID!): Car
    }
    type Mutation {
        insertCar(brand: String!, color: String!, doors: Int!, type: CarTypes!): [Car]!
    }
`)

// create the resolver map 
const resolvers = {
    Query: {
        carsByType: (parent, args, context, info) => {
            return context.db.cars.filter(car => car.type === args.type)
        },
        carsById: (parent, args, context, info) => {
            return context.db.cars.filter(car => car.id === args.id) [0]
        }
    },
    Car: {
        brand: (parent, args, context, info) => {
            return db.cars.filter(car => car.brand === parent.brand) [0].brand
        }
    },
    Mutation: {
        insertCar: (_, { brand, color, doors, type }) => {
            context.db.cars.push({
                id: Math.random().toString(),
                brand: brand,
                color: color,
                doors: doors,
                type: type
            })
            return db.cars
        }
    }
}

const dbConnection = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(db)
        }, 2000)
    })
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async () => {
        return{ db: await dbConnection() }
    } 
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})




// const app = express()

// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: resolvers(),
//     graphiql: true
// }))

// app.listen(3000)

// console.log('GraphQL server is listening on PORT 3000')
