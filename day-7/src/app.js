const express = require("express");
const notes = require('./models/notes.model')
const mongoose = require('mongoose')
const app = express();

app.use(express.json());

app.post('/notes',async (req,res)=>{
    const {title,description} = req.body;
    const note = await notes.create({
        title,description
    })
    res.status(201).json({
        massage:"notes create",
        note
    })
})

app.get('/notes', async (req,res)=>{
    const note = await notes.find()

    res.status(200).json({
        massage:'note get',
        note
    })
})
app.patch('/notes/:id', async (req, res) => {
  const note = await notes.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  )

  res.json(note)
})


app.delete('/notes/:id', async (req, res) => {
  const note = await notes.findByIdAndDelete(req.params.id)

  res.json({ message: 'deleted' })
})


module.exports = app;



