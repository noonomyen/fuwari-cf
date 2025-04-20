declare const githubRepoRegex: RegExp;

/**
 * Checks if the given string is a valid GitHub repository identifier.
 *
 * A valid GitHub repository identifier is typically in the format "owner/repo".
 *
 * @param ownerRepo - The GitHub repository identifier to validate.
 * @returns True if the input matches the GitHub repository format, otherwise false.
 */
declare function isGithubRepo(ownerRepo: string): boolean;

export default isGithubRepo;
