import {  Notice, Error_out, Log, Wallet, Output } from "cartesi-wallet";
import { Router } from "cartesi-router";
import { getAddress } from "viem";
const wallet = new Wallet(new Map());
const router = new Router(wallet);

class User {
  static nextId = 0
  static totalEarnings = 0
  static supporters = 0
  id: number
  creatorAddress: string
  username: string
  fullname: string
  profession: string
  bio: string
  profilePix:string
  earnings: number
  contributionCount: number
  constructor(
    creatorAddres: string,
    username: string,
    fullname: string,
    profession: string,
    bio: string,
    profilePix:string,
   ){

    this.id = User.nextId++
    this.creatorAddress = creatorAddres
    this.username = username
    this.fullname = fullname
    this.bio = bio
    this.profession = profession
    this.profilePix = profilePix
    this.earnings = User.totalEarnings
    this.contributionCount = User.supporters
    }

    setContributorCount(count: number) {
      this.contributionCount = count
    }

    getContributorCount(): number {
      return this.contributionCount
    }

    setCreatorEarnings(earning: number) {
      this.earnings = earning
    }

    getCreatorEarnings(): number {
      return this.earnings
    }
}
class CreateProfile {
    creators: User[]
    constructor(){
      this.creators = []
    }
    create(creatorAddress: string, username: string, 
      fullname: string, profession: string, 
      bio: string, profilePix: string) {
      try{
        // check if username and creator address already exist
        if(this.creators.find((item) => item.creatorAddress === creatorAddress )) throw new Error("Creator already exist")
        if(this.creators.find((item) => item.username === username )) throw new Error("Username already exist")

        const creator = new User(
          creatorAddress, 
          username, 
          fullname, 
          profession,
          bio,
          profilePix,
        )
        this.creators.push(creator)
        let creator_json = JSON.stringify(creator);
        const notice_payload = `{{"type":"add_creator","content":${creator_json}}}`;
        console.log(
          `Creator ${creator.username} created for ${creator.creatorAddress}}`
        );
        return new Notice(notice_payload);
        }catch(error){
        const error_msg = `Failed to create Profile ${error}`;
        console.debug(error_msg);
        return new Error_out(error_msg);
        }
    }
 
    getCreator(creator_id: number){
      try{
        let creator_json = JSON.stringify(this.creators[creator_id]);
        console.log("creator", creator_json)
        return new Log(creator_json);
      }catch(error){
        return new Error_out(`Creator id ${creator_id} not found`);
      }
    }

    getAllCreators(){
      try{
        let creators_json = JSON.stringify(this.creators);
        console.log("creators length", creators_json)
        return new Log(creators_json)
      }catch(error){
        return new Error_out(`Creators not found`);
      }
    }

    sendTip(sender: string, amount: BigInt, token: `0x${string}`, creatorId: number, ){
      let outputs = new Set<Output>();
      try{
        // handle erc20 transfer
        const toAddress = this.creators[creatorId]?.creatorAddress as "0x"

        let output: Output;
        try{
          output = wallet.erc20_transfer(
            getAddress(sender), 
            getAddress(toAddress), getAddress(token), 
            BigInt(amount.toString())
           )
        }catch(error){
          return new Error_out(`unable to send tip ${error}`);
        }
        if (output.type === "error") {
          return new Error_out(output.payload);
        }  
        outputs.add(output)

        let creator = this.creators[creatorId]
        let creatorBalance = creator?.getCreatorEarnings()
        let supporters = creator?.getContributorCount()
        
        if (creatorBalance == undefined) {
          return new Error_out(`Creator balance undefined`);
        }
        if (supporters == undefined) {
          return new Error_out(`Creator balance undefined`);
        }
         // increment the creator balance 
        creator?.setCreatorEarnings(creatorBalance += Number(amount))
        // increment the supporter count 
        creator?.setContributorCount(supporters += 1)

        //get updated balance and count
        let updatedBalance = creator?.getCreatorEarnings() 
        let updatedCount = creator?.getContributorCount()

        const tip_notice =  new Notice (`Creator balance increased to :
         ${updatedBalance} and contributor count increased to : ${updatedCount}`);
         outputs.add(tip_notice)
         return outputs
      }catch(error){
        console.log(error)
        return new Error_out(`Unable to send tip ${error}`);
      }
    }

    withdrawTip(sender: string, amount: BigInt, token: `0x${string}`, creatorId: number, ){
      let outputs = new Set<Output>();
      try{
        // handle erc20 withdraw
        let output: Output;
        try{
          output = wallet.erc20_withdraw(
            getAddress(sender), 
            getAddress(token), 
            BigInt(amount.toString())
           )
        }catch(error){
          return new Error_out(`unable to withdraw ${error}`);
        }
        if (output.type === "error") {
          return new Error_out(output.payload);
        }  
        outputs.add(output)

        let creator = this.creators[creatorId]
        let creatorBalance = creator?.getCreatorEarnings()
      
         // increment the creator balance 
         if (creatorBalance == undefined) {
          return new Error_out(`Creator balance undefined`);
        }
        creator?.setCreatorEarnings(creatorBalance -= Number(amount))     

        //get updated balance and count
        let updatedBalance = creator?.getCreatorEarnings() 
  
        const tip_notice =  new Notice (`Creator balance reduced to :
         ${updatedBalance}`);
         outputs.add(tip_notice)
         return outputs
      }catch(error){
        console.log(error)
        return new Error_out(`Unable to withdraw tip ${error}`);
      }
    }

}

export { CreateProfile, User }