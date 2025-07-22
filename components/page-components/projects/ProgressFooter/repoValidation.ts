export const isGithubRepo = (url: string): boolean => {
  try {
    // Extract github URL if embedded in another string
    const githubUrlMatch = url.match(/https:\/\/github\.com\/[^\s?]+/i);
    if (!githubUrlMatch) return false;

    const parsedUrl = new URL(url);

    // Must be github.com domain
    if (!parsedUrl.hostname.includes("github.com")) return false;

    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathSegments.length !== 2) return false;

    // Should not end with .git
    if (pathSegments[1].endsWith(".git")) return false;
    if (url.endsWith("?")) return false;

    // Should not have query parameters
    if (parsedUrl.search) return false;

    return true;
  } catch (error) {
    return false;
  }
};

export const extractRepoInfo = (repoUrl: string) => {
  const parsedUrl = new URL(repoUrl);
  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

  if (pathSegments.length >= 2) {
    return {
      owner: pathSegments[0],
      repo: pathSegments[1].replace(".git", ""), // Remove .git if present
    };
  }

  throw new Error("Invalid GitHub URL format");
};

export const repositoryExists = async (repoUrl: string): Promise<boolean> => {
  try {
    const { owner, repo } = extractRepoInfo(repoUrl);
    const githubToken =
      process.env.GITHUB_TOKEN ??
      "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";

    const headers = {
      Authorization: `token ${githubToken}`,
    };
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl, { headers });
    return response.status === 200;
  } catch (error) {
    console.error("Error checking repository existence:", error);
    return false;
  }
};

// .git at the end
// unnecessary extra paths or query params
// not a github url
// not a valid repo url
// repo not accessible
//

export const repoContainsCode = async (repoUrl: string): Promise<boolean> => {
  try {
    const { owner, repo } = extractRepoInfo(repoUrl);
    const githubToken =
      process.env.GITHUB_TOKEN ??
      "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";

    const headers = {
      Authorization: `token ${githubToken}`,
    };

    // First check if repo has any commits by getting the default branch info
    const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResponse = await fetch(repoApiUrl, { headers });

    if (!repoResponse.ok) return false;

    const repoData = await repoResponse.json();

    // Quick checks for empty repo
    if (!repoData.default_branch) return false;

    // Check if there are any commits in the default branch
    const commitsApiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
    const commitsResponse = await fetch(commitsApiUrl, { headers });

    // If we can get commits, the repo has code
    return commitsResponse.ok && commitsResponse.status === 200;
  } catch (error) {
    console.error("Error checking repository code:", error);
    return false;
  }
};

export const checkFileExists = async (repoUrl: string, fileName: string) => {
  try {
    const { owner, repo } = extractRepoInfo(repoUrl);

    // Use GitHub API to check if file exists in root directory
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;
    const response = await fetch(apiUrl);

    // File exists if status is 200
    return response.status === 200;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};

export const validateProjectRepo = async (repoUrl: string) => {
  if (!isGithubRepo(repoUrl))
    return { isValid: false, error: "Invalid Github Repo URL" };

  const repoExists = await repositoryExists(repoUrl);

  if (!repoExists)
    return { isValid: false, error: "Repository does not exist or is private" };

  const repoContainsCodeResponse = await repoContainsCode(repoUrl);

  if (!repoContainsCodeResponse)
    return { isValid: false, error: "Repository appears to be empty" };

  return { isValid: true, error: "" };
};

export const formatGitHubUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathSegments.length >= 2) {
      const owner = pathSegments[0];
      const repo = pathSegments[1].replace(".git", "");
      return `https://github.com/${owner}/${repo}`;
    }

    return url;
  } catch (error) {
    return url;
  }
};
