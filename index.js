"use strict";
class PriorityQueue {
  constructor() {
    this.keys = new Set();
    this.queue = [];
  }
  sort() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
  set(a, b) {
    let c = Number(b);
    if (isNaN(c)) throw new TypeError('"priority" must be a number');
    this.keys.has(a)
      ? this.queue.map((b) => {
          b.key === a && Object.assign(b, { priority: c });
          return b;
        })
      : (this.keys.add(a), this.queue.push({ key: a, priority: c }));
    this.sort();
    return this.queue.length;
  }
  next() {
    let a = this.queue.shift();
    this.keys.delete(a.key);
    return a;
  }
  isEmpty() {
    return 0 === this.queue.length;
  }
  has(a) {
    return this.keys.has(a);
  }
  get(a) {
    return this.queue.find((b) => b.key === a);
  }
}
function removeDeepFromMap(a, b) {
  let c = new Map();
  for (let [d, e] of a)
    d !== b && e instanceof Map
      ? c.set(d, removeDeepFromMap(e, b))
      : d !== b && c.set(d, e);
  return c;
}
function isValidNode(a) {
  a = Number(a);
  return isNaN(a) || 0 >= a ? !1 : !0;
}
function toDeepMap(a) {
  let b = new Map();
  Object.keys(a).forEach((c) => {
    let d = a[c];
    if (null !== d && "object" === typeof d && !Array.isArray(d))
      return b.set(c, toDeepMap(d));
    if (!isValidNode(d))
      throw Error(
        `Could not add node at key "${c}", make sure it's a valid node`,
        d
      );
    return b.set(c, Number(d));
  });
  return b;
}
function validateDeep(a) {
  if (!(a instanceof Map))
    throw Error(`Invalid graph: Expected Map instead found ${typeof a}`);
  a.forEach((a, c) => {
    if ("object" === typeof a && a instanceof Map) validateDeep(a);
    else if ("number" !== typeof a || 0 >= a)
      throw Error(
        `Values must be numbers greater than 0. Found value ${a} at ${c}`
      );
  });
}
class Graph {
  constructor(a) {
    a instanceof Map
      ? (validateDeep(a), (this.graph = a))
      : (this.graph = a ? toDeepMap(a) : new Map());
  }
  addNode(a, b) {
    b instanceof Map ? validateDeep(b) : (b = toDeepMap(b));
    this.graph.set(a, b);
    return this;
  }
  addVertex(a, b) {
    return this.addNode(a, b);
  }
  removeNode(a) {
    this.graph = removeDeepFromMap(this.graph, a);
    return this;
  }
  path(a, b, c = {}) {
    if (!this.graph.size) return c.cost ? { path: null, cost: 0 } : null;
    let d = new Set(),
      e = new PriorityQueue(),
      g = new Map(),
      f = [],
      k = 0,
      h = [];
    c.avoid && (h = [].concat(c.avoid));
    if (h.includes(a)) throw Error(`Starting node (${a}) cannot be avoided`);
    if (h.includes(b)) throw Error(`Ending node (${b}) cannot be avoided`);
    for (e.set(a, 0); !e.isEmpty(); ) {
      let a = e.next();
      if (a.key === b) {
        k = a.priority;
        for (b = a.key; g.has(b); ) f.push(b), (b = g.get(b));
        break;
      }
      d.add(a.key);
      (this.graph.get(a.key) || new Map()).forEach((b, c) => {
        if (d.has(c) || h.includes(c)) return null;
        if (!e.has(c)) return g.set(c, a.key), e.set(c, a.priority + b);
        let f = e.get(c).priority;
        b = a.priority + b;
        return b < f ? (g.set(c, a.key), e.set(c, b)) : null;
      });
    }
    if (!f.length) return c.cost ? { path: null, cost: 0 } : null;
    c.trim ? f.shift() : (f = f.concat([a]));
    c.reverse || (f = f.reverse());
    return c.cost ? { path: f, cost: k } : f;
  }
  shortestPath(...a) {
    return this.path(...a);
  }
}
module.exports = Graph;
