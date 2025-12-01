export const CONTRACT_ADDRESSES = {
  MEME_CONTEST_FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "",
} as const;

export const CONTRACT_ABIS = {
  MEME_CONTEST_FACTORY: [
    {
      type: "constructor",
      inputs: [
        { name: "_implementation", type: "address", internalType: "address" },
        {
          name: "_labsSplitDestination",
          type: "address",
          internalType: "address",
        },
        { name: "_owner", type: "address", internalType: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "acceptOwnership",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "allContests",
      inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "contestCount",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "contestInfo",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [
        { name: "contestAddress", type: "address", internalType: "address" },
        { name: "creator", type: "address", internalType: "address" },
        { name: "createdAt", type: "uint256", internalType: "uint256" },
        { name: "exists", type: "bool", internalType: "bool" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "createContest",
      inputs: [
        {
          name: "config",
          type: "tuple",
          internalType: "struct MemeContestFactory.ContestConfig",
          components: [
            { name: "contestStart", type: "uint256", internalType: "uint256" },
            { name: "votingDelay", type: "uint256", internalType: "uint256" },
            { name: "votingPeriod", type: "uint256", internalType: "uint256" },
            {
              name: "numAllowedProposalSubmissions",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "maxProposalCount",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "percentageToCreator",
              type: "uint256",
              internalType: "uint256",
            },
            { name: "costToPropose", type: "uint256", internalType: "uint256" },
            { name: "costToVote", type: "uint256", internalType: "uint256" },
            {
              name: "priceCurveType",
              type: "uint256",
              internalType: "uint256",
            },
            { name: "multiple", type: "uint256", internalType: "uint256" },
            {
              name: "creatorSplitDestination",
              type: "address",
              internalType: "address",
            },
          ],
        },
        { name: "salt", type: "bytes32", internalType: "bytes32" },
      ],
      outputs: [
        { name: "contestAddress", type: "address", internalType: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "creatorContests",
      inputs: [
        { name: "", type: "address", internalType: "address" },
        { name: "", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getContestInfo",
      inputs: [
        { name: "contestAddress", type: "address", internalType: "address" },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          internalType: "struct MemeContestFactory.ContestInfo",
          components: [
            {
              name: "contestAddress",
              type: "address",
              internalType: "address",
            },
            { name: "creator", type: "address", internalType: "address" },
            { name: "createdAt", type: "uint256", internalType: "uint256" },
            { name: "exists", type: "bool", internalType: "bool" },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getContests",
      inputs: [
        { name: "offset", type: "uint256", internalType: "uint256" },
        { name: "limit", type: "uint256", internalType: "uint256" },
      ],
      outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getCreatorContests",
      inputs: [{ name: "creator", type: "address", internalType: "address" }],
      outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getTotalContests",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "implementation",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "labsSplitDestination",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "multicall",
      inputs: [
        { name: "contests", type: "address[]", internalType: "address[]" },
        { name: "data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "pendingOwner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "predictContestAddress",
      inputs: [{ name: "salt", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "renounceOwnership",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setImplementation",
      inputs: [
        { name: "newImplementation", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setlabsSplitDestination",
      inputs: [
        { name: "newDestination", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "transferOwnership",
      inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "usedSalt",
      inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "ContestCreated",
      inputs: [
        {
          name: "creator",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "contestAddress",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "contestId",
          type: "uint256",
          indexed: true,
          internalType: "uint256",
        },
        {
          name: "contestStart",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "votingPeriod",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ImplementationUpdated",
      inputs: [
        {
          name: "oldImplementation",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "newImplementation",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferStarted",
      inputs: [
        {
          name: "previousOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "newOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          name: "previousOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "newOwner",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "AddressEmptyCode",
      inputs: [{ name: "target", type: "address", internalType: "address" }],
    },
    { type: "error", name: "ContestDoesNotExist", inputs: [] },
    { type: "error", name: "FailedCall", inputs: [] },
    { type: "error", name: "FailedDeployment", inputs: [] },
    {
      type: "error",
      name: "InsufficientBalance",
      inputs: [
        { name: "balance", type: "uint256", internalType: "uint256" },
        { name: "needed", type: "uint256", internalType: "uint256" },
      ],
    },
    { type: "error", name: "InvalidImplementation", inputs: [] },
    { type: "error", name: "InvalidPercentage", inputs: [] },
    { type: "error", name: "InvalidTimestamps", inputs: [] },
    {
      type: "error",
      name: "OwnableInvalidOwner",
      inputs: [{ name: "owner", type: "address", internalType: "address" }],
    },
    {
      type: "error",
      name: "OwnableUnauthorizedAccount",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
    },
    { type: "error", name: "SaltAlreadyUsed", inputs: [] },
  ],
  MEME_CONTEST: [
    "function propose(string, string) external payable returns (uint256)",
    "function castVote(uint256, uint256) external payable",
    "function contestStart() external view returns (uint256)",
    "function voteStart() external view returns (uint256)",
    "function votingPeriod() external view returns (uint256)",
    "function proposals(uint256) external view returns (address, string, string, uint256, bool)",
    "function votes(uint256, address) external view returns (uint256)",
    "event ProposalCreated(uint256 indexed proposalId, address indexed author, string description)",
    "event VoteCast(address indexed voter, uint256 indexed proposalId, uint256 votes, uint256 cost)",
  ],
};

export const DEFAULT_CONTEST_CONFIG = {
  CONTEST_START_DELAY: 1 * 60,
  VOTING_DELAY: 60 * 60,
  VOTING_PERIOD: 2 * 24 * 60 * 60, // 2 days
  NUM_ALLOWED_SUBMISSIONS: 5,
  MAX_PROPOSAL_COUNT: 10,
  PERCENTAGE_TO_CREATOR: 80,
  COST_TO_PROPOSE: "0.00000001",
  COST_TO_VOTE: "0.00000001",
  PRICE_CURVE_EXPONENTIAL: 1,
  EXPONENTIAL_MULTIPLE: "2",
};
