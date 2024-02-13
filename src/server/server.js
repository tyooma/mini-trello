const { ApolloServer, gql } = require('apollo-server')

let columns = [
  { id: '1', title: 'To Do', cards: [] },
  { id: '2', title: 'In Development', cards: [] },
  { id: '3', title: 'QA', cards: [] },
  { id: '4', title: 'Done', cards: [] },
]

const typeDefs = gql`
  type Card {
    id: ID!
    title: String!
    description: String!
    createdAt: String!
  }

  type Column {
    id: ID!
    title: String!
    cards: [Card!]!
  }

  type Query {
    cards: [Card!]!
    columns: [Column!]!
    columnCards(columnId: ID!): [Card!]!
    columnCardsSortedByDate(columnId: ID!): [Card!]!
  }

  input UpdateCardInput {
    id: ID!
    title: String!
    description: String!
  }

  type Mutation {
    createCard(title: String!, columnId: ID!): Card!
    createColumn(title: String!): Column!
    deleteColumn(id: ID!): Boolean!
    updateCard(input: UpdateCardInput!): Card!
    moveCard(
      id: ID!
      fromColumnId: ID!
      fromColumnIndex: Int!
      toColumnId: ID!
      toColumnIndex: Int!
    ): Card!
    deleteCard(id: ID!): Boolean!
  }
`

const resolvers = {
  Query: {
    cards: () => cards,
    columns: () => columns,
    columnCards: (_, { columnId }) => {
      const column = columns.find(col => col.id === columnId)
      if (column) {
        return column.cards
      } else {
        return []
      }
    },
    columnCardsSortedByDate: (_, { columnId }) => {
      const column = columns.find(col => col.id === columnId)
      if (column && column.cards) {
        const sortedCards = column.cards
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        return sortedCards
      } else {
        return []
      }
    },
  },
  Mutation: {
    createCard: (_, { title, columnId }) => {
      const column = columns.find(col => col.id === columnId)
      if (column) {
        const newCard = {
          id: Date.now(),
          title,
          description: '',
          createdAt: new Date().toISOString(),
        }
        column.cards.unshift(newCard)
        return newCard
      } else {
        throw new Error('Column not found')
      }
    },
    createColumn: (_, { title }) => {
      const newColumn = { id: String(columns.length + 1), title, cards: [] }
      columns.push(newColumn)
      return newColumn
    },
    deleteColumn: (_, { id }) => {
      const index = columns.findIndex(column => column.id === id)
      if (index !== -1) {
        columns.splice(index, 1)
        return true
      }
      return false
    },
    updateCard: (_, { input }) => {
      const { id, title, description } = input
      for (const column of columns) {
        const cardIndex = column.cards.findIndex(card => card.id == id)
        if (cardIndex !== -1) {
          column.cards[cardIndex].title = title
          column.cards[cardIndex].description = description
          return column.cards[cardIndex]
        }
      }
      throw new Error('Card not found')
    },
    moveCard: (
      _,
      { id, fromColumnId, fromColumnIndex, toColumnId, toColumnIndex }
    ) => {
      const fromColIndex = columns.findIndex(
        column => column.id === fromColumnId
      )
      const toColIndex = columns.findIndex(column => column.id === toColumnId)

      if (fromColIndex === -1) {
        throw new Error('Column from which the card is to be moved not found')
      }

      if (toColIndex === -1) {
        throw new Error('Column to which the card is to be moved not found')
      }

      const fromColumn = columns[fromColIndex]
      const toColumn = columns[toColIndex]

      const movedCardIndex = fromColumn.cards.findIndex(
        card => card.id == Number(id)
      )

      if (movedCardIndex === -1) {
        throw new Error('Card not found in the specified column')
      }

      const movedCard = fromColumn.cards.splice(fromColumnIndex, 1)[0]

      if (fromColumnId === toColumnId) {
        toColumn.cards.splice(toColumnIndex, 0, movedCard)
      } else {
        toColumn.cards.splice(toColumnIndex, 0, movedCard)
      }

      return movedCard
    },
    deleteCard: (_, { id }) => {
      for (const column of columns) {
        const index = column.cards.findIndex(card => card.id == id)
        if (index !== -1) {
          column.cards.splice(index, 1)
          return true
        }
      }
      return false
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
