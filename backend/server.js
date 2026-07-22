import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db.js';
import teacherRouter from './routes/teacher.route.js';
import teacherPositionRouter from './routes/teacherPosition.route.js';

const app = express();

app.use(express.json());

// API Teachers
app.use('/teachers', teacherRouter);
// API Teacher Positions
app.use('/teacher-positions', teacherPositionRouter);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
