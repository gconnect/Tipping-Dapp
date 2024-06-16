import { Card, CardHeader, 
CardBody, CardFooter, Heading, useDisclosure, Box, Button, Flex, Text,Avatar, IconButton } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import { TipModal } from './TipModal'

export const CreatorCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='m-2'>
      <Card maxW='md'>
        <CardHeader  className='bg-purple-200 rounded-t'>
          <Flex>
            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
              <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
              <Box>
                <Heading size='sm'>Justin Obi</Heading>
                <Text size={'sm'}>Blockchain Engineer</Text>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody  className='bg-purple-200'>
          <Text>
            I am passionate about building solutions. And more so blockchain dapps. Proficient in both backend and frontend technologies.
          </Text>
        </CardBody>
          <CardFooter  className='bg-purple-200 rounded-b'>
          <Button onClick={onOpen} colorScheme='purple' className='w-full'>Send Tip</Button>
          <TipModal isOpen={isOpen} onClose={onClose}/>
      </CardFooter>
    </Card>
    </div>
  )
}
