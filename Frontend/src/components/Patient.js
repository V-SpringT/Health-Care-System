import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const fakePatients = [
  {
    id: 1,
    name: "Nguyen Van A",
    birth: "1985-05-12",
    exams: [
      { date: "2024-01-01", heartRate: 72, temperature: 36.5 },
      { date: "2024-02-15", heartRate: 80, temperature: 37.2 },
    ],
  },
  {
    id: 2,
    name: "Tran Thi B",
    birth: "1990-11-23",
    exams: [
      { date: "2024-03-05", heartRate: 75, temperature: 36.8 },
    ],
  },
  {
    id: 3,
    name: "Le Van C",
    birth: "1975-03-15",
    exams: [
      { date: "2024-01-12", heartRate: 70, temperature: 36.4 },
      { date: "2024-03-18", heartRate: 78, temperature: 37.0 },
    ],
  },
];

const PatientManagement = () => {
  const [patients] = useState(fakePatients);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleDetails = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient);
  };

  const closeDetails = () => {
    setSelectedPatient(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Patient Management</h2>
      {!selectedPatient ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={styles.headerCell}>#</th>
              <th style={styles.headerCell}>Họ và Tên</th>
              <th style={styles.headerCell}>Ngày Sinh</th>
              <th style={styles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id}>
                <td style={styles.cell}>{index + 1}</td>
                <td style={styles.cell}>{patient.name}</td>
                <td style={styles.cell}>{patient.birth}</td>
                <td style={styles.cell}>
                <button
                  style={styles.button}
                  onClick={() => {}}
                >
                  <FontAwesomeIcon icon={faEdit} /> Sửa
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: "red" }}
                  onClick={()=>{}}
                >
                  <FontAwesomeIcon icon={faTrash} /> Xóa
                </button>
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: "blue",
                    }}
                    onClick={() => handleDetails(patient.id)}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <h3>Chi tiết bệnh nhân: {selectedPatient.name}</h3>
          <p>Ngày sinh: {selectedPatient.birth}</p>
          <button style={styles.closeButton} onClick={closeDetails}>
            Đóng
          </button>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={styles.headerCell}>#</th>
                <th style={styles.headerCell}>Ngày Khám</th>
                <th style={styles.headerCell}>Nhịp Tim</th>
                <th style={styles.headerCell}>Nhiệt Độ</th>
              </tr>
            </thead>
            <tbody>
              {selectedPatient.exams.map((exam, index) => (
                <tr key={index}>
                  <td style={styles.cell}>{index + 1}</td>
                  <td style={styles.cell}>{exam.date}</td>
                  <td style={styles.cell}>{exam.heartRate} bpm</td>
                  <td style={styles.cell}>{exam.temperature} °C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  closeButton: {
    padding: "10px 15px",
    margin: "10px 0",
    cursor: "pointer",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "3px",
  },
};

export default PatientManagement;
