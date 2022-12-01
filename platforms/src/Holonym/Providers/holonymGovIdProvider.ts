// ----- Types
import type { Provider, ProviderOptions } from "../../types";
import type { RequestPayload, VerifiedPayload } from "@gitcoin/passport-types";

// ----- Ethers library
import { Contract } from "ethers";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

// ----- Credential verification
import { getAddress } from "../../utils/signer";

// set the network rpc url based on env
export const RPC_URL = process.env.RPC_URL;

const GOV_ID_SR_ADDRESS = ""; // TODO

// ABI for Holonym Sybil resistance contract based on government ID
const GOV_ID_SR_ABI = [
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "isUniqueForAction",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

const actionId = 123456789;

export class HolonymGovIdProvider implements Provider {
  // Give the provider a type so that we can select it from a payload
  type = "Holonym";
  // Options can be set here and/or via the constructor
  _options = {};

  // construct the provider instance with supplied options
  constructor(options: ProviderOptions = {}) {
    this._options = { ...this._options, ...options };
  }

  // Verify that the address defined in the payload has proven uniqueness using Holonym
  async verify(payload: RequestPayload): Promise<VerifiedPayload> {
    // if a signer is provider we will use that address to verify against
    const address = await getAddress(payload);

    try {
      // define a provider using the rpc url
      const provider: StaticJsonRpcProvider = new StaticJsonRpcProvider(RPC_URL);

      const contract = new Contract(GOV_ID_SR_ADDRESS, GOV_ID_SR_ABI, provider);

      // Query contract for user's uniqueness
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const valid: boolean = await contract.isUniqueForAction(address, actionId);

      return {
        valid,
        record: valid
          ? {
              // store the address into the proof records
              address,
              holonym: `Is unique for action ${actionId}, based on government ID`,
            }
          : undefined,
      };
    } catch (e) {
      return {
        valid: false,
        error: [JSON.stringify(e)],
      };
    }
  }
}
