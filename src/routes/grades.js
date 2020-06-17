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
      error: error.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);
    json = json.grades.find((item) => item.id === id);

    res.send(json);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    let grade = req.body;
    if (JSON.stringify(grade) == '{}') throw new Error('Body not found');
    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);
    json.grades.push({
      id: json.nextId,
      ...grade,
      timestamp: new Date(),
    });
    json.nextId++;

    await fs.writeFile(global.pathFile, JSON.stringify(json));

    res.end();
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

router.put('/', async (req, res) => {
  try {
    let grade = req.body;
    if (JSON.stringify(grade) == '{}') throw new Error('Body not found');
    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);

    let index = json.grades.findIndex((item) => item.id == parseInt(grade.id));
    json.grades[index].student = grade.student;
    json.grades[index].subject = grade.subject;
    json.grades[index].type = grade.type;
    json.grades[index].value = grade.value;

    await fs.writeFile(global.pathFile, JSON.stringify(json));

    res.send(json.grades[index]);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);
    json.grades = json.grades.filter((item) => item.id !== id);

    await fs.writeFile(global.pathFile, JSON.stringify(json));
    res.end();
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

router.get('/SomaAluno/:student/:subject', async (req, res) => {
  try {
    let student = req.params.student;
    let subject = req.params.subject;

    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);

    json = json.grades.filter((item) => item.student === student && item.subject === subject);
    let sum = 0;

    for (let item of json) {
      sum += item.value;
    }


    res.send({
      value: sum
    });
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.get('/Media/:subject/:type', async (req, res) => {
  try {
    let subject = req.params.subject;
    let type = req.params.type;

    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);

    json = json.grades.filter((item) => item.type === type && item.subject === subject);
    let sum = 0;
    let media = 0;
    for (let item of json) {
      sum += item.value;
    }
    media = sum / json.length;

    res.send({
      media: media
    });
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.get('/Melhores/:subject/:type', async (req, res) => {
  try {
    let subject = req.params.subject;
    let type = req.params.type;

    let data = await fs.readFile(global.pathFile, 'utf8');
    let json = JSON.parse(data);

    json = json.grades.filter((item) => item.type === type && item.subject === subject);

    json = json.sort((a, b) => b.value - a.value);
    json = json.filter((item, index) => index < 3);

    res.send(json);
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

module.exports = router;