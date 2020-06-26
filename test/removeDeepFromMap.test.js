import { removeDeepFromMap } from "../libs/removeDeepFromMap";

describe("removeDeepFromMap", () => {
  it("returns a map without the passed key", () => {
    const map = new Map();
    map.set("a", true);
    map.set("b", true);

    const newMap = removeDeepFromMap(map, "b");

    expect(newMap.has("b")).toBe(false);
    expect(newMap.has("a")).toBe(true);
  });

  it("removes a deep reference to the key", () => {
    const map = new Map();
    const barMap = new Map();

    barMap.set("bar", true);
    barMap.set("foo", true);

    map.set("foo", barMap);
    map.set("bar", true);

    const newMap = removeDeepFromMap(map, "bar");

    expect(newMap.has("foo")).toBe(true);
    expect(newMap.get("foo").has("foo")).toBe(true);
    expect(newMap.get("foo").has("bar")).toBe(false);
    expect(newMap.has("bar")).toBe(false);
  });

  it("produes no side-effects", () => {
    const map = new Map();
    map.set("a", true);
    map.set("b", true);

    const newMap = removeDeepFromMap(map, "b");

    expect(newMap.has("b")).toBe(false);
    expect(map.has("b")).toBe(true);
  });
});
