import {
  describe as nodeDescribe,
  it as nodeIt,
  test as nodeTest,
} from "node:test";
import { expect } from "expect";

export const describe = nodeDescribe;
export const it = nodeIt;
export const test = nodeTest;
export { expect };

Object.assign(globalThis, {
  describe: nodeDescribe,
  expect,
  it: nodeIt,
  test: nodeTest,
});
