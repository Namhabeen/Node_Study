const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const app=express()
const port=3000
const config=require("./config/key");
const { User }=require("./models/user");
const user = require('./models/user');
const { auth }=require("./middleware/auth");

//body-parser application 분석 (9-11)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/',(req,res)=>res.send('Hello World!'))

app.listen(port,()=>console.log('Connected'))

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true, useFindAndModify:false
}).then(()=>console.log('Mongo DB Connected...'))
  .catch(err=>console.log(err))

app.post('/api/users/register',(req,res)=>{
    //회원가입시 필요한 정보들을 client로 부터 가져와 DB에 넣어줌
    const user=new User(req.body)

    user.save((err,user)=>{
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/api/users/login', (req, res) => {

    // 메일 확인
    User.findOne({ email: req.body.email }, (err, user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "해당 이메일은 가입되어있지 않습니다."
        })
      }
    
      //비밀번호 확인
    
      user.comparePassword(req.body.password, (err, isMatch ) => {
        if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      
        // 토큰생성
        user.generateToken((err, user) => {
          if(err) return res.status(400).send(err);
    
          // 토큰을 저장한다.(쿠키에)
          res.cookie("x_auth", user.token)   
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
        })
      })
   })
})

app.get('/api/users/auth',auth,(req,res)=>{
     res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        imag: req.user.image
     })
})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findByIdAndUpdate({_id: req.user._id},
    {token: ""},
    (err,user)=>{
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true 
        })
    })
})
