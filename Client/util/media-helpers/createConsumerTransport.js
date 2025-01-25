const createConsumerTransport = (transportParams, device, socket, audioPid) => {
  // make a downstream transport for ONE producer/peer/client (with audio and video producers)
  console.log(device , "device from consumer to add")
  const consumerTransport = device.createRecvTransport(transportParams);

  consumerTransport.on("connectionstatechange", (state) => {
    console.log("==connectionstatechange==");
    console.log(state);
  });

  consumerTransport.on("icegatheringstatechange", (state) => {
    console.log("==icegatheringstatechange==");
    console.log(state);
  });
  // transport connect listener... fires on .consume()
  console.log("above cpnnect consumer transport");
  consumerTransport.on(
    "connect",
    async ({ dtlsParameters }, callback, errback) => {
      const connectResp = await socket.emitWithAck("connectTransport", {
        dtlsParameters,
        type: "consumer",
        audioPid,
      });
      if (connectResp === "success") {
        callback();
      } else {
        errback();
      }
    }
  );

  return consumerTransport;
};

export default createConsumerTransport;
