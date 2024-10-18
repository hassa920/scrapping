const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3002;

const url = 'https://arynews.tv/'; // The URL of the homepage

// API route to fetch top news with images, headlines, and subheadings
app.get('/news', async (req, res) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const topNews = [];

    // Array to hold headlines
    const headlines = [];
    
    // Scraping headlines using the tdm-title tdm-title-sm selector
    $('.tdm-title.tdm-title-sm').each((index, element) => {
      const headline = $(element).text().trim();
      headlines.push(headline);
    });

    // Scraping subheadings using the entry-title td-module-title selector
    const subheadings = [];
    $('.entry-title.td-module-title').each((index, element) => {
      const subheading = $(element).text().trim() || 'No Subheading Found'; // Using the same selector for subheading
      subheadings.push(subheading);
    });

    // Scraping image URLs using the entry-thumb td-thumb-css selector
    const imageUrls = [];
    $('.entry-thumb.td-thumb-css').each((index, element) => {
      const imageUrl = $(element).attr('src') || 'No Image Found'; // Extracting image source
      imageUrls.push(imageUrl);
    });

    // Combine headlines, subheadings, and images into the topNews array
    for (let i = 0; i < headlines.length; i++) {
      topNews.push({
        headline: headlines[i] || 'No Headline Found', // Use the indexed headline
        subheading: subheadings[i] || 'No Subheading Found', // Use the indexed subheading
        imageUrl: imageUrls[i] || 'No Image Found', // Use the indexed image URL
      });
    }

    // Send the scraped data as JSON response
    res.json(topNews);
  } catch (error) {
    console.error('Error fetching the page:', error);
    res.status(500).send('Error fetching the data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
