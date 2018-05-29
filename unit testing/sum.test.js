// jest 单元测试.
const sum = require("./sum.js");

describe("sum test suit:", ()=> {
  test("sum test result:", ()=> {
    // toBe 测试整数
    expect(sum(5, 23)).toBe(28);
  });
  test("appdemo", ()=> {
    // toBeGreaterThan 测试小数,floating
    expect(sum(1.1, 4.333333)).toBeGreaterThan(5.433333);
  });
});


