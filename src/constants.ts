export const colors = {
  white: '#FFFFFF',
  white_dark: '#dbdbdb',
  black: '#2c3e50',
  kin: '#6f41e8',
  kin_light: 'rgb(104, 85, 151)',
  kin_dark: '#4927a0',
  background: '#efedf5',
  red: 'red',
  green: 'green',
};

export const breakpoints = {
  mobileBreakpoint: '770px',
  smallScreenBreakpoint: '1440px',
};

export const kinLinks = {
  docs: [
    {
      name: 'Docs',
      link: 'https://developer.kin.org',
    },
    {
      name: 'Discord',
      link: 'https://discord.com/invite/kdRyUNmHDn',
    },
  ],
  serverSDKRepos: [
    { name: 'Node', link: 'https://github.com/kinecosystem/kin-node' },
    { name: 'Python', link: 'https://github.com/kinecosystem/kin-python' },
    { name: 'Go', link: 'https://github.com/kinecosystem/kin-go' },
  ],
  serverSDKTutorials: [
    { name: 'Node', link: 'https://developer.kin.org/tutorials/node/' },
    { name: 'Python', link: 'https://developer.kin.org/tutorials/python/' },
    { name: 'Go', link: 'https://developer.kin.org/tutorials/go/' },
  ],
  webSDK: [
    { name: 'Web SDK Repo', link: 'https://github.com/kin-sdk/kin-sdk-web' },
    {
      name: 'Web SDK Tutorial',
      link: 'https://developer.kin.org/tutorials/web/',
    },
  ],
  SDKless: [
    {
      name: 'Blog - Introducing Kin SDK-Less Transactions',
      link: 'https://kin.org/introducing-kin-sdk-less-transactions/',
    },
  ],
  agora: [
    {
      name: 'Agora',
      link: 'https://developer.kin.org/docs/architecture-overview/',
    },
  ],
  webhooks: [
    {
      name: 'Agora Webhooks',
      link: 'https://developer.kin.org/docs/agora-webhook-reference/',
    },
  ],
  custodialWallets: [
    {
      name: 'Non-Custodial vs Custodial Wallets',
      link:
        'https://developer.kin.org/docs/best-practices/#non-custodial-vs-custodial-wallets-and-private-key-storage',
    },
  ],
  KRE: [
    {
      name: 'Kin Rewards Engine Explained',
      link: 'https://developer.kin.org/docs/the-kre-explained/',
    },
    {
      name: 'KRE Checklist',
      link: 'https://developer.kin.org/docs/transaction-guide/',
    },
  ],
  walletAdapter: [
    {
      name: '@solana/wallet-adapter',
      link: 'https://github.com/solana-labs/wallet-adapter',
    },
    {
      name: 'Implementation in this project',
      link:
        'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/SolanaWallets.tsx',
    },
  ],
  devPortal: [
    { name: 'Kin Developer Portal', link: 'https://portal.kin.org/' },
    {
      name: 'How to Register Your App',
      link: 'https://developer.kin.org/tutorials/#why-register-your-app',
    },
  ],
  solanaRent: [
    {
      name: 'What is Rent?',
      link: 'https://docs.solana.com/implemented-proposals/rent',
    },
  ],
  demoServers: [
    {
      name: 'Node',
      link: 'https://github.com/kin-starters/kin-demo-node-sdk',
    },
    {
      name: 'Python',
      link: 'https://github.com/kin-starters/kin-demo-python-sdk',
    },
    {
      name: 'Go',
      link: 'https://github.com/kin-starters/kin-demo-go-sdk',
    },
  ],
  serverCodeSamples: {
    title: 'See the Code: ',
    methods: {
      setUpKinClient: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-starters/kin-demo-node-sdk/blob/master/src/index.ts#L111-L153',
        },
        {
          name: 'Python Demo',
          link:
            'https://github.com/kin-starters/kin-demo-python-sdk/blob/master/api.py#L155-L210',
        },
        {
          name: 'Go Demo',
          link:
            'https://github.com/kin-starters/kin-demo-go-sdk/blob/master/main.go#L188-L221',
        },
      ],
      createAccount: [
        {
          name: 'Node Demo',
          sdk: 'https://github.com/kinecosystem/kin-node',
          link:
            'https://github.com/kin-starters/kin-demo-node-sdk/blob/master/src/index.ts#L155-L189',
        },
        {
          name: 'Python Demo',
          link:
            'https://github.com/kin-starters/kin-demo-python-sdk/blob/master/api.py#L213-L242',
        },
        {
          name: 'Go Demo',
          link:
            'https://github.com/kin-starters/kin-demo-go-sdk/blob/master/main.go#L256-L281',
        },
      ],
      getBalance: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-starters/kin-demo-node-sdk/blob/master/src/index.ts#L191-L228',
        },
        {
          name: 'Python Demo',
          link:
            'https://github.com/kin-starters/kin-demo-python-sdk/blob/master/api.py#L245-L272',
        },
        {
          name: 'Go Demo',
          link:
            'https://github.com/kin-starters/kin-demo-go-sdk/blob/master/main.go#L223-L254',
        },
      ],
      requestAirdrop: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-starters/kin-demo-node-sdk/blob/master/src/index.ts#L230-L286',
        },
        {
          name: 'Python Demo',
          link:
            'https://github.com/kin-starters/kin-demo-python-sdk/blob/master/api.py#L275-L313',
        },
        {
          name: 'Go Demo',
          link:
            'https://github.com/kin-starters/kin-demo-go-sdk/blob/master/main.go#L283-L319',
        },
      ],
      getTransaction: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-starters/kin-demo-node-sdk/blob/master/src/index.ts#L288-L339',
        },
        {
          name: 'Python Demo',
          link:
            'https://github.com/kin-starters/kin-demo-python-sdk/blob/master/api.py#L389-L416',
        },
        {
          name: 'Go Demo',
          link:
            'https://github.com/kin-starters/kin-demo-go-sdk/blob/master/main.go#L415-L445',
        },
      ],
      submitPayment: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-starters/kin-demo-node-sdk/blob/master/src/index.ts#L356-L412',
        },
        {
          name: 'Python Demo',
          link:
            'https://github.com/kin-starters/kin-demo-python-sdk/blob/master/api.py#L326-L375',
        },
        {
          name: 'Go Demo',
          link:
            'https://github.com/kin-starters/kin-demo-go-sdk/blob/master/main.go#L328-L388',
        },
      ],
    },
  },
  clientCodeSamples: {
    methods: {
      setUpKinClient: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/webSDK/handleSetUpKinClient.ts',
        },
      ],
      createAccount: [
        {
          name: 'See the Code',
          sdk: 'https://github.com/kinecosystem/kin-node',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/webSDK/handleCreateAccount.ts',
        },
      ],
      getBalance: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/webSDK/handleGetBalance.ts',
        },
      ],
      requestAirdrop: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/webSDK/handleRequestAirdrop.ts',
        },
      ],
      submitPayment: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/webSDK/handleSendKin.ts',
        },
      ],
    },
  },
  SDKlessCodeSamples: {
    methods: {
      createAccount: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/SDKless/handleCreateTokenAccount.ts',
        },
      ],
      getBalance: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/SDKless/handleGetKinBalances.ts',
        },
      ],
      submitPayment: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/SDKless/handleSendKin.ts',
        },
      ],
      closeEmptyTokenAccount: [
        {
          name: 'See the Code',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/helpers/SDKless/handleCloseEmptyTokenAccount.ts',
        },
      ],
    },
  },
};

export type TransactionTypeName = 'Earn' | 'Spend' | 'P2P' | 'None';
export const transactionTypeNames: TransactionTypeName[] = [
  'Earn',
  'Spend',
  'P2P',
  'None',
];
export type SolanaNetwork = 'Mainnet' | 'Devnet';
export const solanaNetworks: SolanaNetwork[] = ['Mainnet', 'Devnet'];

export const solanaAddresses = {
  Mainnet: {
    kinMint: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6',
  },
  Devnet: {
    kinMint: '',
  },
};
