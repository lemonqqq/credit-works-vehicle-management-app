import { requestApi } from "./api";

let queueList = [];

let status = {
  NotStarted: "not started",
  Started: "started",
  PollFailed: "poll failed",
  RequestFailed: "request failed",
  Completed: "completed",
};

const waitAndPoll = async (queueId) => {
  let delay = 1_000;
  const queue = queueList.find((x) => x.id == queueId);
  if (queue === undefined)
    throw new Error(`Queue item does not exist - ${queueId}`);

  while (queue.noOfAttempts < 10) {
    update(queue, status.Started);

    let response;
    try {
      response = await requestApi.poll(queueId);
    } catch (error) {
      update(queue, status.PollFailed);
      throw error;
    }

    const { state } = response;
    if (state === "succeeded") {
      update(queue, status.Completed);
      return;
    }
    if (state === "failed") {
      update(queue, status.RequestFailed);
      throw new Error("The queued request failed");
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, 5_000);
  }
  update(queue, status.PollFailed);
  throw new Error("Timed out waiting for the queued request");
};

const update = (queue, pollStatus) => {
  queue.status = pollStatus;
  if (pollStatus === status.Started) {
    queue.noOfAttempts += 1;
    publish();
    return;
  }

  setTimeout(() => remove(queue.id), 20_000);
  publish();
};

const remove = (queueId) => {
  queueList = queueList.filter((x) => x.id != queueId);
  publish();
};

const add = async (method, path, queueId) => {
  queueList.push({
    method: method,
    path: path,
    id: queueId,
    status: status.NotStarted,
    noOfAttempts: 0,
  });
  publish();
  await waitAndPoll(queueId);
};

const listeners = new Set();

const publish = () => {
  const snapshot = queueList.map((item) => ({ ...item }));
  listeners.forEach((listener) => listener(snapshot));
};

const subscribe = (listener) => {
  listeners.add(listener);
  listener(queueList.map((item) => ({ ...item })));
  return () => listeners.delete(listener);
};

export const pollingService = {
  add: (method, path, queueId) => add(method, path, queueId),
  getList: () => queueList,
  subscribe: (listener) => subscribe(listener),
};
