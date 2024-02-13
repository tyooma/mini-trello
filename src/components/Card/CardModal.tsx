import React, { useState } from 'react'

interface CardModalProps {
  data: { id: string; title: string; description: string }
  onClose: () => void
  onSave: (updatedCard: {
    id: string
    title: string
    description: string
  }) => void
  onDelete: (id: string) => void
}

const CardModal: React.FC<CardModalProps> = ({
  data,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(data.title)
  const [description, setDescription] = useState(data.description)

  const handleSave = () => {
    onSave({ id: data.id, title, description })
  }

  const handleCancel = () => {
    setDescription(data.description)
    onClose()
  }

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleDelete = () => {
    onDelete(data.id)
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50'>
      <div className='modal-content bg-white p-8 rounded-lg'>
        <span className='close absolute top-0 right-0 p-4' onClick={onClose}>
          &times;
        </span>
        {isEditingTitle ? (
          <input
            type='text'
            value={title}
            onChange={handleTitleChange}
            className='text-lg font-semibold mb-4 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
          />
        ) : (
          <h2 className='text-lg font-semibold mb-4' onClick={handleTitleClick}>
            {data.title}
          </h2>
        )}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Enter card description...'
          className='block w-full border border-gray-300 rounded-md px-3 py-2 mb-4 shadow-sm focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm'
        />
        <div className='flex justify-end'>
          <button
            onClick={handleSave}
            className='bg-green-500 hover:bg-green-600 text-sm text-white px-4 py-2 rounded-lg mr-2'
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className='bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-lg mr-2'
          >
            Delete
          </button>
          <button
            onClick={handleCancel}
            className='bg-gray-500 hover:bg-gray-600 text-sm text-white px-4 py-2 rounded-lg'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModal
