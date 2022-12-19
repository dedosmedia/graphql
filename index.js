import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';
import { v1 as uuid }from 'uuid'


const persons = [
    {
        name : "Diego",
        phone: "11111",
        street: "Cll 13",
        city: "Armenia",
        id: "0939f557-219a-4d3f-a873-bed461eea71d"
    },
    {
        name : "Ariana",
        phone: "222",
        street: "Cll 13",
        city: "Armenia",
        id: "cfed97e5-0a92-4c90-9333-fe489511d688"
    },

    {
        name : "Teo",
        street: "Cll 13",
        city: "Armenia",
        id: "60ca7f2c-aa7a-44da-93fa-7ac98171fa56"
    },    
]


const typeDefs = `#graphql
    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: ( root, args) => {
            console.log(args)
            const { name } = args
            return persons.find( person => {
                console.log("ES: "+person.name)
                return person.name === name
            })
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            const person = {...args, id:uuid()}
            persons.push(person)
            return person

        }
    },
    Person : {
        address: (root) => {
            return {
                street: root.street,
                city: root.city,
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})


const { url } = await startStandaloneServer( server, {
    listen: { port: 4000 },
})

console.log(` Server ready at ${url}`)