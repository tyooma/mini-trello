import React, { useEffect, useState } from 'react'
import {
  CREATE_CARD,
  DELETE_CARD,
  UPDATE_CARD,
} from '../server/mutations/mutations'
import {
  GET_COLUMN_CARDS,
  GET_COLUMN_CARDS_SORTED_BY_DATE,
} from '../server/queries/queries'
import { useMutation, useQuery } from '@apollo/client'
import Card from './Card/Card'
import CardModal from './Card/CardModal'
import { Draggable, Droppable } from 'react-beautiful-dnd'

interface ColumnProps {
  column: {
    id: string
    title: string
    cards: { id: string; title: string; description: string }[]
  }
  deleteColumn: (id: string) => void
  columns: any
}

const Column: React.FC<ColumnProps> = ({ column, deleteColumn, columns }) => {
  const [title, setTitle] = useState('')
  const [creatingCard, setCreatingCard] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalCard, setModalCard] = useState<{
    id: string
    title: string
    description: string
  } | null>(null)
  const [sortMethod, setSortMethod] = useState<string>('index')
  const { loading, error, data, refetch } = useQuery(
    sortMethod === 'date' ? GET_COLUMN_CARDS_SORTED_BY_DATE : GET_COLUMN_CARDS,
    {
      variables: { columnId: column.id },
    }
  )
  const [createCard] = useMutation(CREATE_CARD)
  const [updateCardDescription] = useMutation(UPDATE_CARD)
  const [deleteCard] = useMutation(DELETE_CARD)

  useEffect(() => {
    refetch()
  }, [columns, sortMethod])

  const handleCreateCard = async () => {
    if (title.trim() !== '') {
      await createCard({ variables: { title, columnId: column.id } })
      setTitle('')
      setCreatingCard(false)
      refetch()
    }
  }

  const handleSaveCard = async (updatedCard: any) => {
    await updateCardDescription({
      variables: {
        input: {
          id: updatedCard.id,
          title: updatedCard.title,
          description: updatedCard.description,
        },
      },
    })
    setShowModal(false)
    refetch()
  }

  const handleCancelCreateCard = () => {
    setTitle('')
    setCreatingCard(false)
  }

  const handleOpenModal = (card: {
    id: string
    title: string
    description: string
  }) => {
    setModalCard(card)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setModalCard(null)
    setShowModal(false)
  }

  const handleDeleteCard = async (id: any) => {
    await deleteCard({ variables: { id } })
    setShowModal(false)
    refetch()
  }

  return (
    <div className='w-72 bg-gray-100 rounded-lg p-4'>
      <div className='text-lg font-semibold mb-2 flex justify-between items-center'>
        <span>{column.title}</span>
        <span
          className='text-gray-500 cursor-pointer hover:text-red-700'
          onClick={() => deleteColumn(column.id)}
        >
          &times;
        </span>
      </div>
      <div className='flex items-center mb-2'>
        <button
          onClick={() => setSortMethod('date')}
          className={`flex-1 bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 py-1 rounded-l-lg ${
            sortMethod === 'date' && 'bg-gray-400'
          }`}
        >
          Date
        </button>
        <button
          onClick={() => setSortMethod('index')}
          className={`flex-1 bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 py-1 rounded-r-lg ${
            sortMethod === 'index' && 'bg-gray-400'
          }`}
        >
          Index
        </button>
      </div>
      <div>
        {!creatingCard ? (
          <button
            className='w-full bg-blue-500 hover:bg-blue-600 text-sm text-white py-2 rounded-lg'
            onClick={() => setCreatingCard(true)}
          >
            Create Card
          </button>
        ) : (
          <div className='mt-4'>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Enter card title...'
              className='border border-slate-300 rounded-md px-3 py-1 mb-2 shadow-sm focus:outline-none focus:border-sky-300 focus:ring-sky-300 focus:ring-1 w-full sm:text-sm'
            />
            <div className='flex'>
              <button
                className='flex-1 bg-green-500 hover:bg-green-600 text-sm text-white py-2 rounded-lg'
                onClick={handleCreateCard}
              >
                Add
              </button>
              <button
                className='flex-1 bg-red-500 hover:bg-red-600 text-sm text-white py-2 rounded-lg ml-2'
                onClick={handleCancelCreateCard}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {showModal && modalCard && (
          <CardModal
            data={modalCard}
            onSave={handleSaveCard}
            onClose={handleCloseModal}
            onDelete={handleDeleteCard}
          />
        )}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <Droppable droppableId={column.id}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <div className='mt-4'>
                  {sortMethod === 'date'
                    ? data?.columnCardsSortedByDate?.map(
                        (card: any, index: any) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id}
                            index={index}
                          >
                            {provided => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  title={card.title}
                                  onClick={() => handleOpenModal(card)}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      )
                    : data?.columnCards?.map((card: any, index: any) => (
                        <Draggable
                          key={card.id}
                          draggableId={card.id}
                          index={index}
                        >
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card
                                title={card.title}
                                onClick={() => handleOpenModal(card)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        )}
      </div>
    </div>
  )
}

export default Column
