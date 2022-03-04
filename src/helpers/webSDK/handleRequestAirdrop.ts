import { KinClient } from '@kin-sdk/client';

import { getPublicKey } from '..';

interface HandleRequestAirdrop {
  kinClient: KinClient;
  to: string;
  amount: string;
  kinNetwork: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleRequestAirdrop({
  onSuccess,
  onFailure,
  to,
  amount,
  kinClient,
  kinNetwork,
}: HandleRequestAirdrop) {
  console.log('🚀 ~ handleRequestAirdrop', to, amount);
  try {
    const publicKey = getPublicKey(to, kinNetwork);

    const [success, error] = await kinClient.requestAirdrop(publicKey, amount);

    if (error) throw new Error(error);

    if (success) onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
