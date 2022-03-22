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
