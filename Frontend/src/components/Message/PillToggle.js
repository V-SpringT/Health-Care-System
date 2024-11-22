import React, { useState } from "react";
import "./index.css";

function PillToggle({changeStatus}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => {
      changeStatus('status', !prev)
      return !prev
    });
    
  };

  return (
    <div className="pill-toggle">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default PillToggle;
