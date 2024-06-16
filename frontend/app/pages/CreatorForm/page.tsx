"use client"
import React, { ReactElement, useState } from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button
} from '@chakra-ui/react'

const CreatorForm = () => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const isError = input === ''

  return (
    <div className='min-h-screen mx-4'>
      <h1 className='text-center lg:text-2xl md:text-xl text-lg text-light-purple mt-8 lg:mt-24 md:mt-16 mb-4 font-bold '>Welcome, Create your profile 👋</h1>
      <div className=' p-8 lg:w-1/3 md:w-1/2 w-full lg:m-auto md:m-auto border rounded  border-light-purple '>
      <FormControl>
      <Input borderColor="blue.700" className='mt-2' placeholder='username' type='text' value={input} onChange={handleInputChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Full name' type='email' value={input} onChange={handleInputChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Profession' type='email' value={input} onChange={handleInputChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Bio' type='email' value={input} onChange={handleInputChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Link to portfolio' type='email' value={input} onChange={handleInputChange} />
      </FormControl>
      <Button colorScheme='purple' className='mt-2 w-full'>Create Profile</Button>
    </div>
    </div>
 
  )
}

export default CreatorForm