"use client"
import React from 'react'
import { Card, CardHeader, Stack, Heading, Text, Button, CardBody, CardFooter, useDisclosure } from '@chakra-ui/react'
import Image from 'next/image'
import { TipModal } from '@/app/component/TipModal'

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='min-h-screen m-4'>
      <div className='lg:w-1/2 w-full m-auto lg:mt-36 md:mt-24 mt-16'>
      <h1 className='text-center lg:text-2xl md:text-xl text-lg text-light-purple mt-8 lg:mt-24 md:mt-16 mb-4 font-bold '>Welcome, Justin! 👋</h1>
      <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      >
      <Image
        objectFit='cover'
        max-w={{ base: '100%', sm: '200px' }}
        width={300}
        height={300}
        src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
        alt='Caffe Latte'
      />

      <Stack>
        <CardBody>
          <Heading size='md'>Justin Obi</Heading>
          <Text py='2'>
          I am passionate about building solutions. And more so blockchain dapps. Proficient in both backend and frontend technologies.
          </Text>
        </CardBody>

        <CardFooter>
          <Button onClick={onOpen} colorScheme='purple' className='w-full'>Send Tip</Button>
          <TipModal isOpen={isOpen} onClose={onClose}/>

          <Button className='w-full mx-2' variant='solid' colorScheme='blue'>
            Share Profile
        </Button>
        </CardFooter>
      </Stack>
    </Card>
    </div>
    </div>
  )
}
export default Profile