//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] })
const User = new mongoose.model("User", userSchema)


app.get('/', function(req, res) {
    res.render('home');
});

app.route('/login')
    .get(function(req, res) {
        res.render('login');
    })
    .post(function(req, res) {
        User.findOne({
            email: req.body.username
        }, function(err, foundUser) {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render('secrets')
                }
            }else {
                res.send(err.message);
            }
        });
    });

app.route('/register')
    .get(function(req, res) {
        res.render('register');
    })
    .post(function(req, res) {
        const newUser = new User ({
            email: req.body.username,
            password: req.body.password
        })
        newUser.save(function(err){
            if (!err) {
                res.render("secrets")
            }else {
                res.send(err.message)
            }
        });
    });



app.listen(3000, function() {
    console.log('listening on port 3000');
});

