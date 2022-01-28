export interface MakeToast {
  text: string;
  happy: boolean;
}

interface OpenExplorer {
  transaction?: string;
  address?: string;
  kinEnvironment: string;
}
export function openExplorer({
  transaction,
  address,
  kinEnvironment,
}: OpenExplorer) {
  if (transaction) {
    window.open(
      `https://explorer.solana.com/tx/${transaction}${
        kinEnvironment === 'Test'
          ? '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev%2F'
          : ''
      }`
    );
  } else if (address) {
    window.open(
      `https://explorer.solana.com/address/${address}${
        kinEnvironment === 'Test'
          ? '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev%2F'
          : ''
      }`
    );
  }
}
