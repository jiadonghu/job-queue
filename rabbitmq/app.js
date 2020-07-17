const CronJob = require('cron').CronJob;
const { queue, connect } = require('./connection');

const cronJobs = (channel, queue) => {
  // every 10 seconds
  const job = new CronJob(
    '0/10 * * * * *',
    function () {
      // push 6 msgs to queue
      for (let i = 0; i < 5; i++ ) {
        const msg = { id: i, from: 'rabbitMQ', timestamp: Date.now() };
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), { persistent: true });
      }
    },
    null,
    true,
    'America/New_York'
  );
  job.start();
}

(async () => {
  const channel = await connect();

  //start cron jobs
  cronJobs(channel, queue);

})();