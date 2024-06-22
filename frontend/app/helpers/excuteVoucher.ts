import { RollupsContracts } from "../cartesi/hooks/useRollups"
import { getCreatorVouchers } from "./getCreatorVouchers"
import { createUrqlClient, getVouchers, getVoucherWithProof } from './../cartesi/VoucherService';
import { errorAlert, successAlert } from "../utils/customAlert";

const client = createUrqlClient();

const executeVoucher = async (index: number, inputIndex: number,
   rollups: RollupsContracts) => {
  
    // check if voucher is executed
  const voucherExecuted = await rollups?.dappContract.wasVoucherExecuted(
    BigInt(inputIndex),
    BigInt(index)
  )
  console.log("voucherExecuted", voucherExecuted)
  if (voucherExecuted) return errorAlert('Fund already withrawn')

  // get voucher with proof
  try {
    const voucherWithProof = await getVoucherWithProof(
      client,
      index,
      inputIndex
    )
    if (voucherWithProof) {
    
    const voucher = voucherWithProof
    const newVoucherToExecute = { ...voucher }
    
    // execute the voucher
    try {
      const tx = await rollups.dappContract.executeVoucher(
        voucher.destination,
        voucher.payload,
        voucher.proof
      )
      const receipt = await tx.wait()
      if (receipt) {
        console.log('voucher receipt ', receipt)
        successAlert('Congratulation! Fund successfully withdrawn')
      }
      console.log("newVoucherToExecute", newVoucherToExecute)
    } catch (e) {

      console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`)
      errorAlert('Fund not withrawn')
    }
    }
  } catch (error) {
    console.log(error)
  }
}

export const finalWithraw = async (address: string, rollups: RollupsContracts, setCreatorVouchers: Function) => {
  if (address) {
    // get all vouchers
    const vouchers = await getVouchers(client);
    if (!vouchers.length) return errorAlert("No vouchers found");
   
    if (vouchers.length) {
      // get only creator vouchers
      const creatorVouchersData = await getCreatorVouchers(address, vouchers);
      
      // Check execution status for initial data
      const updatedVouchers = await Promise.all(
        creatorVouchersData.map(async (voucher: any) => {
          if (rollups) {
            const isExecuted = await rollups.dappContract.wasVoucherExecuted(
              BigInt(voucher.input.index),
              BigInt(voucher.index)
            );
            return { ...voucher, executed: isExecuted };
          } else {
            return voucher;
          }
        })
      );
      setCreatorVouchers(updatedVouchers)
      console.log("creatorVouchers1", updatedVouchers);

      updatedVouchers.filter((voucher) => voucher.executed !== true).map((voucher, index) => executeVoucher(voucher.index, voucher.input.index, rollups))

    // Log the execution status of each updated voucher
    // updatedVouchers.forEach(voucher => {
    //   console.log(`Voucher index: ${voucher.index}, executed: ${voucher.executed}`);
    // });

    // // Filter vouchers that have not been executed
    // const vouchersToExecute = updatedVouchers.filter(voucher => !voucher.executed);
    // console.log("Vouchers to execute:", vouchersToExecute);

    // if (vouchersToExecute.length === 0) {
    //   console.log("No vouchers to execute");
    //   errorAlert("No vouchers to execute")
    //   return;
    // }

    // // Execute the vouchers that have not been executed
    // for (const voucher of vouchersToExecute) {
    //   console.log(`Executing voucher index: ${voucher.index}, input index: ${voucher.input.index}`);
    //   await executeVoucher(voucher.index, voucher.input.index, rollups);
    //   console.log(`Executed voucher index: ${voucher.index}, input index: ${voucher.input.index}`);
    // }
    }
  }
};

export const fetchCreatorVouchers = async (address: string, rollups: RollupsContracts) => {
  if (address) {
    // get all vouchers
    const vouchers = await getVouchers(client);
    if (!vouchers.length) return errorAlert("No vouchers found");
   
    if (vouchers.length) {
      // get only creator vouchers
      const creatorVouchersData = await getCreatorVouchers(address, vouchers);
      
      // Check execution status for initial data
      const updatedVouchers = await Promise.all(
        creatorVouchersData.map(async (voucher: any) => {
          if (rollups) {
            const isExecuted = await rollups.dappContract.wasVoucherExecuted(
              BigInt(voucher.input.index),
              BigInt(voucher.index)
            );
            return { ...voucher, executed: isExecuted };
          } else {
            return voucher;
          }
        })
      );
      
      console.log("creatorVouchers1", updatedVouchers);

      updatedVouchers.filter((voucher) => voucher.executed !== true).map((voucher, index) => executeVoucher(voucher.index, voucher.input.index, rollups))

    }
  }
};


