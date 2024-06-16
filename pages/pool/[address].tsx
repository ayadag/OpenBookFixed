import { ReactNode } from 'react';

import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import { getSearchLayout } from '../../components/layouts/SearchLayout';
import { ActionCenter } from '../../components/market/ActionCenter';
import { EventQueueCard } from '../../components/market/EventQueue';
import { OverviewTable2 } from '../../components/market/OverviewTable';
import { TokenDisplay } from '../../components/market/TokenDisplay';
import { VaultDisplay } from '../../components/market/Vault';
import { useSolana } from '../../context';
import { MarketProvider } from '../../context/market';
import { useSerumMarket } from '../../hooks/useSerumMarket';
import { formatAmmKeysById } from '../../utils/formatAmmKeysById';

async function PoolPage() {
  const router = useRouter();
  const wallet = useWallet();
  const { address } = router.query;  //pool address

  const { cluster } = useSolana();

  const targetPoolInfo = await formatAmmKeysById(address as string)
  if(!targetPoolInfo){
    toast.error("cannot find the target pool")
  }
  //targetPoolInfo.marketId   //market id

  // TODO: handle loading
  // const [pageLoading, setPageLoading] = useState(true);

  const { serumMarket } = useSerumMarket(targetPoolInfo.marketId);

  if (!serumMarket) return <p>loading...</p>;

  return (
    <MarketProvider serumMarket={serumMarket} walletAddress={wallet.publicKey}>
      <div className="flex flex-col items-stretch space-y-4">
        <TokenDisplay />
        <OverviewTable2 poolAddress={new web3.PublicKey(address as string)}/>
        <VaultDisplay />
        <EventQueueCard />
        {cluster.network !== "mainnet-beta" && <ActionCenter />}
      </div>
    </MarketProvider>
  );
}

PoolPage.getLayout = (page: ReactNode) => getSearchLayout(page, "Pool");

export default PoolPage;
