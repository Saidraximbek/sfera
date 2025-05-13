import React from 'react'
import StudentsList from '../components/StudentsList'
const Students = () => {
  return (
    <div className='w-full flex justify-center flex-col gap-10 bg-amber-50 rounded-2xl p-5'>
      <h1 className='text-3xl self-center font-bold'>Tasdiqlanmagan O'quvchilar</h1>
        <StudentsList />
    </div>
  )
}

export default Students