import { useState, FormEvent, useEffect } from "react";
import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export interface CoinProps {
    changePercent24Hr: string;
    explorer: string;
    id: string;
    marketCapUsd: string;
    maxSupply: string;
    name: string;
    priceUsd: string;
    rank: string;
    supply: string;
    symbol: string;
    volumeUsd24Hr: string;
    vwap24Hr: string;
    formatedPriceUsd?: string;
    formatedMarketCapUsd?: string;
    formatedVolumeUsd24Hr?: string;
}

export interface DataProps {
    data: CoinProps[];
    timestamp: number;
}

export function Home() {

    const [input, setInput] = useState('');
    const [coins, setCoins] = useState<CoinProps[]>([]);
    const [offset, setOffset] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [offset]);

    async function getData() {
          fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`).
          then(response => response.json()).
          then((data: DataProps) => {
            const coinsData = data.data;
            const price = Intl.NumberFormat('en-US', {style: "currency", currency: "USD"});
            const priceCompact = Intl.NumberFormat('en-US', {style: "currency", currency: "USD", notation: "compact"});

            const formatedResult = coinsData.map((coin) => {
                const formated = {
                    ...coin,
                    formatedPriceUsd: price.format(Number(coin.priceUsd)),
                    formatedMarketCapUsd: priceCompact.format(Number(coin.marketCapUsd)),
                    formatedVolumeUsd24Hr: priceCompact.format(Number(coin.volumeUsd24Hr))
                }

                return formated;
            })

            const listCoins = [...coins, ...formatedResult];
            setCoins(listCoins);
          }).
          catch(() => {})
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        if(!input) {
            return;
        }

        navigate(`/detail/${input}`);
    }

    function handleGetMore() {
        if(offset === 0) {
            setOffset(10);
            return;
        } else {
            setOffset(offset + 10);
        }
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Digite o nome da moeda..."
                    id="search"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                />
                <button type="submit">
                    <BsSearch size={30} color="#FFFFFF"/>
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Moeda</th>
                        <th scope="col">Valor mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {coins.length > 0 && coins.map((coin) => (
                        <tr className={styles.tr} key={coin.id}>
                            <td className={styles.tdLabel} data-label="Moeda">
                                <div className={styles.name}>
                                    <img
                                        className={styles.logo}
                                        alt="Logo Cripto"
                                        src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                                    />
                                    <Link to={`/detail/${coin.id}`}>
                                        <span>{coin.name}</span> | {coin.symbol}
                                    </Link>
                                </div>
                            </td>
                            <td className={styles.tdLabel} data-label="Valor mercado">
                                {coin.formatedMarketCapUsd}
                            </td>
                            <td className={styles.tdLabel} data-label="Preço">
                                {coin.formatedPriceUsd}
                            </td>
                            <td className={styles.tdLabel} data-label="Volume">
                                {coin.formatedVolumeUsd24Hr}
                            </td>
                            <td
                                className={Number(coin.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss}
                                data-label="Mudança 24h"
                            >
                                <span>{Number(coin.changePercent24Hr).toFixed(2)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className={styles.buttonMore} onClick={handleGetMore}>Carregar mais...</button>
        </main>
    );
}