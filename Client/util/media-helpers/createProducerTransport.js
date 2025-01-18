const createProducerTransport = (socket, device) =>
  new Promise(async (resolve, reject) => {
    // ask the server to make a transport and send params
    const producerTransportParams = await socket.emitWithAck(
      "requestTransport",
      {
        type: "producer",
      }
    );
    console.log(producerTransportParams);
    // create a send producer transport from front-end
    const producerTransport = device.createSendTransport(
      producerTransportParams
    );
    console.log(producerTransport);
    // listen for producerTransport connect event - won't fire until producerTransport.produce runs in createProducer function
    producerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errBack) => {
        // emit connect transport

        const connectResp = await socket.emitWithAck("connectTransport", {
          dtlsParameters,
          type: "producer",
        });

        if (connectResp === "success") {
          // we are connected
          console.log("we are connected");
          callback();
        } else {
          errBack();
        }
      }
    );

    console.log(device);
    // listen for produce event
    producerTransport.on("produce", async (parameters, callback, errBack) => {
      // emit produce transport

      const { kind, rtpParameters } = parameters;
      const produceResp = await socket.emitWithAck("startProducing", {
        kind,
        rtpParameters,
      });
      console.log(produceResp, "produce response");
      if (produceResp === "error") {
        errBack();
      } else {
        callback({ id: produceResp });
      }
    });

    resolve(producerTransport);
  });

export default createProducerTransport;
