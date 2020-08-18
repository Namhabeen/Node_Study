const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser');
const app=express()
const port=3000
const {User}=require("./models/user");

//body-parser application 분석 (9-11)
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://happybeen:abcd1234@jsstudy.smv9w.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true, useFindAndModify:false
}).then(()=>console.log('Mongo DB Connected...'))
  .catch(err=>console.log(err))

app.get('/',(req,res)=>res.send('Hello World!'))

app.post('/register',(req,res)=>{
    //회원가입시 필요한 정보들을 client로 부터 가져와 DB에 넣어줌
    const user=new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.listen(port,()=>console.log('Connected'))