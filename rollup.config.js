// rollup.config.js
import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default {
  input: "libs/Graph.js",
  output: [
    { file: "index.umd.js", format: "umd", name: "Graph" }
  ],
  plugins: [
    compiler({
      env: "BROWSER",
      compilation_level: "SIMPLE"
    })
  ],
};
