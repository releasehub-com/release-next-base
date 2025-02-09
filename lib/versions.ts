export type VersionId = 'ephemeral' | 'gitlab' | 'kubernetes' | 'replicated' | 'cloud-dev' | 'cloud'

export const DEFAULT_VERSION: VersionId = 'ephemeral'

export const VALID_VERSIONS: VersionId[] = [
  'ephemeral',
  'gitlab', 
  'kubernetes',
  'replicated',
  'cloud-dev',
  'cloud'
]

export function isValidVersion(version: string): version is VersionId {
  return VALID_VERSIONS.includes(version as VersionId)
}

export function getVersionFromStorage(): VersionId {
  if (typeof window === 'undefined') return DEFAULT_VERSION
  
  const stored = localStorage.getItem('version')
  return isValidVersion(stored || '') ? stored as VersionId : DEFAULT_VERSION
} 