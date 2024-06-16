/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface AuthorityFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "calculateAuthorityAddress"
      | "newAuthority(address,bytes32)"
      | "newAuthority(address)"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "AuthorityCreated"): EventFragment;

  encodeFunctionData(
    functionFragment: "calculateAuthorityAddress",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "newAuthority(address,bytes32)",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "newAuthority(address)",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateAuthorityAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "newAuthority(address,bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "newAuthority(address)",
    data: BytesLike
  ): Result;
}

export namespace AuthorityCreatedEvent {
  export type InputTuple = [
    authorityOwner: AddressLike,
    authority: AddressLike
  ];
  export type OutputTuple = [authorityOwner: string, authority: string];
  export interface OutputObject {
    authorityOwner: string;
    authority: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AuthorityFactory extends BaseContract {
  connect(runner?: ContractRunner | null): AuthorityFactory;
  waitForDeployment(): Promise<this>;

  interface: AuthorityFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  /**
   * Beware that only the `newAuthority` function with the `_salt` parameter      is able to deterministically deploy an authority.
   * Calculate the address of an authority to be deployed deterministically.
   * @param _authorityOwner The initial authority owner
   * @param _salt The salt used to deterministically generate the authority address
   */
  calculateAuthorityAddress: TypedContractMethod<
    [_authorityOwner: AddressLike, _salt: BytesLike],
    [string],
    "view"
  >;

  /**
   * On success, MUST emit an `AuthorityCreated` event.
   * Deploy a new authority deterministically.
   * @param _authorityOwner The initial authority owner
   * @param _salt The salt used to deterministically generate the authority address
   */
  "newAuthority(address,bytes32)": TypedContractMethod<
    [_authorityOwner: AddressLike, _salt: BytesLike],
    [string],
    "nonpayable"
  >;

  /**
   * On success, MUST emit an `AuthorityCreated` event.
   * Deploy a new authority.
   * @param _authorityOwner The initial authority owner
   */
  "newAuthority(address)": TypedContractMethod<
    [_authorityOwner: AddressLike],
    [string],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "calculateAuthorityAddress"
  ): TypedContractMethod<
    [_authorityOwner: AddressLike, _salt: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "newAuthority(address,bytes32)"
  ): TypedContractMethod<
    [_authorityOwner: AddressLike, _salt: BytesLike],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "newAuthority(address)"
  ): TypedContractMethod<
    [_authorityOwner: AddressLike],
    [string],
    "nonpayable"
  >;

  getEvent(
    key: "AuthorityCreated"
  ): TypedContractEvent<
    AuthorityCreatedEvent.InputTuple,
    AuthorityCreatedEvent.OutputTuple,
    AuthorityCreatedEvent.OutputObject
  >;

  filters: {
    "AuthorityCreated(address,address)": TypedContractEvent<
      AuthorityCreatedEvent.InputTuple,
      AuthorityCreatedEvent.OutputTuple,
      AuthorityCreatedEvent.OutputObject
    >;
    AuthorityCreated: TypedContractEvent<
      AuthorityCreatedEvent.InputTuple,
      AuthorityCreatedEvent.OutputTuple,
      AuthorityCreatedEvent.OutputObject
    >;
  };
}
