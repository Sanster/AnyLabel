const runcb = cb => {
  typeof cb === 'function' && cb()
}

const getBaseName = filename => {
  return filename.substring(0, filename.length - 4)
}

module.exports = {
  runcb: runcb,
  getBaseName: getBaseName
}
