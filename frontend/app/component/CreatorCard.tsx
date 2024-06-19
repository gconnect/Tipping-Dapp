"use client"
import { Card, CardHeader, 
CardBody, CardFooter, Heading, useDisclosure, Box, Button, Flex, Text,Avatar, IconButton } from '@chakra-ui/react'
import React from 'react'
import { TipModal } from './TipModal'
import { truncate } from '../utils/truncate'

interface Props {
  username: string
  fullname: string
  creatorAddress: string
  bio: string
  profession: string
  profilePix: string,
  earnings: number
  contributionCount: number
}
export const CreatorCard = ({ 
  username, fullname, creatorAddress, 
  bio, profession, profilePix, earnings, contributionCount } : Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='m-2'>
      <Card maxW='md' className=''>
        <CardHeader  className='bg-purple-200 rounded-t'>
          <Flex>
            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
              <Avatar name={username} src={profilePix} />
              <Box>
                <Heading size='sm'>{ bio }</Heading>
                <Text fontWeight={"bold"} size={'sm'}>{username}</Text>
                <Text>{creatorAddress && truncate(creatorAddress) }</Text>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody  className='bg-purple-200'>
          <Text>
            {profession}
          </Text>
          <div className='flex justify-between mt-4'>
              <p className='text-sm'>{`💰 ${earnings} Received`}</p> 
              <p className='text-sm'>{`♻  ${contributionCount} Supports`}</p> 
            </div>
        </CardBody>
          <CardFooter  className='bg-purple-200 rounded-b'>
          
            <Button onClick={onOpen} colorScheme='purple' className='w-full'>Send Tip</Button>
            <TipModal isOpen={isOpen} onClose={onClose}/>
  
      </CardFooter>
    </Card>
    </div>
  )
}
