import React, { useCallback, useEffect, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { executeVoucher, fetchData, getCreatorListVouchers } from '../helpers/excuteVoucher'
import { useAccount } from 'wagmi'
import { useRollups } from '../cartesi/hooks/useRollups'
import { DAPP_ADDRESS } from '../utils/constants'
import { errorAlert } from '../utils/customAlert'

export const ListVoucher = () => {
  const [creatorVouchers,  setCreatorVouchers] = useState([])
  const [executing,  setExecuting] = useState(false)
  const [executed, setExecuted] = useState(false)
  const rollups = useRollups(DAPP_ADDRESS)

  const { address } = useAccount()

  const getCreatorVouchers = useCallback(async () => {
  await fetchData(address as string, rollups!, setCreatorVouchers)
  // setCreatorVouchers(data)
  },[address, rollups])

  const handleExecuteVoucher = async (voucher: any) => {
    try{
      setExecuting(true)
      // creatorVouchers.filter((voucher: any) => voucher.executed !== true).map((voucher, index) => executeVoucher(voucher, rollups!))

      await executeVoucher(voucher, rollups!)
      getCreatorVouchers()
      setExecuting(false)
      // successAlert()
    }catch(error){
      setExecuting(false)
      console.log(error)
      errorAlert(error)
    }
  }

  useEffect(() => {
    getCreatorVouchers() 
  },[getCreatorVouchers])

  return (
  <TableContainer className='mt-16 text-slate-100'>
  <Table variant='simple'>
    <TableCaption>Your Vouchers</TableCaption>
    <Thead>
      <Tr>
        <Th>S/N</Th>
        <Th>Voucher</Th>
        <Th> Action </Th>
      </Tr>
    </Thead>
    <Tbody>
    {creatorVouchers && creatorVouchers.map((item: any, index) => 
        (        
      <Tr key={index}>
       <Td>{item.index}</Td>
       <Td>{item.input.index}</Td>
       { item.execute ?  <Td>
         <Button disabled color={"grey"}>Executed</Button>
         </Td> : <Td>
         <Button colorScheme='green' onClick={async () => await handleExecuteVoucher(item)}>{ executing ? "Executing Voucher" :`Execute Voucher`}</Button>
         </Td> }      
      </Tr>)
    )}
    </Tbody>
  </Table>
</TableContainer>
  )
}
