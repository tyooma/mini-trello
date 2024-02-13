import { gql } from '@apollo/client'

export const CREATE_COLUMN = gql`
  mutation CreateColumn($title: String!) {
    createColumn(title: $title) {
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

export const DELETE_COLUMN = gql`
  mutation DeleteColumn($id: ID!) {
    deleteColumn(id: $id)
  }
`

export const CREATE_CARD = gql`
  mutation CreateCard($title: String!, $columnId: ID!) {
    createCard(title: $title, columnId: $columnId) {
      id
      title
      description
    }
  }
`

export const UPDATE_CARD = gql`
  mutation UpdateCard($input: UpdateCardInput!) {
    updateCard(input: $input) {
      id
      title
      description
    }
  }
`

export const MOVE_CARD = gql`
  mutation MoveCard(
    $id: ID!
    $fromColumnId: ID!
    $fromColumnIndex: Int!
    $toColumnId: ID!
    $toColumnIndex: Int!
  ) {
    moveCard(
      id: $id
      fromColumnId: $fromColumnId
      fromColumnIndex: $fromColumnIndex
      toColumnId: $toColumnId
      toColumnIndex: $toColumnIndex
    ) {
      id
      title
      description
    }
  }
`

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`
