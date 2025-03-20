
import morgan from 'morgan';
import 'reflect-metadata'
import express from 'express'
import 'module-alias/register'
import router from './network/routes';

const app = express();

app.use(express.urlencoded({
  limit: '1mb',
  extended: false
}));

app.use(express.json({limit: '16mb'}))
app.use(morgan('dev'));

app.use('/api', router);

app.listen(3300, () => {
  console.log(`🛰️ App listening at http://localhost:3300`);
}).on('error', (error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

// ENABLE APM LOGGING
// const apm = require('elastic-apm-node');
// apm.start({
//   serviceName: 'cge-services',
//   secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
//   serverUrl: process.env.ELASTIC_APM_SERVER_URL,
// });
// ENABLE APM LOGGING
