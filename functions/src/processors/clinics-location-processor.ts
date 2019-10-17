import { Processor, ExecutionResult } from "./processor";

export class ClinicsLocationProcessor extends Processor {

  constructor(messageLower: string, currentContext: string, previousUserMessages: string[], phoneNo: string, email: string) {
    super(messageLower, currentContext, previousUserMessages, phoneNo, email);
  }

  execute(): ExecutionResult {
    return {
      dataForReplacing: ['clinic one', 'clinic two'],
      isPositiveAnswer: true
    };
  }

}
