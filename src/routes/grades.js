const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;

    res.send(json);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});


module.exports = router;