const express=require('express')
const mongoose=require('mongoose')
const app=express()
const port=3000

mongoose.connect('mongodb+srv://happybeen:abcd1234@jsstudy.smv9w.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true, useFindAndModify:false
}).then(()=>console.log('Mongo DB Connected...'))
  .catch(err=>console.log(err))

app.get('/',(req,res)=>res.send('Hello World!'))

app.listen(port,()=>console.log('Connected'))