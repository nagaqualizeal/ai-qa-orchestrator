export function parseMarkdown(md: string) {
  const testCases: any[] = [];

  const blocks = md.split("### ").slice(1);

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim());

    const titleLine = lines[0];
    const title = titleLine.split(":")[1]?.trim() || titleLine;

    const steps = lines
      .filter(l => /^\d+\./.test(l))
      .map(l => l.replace(/^\d+\.\s*/, ""));

    const expectedIndex = lines.findIndex(l =>
      l.toLowerCase().includes("expected result")
    );

    const expectedResult =
      expectedIndex !== -1 ? lines[expectedIndex + 1] : "";

    testCases.push({
      title,
      steps,
      expectedResult,
      priority: "Medium"
    });
  }

  return testCases;
}