export const StringFormat = (str: string, args: string[]) =>
  str.replace(/{(\d+)}/g, (match, index) => args[index] || '');

export function getAnswer(allAnswers: string[], isPositive: boolean, payload: string[] = null): string {
  const collection = isPositive ? allAnswers.filter(x => !x.startsWith('*')) : allAnswers.filter(x => x.startsWith('*')).map(x => x.replace('*', ''));
  const randomAnswer = collection[Math.floor(Math.random() * collection.length)];
  return StringFormat(randomAnswer, payload);
}
