// ---- Test subject
import { RequestPayload } from "@gitcoin/passport-types";
import { HolonymPhoneNumProvider } from "../Providers/holonymPhoneNumProvider";

const mockIsUniqueForAction = jest.fn();

jest.mock("ethers", () => {
  return {
    Contract: jest.fn().mockImplementation(() => {
      return {
        isUniqueForAction: mockIsUniqueForAction,
      };
    }),
  };
});

const MOCK_ADDRESS = "0xb4B6f1C68be31841B52F4015a31d1f38B99cDb71";
const actionId = 123456789;

describe("Attempt verification", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true for an address that has proven uniqueness to Holonym phone number Sybil resistance smart contract", async () => {
    mockIsUniqueForAction.mockResolvedValueOnce(true);
    const holonym = new HolonymPhoneNumProvider();
    const verifiedPayload = await holonym.verify({
      address: MOCK_ADDRESS,
    } as RequestPayload);

    expect(mockIsUniqueForAction).toBeCalledWith(MOCK_ADDRESS, actionId);
    expect(verifiedPayload).toEqual({
      valid: true,
      record: {
        address: MOCK_ADDRESS,
        holonym: `Is unique for action ${actionId}, based on phone number`,
      },
    });
  });

  it("should return false for an address not proven uniqueness to Holonym phone number Sybil resistance smart contract", async () => {
    mockIsUniqueForAction.mockResolvedValueOnce(false);
    const UNREGISTERED_ADDRESS = "0xUNREGISTERED";

    const holonym = new HolonymPhoneNumProvider();
    const verifiedPayload = await holonym.verify({
      address: UNREGISTERED_ADDRESS,
    } as RequestPayload);

    expect(mockIsUniqueForAction).toBeCalledWith(UNREGISTERED_ADDRESS, actionId);
    expect(verifiedPayload).toEqual({
      valid: false,
    });
  });

  it("should return error response when isUniqueForAction call errors", async () => {
    mockIsUniqueForAction.mockRejectedValueOnce("some error");
    const UNREGISTERED_ADDRESS = "0xUNREGISTERED";

    const holonym = new HolonymPhoneNumProvider();
    const verifiedPayload = await holonym.verify({
      address: UNREGISTERED_ADDRESS,
    } as RequestPayload);

    expect(mockIsUniqueForAction).toBeCalledWith(UNREGISTERED_ADDRESS, actionId);
    expect(verifiedPayload).toEqual({
      valid: false,
      error: [JSON.stringify("some error")],
    });
  });
});