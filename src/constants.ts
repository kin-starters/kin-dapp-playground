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
            'https://github.com/kin-labs/kin-demo-web-sdk-and-server-fe/blob/master/src/kinClientHelpers.ts#L79-L100',
        },
      ],
      createAccount: [
        {
          name: 'Web SDK',
          sdk: 'https://github.com/kinecosystem/kin-node',
          link:
            'https://github.com/kin-labs/kin-demo-web-sdk-and-server-fe/blob/master/src/kinClientHelpers.ts#L116-L158',
        },
      ],
      getBalance: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-demo-web-sdk-and-server-fe/blob/master/src/kinClientHelpers.ts#L167-L209',
        },
      ],
      requestAirdrop: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-demo-web-sdk-and-server-fe/blob/master/src/kinClientHelpers.ts#L220-L241',
        },
      ],
      submitPayment: [
        {
          name: 'Web SDK',
          link:
            'https://github.com/kin-labs/kin-demo-web-sdk-and-server-fe/blob/master/src/kinClientHelpers.ts#L286-L335',
        },
      ],
    },
  },
};

export { colors, breakpoints, kinLinks };
