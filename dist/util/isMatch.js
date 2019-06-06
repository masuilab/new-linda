"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deep_diff_1 = require("deep-diff");
var isMatch = function (targetTuple, searchTuple) {
    var diffs2 = deep_diff_1.observableDiff(targetTuple, searchTuple, function (d) { });
    var notMatchedDiff = diffs2 &&
        diffs2.filter(function (ele) {
            if (ele.kind === 'N' || ele.kind === 'A') {
                return true;
            }
            else if (ele.kind === 'E' && Object.keys(ele.rhs).length !== 0) {
                return true;
            }
            return false;
        });
    return !notMatchedDiff || notMatchedDiff.length === 0
        ? { isMatched: true, res: targetTuple }
        : { isMatched: false, res: null };
};
exports.default = isMatch;
