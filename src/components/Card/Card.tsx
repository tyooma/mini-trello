import React from 'react'

interface CardProps {
  title: string
  onClick: () => void
}

const Card: React.FC<CardProps> = ({ title, onClick }) => {
  return (
    <div
      className='bg-white rounded-md p-4 mb-2 cursor-pointer'
      onClick={onClick}
    >
      <p className='text-lg font-semibold'>{title}</p>
    </div>
  )
}

export default Card
