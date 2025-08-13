export const assert = (cond: any, msg = 'assert'): asserts cond => {
  if (!cond) throw new Error(msg);
};
