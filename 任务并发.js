const tankard = [100, 110, 500, 200, 250]; // 任务时间数组
const concurrentLimit = 3; // 并发数限制

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTask(ms, index) {
  console.log(`Task ${index + 1} started, will take ${ms} ms`);
  await waitFor(ms);
  console.log(`Task ${index + 1} finished`);
}

async function runTasksWithLimit(tasks, limit) {
  const results = [];
  const executing = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = runTask(tasks[i], i);
    results.push(task);

    if (limit <= tasks.length) {
      const e = task.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}
