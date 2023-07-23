import type { Uri } from 'vscode';

export interface Provider {
	readonly id: 'github' | 'azdo';
	readonly name: string;
}

export enum HeadType {
	Branch = 0,
	RemoteBranch = 1,
	Tag = 2,
	Commit = 3,
}

export interface Metadata {
	readonly provider: Provider;
	readonly repo: { owner: string; name: string } & Record<string, unknown>;
	getRevision(): Promise<{ type: HeadType; name: string; revision: string }>;
}

// export type CreateUriOptions = Omit<Metadata, 'provider' | 'branch'>;

export interface RemoteHubApi {
	getMetadata(uri: Uri): Promise<Metadata | undefined>;

	// createProviderUri(provider: string, options: CreateUriOptions, path: string): Uri | undefined;
	getProvider(uri: Uri): Provider | undefined;
	getProviderUri(uri: Uri): Uri;
	getProviderRootUri(uri: Uri): Uri;
	isProviderUri(uri: Uri, provider?: string): boolean;

	// createVirtualUri(provider: string, options: CreateUriOptions, path: string): Uri | undefined;
	getVirtualUri(uri: Uri): Uri;
	getVirtualWorkspaceUri(uri: Uri): Uri | undefined;

	/**
	 * Returns whether RemoteHub has the full workspace contents for a vscode-vfs:// URI.
	 * This will download workspace contents if fetching full workspace contents is enabled
	 * for the requested URI and the contents are not already available locally.
	 * @param workspaceUri A vscode-vfs:// URI for a RemoteHub workspace folder.
	 * @returns boolean indicating whether the workspace contents were successfully loaded.
	 */
	loadWorkspaceContents(workspaceUri: Uri): Promise<boolean>;
}

export interface RepositoryRef {
	type: RepositoryRefType;
	id: string;
}

export const enum RepositoryRefType {
	Branch = 0,
	Tag = 1,
	Commit = 2,
	PullRequest = 3,
	Tree = 4,
}

export interface GitHubAuthorityMetadata {
	v: 1;
	ref?: RepositoryRef;
}
