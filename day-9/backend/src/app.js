const express = require('express');
const app = express();
const User = require('./models/users.model');
const cors = require('cors');
const path = require('path')
app.use(cors());
app.use(express.json());
app.use(express.static("./public"))


app.post('/api/users',async (req,res)=>{
    const {name, phone, email} = req.body;
    const user = await User.create({name, phone, email})
    res.status(201).json({
        message: "User created successfully",
        user: user
    })
})

app.get('/api/users',async (req,res)=>{
    const user = await User.find();
    res.status(200).json({
        message: "User fetched successfully",
        user: user
    })
})
app.delete('/api/users/:id',async (req,res)=>{
     const id = req.params.id
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({
        message: "Note deleted successfully.",
        user: user
    })
})
app.patch('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true,
        runValidators: true
     }
  )

    res.status(200).json({
        message: "Note update successfully.",
        user: user
    })
})


app.use('*name',(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "/public/index.html"))
})







module.exports = app;