import { Processor, ExecutionResult } from "./processor";

export class ClinicsLocationProcessor extends Processor {

  constructor(messageLower: string, currentContext: string, previousUserMessages: string[], phoneNo: string, email: string) {
    super(messageLower, currentContext, previousUserMessages, phoneNo, email);
  }

  execute(): ExecutionResult {
    const rand = Math.random();
    const isPositive = rand < 0.5;
    return {
      dataForReplacing: isPositive ? ['clinic one, clinic two'] : [],
      isPositiveAnswer: isPositive
    };
  }

}
