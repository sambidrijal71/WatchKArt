import express from 'express';
import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import productRoute from './routes/productRoute.js';
import DbConnect from './config/connectDB.js';
import path from 'path'

dotenv.config();

const app = express();
await DbConnect();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/product', productRoute)

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})



const PORT = process.env.PORT || 8000
app.listen(PORT, () => { console.log(`Server connected to PORT ${PORT}`.bgGreen) })