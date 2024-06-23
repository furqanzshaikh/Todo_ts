import express from 'express';
import dotenv from 'dotenv';
import connectDB from './connection/connectDb';
import todoRoutes from './routes/todoRoute';
import userRoute from './routes/userRoute'
import cors from'cors'

dotenv.config();


console.log(process.env.JWT_SECRET)
const app = express();
app.use(express.json());
app.use(cors())
app.use('/api', todoRoutes);
app.use('/api',userRoute)


export default app;
