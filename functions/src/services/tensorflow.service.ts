import {Observable, from} from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import {map} from 'rxjs/operators';

export class TensorFlowService {

  process(message: string): Observable<string> {
    return this.loadModel().pipe(
      map(model => model.predict(tf.zeros([1, 224, 224, 3])).toString())
    );
  }

  private loadModel(): Observable<tf.LayersModel> {
    return from(tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'));
  }
}
