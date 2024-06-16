import {
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { web3 } from '@project-serum/anchor';
import { LIQUIDITY_STATE_LAYOUT_V4 } from '@raydium-io/raydium-sdk';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';

import { getSearchLayout } from '../../components/layouts/SearchLayout';
import { ActionCenter } from '../../components/market/ActionCenter';
import { EventQueueCard } from '../../components/market/EventQueue';
import { OverviewTable2 } from '../../components/market/OverviewTable';
import { TokenDisplay } from '../../components/market/TokenDisplay';
import { VaultDisplay } from '../../components/market/Vault';
import { useSolana } from '../../context';
import { MarketProvider } from '../../context/market';
import { useSerumMarket } from '../../hooks/useSerumMarket';

// import { formatAmmKeysById } from '../../utils/formatAmmKeysById';

// async function PoolPage() {
const PoolPage = () => {
  // const [targetPoolInfo, setTargetPoolInfo] = useState<ApiPoolInfoV4>();
  const { connection } = useConnection();
  const [marketId, setMarketId] = useState<web3.PublicKey>();
  // const [poolId, setPooltId] = useState<web3.PublicKey>();
  const [poolId, setPooltId] = useState<web3.PublicKey>(new web3.PublicKey("4pRDbmvCTAc8gmf3EUbvWT3DRtEF5ceLBB5fraBMqa1W"));

  const router = useRouter();
  const wallet = useWallet();
  const { address } = router.query;  //pool address

  const { cluster } = useSolana();

  const poolAS = address as string;
  console.log("poolAS", poolAS)

  // if(!poolAS){return}
  // const poolAP = new web3.PublicKey(poolAS);
  // const poolAP = new web3.PublicKey("4pRDbmvCTAc8gmf3EUbvWT3DRtEF5ceLBB5fraBMqa1W");

  // setPooltId(new web3.PublicKey(address as string))
  // if(poolAS){setPooltId(new web3.PublicKey(poolAS))}

  
  // try{
  //   const targetPoolInfo = await formatAmmKeysById(poolAS)
  // } catch (e) {return e;}
  // const targetPoolInfo = await formatAmmKeysById(poolAS)

  // const getTargetPoolInfo = async(poolAS: string) => {
  //   const targetPoolInfo = await formatAmmKeysById(poolAS)
  //   return targetPoolInfo;
  // }
  // useEffect( () => { 
  //   async function fetchData() {
  //       try {
  //           const res = await formatAmmKeysById(poolAS); 
  //           // const { serumMarket }  = useSerumMarket(res.marketId);
  //           setTargetPoolInfo(res);
  //       } catch (err) {
  //           console.log(err);
  //       }
  //   }
  //   fetchData();
  // }, [poolAS]);
  // const targetPoolInfo = getTargetPoolInfo(poolAS);
  
  // const { serumMarket } = useSerumMarket(targetPoolInfo.marketId);

  // if(!targetPoolInfo){
  //   toast.error("cannot find the target pool")
  //   // const { serumMarket } = useSerumMarket(targetPoolInfo.marketId);
  //   // return <p>loading...</p>;
  // }
  
  //targetPoolInfo.marketId   //market id

  
  useEffect( () => { 
    async function fetchData() {
        try {
            // const res = await formatAmmKeysById(poolAS); 
            setPooltId(new web3.PublicKey(address as string))
            const res = await connection.getAccountInfo(new web3.PublicKey(address as string))
            if (res === null) throw Error(' get id info error ')
            const info = LIQUIDITY_STATE_LAYOUT_V4.decode(res.data)
  
            const marketId = info.marketId

            setMarketId(marketId);
        } catch (err) {
          toast.error("cannot find the target pool")
          console.log(err);
        }
    }
    fetchData();
  }, [address, connection]);

  // TODO: handle loading
  // const [pageLoading, setPageLoading] = useState(true);

  const { serumMarket } = useSerumMarket(marketId?.toString());
  // const { serumMarket } = useSerumMarket(address as string);

  if (!serumMarket) return <p>loading...</p>;

  return (
    <MarketProvider serumMarket={serumMarket} walletAddress={wallet.publicKey}>
      <div className="flex flex-col items-stretch space-y-4">
        <TokenDisplay />
        <OverviewTable2 poolAddress={poolId}/>
        <VaultDisplay />
        <EventQueueCard />
        {cluster.network !== "mainnet-beta" && <ActionCenter />}
      </div>
    </MarketProvider>
  );
}

PoolPage.getLayout = (page: ReactNode) => getSearchLayout(page, "Pool");

export default PoolPage;
