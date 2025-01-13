import mediasoup, { types as mediasoupTypes } from "mediasoup";
import { createMediaSoupWorkers } from "../util/mediasoup-helpers/createWorkers";

class MediaSoupService {
  public workers: mediasoupTypes.Worker[] = [];

  constructor() {}

  public async InitiateMediaSoup() {
    this.workers = await createMediaSoupWorkers();
    console.log("mediasoup workers ready");
  }
}

export default new MediaSoupService();
