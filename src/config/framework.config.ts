export const frameworkConfig = {
  frameworkName: "playwright",
  language: "typescript",

  basePath: "D:\\PlayWirghtProjects\\PlaywrightFrameworkE2EAgent",

  folders: {
    tests: "tests",
    pages: "pages",
    testData: "test-data"
  },

  naming: {
    page: "{PageName}Page",
    test: "{storyId}.spec.ts",
    data: "{storyId}.json"
  },

  conventions: {
    usePOM: true,
    useTestDescribe: true,
    importStyle: "relative"
  }
};