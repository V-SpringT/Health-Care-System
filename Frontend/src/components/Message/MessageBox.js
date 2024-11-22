import React from 'react';

const WarningBox = ({ mode, id, title, message,type, onClose }) => {
  return (
    <div style={styles.container} >
      <div style={styles.iconContainer}>
        <span style={styles.icon}>⚠️</span>
      </div>
      <div style={styles.textContainer}>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.message}>{message}</p>
      </div>
      <button style={styles.closeButton} onClick={()=> onClose(id, mode)}>
        &times;
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '10px',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '16px 24px',
    maxWidth: '350px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '2px solid #f48fb1', // Light pink border to match theme
    transition: "transform 0.5s ease"
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
  },
  icon: {
    fontSize: '24px', // Larger icon to draw attention
    color: '#f48fb1', // Pinkish color to match the theme
  },
  textContainer: {
    flex: 1,
    marginRight: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#6a1b9a', // Purple color to match the theme
    margin: '0 0 4px 0',
  },
  message: {
    color: '#333',
    fontSize: '14px',
    margin: 0,
  },
  closeButton: {
    backgroundColor: '#f48fb1', // Light pink color to match theme
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
};

export default WarningBox;
