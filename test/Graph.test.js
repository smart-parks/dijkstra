import Graph from "../libs/Graph";

describe("Graph", () => {
  describe("#path()", () => {
    const vertices = {
      a: { b: 20, c: 80 },
      b: { a: 20, c: 20 },
      c: { a: 80, b: 20 },
    };

    it("returns the shortest path", () => {
      const route = new Graph(vertices);

      const path = route.path("a", "c");

      expect(path).toEqual(["a", "b", "c"]);
    });

    it("returns an object containing the cost", () => {
      const route = new Graph(vertices);

      const res = route.path("a", "c", { cost: true });

      expect(res).toEqual({ path: ["a", "b", "c"], cost: 40 });
    });

    it("returns the inverted path", () => {
      const route = new Graph(vertices);

      const path = route.path("a", "c", { reverse: true });

      expect(path).toEqual(["c", "b", "a"]);
    });

    it("returns an object containing the cost and inverted path", () => {
      const route = new Graph(vertices);

      const res = route.path("a", "c", { cost: true, reverse: true });

      expect(res).toEqual({ path: ["c", "b", "a"], cost: 40 });
    });

    it("returns the trimmed path", () => {
      const route = new Graph(vertices);

      const path = route.path("a", "c", { trim: true });

      expect(path).toEqual(["b"]);
    });

    it("returns an object containing the cost and trimmed path", () => {
      const route = new Graph(vertices);

      const res = route.path("a", "c", { cost: true, trim: true });

      expect(res).toEqual({ path: ["b"], cost: 40 });
    });

    it("returns the reverse and trimmed path", () => {
      const route = new Graph(vertices);
      const path = route.path("a", "c", { trim: true });

      expect(path).toEqual(["b"]);
    });

    it("returns an object containing the cost and inverted and trimmed path", () => {
      const route = new Graph(vertices);

      const res = route.path("a", "c", {
        cost: true,
        reverse: true,
        trim: true,
      });

      expect(res).toEqual({ path: ["b"], cost: 40 });
    });

    it("returns empty when no path is found", () => {
      const route = new Graph(vertices);

      const path = route.path("a", "d");

      expect(path).toEqual([]);
    });

    it("returns empty as path and 0 as cost when no path exists and we want the cost", () => {
      const route = new Graph(vertices);

      const res = route.path("a", "d", { cost: true });

      expect(res).toEqual({ path: [], cost: 0 });
    });

    it("returns empty when no vertices are defined", () => {
      const route = new Graph();

      const path = route.path("a", "d");

      expect(path).toEqual([]);
    });

    it("returns empty as path and 0 as cost when no vertices are defined and we want the cost", () => {
      const route = new Graph();

      const res = route.path("a", "d", { cost: true });

      expect(res.path).toEqual([]);
      expect(res.cost).toEqual(0);
    });

    it("returns the same path if a node which is not part of the shortest path is avoided", () => {
      const route = new Graph({
        a: { b: 1 },
        b: { a: 1, c: 1 },
        c: { b: 1, d: 1 },
        d: { c: 1 },
      });

      const path = route.path("a", "c", { cost: true });
      const path2 = route.path("a", "c", { avoid: ["d"], cost: true });

      expect(path).toEqual(path2);
    });

    it("returns a different path if a node which is part of the shortest path is avoided", () => {
      const route = new Graph({
        a: { b: 1, c: 50 },
        b: { a: 1, c: 1 },
        c: { a: 50, b: 1, d: 1 },
        d: { c: 1 },
      });

      const res = route.path("a", "d", { cost: true });
      const res2 = route.path("a", "d", { avoid: ["b"], cost: true });

      expect(res.path).not.toEqual(res2.path);
      expect(res.cost).toBeLessThan(res2.cost);
    });

    it("throws an error if the start node is avoided", () => {
      const route = new Graph(vertices);

      expect(() => route.path("a", "c", { avoid: ["a"] })).toThrow(Error);
    });

    it("throws an error if the end node is avoided", () => {
      const route = new Graph(vertices);

      expect(() => route.path("a", "c", { avoid: ["c"] })).toThrow(Error);
    });

    it("returns the same path and cost if a node which is not part of the graph is avoided", () => {
      const route = new Graph(vertices);

      const res = route.path("a", "c", { cost: true });
      const res2 = route.path("a", "c", { avoid: ["z"], cost: true });

      expect(res.path).toEqual(res2.path);
      expect(res).toEqual(res2);
    });

    it("works with a more complicated graph", () => {
      const route = new Graph({
        a: { b: 7, c: 9, f: 14 },
        b: { c: 10, d: 15 },
        c: { d: 11, f: 2 },
        d: { e: 6 },
        e: { f: 9 },
      });

      const path = route.path("a", "e");

      expect(path).toEqual(["a", "c", "d", "e"]);
    });
  });

  describe("#closest()", () => {
    test("finds the closest node", () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 },
      });

      expect(route.closest("a")).toBe("b");
      expect(route.closest("c")).toBe("b");

      // Returns earlest match on same
      expect(route.closest("b")).toBe("a");
    });

    test("returns null for no connection", () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: {},
        c: { a: 80 },
      });

      expect(route.closest("b")).toBe(null);
      expect(route.closest("z")).toBe(null);
    });
  });

  describe("#removeNode()", () => {
    it("removes a previously set node from the graph", () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 },
      });

      route.removeNode("c");

      expect(route.graph.has("c")).toBe(false);
      expect(route.graph.has("a")).toBe(true);
      expect(route.graph.has("b")).toBe(true);
    });

    it("removes all references to the removed node", () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 },
      });

      route.removeNode("c");

      expect(route.graph.has("c")).toBe(false);
      expect(route.graph.get("b").has("c")).toBe(false);
      expect(route.graph.get("a").has("c")).toBe(false);
    });
  });
});
