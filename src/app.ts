import express from 'express';
import userRouter from './modules/user/user.router';

const app = express();

app.use(express.json());
app.use('/api/users', userRouter);

export default app;