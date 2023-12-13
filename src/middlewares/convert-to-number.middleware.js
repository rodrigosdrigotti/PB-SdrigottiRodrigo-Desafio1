function convertToNumber(req, res, next){
    req.params.pid = Number(req.params.pid)
    req.params.cid = Number(req.params.cid)
    next()
}

module.exports = {
    convertToNumber,
}