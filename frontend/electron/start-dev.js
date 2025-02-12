import { spawn } from 'child_process'
import concurrently from 'concurrently'

// Start both Vite and Electron in development
concurrently([
  { 
    command: 'vite',
    name: 'vite',
    prefixColor: 'blue'
  },
  { 
    command: 'electron .',
    name: 'electron',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success']
}).then(
  () => process.exit(0),
  () => process.exit(1)
)