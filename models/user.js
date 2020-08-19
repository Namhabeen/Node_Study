const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const saltRounds=10
const jwt = require('jsonwebtoken');


const userSchema=mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        defalut:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})


//비밀번호 암호화

/* 중괄호 잘못 닫아서 에러나는 부분,
   종종 실수하는 부분이므로 주석처리 해두기!
userSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('passwrod')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)return next(err)
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if(err) return next(err)
                    else user.password=hash
                    next()
                })
         })
    }
    else{
        next()
    }
})*/

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)


            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

//조건문 체크 잘하기! => 비밀번호 확인 부분에서 
//콜백함수 안썼다는 사실을 깜빡하여 시간을 꽤 낭비함 ㅜㅜ! 
userSchema.methods.comparePassword=function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password, function(err,isMatch){
        if(err) return cb(err)
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken=function(cb){
    //jsonwebtoken을 이용하여 token 생성하기
    var user=this;

    var token=jwt.sign(user._id.toHexString(),'secretToken')
    user.token=token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

const User=mongoose.model('User',userSchema)

module.exports={ User }