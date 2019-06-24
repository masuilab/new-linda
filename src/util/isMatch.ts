import { IsMatchResponse, Tuple } from '../interfaces';
import { observableDiff } from 'deep-diff';

const isMatch = (targetTuple: Tuple, searchTuple: Tuple): IsMatchResponse => {
  const diffs2 = observableDiff(targetTuple, searchTuple, d => {});
  console.log(diffs2);
  const notMatchedDiff =
    diffs2 &&
    diffs2.filter(ele => {
      if (ele.kind === 'N' || ele.kind === 'A') {
        return true;
      } else if (
        ele.kind === 'E' &&
        (Object.keys(ele.rhs).length !== 0 || typeof ele.rhs !== 'object')
      ) {
        return true;
      }
      return false;
    });
  return !notMatchedDiff || notMatchedDiff.length === 0
    ? { isMatched: true, res: targetTuple }
    : { isMatched: false, res: null };
};

export default isMatch;
