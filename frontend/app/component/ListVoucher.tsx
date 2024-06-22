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
import { finalWithraw } from '../helpers/excuteVoucher'
import { useAccount } from 'wagmi'
import { useRollups } from '../cartesi/hooks/useRollups'
import { DAPP_ADDRESS } from '../utils/constants'
import { errorAlert, successAlert } from '../utils/customAlert'
import { executeVoucher } from '../helpers/excuteVoucher'

export const ListVoucher = () => {
  const [creatorVouchers,  setCreatorVouchers] = useState([])
  const [executing,  setExecuting] = useState(false)

  const rollups = useRollups(DAPP_ADDRESS)

  const { address } = useAccount()

  const getCreatorVouchers = useCallback(async () => {
    await finalWithraw(address!, rollups!,setCreatorVouchers )
  },[address, rollups])

  // const isExecuted = async (inputIndex: number, index: number) => {
  //   const voucherExecuted = await rollups?.dappContract.wasVoucherExecuted(
  //     BigInt(inputIndex),
  //     BigInt(index)
  //   )
  //   console.log("status", voucherExecuted)
  //   return voucherExecuted
  // }

  const handleExecuteVoucher = async () => {
    try{
      setExecuting(true)
      await finalWithraw(address!, rollups!, setCreatorVouchers)
      // creatorVouchers.filter((voucher: any) => voucher.executed !== true).map((voucher:any, index) => 
      //   executeVoucher(voucher.index, voucher.input.index, rollups!))
   

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
       <Tr key={index}>
       <Td>{item.index}</Td>
       <Td>{item.input.index}</Td>
       { item.executed ?  <Td>
         <Button disabled color={"grey"}>Executed</Button>
         </Td> : <Td>
         <Button colorScheme='green' onClick={handleExecuteVoucher}>{ executing ? "Executing Voucher" :`Execute Voucher`}</Button>
         </Td> }      
      </Tr>
    )}
    </Tbody>
  </Table>
</TableContainer>
  )
}
