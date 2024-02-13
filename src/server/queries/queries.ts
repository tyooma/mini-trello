import { gql } from '@apollo/client'

export const GET_DEFAULT_COLUMNS = gql`
  query GetDefaultColumns {
    columns {
      id
      title
      cards {
        id
        title
        description
      }
    }
  }
`

export const GET_COLUMN_CARDS = gql`
  query GetColumnCards($columnId: ID!) {
    columnCards(columnId: $columnId) {
      id
      title
      description
      createdAt
    }
  }
`

export const GET_COLUMN_CARDS_SORTED_BY_DATE = gql`
  query GetColumnCardsSortedByDate($columnId: ID!) {
    columnCardsSortedByDate(columnId: $columnId) {
      id
      title
      description
      createdAt
    }
  }
`
