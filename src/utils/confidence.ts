export function validateConfidence(score: number, stage: string) {
  if (score < 0.6) {
    throw new Error(`${stage} confidence too low: ${score}`);
  }
}