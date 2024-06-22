"use client"
import React, { useEffect, useState } from 'react'
import {
  FormControl,
  Input,
  Button,
  Textarea
} from '@chakra-ui/react'
import { addInput } from '@/app/cartesi/Portals'
import { useAccount } from 'wagmi'
import { useRollups } from '@/app/cartesi/hooks/useRollups'
import { BASE_URL, DAPP_ADDRESS } from '@/app/utils/constants'
import { errorAlert } from '@/app/utils/customAlert'
import { pinFileToIPFS } from '@/app/pinata/pinFile'


const CreatorForm = () => {
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [profession, setProfession] = useState('')
  const [bio, setBio] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [profilePix, setProfile] = useState<string | File | undefined>(undefined)

  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const rollups = useRollups(DAPP_ADDRESS)

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFullname(e.target.value)
  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => setProfession(e.target.value)
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)
  const handleProfilePixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setProfile(e.target.files[0])
      console.log(e.target.files[0])
    } 
  }


  const handleCreateAccount = async () => {
    const ipfsImageHash = await pinFileToIPFS(profilePix)
    const payload = {
      "method": "add_creator",
      "args": {
        "username": username,
        "fullname": fullname,
        "bio": bio,
        "profession": profession,
        "profilePix": ipfsImageHash
      }
    }

    if(!address) return errorAlert("Please connect your wallet")
    if(!username || !fullname) return errorAlert("Fields required")
    setLoading(true)
    await addInput(rollups, JSON.stringify(payload))
    setLoading(false)
    setUsername("")
    setFullname("")
    setProfession("")
    setBio("")
    setProfile("")
  }

 

  return (
    <div className='min-h-screen mx-4'>
      <h1 className='text-center lg:text-2xl md:text-xl text-lg text-light-purple mt-8 lg:mt-24 md:mt-16 mb-4 font-bold '>Welcome, Create your profile 👋</h1>
      <div className='text-white p-8 lg:w-1/3 md:w-1/2 w-full lg:m-auto md:m-auto border rounded  border-light-purple '>
      <Input borderColor="blue.700" className='mt-2' placeholder='username' type='text' value={username} onChange={handleUsernameChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Full name' type='text' value={fullname} onChange={handleFullnameChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Profession' type='text' value={profession} onChange={handleProfessionChange} />
      <Textarea borderColor="blue.700" className='mt-2' placeholder='Bio'  value={bio} onChange={handleBioChange} />
      <Input borderColor="blue.700" className='mt-2' placeholder='Profile Pix' type='file'  onChange={handleProfilePixChange} />
      <Button colorScheme='purple' className='mt-2 w-full' onClick={handleCreateAccount}>
        {loading ? "Creating account please wait..." : "Create Profile" }
        </Button>
    </div>
    </div>
 
  )
}

export default CreatorForm