import {  Notice, Error_out } from "cartesi-wallet";

class User {
  static nextId = 1
  id: number
  creatorAddress: string
  username: string
  fullname: string
  constructor(
    creatorAddres: string,
    username: string,
    fullname: string){
    this.id = User.nextId++
    this.creatorAddress = creatorAddres
    this.username = username
    this.fullname = fullname
    }
}
class CreateProfile {
    creators: User[]
    constructor(){
      this.creators = []
    }
    
    create( creatorAddress: string, username: string, fullname: string) {
      try{
        const creator = new User(creatorAddress,username, fullname)
        this.creators.push(creator)
        let auction_json = JSON.stringify(creator);
        const notice_payload = `{{"type":"auction_create","content":${auction_json}}}`;
        console.log(
          `Creaor ${creator.username} created for ${creator.creatorAddress}}`
        );
        return new Notice(notice_payload);
        }catch(error){
        const error_msg = `Failed to create Profile ${error}`;
        console.debug(error_msg);
        return new Error_out(error_msg);
        }
    }

    getAllCreators(){
      return this.creators
    }
}

export { CreateProfile }