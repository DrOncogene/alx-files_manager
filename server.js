import express from 'express';
import process from 'process';
import router from './routes/index';

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

app.use(express.json({ extended: true }));
app.use(router);

app.listen(PORT, () => {
  console.log(`LISTENING ON port ${PORT}`);
});
