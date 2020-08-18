const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser');
const app=express()
const port=3000
const {User}=require("./models/user");
const config=require('./config/key');

//body-parser application 분석 (9-11)
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true, useFindAndModify:false
}).then(()=>console.log('Mongo DB Connected...'))
  .catch(err=>console.log(err))

app.get('/',(req,res)=>res.send('Hello World! node mon test'))

app.listen(port,()=>console.log('Connected'))

app.post('/register',(req,res)=>{
    //회원가입시 필요한 정보들을 client로 부터 가져와 DB에 넣어줌
    const user=new User(req.body)

    user.save((err,user)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/login',(req,res)=>{
    //가입 된 이메일인지 확인
    User.findOne({email: req.body.email},(err,user)=>{
        if(!userInfo){
            return req.json({
                loginSuccess:false,
                message:"해당 이메일로 가입한 사용자가 없습니다."
            })
        }
    })
    //가입 된 이메일의 비밀번호와 일치하는지 확인
    user.comparePassword(req.body.password,(err,isMatch)=>{
        if(!isMatch)
        return res.json({
            loginSuccess:false,
            message:"비밀번호가 틀렸습니다."})
    })
    //사용자를 위한 토큰 생성하기
    user.generateToken((err,user)=>{

    })
})

