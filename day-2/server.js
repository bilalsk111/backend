const express = require('express')
const app = express();

app.get('/',(req,res)=>{
    res.send('helooooo')
})
app.get('/about',(req,res)=>{
    res.send('about')
})

app.listen(5000)