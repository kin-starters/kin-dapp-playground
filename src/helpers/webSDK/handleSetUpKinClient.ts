import { KinClient, KinProd, KinTest } from '@kin-sdk/client';

interface HandleSetupKinClient {
  kinNetwork: string;
  onSuccess: ({ client }: { client: KinClient }) => void;
  onFailure: () => void;
}
export function handleSetUpKinClient({
  kinNetwork,
  onSuccess,
  onFailure,
}: HandleSetupKinClient) {
  try {
    const appIndex = Number(process.env.REACT_APP_APP_INDEX);
    console.log('🚀 ~ handleSetUpKinClient', kinNetwork, appIndex);
    if (appIndex > 0) {
      const client = new KinClient(kinNetwork === 'Prod' ? KinProd : KinTest, {
        appIndex,
      });
      onSuccess({ client });
    } else {
      throw new Error('No App Index');
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
