const Queue = require('bull');
const { setQueues, UI } = require('bull-board');
const task = require('../jobs/tasks');
const app = require('express')()
const taskQueue = new Queue('task_queue', 'redis://127.0.0.1:6379');

setQueues([taskQueue]);

// concurreny as 2
taskQueue.process('processNotification', 2, async (job, done) => {
  console.log('processing job..... ');
  await task(job.data);
  console.log('job done...');
  done();
});

taskQueue.process('prepareJobs', async (job, done) => {
  console.log('adding job...');
  for (let i = 0; i< 5; i++) {
    taskQueue.add('processNotification', {
      id: i,
      from: 'Bull'
    });
  }
  done();
});


taskQueue.add('prepareJobs', {}, {
  repeat: {
    every: 30 * 1000
  }
});

app.use('/admin/queues', UI);
app.get('/admin/pause', (req, res, next) => {
  taskQueue.pause().then(() => res.send('paused'));
});
app.get('/admin/resume', (req, res, next) => {
  taskQueue.resume().then(() => res.send('resumed'));
});
app.listen(4000);