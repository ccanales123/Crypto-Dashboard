import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ScriptableScaleContext,
} from 'chart.js';
import cryptoService from '../../services/cryptoService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Live Cryptocurrency Prices',
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Time',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Price in USD',
      },
      grid: {
        color: (context: ScriptableScaleContext) => {
          if (context.tick && context.tick.value === 0) {
            return '#000000';
          }
          return 'rgba(0, 0, 0, 0.1)';
        },
      },
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  maintainAspectRatio: false,
};

interface GraphData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const LivePriceGraph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    labels: [],
    datasets: [
      {
        label: 'BTC',
        data: [],
        borderColor: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
      },
      {
        label: 'ETH',
        data: [],
        borderColor: '#778899',
        backgroundColor: 'rgba(119, 136, 153, 0.5)',
      },
    ],
  });
  const [currentBTCPrice, setCurrentBTCPrice] = useState<number>(0);
  const [currentETHPrice, setCurrentETHPrice] = useState<number>(0);

  useEffect(() => {
    const updateGraph = async () => {
      try {
        const btcData = await cryptoService.fetchCryptoPrice('BTC');
        const ethData = await cryptoService.fetchCryptoPrice('ETH');
        const newTime = new Date().toLocaleTimeString();

        setCurrentBTCPrice(btcData.USD);
        setCurrentETHPrice(ethData.USD);
      
        setGraphData(prevData => ({
          labels: [...prevData.labels, newTime].slice(-15),
          datasets: prevData.datasets.map(dataset => {
            if (dataset.label === 'BTC') {
              return {
                ...dataset,
                data: [...dataset.data, btcData.USD].slice(-15),
              };
            } else if (dataset.label === 'ETH') {
              return {
                ...dataset,
                data: [...dataset.data, ethData.USD].slice(-15),
              };
            }
            return dataset;
          }),
        }));
      } catch (error) {
        console.error('Error updating graph data:', error);
      }
    };

    const intervalId = setInterval(updateGraph, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const priceStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
    gap: '120px',
    marginTop: '5px',
  };

  return (
    <>
    <div style={{ height: '320px', marginBottom: '20px' }}>
      <Line options={options} data={graphData} />
    </div>
    <div style={priceStyle}>
        <p>1 BTC = <strong>{currentBTCPrice.toFixed(2)}</strong> USD</p>
        <p>1 ETH = <strong>{currentETHPrice.toFixed(2)}</strong> USD</p>
    </div>
  </>
  );
};

export default LivePriceGraph;
