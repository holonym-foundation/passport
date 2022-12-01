import { PlatformSpec, PlatformGroupSpec } from "../types";

export const HolonymPlatformDetails: PlatformSpec = {
  icon: "./assets/holonymStampIcon.svg",
  platform: "Holonym",
  name: "Holonym",
  description: "Connect your wallet to start the process of verifying with Holonym.",
  connectMessage: "Connect Account",
  isEVM: true,
};

export const HolonymProviderConfig: PlatformGroupSpec[] = [
  {
    platformGroup: "Government ID",
    providers: [{ title: "Proven uniqueness using Holonym with government ID", name: "HolonymGovIdProvider" }],
  },
  {
    platformGroup: "Phone number",
    providers: [
      {
        title: "Proven uniqueness using Holonym with phone number",
        name: "HolonymPhoneNumProvider",
      },
    ],
  },
];
