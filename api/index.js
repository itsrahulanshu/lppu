const path = require('path');
const fs = require('fs');

const handler = (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../public/index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};

module.exports = handler;
