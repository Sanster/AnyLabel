import path from 'path'
import { write } from 'fs'
const electron = window.require('electron')
const fs = electron.remote.require('fs')

// 检查文件，文件夹是否存在
function exists(path) {
  return fs.existsSync(path)
}

function listDir(dir, suffix = '.txt') {
  const names = fs.readdirSync(dir)
  return names.filter(x => x.endsWith(suffix))
}

function readLines(filePath) {
  const data = fs.readFileSync(filePath, 'utf8')
  const header = data.trim().split(/\n/)
  return header
}

function readFileSync(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

// 单位 kb
function fileSize(filePath) {
  const stats = fs.statSync(filePath)
  const fileSizeInBytes = stats.size
  return Math.ceil(fileSizeInBytes / 1024.0)
}

function writeFileSync(filePath, data) {
  fs.writeFileSync(filePath, data)
}

const io = {
  exists: exists,
  listDir: listDir,
  readLines: readLines,
  readFileSync: readFileSync,
  fileSize: fileSize,
  writeFileSync: writeFileSync
}

export default io
