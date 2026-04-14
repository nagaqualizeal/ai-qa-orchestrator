import { Logger } from '../utils/logger';
import { StateManager } from './stateManager';

export class Workflow {
  private logger: Logger;
  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.logger = new Logger('Workflow');
    this.stateManager = stateManager;
  }

  async executeStep(stepName: string, stepFn: () => Promise<unknown>): Promise<unknown> {
    this.logger.info(`Executing workflow step: ${stepName}`);
    
    try {
      this.stateManager.updateState(stepName, 'IN_PROGRESS');
      const result = await stepFn();
      this.stateManager.updateState(stepName, 'COMPLETED', result);
      return result;
    } catch (error) {
      this.logger.error(`Step ${stepName} failed`, error);
      this.stateManager.updateState(stepName, 'FAILED', error);
      throw error;
    }
  }

  async retryStep(stepName: string, stepFn: () => Promise<unknown>, maxRetries: number = 3): Promise<unknown> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.executeStep(stepName, stepFn);
      } catch (error) {
        this.logger.warn(`Step ${stepName} attempt ${attempt + 1} failed, retrying...`);
        if (attempt === maxRetries - 1) {
          throw error;
        }
      }
    }
  }
}
