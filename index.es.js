class t{constructor(){this.keys=new Set,this.queue=[]}sort(){this.queue.sort((t,e)=>t.priority-e.priority)}set(t,e){const r=Number(e);if(isNaN(r))throw new TypeError('"priority" must be a number');return this.keys.has(t)?this.queue.map(e=>(e.key===t&&Object.assign(e,{priority:r}),e)):(this.keys.add(t),this.queue.push({key:t,priority:r})),this.sort(),this.queue.length}next(){const t=this.queue.shift();return this.keys.delete(t.key),t}isEmpty(){return Boolean(0===this.queue.length)}has(t){return this.keys.has(t)}get(t){return this.queue.find(e=>e.key===t)}}const e={path:[],cost:0};export default class{constructor(t){if(this.graph=new Map,t)for(var e in t)for(var r in t[e])this.connect(e,r,t[e][r])}connect(t,e,r){if(!1===this.graph.has(t)){let s=new Map;s.set(e,r),this.graph.set(t,s)}else this.graph.get(t).set(e,r);return this}removeNode(t){return this.graph=function t(e,r){const s=new Map;for(const[i,n]of e)i!==r&&n instanceof Map?s.set(i,t(n,r)):i!==r&&s.set(i,n);return s}(this.graph,t),this}path(r,s,i={}){if(!this.graph.size)return i.cost?e:[];const n=new Set,o=new t,h=new Map;let a=[],u=0,c=[];if(i.avoid&&(c=[].concat(i.avoid)),c.includes(r))throw new Error(`Starting node (${r}) cannot be avoided`);if(c.includes(s))throw new Error(`Ending node (${s}) cannot be avoided`);for(o.set(r,0);!o.isEmpty();){const t=o.next();if(t.key===s){u=t.priority;let e=t.key;for(;h.has(e);)a.push(e),e=h.get(e);break}n.add(t.key);(this.graph.get(t.key)||new Map).forEach((e,r)=>{if(n.has(r)||c.includes(r))return null;if(!o.has(r))return h.set(r,t.key),o.set(r,t.priority+e);const s=o.get(r).priority,i=t.priority+e;return i<s?(h.set(r,t.key),o.set(r,i)):null})}return a.length?(i.trim?a.shift():a=a.concat([r]),i.reverse||(a=a.reverse()),i.cost?{path:a,cost:u}:a):i.cost?e:e.path}closest(t){if(!1===this.graph.has(t))return null;let e=1/0,r=null;return this.graph.get(t).forEach((t,s)=>{t<e&&(r=s,e=t)}),r}}
//# sourceMappingURL=index.es.js.map
