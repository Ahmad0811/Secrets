
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/userDB', { useUnifiedTopology: true, useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })

const User = mongoose.model('user', userSchema);



app.route('/')

    .get(function (req, res)
    {
        res.render('home')
    });

app.route('/login')

    .get(function (req, res)
    {
        res.render('login')
    })

    .post(function (req, res)
    {
        const email = req.body.username;
        const password = req.body.password;
        User.findOne({ email: email }, function (err, foundUser)
        {
            if (!err) {
                if (foundUser.password === password) {
                    res.render('secrets')
                } else {
                    res.redirect('/login')
                }
            } else {
                res.send(err)
            }
        })
    })


app.route('/register')

    .get(function (req, res)
    {
        res.render('register')
    })

    .post(function (req, res)
    {
        const email = req.body.username;
        const password = req.body.password;
        const newUser = new User({
            email: email,
            password: password
        })
        newUser.save(function (err)
        {
            if (!err) {
                res.render('secrets')
            } else {
                res.send(err)
            }
        })
    })

app.listen(3000, function ()
{
    console.log('server is running on port 3000')
})