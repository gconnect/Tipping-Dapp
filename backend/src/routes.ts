import { AdvanceRoute, DefaultRoute } from "cartesi-router";
import { Error_out, Output, Report } from "cartesi-wallet";

import { CreateProfile } from "./creator-profile"

class CreateAdvanceProfile extends AdvanceRoute {
  profile: CreateProfile
  constructor(profile: CreateProfile){
    super();
    this.profile = profile
  }
}
class CreateProfileRoute extends CreateAdvanceProfile {
  _parse_request(request: any) {
    this.parse_request(request);
    this.request_args["id"] = this.request_args["id"].toLowerCase();
    // this.request_args["creatorAddress"] = this.request_args["creatorAddress"].toLowerCase();
    this.request_args["username"] = this.request_args["username"].toLowerCase();
    this.request_args["fullname"] = this.request_args["fullname"].toLowerCase();
  }
  public execute = (request: any) => {
    this._parse_request(request);
    try{
      return this.profile.create(
        this.msg_sender,
        this.request_args.username,
        this.request_args.fullname
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
    return new Report(JSON.stringify(this.profile.getAllCreators));
  };
}

export { CreatorListRoute, CreateProfileRoute }