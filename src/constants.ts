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
  sdkRepos: [
    { name: 'Node SDK', link: 'https://github.com/kinecosystem/kin-node' },
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
  ],
  devPortal: [
    { name: 'Kin Developer Portal', link: 'https://portal.kin.org/' },
    {
      name: 'How to Register Your App',
      link: 'https://developer.kin.org/tutorials/#why-register-your-app',
    },
  ],
  serverRepos: [
    {
      name: 'Node',
      link: 'https://github.com/kin-labs/kin-demo-node-sdk',
    },
  ],
  serverCodeSamples: {
    title: 'Sample SDK Code: ',
    methods: {
      setUpKinClient: [
        {
          name: 'Node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L108-L141',
        },
      ],
      createAccount: [
        {
          name: 'Node',
          sdk: 'https://github.com/kinecosystem/kin-node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L148-L173',
        },
      ],
      getBalance: [
        {
          name: 'Node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L180-L208',
        },
      ],
      requestAirdrop: [
        {
          name: 'Node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L215-L257',
        },
      ],
      getTransaction: [
        {
          name: 'Node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L264-L302',
        },
      ],
      submitPayment: [
        {
          name: 'Node',
          link:
            'https://github.com/kin-labs/kin-demo-node-sdk/blob/master/src/index.ts#L324-L367',
        },
      ],
    },
  },
  clientCodeSamples: {
    title: 'Sample Code: ',
    methods: {
      setUpKinClient: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinClientHelpers.ts#L21-L41',
        },
      ],
      createAccount: [
        {
          name: 'Web SDK',
          sdk: 'https://github.com/kinecosystem/kin-node',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinClientHelpers.ts#L57-L99',
        },
      ],
      getBalance: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinClientHelpers.ts#L108-L150',
        },
      ],
      requestAirdrop: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinClientHelpers.ts#L161-L182',
        },
      ],
      submitPayment: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinClientHelpers.ts#L227-L276',
        },
      ],
    },
  },
  SDKlessCodeSamples: {
    title: 'Sample Code: ',
    methods: {
      createAccount: [
        {
          name: 'Solana Web Packages',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinSDKlessHelpers.ts#L249-L355',
        },
      ],
      getBalance: [
        {
          name: 'Solana Web Packages',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinSDKlessHelpers.ts#L192-L234',
        },
      ],

      submitPayment: [
        {
          name: 'Solana Web Packages',
          link:
            'https://github.com/kin-labs/kin-dapp-demo/blob/master/src/kinSDKlessHelpers.ts#L477-L558',
        },
      ],
    },
  },
};

export { colors, breakpoints, kinLinks, solanaAddresses };
