const WORKFLOW_RUN_RE = /\/actions\/runs\/(\d+)\/.*/;

export const getWorkflowFromDeploymentUrl = (url: string): string | undefined => {
	const match = url.match(WORKFLOW_RUN_RE);
	if (match && match.length > 1) return match[1];
};
