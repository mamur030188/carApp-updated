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

// // execute the Queries
const executeQuery = async () => {
    const mutation = `
    mutation {
        insertCar(brand: "Nissan", color: "black", doors: 4, type: SUV){
            brand
            color
            id
        }
    }
    
    `
    const resOne = await graphql(schema, mutation, resolvers())
    console.log(resOne.data)
    const mutationWithVariables = `
    mutation insertCar($brand: String!, $color: String!, $doors: Int!, $type: CarTypes!){
        insertCar(brand: $brand, color: $color, doors: $doors, type: $type) {
            brand
            color
            id
        }
    }
    `
    const resTwo = await graphql(schema, mutationWithVariables, resolvers(), null, {
        brand: 'Honda',
        color: 'brown',
        doors: 4,
        type: 'SUV'
    })
    console.log(resTwo.data)
}
executeQuery();
