var H=globalThis,N=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),it=new WeakMap,w=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(N&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=it.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&it.set(e,t))}return t}toString(){return this.cssText}},st=r=>new w(typeof r=="string"?r:r+"",void 0,j),O=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new w(e,r,j)},rt=(r,t)=>{if(N)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=H.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},B=N?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return st(e)})(r):r;var{is:At,defineProperty:Et,getOwnPropertyDescriptor:xt,getOwnPropertyNames:wt,getOwnPropertySymbols:St,getPrototypeOf:Ct}=Object,I=globalThis,nt=I.trustedTypes,Tt=nt?nt.emptyScript:"",kt=I.reactiveElementPolyfillSupport,S=(r,t)=>r,W={toAttribute(r,t){switch(t){case Boolean:r=r?Tt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},at=(r,t)=>!At(r,t),ot={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ot){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Et(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=xt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let d=s?.call(this);n?.call(this,o),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ot}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let t=Ct(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let e=this.properties,i=[...wt(e),...St(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(B(s))}else t!==void 0&&e.push(B(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:W).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:W;this._$Em=s;let d=o.fromAttribute(e,n.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??at)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,n,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[S("elementProperties")]=new Map,m[S("finalized")]=new Map,kt?.({ReactiveElement:m}),(I.reactiveElementVersions??=[]).push("2.1.2");var J=globalThis,dt=r=>r,D=J.trustedTypes,ct=D?D.createPolicy("lit-html",{createHTML:r=>r}):void 0,mt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+v,Pt=`<${gt}>`,b=document,T=()=>b.createComment(""),k=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,Ut=r=>G(r)||typeof r?.[Symbol.iterator]=="function",Z=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lt=/-->/g,ht=/>/g,$=RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pt=/'/g,ut=/"/g,ft=/^(?:script|style|textarea|title)$/i,Q=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=Q(1),jt=Q(2),Bt=Q(3),A=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),_t=new WeakMap,y=b.createTreeWalker(b,129);function vt(r,t){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(t):t}var Mt=(r,t)=>{let e=r.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=C;for(let d=0;d<e;d++){let a=r[d],h,p,c=-1,_=0;for(;_<a.length&&(o.lastIndex=_,p=o.exec(a),p!==null);)_=o.lastIndex,o===C?p[1]==="!--"?o=lt:p[1]!==void 0?o=ht:p[2]!==void 0?(ft.test(p[2])&&(s=RegExp("</"+p[2],"g")),o=$):p[3]!==void 0&&(o=$):o===$?p[0]===">"?(o=s??C,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?$:p[3]==='"'?ut:pt):o===ut||o===pt?o=$:o===lt||o===ht?o=C:(o=$,s=void 0);let f=o===$&&r[d+1].startsWith("/>")?" ":"";n+=o===C?a+Pt:c>=0?(i.push(h),a.slice(0,c)+mt+a.slice(c)+v+f):a+v+(c===-2?d:f)}return[vt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},P=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0,d=t.length-1,a=this.parts,[h,p]=Mt(t,e);if(this.el=r.createElement(h,i),y.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=y.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(mt)){let _=p[o++],f=s.getAttribute(c).split(v),R=/([.?@])?(.*)/.exec(_);a.push({type:1,index:n,name:R[2],strings:f,ctor:R[1]==="."?q:R[1]==="?"?F:R[1]==="@"?K:x}),s.removeAttribute(c)}else c.startsWith(v)&&(a.push({type:6,index:n}),s.removeAttribute(c));if(ft.test(s.tagName)){let c=s.textContent.split(v),_=c.length-1;if(_>0){s.textContent=D?D.emptyScript:"";for(let f=0;f<_;f++)s.append(c[f],T()),y.nextNode(),a.push({type:2,index:++n});s.append(c[_],T())}}}else if(s.nodeType===8)if(s.data===gt)a.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf(v,c+1))!==-1;)a.push({type:7,index:n}),c+=v.length-1}n++}}static createElement(t,e){let i=b.createElement("template");return i.innerHTML=t,i}};function E(r,t,e=r,i){if(t===A)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=k(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=E(r,s._$AS(r,t.values),s,i)),t}var V=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??b).importNode(e,!0);y.currentNode=s;let n=y.nextNode(),o=0,d=0,a=i[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new U(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new Y(n,this,t)),this._$AV.push(h),a=i[++d]}o!==a?.index&&(n=y.nextNode(),o++)}return y.currentNode=b,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},U=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),k(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ut(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(vt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new V(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=_t.get(t.strings);return e===void 0&&_t.set(t.strings,e=new P(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new r(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=dt(t).nextSibling;dt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},x=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(t,e=this,i,s){let n=this.strings,o=!1;if(n===void 0)t=E(this,t,e,0),o=!k(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let d=t,a,h;for(t=n[0],a=0;a<n.length-1;a++)h=E(this,d[i+a],e,a),h===A&&(h=this._$AH[a]),o||=!k(h)||h!==this._$AH[a],h===l?t=l:t!==l&&(t+=(h??"")+n[a+1]),this._$AH[a]=h}o&&!s&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},q=class extends x{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},F=class extends x{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},K=class extends x{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??l)===A)return;let i=this._$AH,s=t===l&&i!==l||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==l&&(i===l||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Y=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Lt=J.litHtmlPolyfillSupport;Lt?.(P,U),(J.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new U(t.insertBefore(T(),n),n,void 0,e??{})}return s._$AI(r),s};var X=globalThis,g=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};g._$litElement$=!0,g.finalized=!0,X.litElementHydrateSupport?.({LitElement:g});var Rt=X.litElementPolyfillSupport;Rt?.({LitElement:g});(X.litElementVersions??=[]).push("4.2.2");var Ht="calendar.btoddb_reminders",tt="sensor.btoddb_location_reminders",yt="btoddb_ha_reminders_location",z=r=>String(r).padStart(2,"0");function bt(r){return`${r.getFullYear()}-${z(r.getMonth()+1)}-${z(r.getDate())}T${z(r.getHours())}:${z(r.getMinutes())}`}function et(){let r=new Date;return r.setHours(r.getHours()+1,0,0,0),bt(r)}var M=class extends g{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e}_titleChanged(e){let i=e.target.value;this._fireConfigChanged({...this._config,title:i})}_entityChanged(e){let i=e.detail.value;this._fireConfigChanged({...this._config,entity:i})}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?u``:u`
      <div class="card-config">
        <input
          class="title-field"
          type="text"
          placeholder="Title (optional)"
          .value=${this._config.title??""}
          @change=${this._titleChanged}
        />
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity??""}
          .label=${"Calendar entity"}
          .includeDomains=${["calendar"]}
          @value-changed=${this._entityChanged}
        ></ha-entity-picker>
      </div>
    `}};M.properties={hass:{attribute:!1},_config:{state:!0}},M.styles=O`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .title-field,
    ha-entity-picker {
      width: 100%;
    }
    .title-field {
      height: 40px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
  `;customElements.define("btoddb-reminders-card-editor",M);var L=class extends g{constructor(){super(...arguments);this._config={type:""};this._items=[];this._mode="time";this._message="";this._when=et();this._locMessage="";this._locPerson="";this._locZone="";this._locTrigger="enter";this._busy=!1;this._error="";this._editingUid="";this._entity=Ht;this._lastSignature=""}static getConfigElement(){return document.createElement("btoddb-reminders-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config=e??{type:""},this._entity=e?.entity??""}getCardSize(){let e=this._locationItems().length;return 3+Math.min(this._items.length+e,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(e){if(!e.has("hass")||!this.hass)return;let i=this.hass.states[this._entity],s=i?`${i.state}|${i.last_updated}`:"missing";s!==this._lastSignature&&(this._lastSignature=s,this._fetch())}async _fetch(){if(!this.hass)return;if(!this._entity){this._error="No calendar entity configured. Edit the card to select one.",this._items=[];return}if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let e=new Date;e.setHours(0,0,0,0);let i=new Date;i.setFullYear(i.getFullYear()+1);try{let s=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(i.toISOString())}`),n=Date.now()-6e4;this._items=(s??[]).map(o=>({kind:"time",uid:o.uid??"",summary:o.summary,start:new Date(o.start.dateTime??o.start.date??"")})).filter(o=>o.start.getTime()>=n).sort((o,d)=>o.start.getTime()-d.start.getTime()),this._error=""}catch(s){this._error=`Could not load reminders: ${this._msg(s)}`}}async _add(){let e=this._message.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}let i=this._editingUid;this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update",{uid:i,message:e,when:this._when},void 0,void 0,!0),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create",{message:e,when:this._when},void 0,void 0,!0),this._message="",this._when=et(),await this._fetch()}catch(s){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(s)}`}finally{this._busy=!1}}async _delete(e){if(e)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:e}),this._items=this._items.filter(i=>i.uid!==e)}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}async _addLocation(){let e=this._locMessage.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._locPerson){this._error="Pick a person to track.";return}if(!this._locZone){this._error="Pick a zone.";return}let i=this._editingUid;this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update_location",{uid:i,message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger}),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create_location",{message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger}),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter"}catch(s){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(s)}`}finally{this._busy=!1}}_startEditTime(e){this._editingUid=e.uid,this._mode="time",this._message=e.summary,this._when=bt(e.start),this._error=""}_startEditLocation(e){this._editingUid=e.uid,this._mode="location",this._locMessage=e.summary,this._locPerson=e.person,this._locZone=e.zone,this._locTrigger=e.trigger,this._error=""}_cancelEdit(){this._editingUid="",this._message="",this._when=et(),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._error=""}async _deleteLocation(e){if(e)try{await this.hass.callService("btoddb_ha_reminders","delete_location",{uid:e})}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}_locationSensorId(){let e=this.hass?.states??{};if(e[tt]?.attributes?.[yt])return tt;for(let[i,s]of Object.entries(e))if(i.startsWith("sensor.")&&s.attributes?.[yt])return i;return tt}_locationItems(){return(this.hass?.states[this._locationSensorId()]?.attributes?.reminders??[]).map(s=>({kind:"location",uid:s.uid,summary:s.summary,person:s.person,zone:s.zone,trigger:s.trigger,deliveredAt:s.delivered_at?new Date(s.delivered_at):null}))}_entityName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTime(e){try{return e.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_renderTimeAddRow(){let e=!!this._editingUid;return u`
      <div class="add-row">
        <input
          class="message"
          type="text"
          placeholder="New reminder"
          .value=${this._message}
          @input=${i=>{this._message=i.target.value}}
          @keydown=${i=>{i.key==="Enter"&&this._add()}}
        />
        <input
          class="when"
          type="datetime-local"
          .value=${this._when}
          @input=${i=>{this._when=i.target.value}}
        />
        ${e?u`<button type="button" class="btn btn-secondary" ?disabled=${this._busy} @click=${()=>this._cancelEdit()}>Cancel</button>`:l}
        <button type="button" class="btn btn-primary" ?disabled=${this._busy} @click=${()=>this._add()}>
          ${e?"Save":"Add"}
        </button>
      </div>
    `}_renderLocationAddRow(){let e=!!this._editingUid;return u`
      <div class="add-row">
        <input
          class="message"
          type="text"
          placeholder="New reminder"
          .value=${this._locMessage}
          @input=${i=>{this._locMessage=i.target.value}}
        />
        <ha-entity-picker
          class="picker"
          .hass=${this.hass}
          .value=${this._locPerson}
          .label=${"Person"}
          .includeDomains=${["person"]}
          @value-changed=${i=>{this._locPerson=i.detail.value}}
        ></ha-entity-picker>
        <ha-entity-picker
          class="picker"
          .hass=${this.hass}
          .value=${this._locZone}
          .label=${"Zone"}
          .includeDomains=${["zone"]}
          @value-changed=${i=>{this._locZone=i.detail.value}}
        ></ha-entity-picker>
        <select
          class="trigger"
          .value=${this._locTrigger}
          @change=${i=>{this._locTrigger=i.target.value}}
        >
          <option value="enter">Entering</option>
          <option value="leave">Leaving</option>
        </select>
        ${e?u`<button type="button" class="btn btn-secondary" ?disabled=${this._busy} @click=${()=>this._cancelEdit()}>Cancel</button>`:l}
        <button
          type="button"
          class="btn btn-primary"
          ?disabled=${this._busy}
          @click=${()=>this._addLocation()}
        >
          ${e?"Save":"Add"}
        </button>
      </div>
    `}_renderTimeItem(e){return u`
      <div class="item">
        <ha-icon class="leading" icon="mdi:alarm"></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${this._formatTime(e.start)}</span>
        </div>
        <ha-icon-button
          .label=${"Edit reminder"}
          @click=${()=>this._startEditTime(e)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${()=>this._delete(e.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `}_renderLocationItem(e){let s=`${e.trigger==="enter"?"Entering":"Leaving"} ${this._entityName(e.zone)} \xB7 ${this._entityName(e.person)}`,n=e.deliveredAt?`Delivered ${this._formatTime(e.deliveredAt)} \xB7 ${s}`:s;return u`
      <div class="item ${e.deliveredAt?"delivered":""}">
        <ha-icon class="leading" icon="mdi:map-marker"></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${n}</span>
        </div>
        ${e.deliveredAt?l:u`<ha-icon-button
              .label=${"Edit reminder"}
              @click=${()=>this._startEditLocation(e)}
            >
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </ha-icon-button>`}
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${()=>this._deleteLocation(e.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `}render(){let e=this._config.title??"BToddB Reminders",i=this._locationItems(),s=i.filter(d=>!d.deliveredAt),n=i.filter(d=>d.deliveredAt).sort((d,a)=>a.deliveredAt.getTime()-d.deliveredAt.getTime()),o=this._items.length+i.length;return u`
      <ha-card .header=${e}>
        <div class="content">
          <div class="tabs">
            <button
              class="tab ${this._mode==="time"?"active":""}"
              @click=${()=>{this._mode!=="time"&&(this._cancelEdit(),this._mode="time")}}
            >
              Time
            </button>
            <button
              class="tab ${this._mode==="location"?"active":""}"
              @click=${()=>{this._mode!=="location"&&(this._cancelEdit(),this._mode="location")}}
            >
              Location
            </button>
          </div>

          ${this._mode==="time"?this._renderTimeAddRow():this._renderLocationAddRow()}

          ${this._error?u`<div class="error">${this._error}</div>`:l}

          ${o===0?u`<div class="empty">No reminders.</div>`:u`
                <div class="list">
                  ${this._items.map(d=>this._renderTimeItem(d))}
                  ${s.map(d=>this._renderLocationItem(d))}
                  ${n.map(d=>this._renderLocationItem(d))}
                </div>
              `}
        </div>
      </ha-card>
    `}};L.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_mode:{state:!0},_message:{state:!0},_when:{state:!0},_locMessage:{state:!0},_locPerson:{state:!0},_locZone:{state:!0},_locTrigger:{state:!0},_busy:{state:!0},_error:{state:!0},_editingUid:{state:!0}},L.styles=O`
    .content {
      padding: 0 16px 12px;
    }
    .tabs {
      display: flex;
      gap: 8px;
      padding-top: 8px;
    }
    .tab {
      flex: 0 0 auto;
      height: 32px;
      padding: 0 14px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color, #727272);
      font-family: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .tab.active {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    .add-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      flex-wrap: wrap;
    }
    .message,
    .when,
    .trigger {
      height: 40px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
    .message {
      flex: 1 1 160px;
      min-width: 140px;
    }
    .when,
    .trigger {
      flex: 0 0 auto;
    }
    .picker {
      flex: 1 1 140px;
      min-width: 130px;
    }
    .btn {
      flex: 0 0 auto;
      height: 36px;
      padding: 0 16px;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.025em;
      cursor: pointer;
      transition: box-shadow 0.15s, background 0.15s;
    }
    .btn:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }
    .btn-primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35);
    }
    .btn-secondary {
      background: transparent;
      color: var(--primary-color, #03a9f4);
      border: 1px solid var(--primary-color, #03a9f4);
    }
    .btn-secondary:hover:not(:disabled) {
      background: color-mix(
        in srgb,
        var(--primary-color, #03a9f4) 10%,
        transparent
      );
    }
    .error {
      color: var(--error-color, #db4437);
      padding: 8px 0;
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color, #727272);
      padding: 16px 0 4px;
      text-align: center;
    }
    .list {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .item:first-child {
      border-top: none;
    }
    .leading {
      color: var(--state-icon-color, var(--primary-color, #03a9f4));
      flex: 0 0 auto;
    }
    .text {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 0;
    }
    .summary {
      color: var(--primary-text-color, #212121);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item.delivered .summary {
      text-decoration: line-through;
      color: var(--secondary-text-color, #727272);
    }
    .item.delivered .leading {
      color: var(--secondary-text-color, #727272);
    }
    .time {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
    }
    ha-icon-button {
      color: var(--secondary-text-color, #727272);
      flex: 0 0 auto;
    }
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",L);var Nt="v0.0.31";console.info(`%c BTODDB-HA-REMINDERS %c ${Nt} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=btoddb-ha-reminders.js.map
