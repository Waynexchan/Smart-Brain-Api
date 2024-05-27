import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfileGet } from './controllers/profile.js';
import { handleImage, handleClarifaiCall } from './controllers/image.js';

if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then(dotenv => dotenv.config());
}


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    },
    searchPath: [process.env.DB_SCHEMA, 'public'],
});

db.raw('SELECT 1')
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Database connection failed', err));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('success'));
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/imageurl', (req, res) => handleClarifaiCall(req, res));

app.listen(3000, () => console.log('Server is running on port 3000'));
