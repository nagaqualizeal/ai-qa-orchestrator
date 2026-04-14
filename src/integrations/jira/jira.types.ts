export interface JiraIssueType {
  id: string;
  name: string;
  subtask: boolean;
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl: string;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: string;
}

export interface JiraIssue {
  key: string;
  id: string;
  fields: {
    summary: string;
    description: string;
    priority: JiraPriority;
    status: JiraStatus;
    issuetype: JiraIssueType;
    created: string;
    updated: string;
  };
}
