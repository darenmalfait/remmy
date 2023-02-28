export enum Appearance {
  SYSTEM = 'SYSTEM',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type RadioGroupItem = {
  label: string
  value: string
}

export type FilenameConfiguration = {
  id: string
  type: 'date' | 'detail' | 'description' | 'separator'
  value: string
  options?: string[]
}
