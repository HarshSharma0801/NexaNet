import { Server } from "socket.io";
import { Call } from "../../controllers/call";

export const updateActiveSpeakers = (call: Call, io: Server) => {
  //this function is called on newDominantSpeaker, or a new peer produces
  // mutes existing consumers/producer if below 5, for all peers in call
  // unmutes existing consumers/producer if in top 5, for all peers in call
  // return new transports by peer
  //called by either activeSpeakerObserver (newDominantSpeaker) or startProducing

  const activeSpeakers = call.activeSpeakerList.slice(0, 5);
  const mutedSpeakers = call.activeSpeakerList.slice(5);
  const newTransportsByPeer: Record<string, string[]> = {};
  // loop through all connected participants in the call
  call.participants.forEach((participant) => {
    // loop through all participants to mute
    mutedSpeakers.forEach((pid) => {
      // pid is the producer id we want to mute
      if (participant?.producer?.audio?.id === pid) {
        // this participant is the produer. Mute the producer
        participant?.producer?.audio.pause();
        participant?.producer?.video.pause();
        return;
      }
      const downstreamToStop = participant.downstreamTransports.find(
        (t: any) => t?.audio?.producerId === pid
      );
      if (downstreamToStop) {
        // found the audio, mute both
        downstreamToStop.audio.pause();
        downstreamToStop.video.pause();
      } //no else. Do nothing if no match
    });
    // store all the pid's this participant is not yet consuming
    const newSpeakersToThisClient: string[] = [];
    activeSpeakers.forEach((pid) => {
      if (participant?.producer?.audio?.id === pid) {
        // this participant is the produer. Resume the producer
        participant?.producer?.audio.resume();
        participant?.producer?.video.resume();
        return;
      }
      // can grab pid from the audio.producerId like above, or use our own associatedAudioPid
      const downstreamToStart = participant.downstreamTransports.find(
        (t: any) => t?.associatedAudioPid === pid
      );
      if (downstreamToStart) {
        // we have a match. Just resume
        downstreamToStart?.audio.resume();
        downstreamToStart?.video.resume();
      } else {
        // this participant is not consuming... start the process
        newSpeakersToThisClient.push(pid);
      }
    });

    // this participant has at least 1 new consumer/transport to make
    // at socket.id key, put the array of newSpeakers to make
    // if there were no newSpeakers, then there will be no key for that participant

    newTransportsByPeer[participant.socket] = newSpeakersToThisClient;
  });
  // participant loop is done. We have muted or unmuted all producers/consumers
  // based on the new activeSpeakerList. Now, send out the consumers that
  // need to be made.
  // Broadcast to this call
  io.to(call.conversatiionId).emit("updateActiveSpeakers", activeSpeakers);
  return newTransportsByPeer;
};
