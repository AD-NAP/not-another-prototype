---
type: regex
target: { source: file, path: test/usernames.test.js }
pattern: 'ERR_MODULE_NOT_FOUND[\s\S]{0,80}\burl\b'
arm: with-only
---
