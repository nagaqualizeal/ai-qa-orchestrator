import { Logger } from '../utils/logger';

interface WorkflowState {
  [key: string]: {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    result?: unknown;
    error?: unknown;
    timestamp: number;
  };
}

export class StateManager {
  private logger: Logger;
  private state: WorkflowState = {};

  constructor() {
    this.logger = new Logger('StateManager');
  }

  updateState(key: string, status: string, result?: unknown): void {
    this.state[key] = {
      status: status as any,
      result,
      timestamp: Date.now(),
    };
    this.logger.info(`State updated: ${key} = ${status}`);
  }

  getState(key: string): Record<string, unknown> | undefined {
    return this.state[key];
  }

  getAllState(): WorkflowState {
    return { ...this.state };
  }

  clearState(): void {
    this.state = {};
    this.logger.info('State cleared');
  }
}
