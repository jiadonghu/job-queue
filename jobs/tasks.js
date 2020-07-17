const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const task = async (data) => {
  const timer = parseInt(Math.random() * 10) + 1;
  console.log(`starting the task ${data.id} - ${data.timestamp} from ${data.from}, lasts ${timer} s, by worker ${process.env.pm_id}`);
  if (timer > 5) {
    throw new Error('timeout!');
  }
  await sleep(1000 * timer);
}

module.exports = task;