import * as tf from "@tensorflow/tfjs";
import * as request from "request";

export class StorageIoHandler implements tf.io.IOHandler {
  load?: tf.io.LoadHandler = () => {
    return new Promise<tf.io.ModelArtifacts>((resolve, reject) => {
      request(
        "https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fmodel.json?alt=media",
        { json: true },
        (err, res, body) => {
          if (err) reject(err);
          const result = body as tf.io.ModelArtifacts;
          result.weightSpecs = body.weightsManifest[0].weights;
          request(
            "https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fgroup1-shard1of1.bin?alt=media",
            { encoding: null },
            (err2, res2, body2) => {
              if (err2) reject(err2);
              const bufferBody: Buffer = body2;
              result.weightData = new Uint8Array(bufferBody).buffer;
              resolve(result);
            }
          );
        }
      );
    });
  };
}
