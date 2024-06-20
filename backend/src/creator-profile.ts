import {  Notice, Error_out, Log, Wallet } from "cartesi-wallet";
import { Router } from "cartesi-router";
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
      try{
        const toAddress = this.creators[creatorId]?.creatorAddress as "0x"
        // const data = wallet.erc20_transfer(sender as "0x", toAddress, token as "0x", BigInt(amount))
        
        const data = {
          sender, toAddress, token, amount
        }
        let creatorBalance = this.creators[creatorId]?.earnings!
        let supporters = this.creators[creatorId]?.contributionCount!
         // increment the creator balance 
        creatorBalance += Number(amount)
        // increment the supporter count 
        supporters +=1
        let tip_json = JSON.stringify(data);
        // router.process("erc20_transfer", tip_json);
        const notice_payload = `{{"type":"send_tip","content":${tip_json}}}`;
        return new Notice(notice_payload);
      }catch(error){
        console.log(error)
        return new Error_out(`Unable to send tip ${error}`);
      }
    }

}

export { CreateProfile, User }