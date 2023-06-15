const express = require('express');
const router = express.Router();
require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.API_KEY; // Access the API key from .env

const db = require("../model/helper"); // Import the helper module

router.get('/restaurants', async (req, res) => {
  const { city } = req.query;

  try {
    const { data: restaurants } = await db(`SELECT * FROM restaurants WHERE city = '${city}';`);
    console.log('restaurants:', restaurants);

    const promises = Object.values(restaurants).map(async (restaurant) => {
      const { restaurant_id } = restaurant;

      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant_id}&fields=name,formatted_address,website,formatted_phone_number&key=${apiKey}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details');
      }

      const data = await response.json();

      const placeData = data.result;
      const name = placeData.name;
      const location = placeData.formatted_address;
      const website = placeData.website;
      const phone = placeData.formatted_phone_number;

      return {
        id: restaurant.id,
        name,
        location,
        website,
        phone,
      };
    });

    const listOfRestaurants = await Promise.all(promises);

    res.json(listOfRestaurants);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
});

module.exports = router;
