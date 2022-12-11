const express = require('express') 
const app = express()
const {db}  = require('./db/connect')
const {body, validationResult, check} = require('express-validator')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

//secret key to create access tokens
const ACCESS_TOKEN_SECRET = "suce9jj3ma2fvdjv6zxa66xulo2rvbpgoeteuxjr"

app.set('view engine', 'ejs')
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())


//this middleware authenticates user tokens
const authenticateToken = (req, res, next) => {
    var session = req.cookies.Session
    if(!session) return res.render('login.ejs', {message: "Please log in!"})

    jwt.verify(session, ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.render('login.ejs', {message: "Session expired. Please log in again."})
        req.user = user
        next()
    })
}

app.get('/', authenticateToken, (req, res) => {
    const getProductCodes = "SELECT productCode FROM products GROUP BY productCode"
    db.query(getProductCodes, (err, result)=>{
        if(err) throw err
        return res.render('index.ejs', {name: req.user.fullName, productCodes: result, products: ''})  
    })
})

app.post('/', authenticateToken, (req, res) => {
    const chosenProductCode = req.body.productCode
    const getRelatedProducts = 'SELECT * FROM products WHERE productCode=(?)'
    db.query(getRelatedProducts, [chosenProductCode], (err, result)=>{
        if(err) throw err
        const getProductCodes = "select productCode from products group by productCode"
        db.query(getProductCodes, (err, PCresult)=>{
            if(err) throw err
            return res.render('index.ejs', {name: req.user.fullName, productCodes: PCresult, products: result})  
        })
    })
})

app.get('/delete/:id', authenticateToken, (req, res)=>{
    var id = req.params.id
    deleteProd = 'DELETE FROM products WHERE productID=(?)'
    db.query(deleteProd, [id], (err, result)=>{
        if(err) throw err
        res.redirect('/') 
    })
})

app.get('/register', (req, res) => {
    res.render('register.ejs', {message: "Please Register"})
})

app.post('/register',
    body('fullName').escape().isLength({min: 5, max: 25}).withMessage('Name must be between 5 and 25 characters.'),
    body('username').trim().escape().isLength({min: 5}, {max: 10}).withMessage('Username must be between 5 and 10 characters'),
    body('password').isLength({min: 8, max: 16}).withMessage('Password should contain at least 8 characters (max 16).'),
    body('password').matches('[0-9]').matches('[a-z]').matches('[A-Z]').withMessage('Password must contain at least 1 uppercase, 1 lowercase letter and a number.'),
    (req, res) => {
        const errors = validationResult(req).errors
        if(errors.length !== 0) return res.render('register.ejs', {message: `${errors[0].msg}`})
        
        let fullName = req.body.fullName
        let username = req.body.username
        let plainPassword = req.body.password
        
        bcrypt.hash(plainPassword, 10).then((hashedPassword) => {
            const pushUser = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?)"
            db.query(pushUser, [fullName, username, hashedPassword], (err, result)=>{
                if(err) throw err
                if(result) console.log('user pushed to db')
                return res.render('register.ejs', {message: 'Register successful!'})
            })       
        })
})


app.get('/login', (req, res) => {
    res.render('login.ejs', {message: "Please log in."})
})

app.post('/login',
    body('username').trim().escape(),
    body('password').trim().escape(),
    (req, res)=>{
        let username = req.body.username
        let plainPassword = req.body.password

        const checkUser = "SELECT * FROM users WHERE username=(?)"
        db.query(checkUser, [username], (err, dbResult) => {
            if(err) throw err
            if(dbResult.length !== 0){
                bcrypt.compare(plainPassword, dbResult[0].password).then((passwordOK) => {
                    //if password is correct then log in, otherwise notify user
                    if(passwordOK){
                        let accessToken = jwt.sign({fullName: dbResult[0].fullName}, ACCESS_TOKEN_SECRET, {expiresIn: "60m"})
                        res.cookie("Session", accessToken)
                        return res.redirect('/')
                    }

                    else return res.render('login.ejs', {message:"Invalid credentials!"})
                })
            }
            // user not found
            else{
                return res.render('login.ejs', {message:"Invalid credentials!"})
            }
        })
})

app.get('/logout', (req, res)=>{
    res.clearCookie("Session")
    return res.redirect('/login')
})

app.listen(8080, (err) => {
    if(err) throw err
    console.log('listening')
})