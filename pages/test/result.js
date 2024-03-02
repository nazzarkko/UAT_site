// init your index.js
import { useEffect, useState } from "react";
import styles from '../../styles/Test.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { writeLS, readLS } from "../../utils/localstorage";
import { categories, categories_ukr } from "../../info/categories";

import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import Header from "../components/Header";


function index() {


    const [results, setResults] = useState({});
    const [chartData, setChartData] = useState(null);

    const loadResults = async () => {
        const answersFromLS = readLS('answers') || {};

        const summary = {};
        const response = await fetch('/api/load_results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers: answersFromLS }),

        }).catch((err) => {
            console.log(err);
        });

        const results = await response.json();
        setResults(results);


        const chartData_ = results;
        const dataPoints = chartData_;
        const chartData = {
            labels: Object.keys(dataPoints).map((key) => categories_ukr[key]),
            datasets: [
                {
                    label: 'Результати тесту',
                    data: Object.values(dataPoints).map((value) => parseInt(value * 100)),
                    backgroundColor: 'rgba(21, 166, 117, 0.12)',
                    borderColor: 'rgba(21, 200, 117, 0.6)',
                    borderWidth: 4
                },
            ],
        };

        setChartData(chartData);

    }

    const [width, setWidth] = useState(0);
    useEffect(() => {
        setWidth(window.innerWidth);
        loadResults();
    }, []);






    const chartOptions = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(21, 255, 117, 0.5)',
                },
                grid: {
                    color: 'rgba(21, 255, 117, 0.5)', 
                },
                pointLabels: {
                    font: {
                        size: width > 600 ? 20 : 12,
                    }
                },
                ticks: {
                    font: {
                        size: 5,

                    }
                }
            },
        },
    };

    return (
        <div className={styles.main}>
            <Header/>
            <div className={styles.square}>
            <div className={styles.container}>
                <div className={styles.title}>
                    Ваш результат
                </div>
                <div className={styles.radar_title}>Radar Chart</div>,
                <div className={styles.results}>
                    {chartData && <Radar data={chartData} options={chartOptions} />}
                </div>



            </div>
            </div>
            
        </div>
    );
}

export default index;
