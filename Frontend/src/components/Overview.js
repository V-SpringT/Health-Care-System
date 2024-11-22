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
    Filler,
} from 'chart.js';
import './styles/Overview.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Overview = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'rpm',
                data: [],
                backgroundColor: 'rgba(106, 76, 147, 0.2)',
                borderColor: '#6a4c93',
                borderWidth: 2,
                pointBackgroundColor: '#ff6f61',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#ff6f61',
                pointHoverBorderColor: '#fff',
                fill: true,
            },
        ],
    });

    const [data2, setData2] = useState({
        labels: [],
        datasets: [
            {
                label: '℃',
                data: [],
                backgroundColor: 'rgba(106, 76, 147, 0.2)',
                borderColor: '#6a4c93',
                borderWidth: 2,
                pointBackgroundColor: '#ff6f61',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#ff6f61',
                pointHoverBorderColor: '#fff',
                fill: true,
            },
        ],
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
        const response = await fetch('http://localhost:3484/examination');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const dates = []
        const hearts = []
        const temperatures = []
        result.results.forEach((item)=>{
            const day = String((new Date(item.createdAt)).getDate()).padStart(2, '0'); 
            const month = String((new Date(item.createdAt)).getMonth() + 1).padStart(2, '0'); 
            
            const formattedDate = `${day}/${month}`;
            dates.push(formattedDate)
            hearts.push(item.heartRate)
            temperatures.push(item.temperature)
        })        
        setData({
            labels: dates,
            datasets: [
                {
                    label: 'rpm',
                    data: hearts,
                    backgroundColor: 'rgba(106, 76, 147, 0.2)',
                    borderColor: '#6a4c93',
                    borderWidth: 2,
                    pointBackgroundColor: '#ff6f61',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#ff6f61',
                    pointHoverBorderColor: '#fff',
                    fill: true,
                },
            ],
        });
        setData2({
            labels: dates,
            datasets: [
                {
                    label: 'rpm',
                    data: temperatures,
                    backgroundColor: 'rgba(106, 76, 147, 0.2)',
                    borderColor: '#6a4c93',
                    borderWidth: 2,
                    pointBackgroundColor: '#ff6f61',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#ff6f61',
                    pointHoverBorderColor: '#fff',
                    fill: true,
                },
            ],
        });
        } catch (err) {
        setError(err.message); 
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#fff',
                },
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#fff',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
    };

    return (
        <>
            <div className="overview">
                <h2>Heart Rate</h2>
                <div className="overview-content">
                    <div className="chart">
                        <Line data={data} options={options} />
                    </div>
                </div>
            </div>

            <div className="overview">
            <h2>Temperature</h2>
            <div className="overview-content">
                <div className="chart">
                    <Line data={data2} options={options} />
                </div>
            </div>
        </div>

        </>
        
    );
};

export default Overview;
