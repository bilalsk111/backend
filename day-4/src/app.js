const express = require('express');
const app = express();

app.use(express.json())
const moive = []


app.post('/moive',(req,res)=>{
    console.log(req.body)
    moive.push(req.body)
 res.send("moive create")
})
app.get('/moive',(req,res)=>{
 res.send(moive)
})
app.patch('/moive/:index',(req,res)=>{
    moive[req.params.index].title = req.body.title
 res.send('title update')
})
app.put('/moive/:index',(req,res)=>{
    moive[req.params.index] = req.body
 res.send('update')
})
app.delete('/moive/:index',(req,res)=>{
   delete moive[req.params.index]
 res.send(`delete`)
})


module.exports = app