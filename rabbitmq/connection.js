const amqp = require('amqplib');

const queue = 'task_queue';
const failedQueue = 'failed_queue';

const connect = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  // creating dead letter exchange
  channel.assertExchange('retryExchange', 'direct', { durable: true });
  channel.assertQueue('retry30s', { durable: true, deadLetterExchange: 'retryExchange', messageTtl: 30000, deadLetterRoutingKey: 'backToQueue' });
  channel.assertQueue(queue, { durable: true, deadLetterExchange: 'retryExchange', deadLetterRoutingKey: 'retry' });
  channel.assertQueue(failedQueue, { durable: true });
  channel.bindQueue(queue, 'retryExchange', 'backToQueue');
  channel.bindQueue('retry30s', 'retryExchange', 'retry');
  return channel;
};

module.exports = {
  queue,
  failedQueue,
  connect
};