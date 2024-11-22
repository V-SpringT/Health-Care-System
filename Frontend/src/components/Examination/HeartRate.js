import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faStopCircle, faDatabase } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client';
function HeartRate() {
  // State for latest data
  const [latestData, setLatestData] = useState({ heartRate: 0, temperature: 0 });
  // State for historical data
  const [historyData, setHistoryData] = useState([{time: 0,heartRate: 0, temperature:0 }]);
  const [exam, setExam] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock measure function
  const handleMeasure = () => {
    setLoading(true)
    setExam(!exam)
  };
  const handleSave = async () =>{
    try {
      const res = await fetch('http://localhost:3484/examination/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ heartRate: latestData.heartRate, temperature: latestData.temperature }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }else{
        alert("Lưu thành công!")
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }


  // Prepare data for the chart
  const chartData = {
    labels: historyData.map((data) => data.time),
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: historyData.map((data) => data.heartRate),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        borderWidth: 4,
        pointRadius: 4,
      },
      {
        label: 'Temperature (°C)',
        data: historyData.map((data) => data.temperature),
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        borderWidth: 4,
        pointRadius: 4,
      },
    ],
  };

  useEffect(() => {
    const socket = io('http://localhost:3484');
    if (exam) {
      socket.emit('updateStatus', {
          examination: exam
      });

      socket.on('examination', (data) => {
        setHistoryData((prevData) => {
            const newMeasurement = {
                time: prevData.length, // Sử dụng prevData để tính chiều dài
                heartRate: data.heart,
                temperature: data.temperature,
            };
            const heartSum = prevData.reduce((sum, item)=>{
              return sum + item.heartRate
            },0) 

            const temperSum = prevData.reduce((sum, item)=>{
              return sum + item.temperature
            },0) 

            setLatestData({
              heartRate: isNaN((heartSum/(prevData.length-1)).toFixed(0)) ? 0 : (heartSum/(prevData.length-1)).toFixed(0) , 
              temperature: isNaN((temperSum/(prevData.length-1)).toFixed(1)) ? 0 : (temperSum/(prevData.length-1)).toFixed(1)})
            return [...prevData, newMeasurement];
        });
    });
    
    } else {
      socket.off('examination');
    }
    return () => {
        socket.disconnect();
    };
  }, [exam]);


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* Box for recent measurement */}
      <div style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <h2>Average Examination Results</h2>
        <p>Heart Rate: <strong>{latestData.heartRate} bpm</strong></p>
        <p>Temperature: <strong>{latestData.temperature} °C</strong></p>
      </div>

      {/* Chart */}
      <div style={{ marginBottom: '20px' }}>
        <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: '#333',
                    font: { size: 14, family: 'Arial' },
                  },
                },
                tooltip: {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                },
              },
              scales: {
                x: {
                  grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  ticks: { color: '#333',   },
                },
                y: {
                  beginAtZero: true,
                  min: 0,
                  grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  ticks: { color: '#333', stepSize: 20, },
                },
              },
            }}

         />
      </div>

      {/* Measure Now Button */}
      <div style={{display: "flex", justifyContent: "start", gap: "10px"}}>
        <button
        onClick={handleMeasure}
        style={{
          padding: '12px 30px',
          backgroundColor: exam ? '#d9534f' : '#6f42c1', // Màu đỏ khi khám, màu tím khi chưa khám
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tạo hiệu ứng nổi nhẹ
          transition: 'all 0.3s ease', // Hiệu ứng mượt khi đổi trạng thái
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = exam ? '#c9302c' : '#5a34a1'} // Hover
        onMouseLeave={(e) => e.target.style.backgroundColor = exam ? '#d9534f' : '#6f42c1'}
      >
        <FontAwesomeIcon
          icon={exam ? faStopCircle : faStethoscope}
          style={{ marginRight: '10px', fontSize: '20px' }}
        />
        {exam ? 'Stop' : 'Start'}
      </button>
      
      { loading && (!exam) && (historyData.length > 1)  && <button
        onClick={()=>{handleSave()}}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6f42c1', // Màu tím chính
          color: '#fff',
          border: 'none',
          borderRadius: '16px', // Bo tròn mềm mại
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Hiệu ứng nổi
          transition: 'all 0.3s ease', // Hiệu ứng hover
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#5a34a1'} // Màu hover tối hơn
        onMouseLeave={(e) => e.target.style.backgroundColor = '#6f42c1'}
      >
        <FontAwesomeIcon
          icon={faDatabase}
          style={{ marginRight: '10px', fontSize: '18px' }}
        />
        Save 
      </button>}

    </div>
    </div>
  );
}

export default HeartRate;
