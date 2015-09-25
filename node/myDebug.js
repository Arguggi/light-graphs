"use strict";

module.exports = {
    debug
};

function debug(debugFun, functionName, args) {
    //debugFun('Called by ', args.callee);
    debugFun('Function: ' + functionName);
    for (let i = 0; i < args.length; i++) {
        debugFun(args[i]);
    }
    debugFun('---------------');
}
