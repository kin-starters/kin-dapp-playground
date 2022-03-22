const colors = {
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

const breakpoints = {
  mobileBreakpoint: '770px',
  smallScreenBreakpoint: '1440px',
};

const solanaAddresses = {
  Mainnet: {
    kinMint: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6',
    memoV1ProgramId: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
    memoV2ProgramId: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
  },
  Devnet: {
    kinMint: '',
    memoV1ProgramId: '',
    memoV2ProgramId: '',
  },
};

const kinLinks = {
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
      link: 'https://github.com/kin-labs/kin-demo-node-sdk',
    },
  ],
  serverCodeSamples: {
    title: 'See the Code: ',
    methods: {
      setUpKinClient: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L108-L141',
        },
      ],
      createAccount: [
        {
          name: 'Node Demo',
          sdk: 'https://github.com/kinecosystem/kin-node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L148-L173',
        },
      ],
      getBalance: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L180-L208',
        },
      ],
      requestAirdrop: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L215-L257',
        },
      ],
      getTransaction: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L264-L302',
        },
      ],
      submitPayment: [
        {
          name: 'Node Demo',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L324-L367',
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

export { colors, breakpoints, kinLinks, solanaAddresses };
