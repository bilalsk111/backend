const express = require('express');
const app = express();

app.use(express.json());
const notes = []

app.post('/notes',(req,res)=>{
    notes.push(req.body);
    res.status(201).json({
        message: "Note created successfully",
        notes: req.body
    })
})


app.get('/notes',(req,res)=>{
    res.status(200).json({
        message: "Notes retrieved successfully",
        data: notes
    })
})

app.delete('/notes/:idx',(req,res)=>{
    delete notes[req.params.idx]
    res.status(200).json({
        message: "Note deleted successfully",
        data: notes
    })
})




module.exports = app;