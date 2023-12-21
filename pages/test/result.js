// init your index.js
import { useEffect, useState } from "react";
import styles from '../../styles/Test.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { writeLS, readLS } from "../../utils/localstorage";
import { categories, categories_ukr } from "../../info/categories";

import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';


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
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };

        setChartData(chartData);

    }
    useEffect(() => {
        loadResults();
    }, []);






    const chartOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.title}>
                    Результати тесту
                </div>

                {chartData && <Radar data={chartData} options={chartOptions} />}





            </div>
        </div>
    );
}

export default index;