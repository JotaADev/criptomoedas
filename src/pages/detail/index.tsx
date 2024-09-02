import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoinProps } from "../home";
import styles from "./detail.module.css";

export function Detail() {

    const {cripto} = useParams();
    const navigate = useNavigate();
    const [coinData, setCoinData] = useState<CoinProps>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCoin();
    }, [cripto]);

    async function getCoin() {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`).
        then(response => response.json()).
        then((data) => {
            const coinsData = data.data;
            const price = Intl.NumberFormat('en-US', {style: "currency", currency: "USD"});
            const priceCompact = Intl.NumberFormat('en-US', {style: "currency", currency: "USD", notation: "compact"});

            const formatedResult = {
                ...coinsData,
                formatedPriceUsd: price.format(Number(coinsData.priceUsd)),
                formatedMarketCapUsd: priceCompact.format(Number(coinsData.marketCapUsd)),
                formatedVolumeUsd24Hr: priceCompact.format(Number(coinsData.volumeUsd24Hr))
            }

            setCoinData(formatedResult);
            setLoading(false);
        }).
        catch(() => {navigate('/')});
    }

    if(loading) {
        return (
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando detalhes</h4>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.center}>{coinData?.name}</h1>
            <h1 className={styles.center}>{coinData?.symbol}</h1>

            <section className={styles.content}>
                <img
                    src={`https://assets.coincap.io/assets/icons/${coinData?.symbol.toLowerCase()}@2x.png`}
                    alt="Logo Cripto"
                    className={styles.logo}
                />
                <h1>{coinData?.name} | {coinData?.symbol}</h1>
                <p><strong>Preço: </strong>{coinData?.formatedPriceUsd}</p>
                <a>
                    <strong>Mercado: </strong>{coinData?.formatedMarketCapUsd}
                </a>
                <a>
                    <strong>Volume: </strong>{coinData?.formatedVolumeUsd24Hr}
                </a>
                <a>
                    <strong>Mudança 24h: </strong>
                    <span className={Number(coinData?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>
                        {Number(coinData?.changePercent24Hr).toFixed(2)}
                    </span>
                </a>
            </section>
        </div>
    );
}