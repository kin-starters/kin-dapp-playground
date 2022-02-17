import SecureLS from 'secure-ls';
import BigNumber from 'bignumber.js';

import { FC, useMemo, useCallback } from 'react';
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  TransactionInstruction,
} from '@solana/web3.js';

import { createKinMemo, TransactionType } from '@kin-tools/kin-memo';
import { Token } from '@solana/spl-token';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

// https://github.com/softvar/secure-ls
export const secureLocalStorage = new SecureLS();
console.log('🚀 ~ secureLocalStorage', secureLocalStorage);

interface WalletProps {
  solanaEnvironment: string;
}
export const Wallet: FC<WalletProps> = ({ children, solanaEnvironment }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Devnet;
  let network = WalletAdapterNetwork.Mainnet;
  if (solanaEnvironment === 'Devnet') network = WalletAdapterNetwork.Devnet;
  if (solanaEnvironment === 'Testnet') network = WalletAdapterNetwork.Testnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          {/* Your app's components go here, nested within the context providers. */}
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const SendOneLamportToRandomAddress: FC = () => {
  const { connection } = useConnection();
  console.log('🚀 ~ connection', connection);
  const { publicKey, sendTransaction } = useWallet();
  console.log('🚀 ~ publicKey', publicKey);

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, 'processed');
  }, [publicKey, sendTransaction, connection]);

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Send 1 lamport to a random address!
    </button>
  );
};

declare global {
  interface Window {
    solana: any;
  }
}

function kinToQuarks(amount: string): BigNumber {
  const b = new BigNumber(amount).decimalPlaces(5, BigNumber.ROUND_DOWN);
  return b.multipliedBy(1e5);
}

function generateMemoInstruction(memoContent: string): TransactionInstruction {
  return new TransactionInstruction({
    keys: [],
    programId: new PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'),
    data: Buffer.from(memoContent),
  });
}

export interface HandleSendKin {
  connection: Connection;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
  from: PublicKey;
  to: string;
  amount: string;
  memo: string;
  type: string;
  solanaEnvironment: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

export async function handleSendKin({
  onSuccess,
  onFailure,
  connection,
  sendTransaction,
  from,
  to,
  amount,
  memo,
  type,
  solanaEnvironment,
}: HandleSendKin) {
  console.log('🚀 ~ handleSendKin', from, to, type, amount, solanaEnvironment);
  try {
    if (solanaEnvironment !== 'Mainnet')
      throw new Error('No Mint for that environment');

    let kinMint = 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6';
    const mint = new PublicKey(kinMint);
    console.log('🚀 ~ mint', mint.toBase58());

    let kinTokenProgramId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
    const tokenProgramId = new PublicKey(kinTokenProgramId);
    console.log('🚀 ~ tokenProgramId', tokenProgramId.toBase58());

    const appIndex = Number(process.env.REACT_APP_APP_INDEX) || 0;
    console.log('🚀 ~ appIndex', appIndex);
    let transactionType = TransactionType.None;
    if (type === 'Earn') transactionType = TransactionType.Earn;
    if (type === 'Spend') transactionType = TransactionType.Spend;
    if (type === 'P2P') transactionType = TransactionType.P2P;

    const appIndexMemo = createKinMemo({
      appIndex,
      type: transactionType,
    });
    console.log('🚀 ~ memo', memo);

    const fromPublicKey = new PublicKey(from);
    console.log('🚀 ~ fromPublicKey', fromPublicKey.toBase58());
    const fromTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      fromPublicKey,
      { mint }
    );
    console.log('🚀 ~ fromTokenAccounts', fromTokenAccounts);
    const fromTokenAccount = fromTokenAccounts?.value[0]?.pubkey;
    console.log('🚀 ~ fromTokenAccount', fromTokenAccount.toBase58());
    const toPublicKey = new PublicKey(to);
    const toTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      toPublicKey,
      { mint }
    );
    console.log('🚀 ~ toTokenAccounts', toTokenAccounts);
    const toTokenAccount = toTokenAccounts?.value[0]?.pubkey;
    console.log('🚀 ~ toTokenAccount', toTokenAccount.toBase58());

    const quarks = kinToQuarks(amount);
    console.log('🚀 ~ quarks', quarks);

    const appIndexMemoInstruction = generateMemoInstruction(appIndexMemo);
    console.log('🚀 ~ appIndexMemoInstruction', appIndexMemoInstruction);

    const transferInstruction = Token.createTransferInstruction(
      tokenProgramId,
      fromTokenAccount,
      toTokenAccount,
      fromPublicKey,
      [],
      Number(quarks)
    );

    const transaction = new Transaction()
      .add(appIndexMemoInstruction) // Must be the first instruction
      .add(transferInstruction);

    if (memo) {
      const memoInstruction = generateMemoInstruction(memo);
      transaction.add(memoInstruction);
    }

    console.log('🚀 ~ transaction', transaction);
    const signature = await sendTransaction(transaction, connection);
    console.log('🚀 ~ signature', signature);

    await connection.confirmTransaction(signature, 'processed');

    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
