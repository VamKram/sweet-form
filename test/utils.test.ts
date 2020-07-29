import { get, pickByKeys, set } from "../src/utils";

describe("utils", () => {
  it("get deep obj should work ", function() {
      const mock = {a: {b: {c: {d: 1, f: 2}}}};
      const result = get(mock, 'a.b.c.d');
      expect(result).toEqual(1);
  });
  it("get deep obj with empty should work ", function() {
    const mock = {a: {b: 1}};
    const result = get(mock, 'a.b.c.d', 'custom');
    expect(result).toEqual('custom');
  });

  it("set deep obj should work", function() {
    const mock = {a: {b: {c: {d: 1, f: 2}}}};
    set(mock, "a.b.c", 100)
    expect(mock).toEqual({a: {b: {c:100}}})
  });

  it("set deep obj with empty should work", function() {
    const mock = {a: {b: 1,c : 2}};
    set(mock, "a.b.c", 100)
    expect(mock).toEqual({a: {b: {c: 100}, c: 2}})
  });

  it("set without value", function() {
    const mock = {a: {b: 1,c : 2}};
    expect(set(mock, "a.b.c")).toEqual(mock)
  });

  it("pickByKeys should work", function() {
    const all = [{a: 1}, {a: 2}, {a: 3, b: 4}];
    const keys = ["1","2"]
    expect(pickByKeys(all, 'a', keys)).toEqual([{a: 1}, {a: 2}])
  });
})