runcb = (cb) => {
    typeof cb === 'function' && cb();
}

module.exports = {
    runcb
}