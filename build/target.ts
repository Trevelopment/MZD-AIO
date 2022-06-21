'use strict'

require('shelljs/global')
const path = require('path')

const target = process.env.BUILD_TARGET || 'release'
const clean = (process.argv[2] === '--clean')

const targetConfFile = path.resolve(path.join(__dirname, `targets/${target}.json`))
// const targetConfFile = path.resolve(path.join(__dirname, `targets/debug.json`))
const targetDestFile = path.resolve(path.join(__dirname, '../app/config.json'))

if (clean) {
  console.log('Cleaning Target: %s', target)
  process.exit(rm(targetDestFile).code)
}

console.log('Preparing Target: %s', target)

process.exit(cp(targetConfFile, targetDestFile).code)
