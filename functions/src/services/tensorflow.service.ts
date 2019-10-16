import { Observable, from } from "rxjs";
import * as tf from "@tensorflow/tfjs";
import { map } from "rxjs/operators";

export class TensorFlowService {
  process(message: string): Observable<string> {
    return this.loadModel().pipe(
      map(model => model.predict(tf.zeros([null, 82])).toString())
    );
  }

  private loadModel(): Observable<tf.LayersModel> {
    return from(
      tf.loadLayersModel(
        "https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fmodel.json?alt=media&token=9680ead9-59f6-4742-99c3-28b4369e87cc"
      )
    );
  }
}
