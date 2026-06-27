var M=globalThis,L=M.ShadowRoot&&(M.ShadyCSS===void 0||M.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),st=new WeakMap,E=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(L&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=st.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&st.set(t,e))}return e}toString(){return this.cssText}},rt=r=>new E(typeof r=="string"?r:r+"",void 0,W),H=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new E(t,r,W)},nt=(r,e)=>{if(L)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=M.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},Y=L?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return rt(t)})(r):r;var{is:At,defineProperty:wt,getOwnPropertyDescriptor:Et,getOwnPropertyNames:St,getOwnPropertySymbols:Ct,getPrototypeOf:kt}=Object,I=globalThis,ot=I.trustedTypes,Tt=ot?ot.emptyScript:"",Pt=I.reactiveElementPolyfillSupport,S=(r,e)=>r,q={toAttribute(r,e){switch(e){case Boolean:r=r?Tt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},dt=(r,e)=>!At(r,e),at={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:dt};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=at){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&wt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:n}=Et(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??at}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let e=kt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let t=this.properties,i=[...St(t),...Ct(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(Y(s))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:q).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:q;this._$Em=s;let a=o.fromAttribute(t,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(e!==void 0){let o=this.constructor;if(s===!1&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??dt)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[S("elementProperties")]=new Map,g[S("finalized")]=new Map,Pt?.({ReactiveElement:g}),(I.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,lt=r=>r,N=Q.trustedTypes,ct=N?N.createPolicy("lit-html",{createHTML:r=>r}):void 0,mt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+v,Rt=`<${ft}>`,b=document,k=()=>b.createComment(""),T=r=>r===null||typeof r!="object"&&typeof r!="function",J=Array.isArray,Dt=r=>J(r)||typeof r?.[Symbol.iterator]=="function",B=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,pt=/>/g,y=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,_t=/"/g,vt=/^(?:script|style|textarea|title)$/i,G=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),h=G(1),Bt=G(2),jt=G(3),x=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),gt=new WeakMap,$=b.createTreeWalker(b,129);function yt(r,e){if(!J(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(e):e}var Ut=(r,e)=>{let t=r.length-1,i=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=C;for(let a=0;a<t;a++){let d=r[a],p,u,c=-1,_=0;for(;_<d.length&&(o.lastIndex=_,u=o.exec(d),u!==null);)_=o.lastIndex,o===C?u[1]==="!--"?o=ht:u[1]!==void 0?o=pt:u[2]!==void 0?(vt.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=y):u[3]!==void 0&&(o=y):o===y?u[0]===">"?(o=s??C,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,p=u[1],o=u[3]===void 0?y:u[3]==='"'?_t:ut):o===_t||o===ut?o=y:o===ht||o===pt?o=C:(o=y,s=void 0);let f=o===y&&r[a+1].startsWith("/>")?" ":"";n+=o===C?d+Rt:c>=0?(i.push(p),d.slice(0,c)+mt+d.slice(c)+v+f):d+v+(c===-2?a:f)}return[yt(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},P=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0,a=e.length-1,d=this.parts,[p,u]=Ut(e,t);if(this.el=r.createElement(p,i),$.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=$.nextNode())!==null&&d.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(mt)){let _=u[o++],f=s.getAttribute(c).split(v),O=/([.?@])?(.*)/.exec(_);d.push({type:1,index:n,name:O[2],strings:f,ctor:O[1]==="."?F:O[1]==="?"?K:O[1]==="@"?Z:w}),s.removeAttribute(c)}else c.startsWith(v)&&(d.push({type:6,index:n}),s.removeAttribute(c));if(vt.test(s.tagName)){let c=s.textContent.split(v),_=c.length-1;if(_>0){s.textContent=N?N.emptyScript:"";for(let f=0;f<_;f++)s.append(c[f],k()),$.nextNode(),d.push({type:2,index:++n});s.append(c[_],k())}}}else if(s.nodeType===8)if(s.data===ft)d.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf(v,c+1))!==-1;)d.push({type:7,index:n}),c+=v.length-1}n++}}static createElement(e,t){let i=b.createElement("template");return i.innerHTML=e,i}};function A(r,e,t=r,i){if(e===x)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,n=T(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=A(r,s._$AS(r,e.values),s,i)),e}var j=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??b).importNode(t,!0);$.currentNode=s;let n=$.nextNode(),o=0,a=0,d=i[0];for(;d!==void 0;){if(o===d.index){let p;d.type===2?p=new R(n,n.nextSibling,this,e):d.type===1?p=new d.ctor(n,d.name,d.strings,this,e):d.type===6&&(p=new V(n,this,e)),this._$AV.push(p),d=i[++a]}o!==d?.index&&(n=$.nextNode(),o++)}return $.currentNode=b,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},R=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),T(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Dt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(b.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=P.createElement(yt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new j(s,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=gt.get(e.strings);return t===void 0&&gt.set(e.strings,t=new P(e)),t}k(e){J(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let n of e)s===t.length?t.push(i=new r(this.O(k()),this.O(k()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=lt(e).nextSibling;lt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(e,t=this,i,s){let n=this.strings,o=!1;if(n===void 0)e=A(this,e,t,0),o=!T(e)||e!==this._$AH&&e!==x,o&&(this._$AH=e);else{let a=e,d,p;for(e=n[0],d=0;d<n.length-1;d++)p=A(this,a[i+d],t,d),p===x&&(p=this._$AH[d]),o||=!T(p)||p!==this._$AH[d],p===l?e=l:e!==l&&(e+=(p??"")+n[d+1]),this._$AH[d]=p}o&&!s&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},F=class extends w{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},K=class extends w{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},Z=class extends w{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??l)===x)return;let i=this._$AH,s=e===l&&i!==l||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==l&&(i===l||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},V=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var Ot=Q.litHtmlPolyfillSupport;Ot?.(P,R),(Q.litHtmlVersions??=[]).push("3.3.3");var $t=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let n=t?.renderBefore??null;i._$litPart$=s=new R(e.insertBefore(k(),n),n,void 0,t??{})}return s._$AI(r),s};var X=globalThis,m=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=$t(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};m._$litElement$=!0,m.finalized=!0,X.litElementHydrateSupport?.({LitElement:m});var Mt=X.litElementPolyfillSupport;Mt?.({LitElement:m});(X.litElementVersions??=[]).push("4.2.2");var Lt="calendar.btoddb_reminders",tt="sensor.btoddb_location_reminders",bt="btoddb_ha_reminders_location",Ht=[{code:"SU",label:"S"},{code:"MO",label:"M"},{code:"TU",label:"T"},{code:"WE",label:"W"},{code:"TH",label:"T"},{code:"FR",label:"F"},{code:"SA",label:"S"}],xt={MO:"Monday",TU:"Tuesday",WE:"Wednesday",TH:"Thursday",FR:"Friday",SA:"Saturday",SU:"Sunday"},It={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6},z=r=>String(r).padStart(2,"0");function it(r){return`${r.getFullYear()}-${z(r.getMonth()+1)}-${z(r.getDate())}T${z(r.getHours())}:${z(r.getMinutes())}`}function et(){let r=new Date;return r.setHours(r.getHours()+1,0,0,0),it(r)}var D=class extends m{constructor(){super(...arguments);this._config={type:""}}setConfig(t){this._config=t}_titleChanged(t){let i=t.target.value;this._fireConfigChanged({...this._config,title:i})}_entityChanged(t){let i=t.detail.value;this._fireConfigChanged({...this._config,entity:i})}_fireConfigChanged(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?h``:h`
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
    `}};D.properties={hass:{attribute:!1},_config:{state:!0}},D.styles=H`
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
  `;customElements.define("btoddb-reminders-card-editor",D);var U=class extends m{constructor(){super(...arguments);this._config={type:""};this._items=[];this._mode="time";this._message="";this._when=et();this._repeatOpen=!1;this._freq="daily";this._weekday="MO";this._locMessage="";this._locPerson="";this._locZone="";this._locTrigger="enter";this._locPersistent=!1;this._busy=!1;this._error="";this._editingUid="";this._entity=Lt;this._lastSignature=""}static getConfigElement(){return document.createElement("btoddb-reminders-card-editor")}static getStubConfig(){return{}}setConfig(t){this._config=t??{type:""},this._entity=t?.entity??""}getCardSize(){let t=this._locationItems().length;return 3+Math.min(this._items.length+t,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(t){if(!t.has("hass")||!this.hass)return;let i=this.hass.states[this._entity],s=i?`${i.state}|${i.last_updated}`:"missing";s!==this._lastSignature&&(this._lastSignature=s,this._fetch())}async _fetch(){if(!this.hass)return;if(!this._entity){this._error="No calendar entity configured. Edit the card to select one.",this._items=[];return}if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let t=new Date;t.setHours(0,0,0,0);let i=new Date;i.setFullYear(i.getFullYear()+1);try{let s=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(t.toISOString())}&end=${encodeURIComponent(i.toISOString())}`),n=Date.now()-6e4,o=new Set;this._items=(s??[]).map(a=>({kind:"time",uid:a.uid??"",summary:a.summary,start:new Date(a.start.dateTime??a.start.date??""),rrule:a.description??""})).filter(a=>a.start.getTime()>=n||a.rrule!=="").sort((a,d)=>a.start.getTime()-d.start.getTime()).filter(a=>a.rrule?o.has(a.uid)?!1:(o.add(a.uid),!0):!0),this._error=""}catch(s){this._error=`Could not load reminders: ${this._msg(s)}`}}_buildRrule(){return this._repeatOpen?this._freq==="daily"?"FREQ=DAILY":`FREQ=WEEKLY;BYDAY=${this._weekday}`:""}_adjustToWeekday(t,i){let s=It[i]??1,n=new Date(t),o=n.getDay(),a=(s-o+7)%7;return n.setDate(n.getDate()+a),it(n)}async _add(){let t=this._message.trim();if(!t){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}let i=this._editingUid,s=this._buildRrule(),n=this._when;s&&this._freq==="weekly"&&(n=this._adjustToWeekday(n,this._weekday));let o={message:t,when:n};s&&(o.rrule=s),i&&!s&&(o.rrule=null),this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update",{uid:i,...o},void 0,void 0,!0),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create",o,void 0,void 0,!0),this._message="",this._when=et(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",await this._fetch()}catch(a){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(a)}`}finally{this._busy=!1}}async _delete(t){if(t)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:t}),this._items=this._items.filter(i=>i.uid!==t)}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}async _addLocation(){let t=this._locMessage.trim();if(!t){this._error="Enter a reminder message.";return}if(!this._locPerson){this._error="Pick a person to track.";return}if(!this._locZone){this._error="Pick a zone.";return}let i=this._editingUid;this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update_location",{uid:i,message:t,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create_location",{message:t,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1}catch(s){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(s)}`}finally{this._busy=!1}}_startEditTime(t){if(this._editingUid=t.uid,this._mode="time",this._message=t.summary,this._when=it(t.start),t.rrule){this._repeatOpen=!0;let i=t.rrule.toUpperCase();if(i.includes("FREQ=WEEKLY")){this._freq="weekly";let s=i.match(/BYDAY=(\w+)/);this._weekday=s?s[1]:"MO"}else this._freq="daily",this._weekday="MO"}else this._repeatOpen=!1,this._freq="daily",this._weekday="MO";this._error=""}_startEditLocation(t){this._editingUid=t.uid,this._mode="location",this._locMessage=t.summary,this._locPerson=t.person,this._locZone=t.zone,this._locTrigger=t.trigger,this._locPersistent=t.persistent,this._error=""}_cancelEdit(){this._editingUid="",this._message="",this._when=et(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1,this._error=""}async _deleteLocation(t){if(t)try{await this.hass.callService("btoddb_ha_reminders","delete_location",{uid:t})}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}_locationSensorId(){let t=this.hass?.states??{};if(t[tt]?.attributes?.[bt])return tt;for(let[i,s]of Object.entries(t))if(i.startsWith("sensor.")&&s.attributes?.[bt])return i;return tt}_locationItems(){return(this.hass?.states[this._locationSensorId()]?.attributes?.reminders??[]).map(s=>({kind:"location",uid:s.uid,summary:s.summary,person:s.person,zone:s.zone,trigger:s.trigger,persistent:s.persistent??!1,deliveredAt:s.delivered_at?new Date(s.delivered_at):null}))}_entityName(t){return this.hass?.states[t]?.attributes?.friendly_name??t}_msg(t){return t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}_formatTime(t){try{return t.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return t.toLocaleString()}}_formatTimeOnly(t){try{return t.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"})}catch{return t.toLocaleString()}}_dayKey(t){return`${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`}_formatDayHeader(t){let i=new Date;if(this._dayKey(t)===this._dayKey(i))return"Today";let s=new Date(i);if(s.setDate(i.getDate()+1),this._dayKey(t)===this._dayKey(s))return"Tomorrow";try{return t.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}catch{return t.toLocaleDateString()}}_renderDayHeader(t){return h`<div class="day-header">${this._formatDayHeader(t)}</div>`}_formatRecurrence(t,i){let s=i.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"}),n=t.toUpperCase();if(n.includes("FREQ=DAILY"))return`Every day at ${s}`;if(n.includes("FREQ=WEEKLY")){let o=n.match(/BYDAY=(\w+)/);return o?`Every ${xt[o[1]]??o[1]} at ${s}`:`Weekly at ${s}`}return t}_renderRepeatDisclosure(){return h`
      <div class="repeat-row">
        <button
          type="button"
          class="repeat-toggle"
          @click=${()=>{this._repeatOpen=!this._repeatOpen}}
        >
          <ha-icon
            icon=${this._repeatOpen?"mdi:chevron-down":"mdi:chevron-right"}
          ></ha-icon>
          Repeat
        </button>
        ${this._repeatOpen?h`
              <div class="repeat-body">
                <select
                  class="freq-select"
                  .value=${this._freq}
                  @change=${t=>{this._freq=t.target.value}}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                ${this._freq==="weekly"?h`
                      <div class="weekday-chips">
                        ${Ht.map(({code:t,label:i})=>h`
                            <button
                              type="button"
                              class="chip ${this._weekday===t?"selected":""}"
                              title=${xt[t]??t}
                              @click=${()=>{this._weekday=t}}
                            >
                              ${i}
                            </button>
                          `)}
                      </div>
                    `:l}
              </div>
            `:l}
      </div>
    `}_renderTimeAddRow(){let t=!!this._editingUid;return h`
      <div>
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
          ${t?h`<button
                type="button"
                class="btn btn-secondary"
                ?disabled=${this._busy}
                @click=${()=>this._cancelEdit()}
              >
                Cancel
              </button>`:l}
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this._busy}
            @click=${()=>this._add()}
          >
            ${t?"Save":"Add"}
          </button>
        </div>
        ${this._renderRepeatDisclosure()}
      </div>
    `}_renderLocationAddRow(){let t=!!this._editingUid;return h`
      <div>
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
          ${t?h`<button type="button" class="btn btn-secondary" ?disabled=${this._busy} @click=${()=>this._cancelEdit()}>Cancel</button>`:l}
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this._busy}
            @click=${()=>this._addLocation()}
          >
            ${t?"Save":"Add"}
          </button>
        </div>
        <div class="repeat-row">
          <button
            type="button"
            class="repeat-toggle ${this._locPersistent?"active":""}"
            @click=${()=>{this._locPersistent=!this._locPersistent}}
          >
            <ha-icon icon="mdi:repeat"></ha-icon>
            Repeat
          </button>
        </div>
      </div>
    `}_renderTimeRows(){let t=[],i="";for(let s of this._items){let n=this._dayKey(s.start),o=n!==i;o&&(t.push(this._renderDayHeader(s.start)),i=n),t.push(this._renderTimeItem(s,o))}return t}_renderTimeItem(t,i=!1){let s=!!t.rrule,n=s?this._formatRecurrence(t.rrule,t.start):this._formatTimeOnly(t.start);return h`
      <div class="item ${s?"recurring":""} ${i?"day-first":""}">
        <ha-icon
          class="leading"
          icon=${s?"mdi:repeat":"mdi:alarm"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${t.summary}</span>
          <span class="time">${n}</span>
        </div>
        <ha-icon-button
          .label=${"Edit reminder"}
          @click=${()=>this._startEditTime(t)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${()=>this._delete(t.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `}_renderLocationItem(t){let s=`${t.trigger==="enter"?"Entering":"Leaving"} ${this._entityName(t.zone)} \xB7 ${this._entityName(t.person)}`,n=t.deliveredAt?`Delivered ${this._formatTime(t.deliveredAt)} \xB7 ${s}`:t.persistent?`Repeating \xB7 ${s}`:s,o=t.persistent&&!t.deliveredAt;return h`
      <div class="item ${o?"persistent":""} ${t.deliveredAt?"delivered":""}">
        <ha-icon class="leading" icon=${o?"mdi:map-marker-path":"mdi:map-marker"}></ha-icon>
        <div class="text">
          <span class="summary">${t.summary}</span>
          <span class="time">${n}</span>
        </div>
        ${t.deliveredAt?l:h`<ha-icon-button
              .label=${"Edit reminder"}
              @click=${()=>this._startEditLocation(t)}
            >
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </ha-icon-button>`}
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${()=>this._deleteLocation(t.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `}render(){let t=this._config.title??"BToddB Reminders",i=this._locationItems(),s=i.filter(a=>!a.deliveredAt),n=i.filter(a=>a.deliveredAt).sort((a,d)=>d.deliveredAt.getTime()-a.deliveredAt.getTime()),o=this._items.length+i.length;return h`
      <ha-card .header=${t}>
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

          ${this._error?h`<div class="error">${this._error}</div>`:l}

          ${o===0?h`<div class="empty">No reminders.</div>`:h`
                <div class="list">
                  ${this._renderTimeRows()}
                  ${s.map(a=>this._renderLocationItem(a))}
                  ${n.map(a=>this._renderLocationItem(a))}
                </div>
              `}
        </div>
      </ha-card>
    `}};U.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_mode:{state:!0},_message:{state:!0},_when:{state:!0},_repeatOpen:{state:!0},_freq:{state:!0},_weekday:{state:!0},_locMessage:{state:!0},_locPerson:{state:!0},_locZone:{state:!0},_locTrigger:{state:!0},_locPersistent:{state:!0},_busy:{state:!0},_error:{state:!0},_editingUid:{state:!0}},U.styles=H`
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
    .day-header {
      color: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 8px 0 2px;
      margin-top: 4px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .list > .day-header:first-child {
      border-top: none;
      margin-top: 0;
      padding-top: 4px;
    }
    .item.day-first {
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
    .item.recurring .leading {
      color: var(--accent-color, var(--primary-color, #03a9f4));
    }
    .item.persistent .leading {
      color: var(--accent-color, var(--primary-color, #03a9f4));
    }
    .time {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
    }
    ha-icon-button {
      color: var(--secondary-text-color, #727272);
      flex: 0 0 auto;
    }
    /* Repeat disclosure */
    .repeat-row {
      padding-top: 6px;
    }
    .repeat-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--secondary-text-color, #727272);
      font-family: inherit;
      font-size: 13px;
    }
    .repeat-toggle:hover {
      color: var(--primary-color, #03a9f4);
    }
    .repeat-toggle.active {
      color: var(--primary-color, #03a9f4);
    }
    .repeat-body {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
    }
    .freq-select {
      height: 36px;
      padding: 0 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
    }
    .weekday-chips {
      display: flex;
      gap: 4px;
    }
    .chip {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-sizing: border-box;
    }
    .chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .chip:hover:not(.selected) {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",U);var Nt="v0.0.40";console.info(`%c BTODDB-HA-REMINDERS %c ${Nt} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});
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
