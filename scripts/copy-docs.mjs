import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const source = resolve(root, 'docs')
const target = resolve(root, 'dist', 'docs')

if (!existsSync(source)) {
  throw new Error(`docs directory not found at ${source}`)
}

mkdirSync(resolve(root, 'dist'), { recursive: true })
cpSync(source, target, { recursive: true })
console.log(`Copied docs to ${target}`)

