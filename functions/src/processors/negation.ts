import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, of } from "rxjs";

export class NegationProcessor extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    if (this.context.previousUserContexts != null &&
      this.context.previousUserContexts.length > 0 &&
      this.context.previousUserContexts[this.context.previousUserContexts.length - 1].toLowerCase().includes('nextsymptomsflow')) {
      return this.executeSymptomsCollection();
    }
    return of({
      isPositiveAnswer: true,
      forceContext: null
    } as ExecutionResult);
  }


  private executeSymptomsCollection(): Observable<ExecutionResult> {
    const allSymptomsNames = this.context.intentsModel.intents.find(x => x.tag === 'nextSymptomsFlow').patterns;

    const symptomsData = this.context.previousUserMessages.slice(this.context.previousUserMessages.length - 11, this.context.previousUserMessages.length)
      .map(sentence => sentence.split(',').map(z => z.trim()))
      .reduce((a, b) => a.concat(b))
      .filter(sentenceWithSymptom => {
        return allSymptomsNames.some(symptom => {
          return sentenceWithSymptom.includes(symptom);
        });
      })
      .map(x => allSymptomsNames.find(s => x.includes(s)))
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(s => this.context.intentsModel.symptomsMap.find(x => x.type === s))
      .filter(s => s);

    const tests = symptomsData.filter(x => x.tests != null && x.tests.length > 0)
      .map(x => x.tests)
      .reduce((a, b) => a.concat(b))
      .filter((value, index, self) => self.indexOf(value) === index);

    const depts = symptomsData.filter(x => x.dept != null)
      .map(x => x.dept)
      .filter((value, index, self) => self.indexOf(value) === index);

      const descs = symptomsData
      .filter(x => x.description != null)
      .map(x => x.description)
      .filter((value, index, self) => self.indexOf(value) === index);

      return of({
        forceAnswer: `You must do the following tests: ${tests.join(',')}. ${descs.join(', ')}. I have set up an appointment at 23rd of November, at 2 o'clock.`,
        forceContext: null
      } as ExecutionResult);
  }

}
