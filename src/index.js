const express = require('express');
const fs = require('fs').promises;
const app = express();
const routerGrade = require('./routes/grades.js');
const port = 3000;
global.pathFile = './data/grades.json';

app.use(express.json());
app.use('/grade', routerGrade);

app.listen(port, async () => {
  try {
    let data = await fs.readFile(global.pathFile, 'utf8');
    if (!data) console.log('Grade file not found');
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});