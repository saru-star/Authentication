const express=require('express')
const app=express()
const authware=require('./auth')

app.get('/',authware,(req,res)=>{
    res.send("hello")
})

app.listen(3000);