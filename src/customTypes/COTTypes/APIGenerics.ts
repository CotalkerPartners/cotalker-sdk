export type IsActiveOptions = 'true' | 'false' | 'all'

export type JSONPatchBody = {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: `/${string}`;
  value?: unknown;
}[]
