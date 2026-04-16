#!/usr/bin/env -S node --strip-types --no-warnings

import { runBuildValidation } from '@pagesmith/site/build-validator'
import { resolve } from 'path'

const outDir = resolve(import.meta.dirname, '..', 'dist')
const basePath = ''
const trailingSlash = false

const exitCode = runBuildValidation({ outDir, basePath, trailingSlash })
process.exit(exitCode)
