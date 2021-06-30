module.exports = {
    success: (req, res, data) => {
        return res.status(200).json(data);
    },
    successWrite: (req, res, data) => {
        return res.status(201).json(data);
    },
    error: (req, res, error) => {
        req.apiLog(req, res, error.log);
        delete error.log;
        return res.status(409).json(error);
    },
    validationError: (req, res, data) => {
        req.apiLog(req, res, error.log);
        delete error.log;
        return res.status(422).json(error);
    }
}