import React, { useState } from "react";

const fakeDevices = [
  {
    id: "D001",
    room: "101",
    bed: "1A",
    patientId: "P001",
  },
  {
    id: "D002",
    room: "102",
    bed: "1B",
    patientId: "P002",
  },
  {
    id: "D003",
    room: "103",
    bed: "2A",
    patientId: "P003",
  },
];

const IoTDeviceManagement = () => {
  const [devices, setDevices] = useState(fakeDevices);

  const handleDelete = (id) => {
    const updatedDevices = devices.filter((device) => device.id !== id);
    setDevices(updatedDevices);
  };

  const handleUpdate = (id) => {
    const updatedDevices = devices.map((device) =>
      device.id === id ? { ...device, room: "Updated Room" } : device
    );
    setDevices(updatedDevices);
    alert(`Updated device with ID: ${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>IoT Device Management</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={styles.headerCell}>Device ID</th>
            <th style={styles.headerCell}>Room</th>
            <th style={styles.headerCell}>Bed</th>
            <th style={styles.headerCell}>Patient ID</th>
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td style={styles.cell}>{device.id}</td>
              <td style={styles.cell}>{device.room}</td>
              <td style={styles.cell}>{device.bed}</td>
              <td style={styles.cell}>{device.patientId}</td>
              <td style={styles.cell}>
                <button
                  style={styles.button}
                  onClick={() => handleUpdate(device.id)}
                >
                  Update
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: "red" }}
                  onClick={() => handleDelete(device.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  headerCell: {
    border: "1px solid black",
    padding: "10px",
    backgroundColor: "#f2f2f2",
  },
  cell: {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  },
  button: {
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "3px",
  },
};

export default IoTDeviceManagement;
