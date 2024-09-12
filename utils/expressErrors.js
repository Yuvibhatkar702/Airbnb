
class ExpressError extends Error{
    ExpressError(code,massage){
        // super();
        this.code = code;
        this.massage = massage;
    }
}

module.exports = ExpressError; 