const { graphql, buildSchema } = require('graphql')
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
`)

// create the resolvers
const resolvers = () => {
    const carsByType = args => {
        return db.cars.filter(car => car.type === args.type)
    }
    const carsById = args => {
        return db.cars.filter(car => car.id === args.id) [0]
    }
    return { carsByType, carsById }
}

// // execute the Queries
const executeQuery = async () => {
    const queryByType = `
        {
            carsByType(type: Coupe){
                brand
                color
                type
                id
            }
        }
    `
    const queryByID = `
        {
            carsById(id:"a") {
                brand
                type
                color
                id
            }
        }
    `
    const responseOne = await graphql(schema, queryByType, resolvers())
    console.log(responseOne.data)
    const responseTwo = await graphql(schema, queryByID, resolvers())
    console.log(responseTwo)
}
executeQuery();
