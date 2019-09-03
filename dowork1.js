self.addEventListener("message", event => {
  console.log("Message listener in worker(doWork1) thread");
  const data = event.data;
  switch (data.cmd) {
    case "start":
      console.info("Worker started - " + data.msg);
      self.postMessage("Thread started");
      break;
    case "stop":
      console.info("Worker stopped - " + data.msg);
      self.stop;
      break;
    case "unknown":
      console.info("Unknow command - " + data.msg);
      break;
    default:
      break;
  }
});
