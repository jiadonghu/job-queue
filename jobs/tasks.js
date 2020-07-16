const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const task = async (data) => {
  const timer = parseInt(Math.random() * 10) + 1;
  console.log(`starting the task ${data.id} from ${data.from}, lasts ${timer} s`);
  await sleep(1000 * timer);
  console.log(`done task ${data.id}`);
}

module.exports = task;