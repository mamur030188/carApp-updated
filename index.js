const { ApolloServer, gql } = require('apollo-server')
const { RESTDataSource } = require('apollo-datasource-rest')
const express = require('express')
const db = require('./db.json')

class CarDataAPI extends RESTDataSource {
    async getCar () {
        const data = await this.get('http://localhost:5000/carData')
        return data
    }
}

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
        carsByAPI: Car
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
        },
        carsByAPI: async (parent, args, context, info) => {
            return await context.dataSources.CarDataAPI.getCar()
        }
    },
    // Car: {
    //     brand: (parent, args, context, info) => {
    //         return db.cars.filter(car => car.brand === parent.brand) [0].brand
    //     }
    // },
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
    dataSources: () => {
        return {
            CarDataAPI: new CarDataAPI()
        }
    },
    context: async () => {
        return{ db: await dbConnection() }
    } 
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})



// RESTDataSource 
const app = express()

app.get('/carData', function (req, res){
  res.send({
      id: 'd',
      brand: 'Toyota',
      color: 'Red',
      doors: 4,
      type: 'Coupe'
    
  })  
})

app.listen(5000)

