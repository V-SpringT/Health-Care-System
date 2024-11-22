
import React, { useState, useEffect} from 'react';
import io from 'socket.io-client';
import { FaHeartbeat, FaTemperatureHigh, FaFingerprint } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './styles/Message.css';
import PillToggle from './Message/PillToggle';
import MessageBox from './Message/MessageBox';
function generateUniqueId() {
    const timestamp = Date.now().toString(36); // Chuyển thời gian hiện tại thành base36
    const randomNumber = Math.random().toString(36).substring(2, 10); // Số ngẫu nhiên base36
    const uniqueId = `${timestamp}-${randomNumber}`;
    return uniqueId;
}
const heart={
    status: false,
    warnings: []
}
const temperature={
    status: false,
    warnings: []
}

const signal={
    status: false,
    warnings: []
}

const Examination = () => {


    const [heartWarning, setHeartWarning] = useState(heart)
    const [temperatureWarning, setTemperatureWarning] = useState(temperature)
    const [signalWarning, setSignalWarning] = useState(signal)

    const handleHeartStatus = (key, value)=>{
        if(key === "status"){
            setHeartWarning((prevMessages) =>({
                ...prevMessages,
                [key]: value
            }));
        }
        else{
            setHeartWarning((prevMessages) =>{
                const newWarning = {
                    id : generateUniqueId(),
                    ...value
                  }
                return ({
                    ...prevMessages,
                    warnings: [newWarning ,...prevMessages.warnings ]
                })
            });
        }
            
    }

    const handleTemperatureStatus = (key, value)=>{
        if(key === "status"){
            setTemperatureWarning((prevMessages) =>({
                ...prevMessages,
                [key]: value
            }));
        }
        else{
            setTemperatureWarning((prevMessages) =>{
                const newWarning = {
                    id : generateUniqueId(),
                    ...value
                  }
                return ({
                    ...prevMessages,
                    warnings: [newWarning ,...prevMessages.warnings ]
                })
            });

        }
            
    }
   
    const handleSignalStatus = (key, value)=>{
        if(key === "status"){
            setSignalWarning((prevMessages) =>({
                ...prevMessages,
                [key]: value
            }));
        }
        else{
            setSignalWarning((prevMessages) =>{
                const newWarning = {
                    id : generateUniqueId(),
                    ...value
                  }
                return ({
                    ...prevMessages,
                    warnings: [newWarning ,...prevMessages.warnings ]
                })
            });

        }
            
    }
    const handleRemoveMsge = (id, key, value)=>{
        if(key === "heart") {
            const removedDiv = document.querySelector(`.heart${id}`)
            if(removedDiv){
                removedDiv.classList.add('hidden'); 
                setTimeout(() => {
                    removedDiv.style.display = 'none'; 
                    const curWarning = heartWarning.warnings.filter((item)=>{
                        return item.id !== id
                    })

            setHeartWarning((prev)=>({
                ...prev,
                warnings: curWarning
            }))
                }, 500);
            }
            
        }
        if(key === "temperature"){
            const removedDiv = document.querySelector(`.temperature${id}`)
            if(removedDiv){
                removedDiv.classList.add('hidden'); 
                setTimeout(() => {
                    removedDiv.style.display = 'none'; 
                    const curWarning = temperatureWarning.warnings.filter((item)=>{
                        return item.id !== id
                    })
        
                    setTemperatureWarning((prev)=>({
                        ...prev,
                        warnings: curWarning
                    }))
                }, 500);
            }
            
        }
        if(key === "signal"){
            const removedDiv = document.querySelector(`.signal${id}`)
            if(removedDiv){
                removedDiv.classList.add('hidden'); 
                setTimeout(() => {
                    removedDiv.style.display = 'none'; 
                    const curWarning = signalWarning.warnings.filter((item)=>{
                        return item.id !== id
                    })
        
                    setSignalWarning((prev)=>({
                        ...prev,
                        warnings: curWarning
                    }))
                }, 500);
            }

        }   
    }

    const activities = [
        { 
            name: "Heart Rate Warning", 
            goal: "Provide alerts when the heart rate goes beyond the normal range.", 
            icon: <FaHeartbeat />,
            change: handleHeartStatus
        },
        { 
            name: "Temperature Warning", 
            goal: "Provide alerts when the body temperature goes beyond the safe range.", 
            icon: <FaTemperatureHigh />,
            change: handleTemperatureStatus
        },
        { 
            name: "Signal of Warning", 
            goal: "Receiving assistance from patients through finger gestures", 
            icon: <FaFingerprint />,
            change: handleSignalStatus
        },
    ];

    

    useEffect(() => {
        const socket = io('http://localhost:3484');
    
        // Gửi trạng thái lên server
        socket.emit('updateStatus', {
            heart: heartWarning.status,
            temperature: temperatureWarning.status,
            signal: signalWarning.status,
        });
    
        // Lắng nghe các sự kiện nếu chúng được bật
        if (heartWarning.status) {
            socket.on('heart', (data) => {
                handleHeartStatus('warning', {title: data.title, message: data.message, type: data.type });
            });
        }
    
        if (temperatureWarning.status) {
            socket.on('temperature', (data) => {
                handleTemperatureStatus('warning', { title: data.title, message: data.message, type: data.type });
            });
        }
    
        if (signalWarning.status) {
            socket.on('signal', (data) => { 
                handleSignalStatus('warning', { title: data.title, message: data.message, type: data.type });
            });
        }
    
        // Cleanup socket khi component unmount
        return () => {
            socket.disconnect();
        };
    }, [heartWarning.status, temperatureWarning.status, signalWarning.status]);
    
    return (
        <>
            <div className="activity-cards">
                {activities.map((activity, index) => (
                    <div key={index} >
                        <div className="activity-card" style={{height: "183px"}}>
                            <div className="activity-header">
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-name">{activity.name}</div>
                                <PillToggle changeStatus={activity.change}/>
                            </div>
                            <div className="activity-info">
                                <div className="activity-details"><b>Goal:</b> {activity.goal}</div>
                                {/* <div className="progress-header">
                                    <span className="progress-label">Progress</span>
                                    <span className="progress-percent">{activity.progress}%</span>
                                </div> */}
                                {/* <div className="progress-bar">
                                    <div className="progress" style={{ width: `${activity.progress}%` }}></div>
                                </div> */}
                                {/* <div className="current-progress">
                                    <span>{activity.current}</span>
                                    <span className="days-left">{activity.daysLeft} days left</span>
                                </div> */}
                            </div>
                        </div>
                        {((heartWarning.status && index === 0)) 
                            && <div className='warning-box scrollableContent'>
                                <TransitionGroup>
                                    {heartWarning.warnings.map((item,idx) => (
                                        <CSSTransition key={item.id} timeout={500} classNames={"message"} onExited={() => handleRemoveMsge(item.id, "heart")}>
                                            <div className={`msg heart${item.id}`} style={{marginBottom: "10px"}} >
                                                <MessageBox 
                                                    mode="heart" 
                                                    id={item.id}
                                                    title={item.title} 
                                                    message={item.message} 
                                                    type={item.type}
                                                    onClose={handleRemoveMsge}
                                                />
                                            </div>
                                        </CSSTransition>
                                    
                                    ))}
                                </TransitionGroup>
                            </div>}

                            {((temperatureWarning.status && index === 1) ) 
                            && <div className='warning-box scrollableContent'>
                                <TransitionGroup>
                                    {temperatureWarning.warnings.map((item,idx) => (
                                        <CSSTransition key={item.id} timeout={500} classNames={"message"} onExited={() => handleRemoveMsge(item.id, "temperature")} >
                                            <div className={`msg temperature${item.id}`} style={{marginBottom: "10px"}}> 
                                                <MessageBox 
                                                    mode="temperature" 
                                                    id={item.id} 
                                                    title={item.title} 
                                                    message={item.message} 
                                                    type={item.type} 
                                                    onClose={handleRemoveMsge}
                                                />
                                            </div>
                                        </CSSTransition>
                                    
                                    ))}
                                </TransitionGroup>
                            </div>}

                            {((signalWarning.status && index === 2) ) 
                            && <div className='warning-box scrollableContent'>
                                <TransitionGroup>
                                    {signalWarning.warnings.map((item,idx) => (
                                        <CSSTransition key={item.id} timeout={500} classNames={"message"} onExited={() => handleRemoveMsge(item.id, "signal")}>
                                            <div className={`msg signal${item.id}`} style={{marginBottom: "10px"}}>
                                                <MessageBox 
                                                    mode="signal" 
                                                    id={item.id} 
                                                    title={item.title} 
                                                    message={item.message} 
                                                    type={item.type}
                                                    onClose={handleRemoveMsge}
                                                />
                                            </div>
                                            
                                        </CSSTransition>
                                    
                                    ))}
                                </TransitionGroup>
                            </div>}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Examination;
