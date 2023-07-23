const express = require('express');
const axios = require('axios');
const moment = require('moment');
const app = express();
const port = 3000;

// API endpoint to get all trains in the next 12 hours
app.get('/trains/next12hours', async (req, res) => {
  try {
    const currentTime = moment();
    const next12Hours = moment().add(12, 'hours');
    console.log('Current Time:', currentTime.format());
    console.log('Next 12 Hours:', next12Hours.format());
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTAwNDk1MjYsImNvbXBhbnlOYW1lIjoiU2FyZGhhIFVuaXZlcnNpdHkiLCJjbGllbnRJRCI6Ijk3M2U1ZTYwLWEyYTktNDkxZS05MTUwLWEzYmYwNzM4NWVlZSIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiIxOTAxMDEzNTkifQ.U8JmAfuUR818p45vwAWP2IYrcCPIsIjWSH58CyO_rDU';
    const tokenType = 'Bearer';

    const response = await axios.get('http://20.244.56.144/train/trains', {
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });
  
      const trains = response.data;
  
      console.log('All Trains:', trains);
  
      const trainsInNext12Hours = trains.filter((train) => {
        const departureTime = moment()
          .set({ hour: train.departureTime.Hours, minute: train.departureTime.Minutes, second: train.departureTime.Seconds });
  
        return departureTime.isBetween(currentTime, next12Hours);
      });
  
      console.log('Trains in Next 12 Hours:', trainsInNext12Hours);
  
      res.json(trainsInNext12Hours);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
