import { PriorityQueue } from "./PriorityQueue";
import { removeDeepFromMap } from "./removeDeepFromMap";

class Graph {
  constructor(seed) {
    this.graph = new Map();

    if (seed) {
      for (var a in seed) {
        for (var b in seed[a]) {
          this.connect(a, b, seed[a][b]);
        }
      }
    }
  }

  /**
   * Add a single connection to the graph.
   *
   * @param {any} nodeA - Name of start node
   * @param {any} nodeB - Name of end node
   * @param {number} cost - Weight value for connection
   * @returns{this}
   */
  connect(nodeA, nodeB, cost) {
    if (this.graph.has(nodeA) === false) {
      let connections = new Map();

      connections.set(nodeB, cost);

      this.graph.set(nodeA, connections);
    } else {
      this.graph.get(nodeA).set(nodeB, cost);
    }

    return this;
  }

  /**
   * Removes a node and all of its references from the graph
   *
   * @param {any} node - Node to remove from the graph
   * @return {this}
   * @example
   *
   * const route = new Graph({
   *   A: { B: 1, C: 5 },
   *   B: { A: 3 },
   *   C: { B: 2, A: 2 },
   * });
   *
   * route.removeNode('C');
   * // The graph now is:
   * // { A: { B: 1 }, B: { A: 3 } }
   */
  removeNode(key) {
    this.graph = removeDeepFromMap(this.graph, key);

    return this;
  }

  /**
   * Compute the shortest path between the specified nodes
   *
   * @param {string}  start     - Starting node
   * @param {string}  goal      - Node we want to reach
   * @param {object}  [options] - Options
   *
   * @param {boolean} [options.trim]    - Exclude the origin and destination nodes from the result
   * @param {boolean} [options.reverse] - Return the path in reversed order
   * @param {boolean} [options.cost]    - Also return the cost of the path when set to true
   *
   * @return {array|object} Computed path between the nodes.
   *
   *  When `option.cost` is set to true, the returned value will be an object with shape:
   *    - `path` *(Array)*: Computed path between the nodes
   *    - `cost` *(Number)*: Cost of the path
   *
   * @example
   *
   * const route = new Graph()
   *
   * route.addNode('A', { B: 1 })
   * route.addNode('B', { A: 1, C: 2, D: 4 })
   * route.addNode('C', { B: 2, D: 1 })
   * route.addNode('D', { C: 1, B: 4 })
   *
   * route.path('A', 'D') // => ['A', 'B', 'C', 'D']
   *
   * // trimmed
   * route.path('A', 'D', { trim: true }) // => [B', 'C']
   *
   * // reversed
   * route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']
   *
   * // include the cost
   * route.path('A', 'D', { cost: true })
   * // => {
   * //       path: [ 'A', 'B', 'C', 'D' ],
   * //       cost: 4
   * //    }
   */
  path(start, goal, options = {}) {
    // Don't run when we don't have nodes set
    if (!this.graph.size) {
      if (options.cost) {
        return { path: [], cost: 0 };
      }

      return [];
    }

    const explored = new Set();
    const frontier = new PriorityQueue();
    const previous = new Map();

    let path = [];
    let totalCost = 0;

    let avoid = options.avoid ? new Set(options.avoid) : new Set();

    if (avoid.has(start)) {
      throw new Error(`Starting node (${start}) cannot be avoided`);
    } else if (avoid.has(goal)) {
      throw new Error(`Ending node (${goal}) cannot be avoided`);
    }

    // Add the starting point to the frontier, it will be the first node visited
    frontier.set(start, 0);

    // Run until we have visited every node in the frontier
    while (!frontier.isEmpty()) {
      // Get the node in the frontier with the lowest cost (`priority`)
      const node = frontier.next();

      // When the node with the lowest cost in the frontier in our goal node,
      // we can compute the path and exit the loop
      if (node.key === goal) {
        // Set the total cost to the current value
        totalCost = node.priority;

        let nodeKey = node.key;
        while (previous.has(nodeKey)) {
          path.push(nodeKey);
          nodeKey = previous.get(nodeKey);
        }

        break;
      }

      // Add the current node to the explored set
      explored.add(node.key);

      // Loop all the neighboring nodes
      const neighbors = this.graph.get(node.key) || new Map();
      neighbors.forEach((nCost, nNode) => {
        // If we already explored the node, or the node is to be avoided, skip it
        if (explored.has(nNode) || avoid.has(nNode)) return null;

        // If the neighboring node is not yet in the frontier, we add it with
        // the correct cost
        if (!frontier.has(nNode)) {
          previous.set(nNode, node.key);
          return frontier.set(nNode, node.priority + nCost);
        }

        const frontierPriority = frontier.get(nNode).priority;
        const nodeCost = node.priority + nCost;

        // Otherwise we only update the cost of this node in the frontier when
        // it's below what's currently set
        if (nodeCost < frontierPriority) {
          previous.set(nNode, node.key);
          return frontier.set(nNode, nodeCost);
        }

        return null;
      });
    }

    // Return null when no path can be found
    if (!path.length) {
      if (options.cost) {
        return { path: [], cost: 0 };
      }

      return [];
    }

    // From now on, keep in mind that `path` is populated in reverse order,
    // from destination to origin

    // Remove the first value (the goal node) if we want a trimmed result
    if (options.trim) {
      path.shift();
    } else {
      // Add the origin waypoint at the end of the array
      path = path.concat([start]);
    }

    // Reverse the path if we don't want it reversed, so the result will be
    // from `start` to `goal`
    if (!options.reverse) {
      path = path.reverse();
    }

    // Return an object if we also want the cost
    if (options.cost) {
      return {
        path,
        cost: totalCost,
      };
    }

    return path;
  }

  /**
   * Find the closest node connecting to a given node
   * @param {any} origin - Starting node
   * @return {node}
   */
  closest(origin) {
    if (this.graph.has(origin) === false) {
      return null;
    }

    let cheapest = Infinity;
    let closest = null;

    this.graph.get(origin).forEach((cost, node) => {
      if (cost < cheapest) {
        closest = node;
        cheapest = cost;
      }
    });

    return closest;
  }

  /**
   * Get a list of all nodes connected to a given node
   *
   * @param {any} origin - Starting node
   * @return {Array[node]}
   */
  connections(origin) {
    if (this.graph.has(origin)) {
      return Array.from(this.graph.get(origin).keys());
    }

    return [];
  }
}

export default Graph;
