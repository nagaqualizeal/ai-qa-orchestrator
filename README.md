# AI QA Orchestrator

An intelligent QA orchestration system powered by Claude and LLMs that automates test generation, execution, and reporting across the entire QA lifecycle.

## 🎯 Overview

The AI QA Orchestrator is a sophisticated system designed to streamline QA operations by leveraging multiple specialized agents that work in concert:

- **Jira Analysis Agent**: Analyzes requirements and defects from Jira
- **Test Design Agent**: Generates comprehensive test cases using AI
- **Automation Agent**: Creates automated test scripts
- **Git Agent**: Analyzes code changes for impact assessment
- **CI/CD Agent**: Manages test execution pipelines
- **Reporting Agent**: Generates detailed test reports
- **Defect Agent**: Analyzes and categorizes test failures

## 📁 Project Structure

```
ai-qa-orchestrator/
├── src/
│   ├── agents/           # Specialized QA agents
│   ├── orchestrator/     # Main orchestration logic
│   ├── integrations/     # External system connectors
│   ├── llm/              # LLM provider clients
│   ├── contracts/        # Data transfer contracts
│   ├── utils/            # Utility functions
│   └── config/           # Configuration management
├── scripts/              # Entry points
├── .env                  # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- API credentials for:
  - Jira
  - Claude (or compatible LLM)
  - Jenkins/Azure DevOps (CI/CD)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Running the Orchestrator

```bash
# Run for specific Jira issues
npm start QA-101 QA-102 QA-103

# Or using ts-node directly
ts-node scripts/runOrchestrator.ts QA-101 QA-102

# Development mode
npm run dev
```

## 🔧 Configuration

Edit `.env` file with your credentials:

```env
# Jira
JIRA_API_TOKEN=your_token
JIRA_BASE_URL=https://jira.company.com

# Claude API
CLAUDE_API_KEY=your_claude_key

# CI/CD
JENKINS_BASE_URL=https://jenkins.company.com
JENKINS_API_TOKEN=your_token
```

## 📝 Usage Examples

### Basic Workflow

```typescript
import { Orchestrator } from './src/orchestrator/orchestrator';

const orchestrator = new Orchestrator();
const result = await orchestrator.executeQAWorkflow(['PROJ-101', 'PROJ-102']);
```

### Individual Agent Usage

```typescript
import { JiraAnalysisAgent } from './src/agents/jiraAnalysis/jiraAnalysis.agent';
import { TestDesignAgent } from './src/agents/testDesign/testDesign.agent';

// Analyze Jira issues
const jiraAgent = new JiraAnalysisAgent();
const analysis = await jiraAgent.analyze({
  issueKeys: ['PROJ-101'],
  includeHistory: true,
});

// Generate test cases
const testAgent = new TestDesignAgent();
const testCases = await testAgent.generateTestCases({
  feature: 'User Authentication',
  requirements: ['Login', 'Password Reset'],
});
```

## 🏗️ Architecture

### Core Components

1. **Orchestrator** - Main brain coordinating all agents
2. **Agents** - Specialized components for specific QA tasks
3. **Integrations** - Connectors to external systems
4. **LLM Provider** - Interface to Claude API
5. **State Manager** - Tracks workflow state and results
6. **Contracts** - Data schemas for inter-module communication

### Data Flow

```
Jira Issues → Jira Agent → Orchestrator → Test Design → Automation Agent
                              ↓                           ↓
                         State Manager ← Reporting Agent ← CI/CD Pipeline
```

## 🔌 Integration Points

- **Jira**: Issue tracking and requirements management
- **Claude API**: AI-powered test generation and analysis
- **Git**: Code change analysis
- **Jenkins/Azure**: CI/CD pipeline execution
- **Test Frameworks**: Selenium, Cypress, Playwright, Jest, TestNG

## 📊 Features

- ✅ Automatic test case generation from requirements
- ✅ AI-powered test script creation
- ✅ Intelligent defect categorization
- ✅ Coverage analysis
- ✅ CI/CD integration
- ✅ Comprehensive reporting
- ✅ Confidence scoring
- ✅ Retry mechanisms with exponential backoff

## 🛠️ Development

```bash
# Build TypeScript
npm run build

# Run tests
npm test

# Watch mode
npm run test:watch

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

## 📚 API Reference

### Orchestrator

```typescript
orchestrator.executeQAWorkflow(jiraIssueKeys: string[]): Promise<WorkflowResult>
```

### Agents

Each agent follows a consistent interface:

```typescript
interface Agent {
  // Agent-specific execution method
}
```

## 🐛 Troubleshooting

### Missing Environment Variables

Ensure all required variables are set in `.env`:
- JIRA_API_TOKEN
- CLAUDE_API_KEY

### API Timeout Issues

Adjust timeouts in `src/config/constants.ts`:

```typescript
API_TIMEOUT: 30000, // milliseconds
```

### Authentication Failures

- Verify API tokens are correct
- Check API endpoint URLs
- Ensure network connectivity

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with reproduction steps
3. Include relevant logs and environment details

## 🔮 Roadmap

- [ ] Web dashboard for workflow monitoring
- [ ] Custom agent creation framework
- [ ] Advanced analytics and metrics
- [ ] Multi-LLM support (GPT-4, etc.)
- [ ] Mobile app for status tracking
- [ ] GraphQL API

## 📖 Documentation

- [Agent Development Guide](docs/AGENT_DEVELOPMENT.md)
- [Integration Guide](docs/INTEGRATION_GUIDE.md)
- [Configuration Reference](docs/CONFIGURATION.md)
- [API Reference](docs/API_REFERENCE.md)

---

Made with ❤️ for QA Automation
