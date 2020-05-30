import { terser } from "rollup-plugin-terser";

export default {
  input: "libs/Graph.js",
  output: [
    { file: "index.js", format: "umd", name: "Graph", sourcemap: true },
    { file: "index.es.js", format: "es", sourcemap: true },
  ],
  plugins: [
    terser()
  ],
};
