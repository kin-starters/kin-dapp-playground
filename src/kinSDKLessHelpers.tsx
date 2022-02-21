import SecureLS from 'secure-ls';
import BigNumber from 'bignumber.js';

import { FC, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
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
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  clusterApiUrl,
  PublicKey,
  Transaction,
  Connection,
  TransactionInstruction,
} from '@solana/web3.js';

import { createKinMemo, TransactionType } from '@kin-tools/kin-memo';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import { solanaAddresses } from './constants';
import { saveTransaction } from './helpers';

// https://github.com/softvar/secure-ls
export const secureLocalStorage = new SecureLS();
console.log('🚀 ~ secureLocalStorage', secureLocalStorage);

interface WalletProps {
  solanaNetwork: string;
}
export const Wallet: FC<WalletProps> = ({ children, solanaNetwork }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Devnet;
  let network = WalletAdapterNetwork.Mainnet;
  if (solanaNetwork === 'Devnet') network = WalletAdapterNetwork.Devnet;
  if (solanaNetwork === 'Testnet') network = WalletAdapterNetwork.Testnet;
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

declare global {
  interface Window {
    solana: any;
  }
}

function kinToQuarks(amount: string): BigNumber {
  const b = new BigNumber(amount).decimalPlaces(5, BigNumber.ROUND_DOWN);
  return b.multipliedBy(1e5);
}

interface GenerateMemoInstruction {
  memoContent: string;
  solanaNetwork: string;
  memoVersion: number;
}
function generateMemoInstruction({
  memoContent,
  solanaNetwork,
  memoVersion = 1,
}: GenerateMemoInstruction): TransactionInstruction {
  let memoProgramId;
  if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
    memoProgramId =
      memoVersion === 1
        ? solanaAddresses[solanaNetwork].memoV1ProgramId
        : solanaAddresses[solanaNetwork].memoV2ProgramId;
  } else {
    throw new Error('Missing Addresses for Kin on that Solana Network');
  }
  console.log('🚀 ~ memoProgramId', memoProgramId);

  return new TransactionInstruction({
    keys: [],
    programId: new PublicKey(memoProgramId),
    data: Buffer.from(memoContent),
  });
}
interface GenerateTransferInstruction {
  connection: Connection;
  from: PublicKey;
  to: string;
  amount: string;
  solanaNetwork: string;
}
async function generateTransferInstruction({
  connection,
  from,
  to,
  amount,
  solanaNetwork,
}: GenerateTransferInstruction) {
  console.log('🚀 ~ generateTransferInstruction', from.toBase58(), to, amount);
  if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
    const mint = new PublicKey(solanaAddresses[solanaNetwork].kinMint);
    // From
    const fromTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      from,
      { mint }
    );
    const fromTokenAccount = fromTokenAccounts?.value[0]?.pubkey;
    // To
    const toPublicKey = new PublicKey(to);
    const toTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      toPublicKey,
      { mint }
    );

    const toTokenAccount = toTokenAccounts?.value[0]?.pubkey;
    if (!toTokenAccount) throw new Error('No Token Account!');

    // Amount
    const quarks = kinToQuarks(amount);
    // Instruction
    return Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount,
      toTokenAccount,
      from,
      [],
      Number(quarks)
    );
  } else {
    throw new Error('Solana network not supported');
  }
}

export interface Balance {
  [tokenAccountId: string]: string;
}

interface HandleGetKinBalances {
  connection: Connection;
  address: string;
  solanaNetwork: string;
  onSuccess?: (balances: Balance[]) => void;
  onFailure?: (arg: any) => void;
}

export async function handleGetKinBalances({
  connection,
  address,
  solanaNetwork,
  onSuccess,
  onFailure,
}: HandleGetKinBalances) {
  console.log('🚀 ~ handleGetKinBalances', address);
  try {
    if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
      const mintPublicKey = new PublicKey(
        solanaAddresses[solanaNetwork].kinMint
      );
      const publicKey = new PublicKey(address);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          mint: mintPublicKey,
        }
      );

      const balances = await Promise.all(
        tokenAccounts.value.map(async (tokenAccount) => {
          const tokenAmount = await connection.getTokenAccountBalance(
            tokenAccount.pubkey
          );

          return {
            [tokenAccount.pubkey.toBase58()]: tokenAmount.value.amount,
          };
        })
      );
      console.log('🚀 ~ balances', balances);

      if (onSuccess) onSuccess(balances);
      return balances;
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    if (onFailure) onFailure(error);
    return [];
  }
}

interface HandleCreateTokenAccount {
  connection: Connection;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
  from: PublicKey;
  to: string;
  solanaNetwork: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

// TODO create token account if not found
// https://solanacookbook.com/references/token.html#associated-token-account-ata
export async function handleCreateTokenAccount({
  connection,
  sendTransaction,
  from,
  to,
  solanaNetwork,
  onSuccess,
  onFailure,
}: HandleCreateTokenAccount) {
  console.log('🚀 ~ handleCreateTokenAccount', to);
  try {
    let tokenAccount;
    if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
      const balances = await handleGetKinBalances({
        connection,
        address: to,
        solanaNetwork,
      });

      if (balances && balances.length > 0)
        throw new Error('Token Account already exists!');

      const mintPublicKey = new PublicKey(
        solanaAddresses[solanaNetwork].kinMint
      );
      const toPublicKey = new PublicKey(to);
      tokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintPublicKey,
        toPublicKey
      );
      console.log('🚀 ~ tokenAccount', tokenAccount);

      let transaction = new Transaction().add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mintPublicKey,
          tokenAccount,
          toPublicKey,
          from
        )
      );

      // Send Transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('🚀 ~ signature', signature);

      // Check Transaction has been completed
      await connection.confirmTransaction(signature, 'processed');

      saveTransaction(signature);
      onSuccess();
    } else {
      throw new Error('Missing Addresses for Kin on that Solana Network');
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}

