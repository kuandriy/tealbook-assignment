
// API Log Express middleware 
// Here we can implement (pino , watson, etc..)
module.exports = (req, res, next) => {
    req.apiLog = (req, res, message) => {
        // Can log req data
        console.log(message);
    }
    next();
}