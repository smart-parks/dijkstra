!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Graph=t()}(this,(function(){"use strict";class e{constructor(){this.keys=new Set,this.queue=[]}sort(){this.queue.sort((e,t)=>e.priority-t.priority)}set(e,t){const r=Number(t);if(isNaN(r))throw new TypeError('"priority" must be a number');return this.keys.has(e)?this.queue.map(t=>(t.key===e&&Object.assign(t,{priority:r}),t)):(this.keys.add(e),this.queue.push({key:e,priority:r})),this.sort(),this.queue.length}next(){const e=this.queue.shift();return this.keys.delete(e.key),e}isEmpty(){return Boolean(0===this.queue.length)}has(e){return this.keys.has(e)}get(e){return this.queue.find(t=>t.key===e)}}return class{constructor(e){if(this.graph=new Map,e)for(var t in e)for(var r in e[t])this.connect(t,r,e[t][r])}connect(e,t,r){if(!1===this.graph.has(e)){let s=new Map;s.set(t,r),this.graph.set(e,s)}else this.graph.get(e).set(t,r);return this}removeNode(e){return this.graph=function e(t,r){const s=new Map;for(const[i,n]of t)i!==r&&n instanceof Map?s.set(i,e(n,r)):i!==r&&s.set(i,n);return s}(this.graph,e),this}path(t,r,s={}){if(!this.graph.size)return s.cost?{path:[],cost:0}:[];const i=new Set,n=new e,o=new Map;let h=[],a=0,u=s.avoid?new Set(s.avoid):new Set;if(u.has(t))throw new Error(`Starting node (${t}) cannot be avoided`);if(u.has(r))throw new Error(`Ending node (${r}) cannot be avoided`);for(n.set(t,0);!n.isEmpty();){const e=n.next();if(e.key===r){a=e.priority;let t=e.key;for(;o.has(t);)h.push(t),t=o.get(t);break}i.add(e.key);(this.graph.get(e.key)||new Map).forEach((t,r)=>{if(i.has(r)||u.has(r))return null;if(!n.has(r))return o.set(r,e.key),n.set(r,e.priority+t);const s=n.get(r).priority,h=e.priority+t;return h<s?(o.set(r,e.key),n.set(r,h)):null})}return h.length?(s.trim?h.shift():h=h.concat([t]),s.reverse||(h=h.reverse()),s.cost?{path:h,cost:a}:h):s.cost?{path:[],cost:0}:[]}closest(e){if(!1===this.graph.has(e))return null;let t=1/0,r=null;return this.graph.get(e).forEach((e,s)=>{e<t&&(r=s,t=e)}),r}connections(e){return this.graph.has(e)?Array.from(this.graph.get(e).keys()):[]}}}));
//# sourceMappingURL=index.js.map