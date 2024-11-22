import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    heartMin: "",
    heartMax: "",
    temperatureMin: "",
    temperatureMax: "",
    flex1: "",
    flex2: "",
    flex3: "",
    flex4: "",
  });
  const [loading,setLoading] = useState(false)

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3484/config');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setFormData(result);
      } catch (err) {
        console.log(err)
      }
  };
  useEffect(() => {
      fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3484/config/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      else{
        alert("Đã lưu bản ghi!")
      }
    } catch (err) {
      console.log(err)
    } 
  };





  return (
    <Box sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", marginBottom: 4, fontWeight: "bold" }}
        >
          Health Data Form
        </Typography>
        <Grid container spacing={3}>
          {/* Heart Rate Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Heart Rate Min"
              name="heartRateMin"
              value={formData.heartMin}
              onChange={(e)=>handleChange("heartMin", e.target.value)}
              type="number"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Heart Rate Max"
              name="heartRateMax"
              value={formData.heartMax}
              onChange={(e)=>handleChange("heartMax", e.target.value)}
              type="number"
              variant="outlined"
            />
          </Grid>

          {/* Temperature Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Temperature Min (°C)"
              name="temperatureMin"
              value={formData.temperatureMin}
              onChange={(e)=>handleChange("temperatureMin", e.target.value)}
              type="number"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Temperature Max (°C)"
              name="temperatureMax"
              value={formData.temperatureMax}
              onChange={(e)=>handleChange("temperatureMax", e.target.value)}
              type="number"
              variant="outlined"
            />
          </Grid>

          {/* Fingers Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Finger 1"
              name="finger1"
              value={formData.flex1}
              onChange={(e)=>handleChange("flex1", e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Finger 2"
              name="finger2"
              value={formData.flex2}
              onChange={(e)=>handleChange("flex2", e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Finger 3"
              name="finger3"
              value={formData.flex3}
              onChange={(e)=>handleChange("flex3", e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Finger 4"
              name="finger4"
              value={formData.flex4}
              onChange={(e)=>handleChange("flex4", e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
        {/* Save Button */}
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            sx={{ textTransform: "none", borderRadius: 3, paddingX: 4 }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormComponent;
