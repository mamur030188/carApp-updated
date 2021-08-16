const { graphql, buildSchema } = require('graphql')
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const db = require('./db.json')



// create the schema
const schema = buildSchema(`
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

// create the resolvers
const resolvers = () => {
    const carsByType = args => {
        return db.cars.filter(car => car.type === args.type)
    }
    const carsById = args => {
        return db.cars.filter(car => car.id === args.id) [0]
    }
    const insertCar = ({ brand, color, doors, type }) => {
        db.cars.push({
            id: Math.random().toString(),
            brand: brand,
            color: color,
            doors: doors,
            type: type
        })
        return db.cars
    }
    return { carsByType, carsById, insertCar }
}

const app = express()

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers(),
    graphiql: true
}))

app.listen(3000)

console.log('GraphQL server is listening on PORT 3000')
