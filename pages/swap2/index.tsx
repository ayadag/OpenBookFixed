import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Input,
  Modal,
  Popover,
  Radio,
} from 'antd';

import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import styles from './swap2.module.css';
import tokenList from './tokenList.json';

function Swap() {
    const [slippage, setSlippage] = useState(2.5);
    // const [tokenOneAmount, setTokenOneAmount] = useState(null);
    // const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOneAmount, setTokenOneAmount] = useState(0);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
    const [tokenOne, setTokenOne] = useState(tokenList[0]);
    const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
    const [isOpen, setIsOpen] = useState(false);
    const [changeToken, setChangeToken] = useState(1);
    const [quoteResponse, setQuoteResponse] = useState(null);
    // const [prices, setPrices] = useState(null);

    function handleSlippageChange(e: any) {
        setSlippage(e.target.value);
    }

    // function changeAmount(e: any) {
    //     setTokenOneAmount(e.target.value);
    //     // if(e.target.value && prices){
    //     //   setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
    //     // }else{
    //     // //   setTokenTwoAmount(null);
    //     // setTokenTwoAmount(0);
    //     // }
    // }

    ////////////ayad///////////
    const handleFromValueChange = (
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        setTokenOneAmount(Number(event.target.value));
    };

    const debounce = <T extends unknown[]>(
        func: (...args: T) => void,
        wait: number
      ) => {
        let timeout: NodeJS.Timeout | undefined;
      
        return (...args: T) => {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
      
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
    };

    const debounceQuoteCall = useCallback(debounce(getQuote, 500), [tokenOne, tokenTwo]);

    useEffect(() => {
        debounceQuoteCall(tokenOneAmount);
    }, [tokenOneAmount, debounceQuoteCall]);

    async function getQuote(currentAmount: number) {
        if (isNaN(currentAmount) || currentAmount <= 0) {
          console.error('Invalid fromAmount value:', currentAmount);
          return;
        }
    
        const quote = await (
          await fetch(
            `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${currentAmount * Math.pow(10, tokenOne.decimals)}&slippage=${slippage}`
          )
        ).json();
    
        if (quote && quote.outAmount) {
          const outAmountNumber =
            Number(quote.outAmount) / Math.pow(10, tokenTwo.decimals);
          setTokenTwoAmount(outAmountNumber);
        } else {
            setTokenTwoAmount(0);
        }
    
        setQuoteResponse(quote);
    }



    function switchTokens() {
        // setPrices(null);
        setTokenOneAmount(0);
        setTokenTwoAmount(0);
        const one = tokenOne;
        const two = tokenTwo;
        setTokenOne(two);
        setTokenTwo(one);
        // fetchPrices(two.address, one.address);
    }

    function openModal(asset: any) {
        setChangeToken(asset);
        setIsOpen(true);
    }

    function modifyToken(i: any){
        // setPrices(null);
        // setTokenOneAmount(null);
        // setTokenTwoAmount(null);
        if (changeToken === 1) {
          setTokenOne(tokenList[i]);
        //   fetchPrices(tokenList[i].address, tokenTwo.address)
        } else {
          setTokenTwo(tokenList[i]);
        //   fetchPrices(tokenOne.address, tokenList[i].address)
        }
        setIsOpen(false);
      }
    

    const settings = (
        <>
          <div>Slippage Tolerance</div>
          <div>
            <Radio.Group value={slippage} onChange={handleSlippageChange}>
              <Radio.Button value={0.5}>0.5%</Radio.Button>
              <Radio.Button value={2.5}>2.5%</Radio.Button>
              <Radio.Button value={5}>5.0%</Radio.Button>
            </Radio.Group>
          </div>
        </>
      );
    return (
        <div className={styles.App}>
            <div className={styles.mainWindow}>
                <Modal
                    open={isOpen}
                    footer={null}
                    onCancel={() => setIsOpen(false)}
                    title="Select a token"
                >
                    <div className={styles.modalContent}>
                    {tokenList?.map((e, i) => {
                        return (
                        <div
                            className={styles.tokenChoice}
                            key={i}
                            onClick={() => modifyToken(i)}
                        >
                            <img src={e.img} alt={e.ticker} className={styles.tokenLogo} />
                            <div className={styles.tokenChoiceNames}>
                                <div className={styles.tokenName}>{e.name}</div>
                                <div className={styles.tokenTicker}>{e.ticker}</div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </Modal>
                <div className={styles.tradeBox}>
                    <div className={styles.tradeBoxHeader}>
                        <h4>Swap</h4>
                        <Popover
                        content={settings}
                        title="Settings"
                        trigger="click"
                        placement="bottomRight"
                        >
                            <SettingOutlined className={styles.cog}/>
                        </Popover>
                    </div>
                    <div className={styles.inputs}>
                        <Input
                            placeholder="0"
                            value={tokenOneAmount}
                            // onChange={changeAmount}
                            onChange={handleFromValueChange}
                            // disabled={!prices}
                        />
                        <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
                        <div className={styles.switchButton} onClick={switchTokens}>
                            <ArrowDownOutlined className={styles.switchArrow} />
                        </div>
                        {/* <div className={styles.assetOne} onClick={() => openModal(1)}> */}
                        <div className={styles.assetOne} onClick={() => openModal(1)}>
                            <img src={tokenOne.img} alt="assetOneLogo" className={styles.assetLogo} />
                            {/* <Image src={tokenOne.img} alt="assetOneLogo" width="22px" height="22px" className={styles.assetLogo} /> */}
                            {tokenOne.ticker}
                            <DownOutlined />
                        </div>
                        <div className={styles.assetTwo} onClick={() => openModal(2)}>
                            <img src={tokenTwo.img} alt="assetOneLogo" className={styles.assetLogo} />
                            {tokenTwo.ticker}
                            <DownOutlined />
                        </div>
                    </div>
                    {/* <div className={styles.swapButton} disabled={!tokenOneAmount || !isConnected} onClick={fetchDexSwap}>Swap</div> */}
                    <button className={styles.swapButton} disabled={!tokenOneAmount || tokenOneAmount==0}>Swap</button>
                </div>
            </div>
        </div>
    )
}
export default Swap;