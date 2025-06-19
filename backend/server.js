const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const assetRoutes = require('./routes/asset.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/assets', assetRoutes);

app.listen(port, () => {
  console.log(`Backend server running at Port ${port}`);
});