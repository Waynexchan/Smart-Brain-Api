const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// const db = knex({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1', //localhost, modify where we set up our database
//         user: 'postgres', //add your username for the database here
//         port: 5432, // add your port number here
//         password: 'wayne888', //add your correct password here
//         database: 'smart-brain' //add your database name you created here
//     }
// });

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
  });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
});

app.post('/signin', (req,res) =>{
    signin.handleSignin(req, res, db, bcrypt);
})

app.post('/register', (req, res) => { 
    register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req,res) =>{ profile.handleprofileGet(req, res, db)})

app.put('/image', (req, res) =>{ image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => { image.handleClarifaiCall(req, res); });


app.listen(3000, () => {
    console.log('app is running on port 3000');
});
