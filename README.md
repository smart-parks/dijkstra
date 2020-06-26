# dijkstra

A minor re-write of [albertorestifo/node-dijkstra](https://github.com/albertorestifo/node-dijkstra) with a more limited API.

## Installation

```shell
yarn add smart-parks/dijkstra
```

## Usage

Basic example:

```js
const Graph = require('dijkstra')

const route = new Graph()

route.connect('A', 'B', 1)
route.connect('B', 'A', 1)
route.connect('B', 'C', 2)
route.connect('B', 'D', 4)
route.connect('C', 'B', 2)
route.connect('C', 'D', 1)
route.connect('D', 'C', 1)
route.connect('D', 'B', 4)

route.path('A', 'D') // => [ 'A', 'B', 'C', 'D' ]
```

## API

### `Graph([nodes])`

#### Parameters

- `Object` _optional_: Initial nodes graph.

A nodes graph must follow this structure:

```
{
  node: {
    neighbor: cost Number
  }
}
```

```js
{
  'A': {
    'B': 1
  },
  'B': {
    'A': 1,
    'C': 2,
    'D': 4
  }
}
```

#### Example

```js
const route = new Graph()

// or with pre-populated graph
const route = new Graph({
  'A': { 'B': 1 },
  'B': { 'A': 1, 'C': 2, 'D': 4 }
})
```

### `Graph#connect(from, to, cost)`

Adds a connection to the graph.

```
const a = { name: 'Billy' } // any value
const b = { name: 'Sam' } // any value

const route = new Graph()

route.connect(a, b, 100)
```

### `Graph#removeNode(node)`

Removes a node and all its references from the graph

#### Parameters

- `node`: name of the node to remove

### `Graph#path(start, goal [, options])`

#### Parameters

- `start`: starting node
- `goal`: goal node
- `Object options` _optional_: Addittional options:
  - `Boolean trim`, default `false`: If set to true, the result won't include the start and goal nodes
  - `Boolean reverse`, default `false`: If set to true, the result will be in reverse order, from goal to start
  - `Boolean cost`, default `false`: If set to true, an object will be returned with the following keys:
    - `Array path`: Computed path (subject to other options)
    - `Number cost`: Total cost for the found path
  - `Array avoid`, default `[]`: Nodes to be avoided

#### Returns

If `options.cost` is `false` (default behaviour) an `Array` will be returned, containing the name of the crossed nodes. By default it will be ordered from start to goal, and those nodes will also be included. This behaviour can be changes with `options.trim` and `options.reverse` (see above)

If `options.cost` is `true`, an `Object` with keys `path` and `cost` will be returned. `path` follows the same rules as above and `cost` is the total cost of the found route between nodes.

When to route can be found, the path will be set to `null`.
