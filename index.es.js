class t{constructor(){this.keys=new Set,this.queue=[]}sort(){this.queue.sort((t,e)=>t.priority-e.priority)}set(t,e){const r=Number(e);if(isNaN(r))throw new TypeError('"priority" must be a number');return this.keys.has(t)?this.queue.map(e=>(e.key===t&&Object.assign(e,{priority:r}),e)):(this.keys.add(t),this.queue.push({key:t,priority:r})),this.sort(),this.queue.length}next(){const t=this.queue.shift();return this.keys.delete(t.key),t}isEmpty(){return Boolean(0===this.queue.length)}has(t){return this.keys.has(t)}get(t){return this.queue.find(e=>e.key===t)}}export default class{constructor(t){if(this.graph=new Map,t)for(var e in t)for(var r in t[e])this.connect(e,r,t[e][r])}connect(t,e,r){if(!1===this.graph.has(t)){let s=new Map;s.set(e,r),this.graph.set(t,s)}else this.graph.get(t).set(e,r);return this}removeNode(t){return this.graph=function t(e,r){const s=new Map;for(const[i,n]of e)i!==r&&n instanceof Map?s.set(i,t(n,r)):i!==r&&s.set(i,n);return s}(this.graph,t),this}path(e,r,s={}){if(!this.graph.size)return s.cost?{path:[],cost:0}:[];const i=new Set,n=new t,h=new Map;let o=[],a=0,u=s.avoid?new Set(s.avoid):new Set;if(u.has(e))throw new Error(`Starting node (${e}) cannot be avoided`);if(u.has(r))throw new Error(`Ending node (${r}) cannot be avoided`);for(n.set(e,0);!n.isEmpty();){const t=n.next();if(t.key===r){a=t.priority;let e=t.key;for(;h.has(e);)o.push(e),e=h.get(e);break}i.add(t.key);(this.graph.get(t.key)||new Map).forEach((e,r)=>{if(i.has(r)||u.has(r))return null;if(!n.has(r))return h.set(r,t.key),n.set(r,t.priority+e);const s=n.get(r).priority,o=t.priority+e;return o<s?(h.set(r,t.key),n.set(r,o)):null})}return o.length?(s.trim?o.shift():o=o.concat([e]),s.reverse||(o=o.reverse()),s.cost?{path:o,cost:a}:o):s.cost?{path:[],cost:0}:[]}closest(t){if(!1===this.graph.has(t))return null;let e=1/0,r=null;return this.graph.get(t).forEach((t,s)=>{t<e&&(r=s,e=t)}),r}connections(t){return this.graph.has(t)?Array.from(this.graph.get(t).keys()):[]}}
//# sourceMappingURL=index.es.js.map