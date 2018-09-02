const Config = require('./config/config');
const mongoose = require('mongoose');
const Groups = require('./models/group');
const User = require('./models/user');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

mongoose.connect(Config.url, { useNewUrlParser:true } )
                .then(() => console.log('Connection Successfully.'))
                .catch(err => {
                    console.log('Could not connect with database.');
                });


app.get('/',function (req,res,next) {
    res.json('Welcome');
    next();
})

app.post('/register',(req,res) => {
    var hashPassword = bcrypt.hashSync(req.body.password,8);
    User.create({
            name: req.body.name,
            username:req.body.username,
            password:hashPassword,
            admin:false,
            location:req.body.location,
            meta:{
                age:req.body.age,
                website:req.body.website
            }

        },function(err,data) {
            if (err) {
                throw err;
            }
        //create a token
        var token = jwt.sign({id:data._id},Config.secret,{expiresIn:86400});
        res.status(200).send({auth:true,token:token});

    });
});

app.get('/me',function (req,res) {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, Config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        // res.status(200).send(decoded);
        User.findById(decoded.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");

            res.status(200).send(user);
        });
    });
});

app.post('/login',function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username:username},function(err,user) {
        if(err) {
            return res.status(500).send('500 Internal Server Error.');
        }else if(!user){
            return res.status(404).send('User not found.');
        }else {
            var passwordIsValid = bcrypt.compareSync(password,user.password);
            if(!passwordIsValid)
                return res.status(401).send({auth:false,token:null});
            var token =  jwt.sign({id:user._id},Config.secret,{expiresIn:86400});
            res.status(200).send({ auth:true, token:token});
        }
    });
});

app.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});


app.listen(3000);