
const { queue, failedQueue, connect } = require('./connection');
const task = require('../jobs/tasks');

const startWroker = async () => {
  const channel = await connect();
  channel.prefetch(1);
  channel.consume(queue, async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString());
      await task(data);
      channel.ack(msg);
    } catch(e) {
      console.log('!!!!!! ERROR !!!!!!!!!!!', e.message);

      // retry 3 times then fail the job
      if (
        msg.properties.headers['x-death'] &&
        msg.properties.headers['x-death'].some(item => (item.queue == queue && item.count >= 3))
      ) {
        console.log(`job failed after retried 3 times!!`);
        channel.ack(msg);
        channel.sendToQueue(failedQueue, msg.content, { persistent: true });
      } else {
        channel.reject(msg, false);
      }
    }
  }, { noAck: false });
};

startWroker();

process.on('uncaughtException', function (e) {
  console.log('An error has occured. error is: %s and stack trace is: %s', e, e.stack);
  console.log("Process will restart now.");
  process.exit(1);
})