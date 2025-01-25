import createConsumer from "./createConsumer";
import createConsumerTransport from "./createConsumerTransport";

const requestTransportToConsume = (consumeData, socket, device, addUser) => {
  console.log(consumeData)
  consumeData.AudioProducerIds.forEach(async (audioPid, i) => {
    const videoPid = consumeData.VideoProducerIds[i];
    const consumerTransportParams = await socket.emitWithAck(
      "requestTransport",
      { type: "consumer", audioPid }
    );
    console.log(consumerTransportParams, "got consumerTransportParams ok !!");
    console.log(device , "devince in requestTransportConsume")
    const consumerTransport = createConsumerTransport(
      consumerTransportParams,
      device,
      socket,
      audioPid
    );

    const [audioConsumer, videoConsumer] = await Promise.all([
      createConsumer(consumerTransport, audioPid, device, socket, "audio", i),
      createConsumer(consumerTransport, videoPid, device, socket, "video", i),
    ]);
    console.log(audioConsumer , "audio consumer");
    console.log(videoConsumer , "video consumer");

    const combinedStream = new MediaStream([
      audioConsumer?.track,
      videoConsumer?.track,
    ]);

    console.log("Hope this works...");
    console.log(combinedStream , "combinedstream")
    addUser({
      combinedStream,
      userName: consumeData.AllUserData[i],
      consumerTransport,
      audioConsumer,
      videoConsumer,
    });
  });
};

export default requestTransportToConsume;
