const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RatesLoader = require('./business/ratesLoader');
const port = process.env.PORT || 3000;
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

  const ratesUrl = process.env.RATES_URL;
  const rateLoader = new RatesLoader(ratesUrl);
  
  rateLoader.loadRates().then(

    () => {

      const server = app.listen(port, () => {
        console.log(`App running on port ${port}...`);
      });

      process.on('unhandledRejection', err => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        server.close(() => {
          process.exit(1);
        });
      });
    }
  ).catch(
    error => {
      console.log('COULD NOT LOAD RATES 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    }
  )






