"use client"
import { CreatorCard } from "./component/CreatorCard"

const Home: React.FC = () => {
    return(
      <div className='min-h-screen lg:m-36 md:m-24 m-8'>
      <h1 className='font-bold bg-clip-text bg-gradient-to-r from-[#AE62EE] to-[#FE8A7C] text-transparent lg:text-8xl md:text-6xl text-4xl  text-center'>
      You are just a Tip away from saying thank you to the creators that matters the most to you!
      </h1>
      <h1 className='font-bold text-3xl text-light-purple text-center mt-24 mb-8'>Featured Creators</h1>
      <div className='grid justify-center lg:grid-cols-4 md:grid-cols-2 grid-cols-1 ' id='creators'>
        <CreatorCard/>
        <CreatorCard/>
        <CreatorCard/>
        <CreatorCard/>
      </div>
      </div>
    )
  }
  
  export default Home