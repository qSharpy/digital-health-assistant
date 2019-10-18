import { Observable, from } from "rxjs";
import * as tf from "@tensorflow/tfjs";
import { switchMap } from "rxjs/operators";

export class TensorflowService {
  constructor(protected modelUrl: string, protected errorThreshold: number = 0.25) {}

  protected predict(input: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[]): Observable<any> {
    return this.loadModel().pipe(
      switchMap(model => {
        return from(
          (model.predict(input, {
            verbose: true
          }) as any).data()
        );
      })
    );
  }

  protected loadModel(): Observable<tf.LayersModel> {
    return from(tf.loadLayersModel(tf.io.http(this.modelUrl, {
    })));
  }
}
