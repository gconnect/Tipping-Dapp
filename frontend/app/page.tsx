"use client"
import { CreatorCard } from "./component/CreatorCard"
import { useInspectCall } from "./cartesi/hooks/useInspectCall"
import { useEffect, useState } from "react"
import { useNotices } from "./cartesi/hooks/useNotices"
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import { Tikua} from "@doiim/tikua"
import { useEthersSigner } from "./utils/useEtherSigner"
import rollupAbi from "./cartesi/rollups.json"
import { INSPECT_BASE_URL, DAPP_ADDRESS } from "./utils/constants"
import { useQuery } from "@tanstack/react-query"
import { Report } from "./cartesi/hooks/useReports"

const Home: React.FC = () => {
  const { address } = useAccount()
  const [creators, setCreators] = useState([])

  const fetchCreators = async () => {
    const result = await fetch(`${INSPECT_BASE_URL}/get_creators`);
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json()
    const decode = data.reports.map((report: Report) => {
      return ethers.toUtf8String(report.payload);
    });
    const reportData: any = JSON.parse(decode);
    setCreators(reportData)
    return reportData;
  };


    useEffect(() => {
      fetchCreators()
    },[])

    return(
      <div className='min-h-screen lg:m-36 md:m-24 m-8'>
      <h1 className='font-bold bg-clip-text bg-gradient-to-r from-[#AE62EE] to-[#FE8A7C] text-transparent lg:text-8xl md:text-6xl text-4xl  text-center'>
      You are just a Tip away from saying thank you to the creators that matters the most to you!
      </h1>
      <h1 className='font-bold text-3xl text-light-purple text-center mt-24 mb-8'>Featured Creators</h1>
      <div className='grid justify-center lg:grid-cols-4 md:grid-cols-2 grid-cols-1 ' id='creators'>

        {creators && creators.length > 0 && creators.map((item: any, index) => <div key={index}>

          <CreatorCard username={item.username} 
          fullname={item.fullname} 
          creatorAddress={item.creatorAddress} 
          bio={item.bio} 
          profession={item.profession} 
          profilePix={`https://brown-clinical-python-573.mypinata.cloud/ipfs/${item.profilePix}`} 
          earnings={item.earnings} 
          contributionCount={item.contributionCount}
           />

        </div> )}
        </div>
  
      </div>
    )
  }
  
  export default Home