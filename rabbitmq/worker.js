
const amqp = require('amqplib');
const task = require('../jobs/tasks');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'task_queue';
  channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);
  channel.consume(queue, async (msg) => {
    console.log('consuming...');
    await task(JSON.parse(msg.content.toString()));
    console.log('acknowledge...');
    channel.ack(msg);
  }, { noAck: false })
})();
