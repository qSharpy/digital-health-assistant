export abstract class Processor {

  constructor(protected messageLower: string, protected currentContext: string, protected previousUserMessages: string[], protected phoneNo: string, protected email: string) {

  }

  abstract execute(): ExecutionResult;
}

export interface ExecutionResult {
  isPositiveAnswer: boolean;
  dataForReplacing?: string[];
}
