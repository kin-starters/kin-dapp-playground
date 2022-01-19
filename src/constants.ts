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
  title: 'Code Samples: ',
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
      link: 'https://github.com/kinecosystem/node-sdk-demo-server',
    },
  ],
  setupClient: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L80-L87',
    },
  ],
  createAccount: [
    {
      name: 'Node',
      sdk: 'https://github.com/kinecosystem/kin-node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L94-L117',
    },
  ],
  getBalance: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L124-L150',
    },
  ],
  requestAirdrop: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L157-L184',
    },
  ],
  getTransaction: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L191-L229',
    },
  ],
  submitPayment: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L251-L294',
    },
  ],
};

export { colors, breakpoints, kinLinks };
