const express = require('express');
const app = express();
const Agendash = require('agendash');
const agenda = require('./agenda-instance');
const task = require('../jobs/tasks');

agenda.define('processNotification', { priority: 'high', concurrency: 2 }, async (job) => {
  console.log('processing job..... ');
  await task(job.attrs.data);
  console.log('job done..');
});

agenda.define('prepareJobs', async (job) => { 
  console.log('prepareJobs...');
  for (let i =0; i< 5; i++) {
    agenda.now('processNotification', { from: 'Agenda', id: i });
  }
});


// agenda.start()
//   .then(() => {
//     agenda.every('30 seconds', 'prepareJobs', {});
//   })

(async function () {
  await agenda.start();
  await agenda.every('30 seconds', 'prepareJobs', { });
})();

app.use('/dash', Agendash(agenda));

app.get('/stop', (req, res, next) => {
  agenda.stop();
  return res.send('stoped')
});

app.get('/resume', (req, res, next) => {
  agenda.start();
  return res.send('resumed')
});

app.listen(4000);