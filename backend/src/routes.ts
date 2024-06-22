import { AdvanceRoute, DefaultRoute, WalletRoute } from "cartesi-router";
import { Error_out, Output, Report, Notice, Wallet } from "cartesi-wallet";

import { CreateProfile } from "./creator-profile"

class CreateAdvanceProfile extends WalletRoute {
  profile: CreateProfile
  constructor(profile: CreateProfile, wallet: Wallet){
    super(wallet);
    this.profile = profile
  }
}

class CreateProfileRoute extends CreateAdvanceProfile {
  _parse_request(request: any) {
    this.parse_request(request);
    this.request_args["username"] = this.request_args["username"].toLowerCase();
    // this.request_args["fullname"] = this.request_args["fullname"].toLowerCase();
  }
  public execute = (request: any) => {
    this._parse_request(request);

    try{
      return this.profile.create(
        this.msg_sender,
        this.request_args.username,
        this.request_args.fullname,
        this.request_args.bio,
        this.request_args.profession,
        this.request_args.profilePix,
      )    
    }catch(error){
      const error_msg = `Failed to create message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class SendTipRoute extends CreateAdvanceProfile {
  _parse_request(request: any) {
    this.parse_request(request);
    this.request_args["token"] = this.request_args["token"].toLowerCase();
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      console.log("request.metadata.msg_sender",request.metadata.msg_sender)
      return this.profile.sendTip(
        request.metadata.msg_sender,
        this.request_args.amount,
        this.request_args.token,
        parseInt(this.request_args.creatorId),
      )    
    }catch(error){
      const error_msg = `Failed to create message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class WithdrawTipRoute extends CreateAdvanceProfile {
  _parse_request(request: any) {
    this.parse_request(request);
    this.request_args["token"] = this.request_args["token"].toLowerCase();
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      console.log("request.metadata.msg_sender",request.metadata.msg_sender)
      return this.profile.withdrawTip(
        request.metadata.msg_sender,
        this.request_args.amount,
        this.request_args.token,
        parseInt(this.request_args.creatorId),
      )    
    }catch(error){
      const error_msg = `Failed to create message ${error}`;
      console.debug(error_msg);
      return new Error_out(error_msg);
    }
  };
}

class InspectRoute extends DefaultRoute {
  profile: CreateProfile
  constructor(profile: CreateProfile) {
    super();
    this.profile = profile;
  }
}

class CreatorListRoute extends InspectRoute {
    execute = (request: any): Output => {
    return this.profile.getAllCreators();
  };
}

class CreatorRoute extends InspectRoute {
  execute = (request: any): Output => {
    return this.profile.getCreator(parseInt(<string>request));
  };
}

export { CreatorListRoute, CreateProfileRoute, CreatorRoute, SendTipRoute, WithdrawTipRoute }