import React from 'react';
import './styles/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserMd, faBell, faCog, faSignOutAlt, faMicrochip, faPerson } from '@fortawesome/free-solid-svg-icons';

import { SiNeptune } from "react-icons/si";

function Sidebar({changeStatus}) {
  return (
    <div className="sidebar">
      <div className="logo">
        <SiNeptune />
      </div>
      <nav>
        <ul>
          <li title='Home'  onClick={() => changeStatus("home")}>
            <FontAwesomeIcon icon={faHome} className="fa-icon" />
          </li>
          <li title='Examination' onClick={() => changeStatus("examination")}>
            <FontAwesomeIcon icon={faUserMd} className="fa-icon" />
          </li>
          <li title='Message' onClick={() => changeStatus("message")}>
            <FontAwesomeIcon icon={faBell} className="fa-icon" />
          </li>
          <li title="Config" onClick={() => changeStatus("config")}>
            <FontAwesomeIcon icon={faCog} className="fa-icon" />
          </li>
          <li title="Device" onClick={() => changeStatus("device")}>
            <FontAwesomeIcon icon={faMicrochip} className="fa-icon" />
          </li>
          <li title="Patient" onClick={() => changeStatus("patient")}>
            <FontAwesomeIcon icon={faPerson} className="fa-icon" />
          </li>
          <li>
            <FontAwesomeIcon icon={faSignOutAlt} className="fa-icon" />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
