import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import FriendsList from './components/FriendsList';
import Examination from './components/Examination';
import Message from './components/Message';
import Config from './components/Config'
import Device from './components/DeviceManage'
import Patient from './components/Patient'
function App() {
  const [sidebarStatus, setSideBarStatus] = useState({
    home: true,
    examination: false,
    message: false,
    config: false,
    device: false,
    patient: false
  })

  const handleChangeSidebarStatus = (key)=>{
    setSideBarStatus((prevStatus) => ({
      ...prevStatus,
      home: "home" === key, 
      examination: 'examination' === key,
      message: 'message' === key,
      config: 'config' === key,
      device: 'device' === key,
      patient: 'patient' === key
    }));
  }
  return (
    <div className="app">
      <Sidebar changeStatus={handleChangeSidebarStatus}/>
      <div className="main-content">
        <Header />
        {sidebarStatus.home && <Overview />}
        {sidebarStatus.examination && <Examination />}
        {sidebarStatus.message && <Message />}
        {sidebarStatus.config && <Config />}
        {sidebarStatus.device && <Device />}
        {sidebarStatus.patient && <Patient />}

      </div>
      {sidebarStatus.examination && <FriendsList />}
    </div>
  );
}

export default App;
