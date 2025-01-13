import os from "os";
import * as mediasoup from "mediasoup";
import { config } from "../config/config";

//maximum number of allowed workers
const totalThreads = os.cpus().length;

export const createMediaSoupWorkers = (): Promise<mediasoup.types.Worker[]> =>
  new Promise(async (resolve, reject) => {
    let workers = [];

    //loop to create each worker
    for (let i = 0; i < totalThreads; i++) {
      const worker = await mediasoup.createWorker({
        rtcMinPort: config.workerSettings.rtcMinPort,
        rtcMaxPort: config.workerSettings.rtcMaxPort,
        logLevel: "warn",
        logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
      });

      worker.on("died", () => {
        console.log("Worker has died");
        process.exit(1);
      });
      workers.push(worker);
    }

    resolve(workers);
  });
