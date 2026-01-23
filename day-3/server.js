const express = require('express');
const app = express()

app.use(express.json())

const movie = []

app.post('/moive',(req,res)=>{
    console.log(req.body);
    movie.push(req.body)
    res.send('moivecreate') 
})

app.get('/moive',(req,res)=>{
    res.send(movie)
})

app.listen(8000)