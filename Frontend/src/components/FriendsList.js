import React from 'react';
import './styles/FriendsList.css';
import { FaUserFriends, FaTemperatureLow,FaHeartbeat } from "react-icons/fa";
const FriendsList = () => {
    const friends = [
        { 
            name: "Heart Rate", 
            description: "",
            stat: [
                {age: "Newborn", rate: "100-160"},
                {age: "Children 1-2", rate: "90-150"}, 
                {age: "Children 3-4", rate: "80-140"},
                {age: "Children 5-6", rate: "75-120"},
                {age: "Children 7-9", rate: "70-110"},
                {age: "Children 10-12", rate: "60-100"},
                {age: "Children 13-15", rate: "55-95"},
                {age: "Children 16-18", rate: "50-90"},
                {age: "Adults", rate: "60-100"},
                {age: "Elderly people", rate: "40-100"}
            ], 
            image: <FaHeartbeat /> },
        { name: "Temperature", average: 36.8, stat: {from: 36.3, end: 37.1}, image: <FaTemperatureLow /> },
    ];

    return (
        <div className="friends-list">
            <div className="header-section" style={{}}>
                <h2 style={{
                display: "flex", 
                alignItems: "center", 
                fontSize: "24px", 
                color: "#4A4A8A", // Màu chủ đạo (y tế hoặc thư giãn)
                fontWeight: "bold",
                }}>
                    <FaUserFriends style={{ 
                    color: "#6c5ce7", // Màu nổi bật cho biểu tượng
                    marginRight: "10px",
                    fontSize: "28px"
                    }} /> 
                    Normal Ranges
                </h2>
            </div>
            <ul>
                {friends.map((friend, index) => (
                    <li key={index}>
                        <div className="friend-info">
                            <div style={{display:"flex"}}>
                                <div style={{marginRight: "10px"}}>
                                    {friend.image}
                                </div>
                                <span className="friend-name">{friend.name}</span>
                            </div>
                            <span className="friend-activity">{friend.description}</span>
                            { index === 0 && <table style={{width: "100%", marginTop: "10px"}}>
                                <thead>
                                    <tr>
                                        <th >Age</th>
                                        <th style={{textAlign: "center"}}>Heart Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {friend.stat.map((item)=>(
                                        <tr>
                                            <td style={{padding: "5px", paddingLeft: "0"}}>{item.age}</td>
                                            <td style={{textAlign: "center", padding: "5px"}}>{item.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                
                            </table>}
                            {index === 1 && <div>
                                <p style={{marginTop: "10px"}}><b>Average:</b> {friend.average} °C</p>
                                <p><b>Normal:</b>  {friend.stat.from} °C - {friend.stat.end} °C</p>
                            </div>}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default FriendsList;
