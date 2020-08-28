const { User } = require("../models/user");

let auth = (req, res, next) => {
    //인증 처리를 하는 곳
    //클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;
    //토큰 복호화 후 유저 찾기
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next()

        //next하는 이유: middleware에서 빠져나아갈 수 있게.
    })
}

module.exports = { auth }