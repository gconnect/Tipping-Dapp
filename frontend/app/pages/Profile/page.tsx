"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, Stack, Heading, Text, Button, CardBody, CardFooter, useDisclosure, Divider, Table } from '@chakra-ui/react'
import Image from 'next/image'
import { TipModal } from '@/app/component/TipModal'
import { fetchCreators } from '@/app/helpers/fetchCreators'
import { useAccount } from 'wagmi'
import { DAPP_ADDRESS, TEST_TOKEN } from '@/app/utils/constants'
import { getERC20L2Balance } from '@/app/helpers/getBalance'
import { WithdrawModal } from '@/app/component/WithdrawModal'
import { setBalance } from 'viem/actions'
import { parseEther } from 'ethers'
import { finalWithraw } from '@/app/helpers/excuteVoucher'
import { errorAlert } from '@/app/utils/customAlert'
import { useRollups } from '@/app/cartesi/hooks/useRollups'
import { ListVoucher } from '@/app/component/ListVoucher'
const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ creator, setCreator ] = useState<any>()
  const [creatorAddress, setCreatorAddress] = useState()
  const [balance, setbalance] = useState(0)
  const [depositing, setDepositing] = useState(false)
  const rollups = useRollups(DAPP_ADDRESS)

  const { address,  chain } = useAccount()

  console.log("address", address)
  const getCreators = async () => {
    const data = await fetchCreators()
    console.log(data)
    if(data){
      return data.find((item: any) => {
        if(item.creatorAddress === address?.toLowerCase()){       
          setCreator(item)
          console.log(item)
          setCreatorAddress(item.creatorAddress)
        }
      })
    }
  }

  const l2Balance = async () => {
   const bal = await getERC20L2Balance(TEST_TOKEN, address!, chain!)
   console.log("creatorAddress", creatorAddress)
   if(bal === null){
    setbalance(0)
   }
   console.log("balance", bal)
   setbalance(bal)
  }


  useEffect(() => {
    getCreators()
    l2Balance()
  },[])

  return (
    <div className='min-h-screen m-4'>
      {creator && creator.creatorAddress === address?.toLowerCase() ? 
      <div className='lg:w-1/2 w-full m-auto lg:mt-36 md:mt-24 mt-16'>
      <h1 className='text-center lg:text-2xl md:text-xl text-lg text-light-purple mt-8 lg:mt-24 md:mt-16 mb-4 font-bold '>{`Welcome, ${creator.username}! 👋`}</h1>
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
        priority
        src={`https://gateway.pinata.cloud/ipfs/${creator.profilePix}`}
        alt='Caffe Latte'
      />
      <Stack className=''>
        <CardBody>
          <Heading size='md'>{creator.fullname}</Heading>
          <Text py='2'>
          {creator.bio}
          </Text>
          <Text py='2' fontWeight={"bold"}>
           {` Earninngs : ${balance ? balance/1e18 : '0'} TEST TOKEN`}
          </Text>
          <Button onClick={onOpen} colorScheme='purple' className='w-full'>Withdraw</Button>

           
            {/* <Button className="mt-2 w-full" colorScheme='green' mr={3} onClick={handleDeposit}>
            {depositing ? "Depositing..." : "Deposit"}
          </Button> */}
        </CardBody>

        <CardFooter>
            <Button className='mx-2 w-full' variant='solid' colorScheme='blue'>
              Share Profile
            </Button>
        </CardFooter>
        <WithdrawModal isOpen={isOpen} onClose={onClose} creatorId={creator.id!!} 
            creatorWalletAddress={creator.creatorAddress} creatorUsername={creator.username}/>
      </Stack>
    </Card>
    <ListVoucher/>

    </div>: <div className='text-center mt-36  text-slate-200 text-lg '> Opps! No account found for you. Create your account!</div> }

    </div>
  )
}
export default Profile