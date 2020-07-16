const amqp = require('amqplib');
const CronJob = require('cron').CronJob;

const cronJobs = (channel, queue) => {
  // every 10 seconds
  const job = new CronJob(
    '0/10 * * * * *',
    function () {
      // push 6 msgs to queue
      for (let i = 0; i < 6; i++ ) {
        const msg = { id: i, from: 'rabbitMQ' };
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
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'task_queue';
  channel.assertQueue(queue, { durable: true });

  //start cron jobs
  cronJobs(channel, queue);

})();