import { ReactNode } from 'react';

import { useRouter } from 'next/router';

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

const MarketPage = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { address } = router.query;

  const { cluster } = useSolana();

  // TODO: handle loading
  // const [pageLoading, setPageLoading] = useState(true);

  const { serumMarket } = useSerumMarket(address as string);

  if (!serumMarket) return <p>loading...</p>;

  return (
    <MarketProvider serumMarket={serumMarket} walletAddress={wallet.publicKey}>
      <div className="flex flex-col items-stretch space-y-4">
        <TokenDisplay />
        <OverviewTable2 {...PublicKey: new web3.PublicKey("jscxe")}/>
        <VaultDisplay />
        <EventQueueCard />
        {cluster.network !== "mainnet-beta" && <ActionCenter />}
      </div>
    </MarketProvider>
  );
};

MarketPage.getLayout = (page: ReactNode) => getSearchLayout(page, "Market");

export default MarketPage;
