import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import Column from './Column'
import { GET_DEFAULT_COLUMNS } from '../server/queries/queries'
import {
  CREATE_COLUMN,
  DELETE_COLUMN,
  MOVE_CARD,
} from '../server/mutations/mutations'

const Board: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_DEFAULT_COLUMNS)
  const [createColumn] = useMutation(CREATE_COLUMN)
  const [deleteColumn] = useMutation(DELETE_COLUMN)
  const [moveCard] = useMutation(MOVE_CARD)

  const handleCreateColumn = async () => {
    const title = prompt('Enter column title:') || ''
    if (title.trim() !== '') {
      await createColumn({ variables: { title } })
      refetch()
    }
  }

  const handleDeleteColumn = (id: string) => {
    deleteColumn({ variables: { id } })
    refetch()
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    console.log(result)

    const fromColumnId = result.source.droppableId
    const fromColumnIndex = result.source.index
    const toColumnId = result.destination.droppableId
    const toColumnIndex = result.destination.index
    const cardId = result.draggableId

    await moveCard({
      variables: {
        id: cardId,
        fromColumnId,
        fromColumnIndex,
        toColumnId,
        toColumnIndex,
      },
    })

    refetch()
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className='flex flex-row space-x-2 p-4'>
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columns.map((column: any) => (
          <Column
            key={column.id}
            column={column}
            deleteColumn={handleDeleteColumn}
            columns={data}
          />
        ))}
      </DragDropContext>
      <button
        onClick={handleCreateColumn}
        className='bg-blue-500 hover:bg-blue-600 text-sm text-white px-4 py-2 rounded-lg'
      >
        Create Column
      </button>
    </div>
  )
}

export default Board
