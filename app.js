//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

var secret = 'Thisisourlittelesecret.' // process.env.SOME_LONG_UNGUESSABLE_STRING;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.get('/secrets', (req, res) => {
    res.render('secrets')
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render('secrets');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                } else {
                    console.log('wrong password');
                }
            } 
        })
        .catch((err) => {
            console.log(err)
        });
});



app.listen(3000, ()=>{
    console.log('Server started on port 3000')
});