interface HandleCloseEmptyTokenAccount {
  connection: Connection;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
  to: string;
  solanaNetwork: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

// TODO create token account if not found
// https://solanacookbook.com/references/token.html#associated-token-account-ata
export async function handleCloseEmptyTokenAccount({
  connection,
  sendTransaction,
  to,
  solanaNetwork,
  onSuccess,
  onFailure,
}: HandleCloseEmptyTokenAccount) {
  try {
    if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
      const mintPublicKey = new PublicKey(
        solanaAddresses[solanaNetwork].kinMint
      );
      const toPublicKey = new PublicKey(to);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        toPublicKey,
        {
          mint: mintPublicKey,
        }
      );
      console.log('🚀 ~ tokenAccounts', tokenAccounts);

      const zeroBalanceTokenAccountsRaw = await Promise.all(
        tokenAccounts.value.map(async (tokenAccount) => {
          try {
            const tokenAmount = await connection.getTokenAccountBalance(
              tokenAccount.pubkey
            );
            console.log('🚀 ~ tokenAmount', tokenAmount);

            return tokenAmount.value.amount === '0'
              ? tokenAccount.pubkey
              : null;
          } catch (error) {
            return null;
          }
        })
      );

      const zeroBalanceTokenAccounts = zeroBalanceTokenAccountsRaw.filter(
        (pk) => pk
      );
      console.log('🚀 ~ zeroBalanceTokenAccounts', zeroBalanceTokenAccounts);

      const signatures = await Promise.all(
        zeroBalanceTokenAccounts.map(async (tokenAccountPublicKey) => {
          if (tokenAccountPublicKey) {
            try {
              const transaction = new Transaction().add(
                Token.createCloseAccountInstruction(
                  TOKEN_PROGRAM_ID,
                  tokenAccountPublicKey,
                  toPublicKey,
                  toPublicKey,
                  []
                )
              );
              console.log('🚀 ~ transaction', transaction);

              const signature = await sendTransaction(transaction, connection);
              // Check Transaction has been completed
              await connection.confirmTransaction(signature, 'processed');

              saveTransaction(signature);
              return signature;
            } catch (error) {
              console.log('🚀 ~ error', error);
            }
          }
        })
      );
      console.log('🚀 ~ signatures', signatures);

      onSuccess();
    } else {
      throw new Error('Missing Addresses for Kin on that Solana Network');
    }
  } catch (error) {
    onFailure(error);
  }
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
  solanaNetwork: string;
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
  solanaNetwork,
}: HandleSendKin) {
  console.log('🚀 ~ handleSendKin', from, to, type, amount, solanaNetwork);
  try {
    // App Index
    const appIndex = Number(process.env.REACT_APP_APP_INDEX);
    if (!appIndex) throw new Error('No App Index!');

    console.log('🚀 ~ appIndex', appIndex);

    // Transaction Type
    let transactionType = TransactionType.None;
    if (type === 'Earn') transactionType = TransactionType.Earn;
    if (type === 'Spend') transactionType = TransactionType.Spend;
    if (type === 'P2P') transactionType = TransactionType.P2P;

    // Create correctly formatted memo string, including your App Index
    const appIndexMemo = createKinMemo({
      appIndex,
      type: transactionType,
    });
    console.log('🚀 ~ appIndexMemo', appIndexMemo);
    // Create Memo Instruction for KRE Ingestion - Must be Memo Program v1, not v2
    const appIndexMemoInstruction = generateMemoInstruction({
      memoContent: appIndexMemo,
      solanaNetwork,
      memoVersion: 1,
    });
    console.log('🚀 ~ appIndexMemoInstruction', appIndexMemoInstruction);

    // Create Transfer Instruction
    const transferInstruction = await generateTransferInstruction({
      connection,
      from,
      to,
      amount,
      solanaNetwork,
    });

    // Build Transaction -
    const transaction = new Transaction()
      .add(appIndexMemoInstruction) // Must be the first instruction
      .add(transferInstruction);

    // Add additional memo, e.g. for SKU if present. Here we are using Memo Program v2
    if (memo) {
      const memoInstruction = generateMemoInstruction({
        memoContent: memo,
        solanaNetwork,
        memoVersion: 2,
      });
      transaction.add(memoInstruction);
    }

    // Final Transaction
    console.log('🚀 ~ transaction', transaction);

    // Send Transaction
    const signature = await sendTransaction(transaction, connection);
    console.log('🚀 ~ signature', signature);

    // Check Transaction has been completed
    await connection.confirmTransaction(signature, 'processed');

    saveTransaction(signature);

    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
