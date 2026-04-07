const express = require('express');
const app = express();

// Root URL ping response
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

// Port for Replit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));