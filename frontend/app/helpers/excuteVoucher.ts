// import { RollupsContracts } from "../cartesi/hooks/useRollups"
// import { getCreatorVouchers } from "./getCreatorVouchers"
// import { createUrqlClient, getVouchers, getVoucherWithProof } from './../cartesi/VoucherService';
// import { errorAlert, successAlert } from "../utils/customAlert";

// const client = createUrqlClient();

//  export const fetchData = async (address: string, rollups: RollupsContracts, setCreatorVouchers: Function) => {
   
//     if (address) {
//       const vouchers = await getVouchers(client)
//       if (!vouchers.length) return errorAlert("No vouchers found");
//       if (vouchers.length) {
//         const creatorVouchersData = await getCreatorVouchers(
//           address,
//           vouchers
//         )
//         // Check execution status for initial data
//         const updatedVouchers = await Promise.all(
//           creatorVouchersData.map(async(voucher: any) => {
//             if (rollups) {
//               const isExecuted = await rollups.dappContract.wasVoucherExecuted(
//                 BigInt(voucher.input.index),
//                 BigInt(voucher.index)
//               )
//               return { ...voucher, executed: isExecuted }
//             } else {
//               return voucher
//             }
//           })
//         )
//         console.log('creators vouchers ', updatedVouchers)
//         setCreatorVouchers(updatedVouchers)
//       }
//     }
//   }

// export const executeVoucher = async (voucher: any, rollups: RollupsContracts) => {
//   const isExecuted = await rollups.dappContract.wasVoucherExecuted(
//         BigInt(voucher.input.index),
//         BigInt(voucher.index)
//       );
//     if (isExecuted) return errorAlert('Fund already withrawn')
//     const voucherWithProof = await getVoucherWithProof(client, voucher.index, voucher.input.index);
//     if (voucherWithProof) {
//       const voucher = voucherWithProof;
//       const newVoucherToExecute = { ...voucher };
        
//     // Execute the voucher
//     const tx = await rollups.dappContract.executeVoucher(
//               voucher.destination,
//               voucher.payload,
//               voucher.proof
//             )
//       const receipt = await tx.wait();
//       if (receipt) {
//         console.log('voucher receipt ', receipt);
//         successAlert('Congratulation! Fund successfully withdrawn');
//       }
//       console.log("newVoucherToExecute", newVoucherToExecute);
// }
// };


import { RollupsContracts } from "../cartesi/hooks/useRollups";
import { getCreatorVouchers } from "./getCreatorVouchers";
import { createUrqlClient, getVouchers, getVoucherWithProof } from './../cartesi/VoucherService';
import { errorAlert, successAlert } from "../utils/customAlert";

const client = createUrqlClient();

export const fetchData = async (address: string, rollups: RollupsContracts, setCreatorVouchers: Function) => {
  try {
    if (!address) throw new Error("Address is required");

    const vouchers = await getVouchers(client);
    if (!vouchers.length) return errorAlert("No vouchers found");

    const creatorVouchersData = await getCreatorVouchers(address, vouchers);

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

    console.log('creators vouchers', updatedVouchers);
    setCreatorVouchers(updatedVouchers);
  } catch (error: any) {
    console.error('Error fetching data:', error);
    errorAlert(error.message);
  }
};

export const executeVoucher = async (voucher: any, rollups: RollupsContracts) => {
  try {
    if (!rollups) throw new Error("Rollups contract is required");

    const isExecuted = await rollups.dappContract.wasVoucherExecuted(
      BigInt(voucher.input.index),
      BigInt(voucher.index)
    );

    if (isExecuted) return errorAlert('Fund already withdrawn');

    const voucherWithProof = await getVoucherWithProof(client, voucher.index, voucher.input.index);

    if (voucherWithProof) {
      const tx = await rollups.dappContract.executeVoucher(
        voucherWithProof.destination,
        voucherWithProof.payload,
        voucherWithProof.proof
      );

      const receipt = await tx.wait();
      if (receipt) {
        console.log('Voucher receipt', receipt);
        successAlert('Congratulations! Funds successfully withdrawn');
      }

      console.log("Voucher executed successfully", voucherWithProof);
    }
  } catch (error) {
    console.error('Error executing voucher:', error);
    errorAlert('Could not execute voucher');
  }
};




