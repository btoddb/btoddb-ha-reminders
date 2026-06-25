var N=globalThis,O=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),et=new WeakMap,x=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(O&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&et.set(e,t))}return t}toString(){return this.cssText}},st=r=>new x(typeof r=="string"?r:r+"",void 0,j),U=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new x(e,r,j)},it=(r,t)=>{if(O)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=N.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},B=O?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return st(e)})(r):r;var{is:bt,defineProperty:At,getOwnPropertyDescriptor:wt,getOwnPropertyNames:Et,getOwnPropertySymbols:xt,getPrototypeOf:St}=Object,I=globalThis,rt=I.trustedTypes,Ct=rt?rt.emptyScript:"",Tt=I.reactiveElementPolyfillSupport,S=(r,t)=>r,W={toAttribute(r,t){switch(t){case Boolean:r=r?Ct:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ot=(r,t)=>!bt(r,t),nt={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&At(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=wt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let t=St(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let e=this.properties,s=[...Et(e),...xt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(B(i))}else t!==void 0&&e.push(B(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return it(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:W).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:W;this._$Em=i;let l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??ot)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[S("elementProperties")]=new Map,_[S("finalized")]=new Map,Tt?.({ReactiveElement:_}),(I.reactiveElementVersions??=[]).push("2.1.2");var J=globalThis,at=r=>r,D=J.trustedTypes,lt=D?D.createPolicy("lit-html",{createHTML:r=>r}):void 0,mt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,_t="?"+$,Pt=`<${_t}>`,b=document,T=()=>b.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,kt=r=>G(r)||typeof r?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,ht=/>/g,v=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,pt=/"/g,gt=/^(?:script|style|textarea|title)$/i,Q=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),u=Q(1),jt=Q(2),Bt=Q(3),A=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ut=new WeakMap,y=b.createTreeWalker(b,129);function ft(r,t){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(t):t}var Mt=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=C;for(let l=0;l<e;l++){let a=r[l],d,p,c=-1,m=0;for(;m<a.length&&(o.lastIndex=m,p=o.exec(a),p!==null);)m=o.lastIndex,o===C?p[1]==="!--"?o=ct:p[1]!==void 0?o=ht:p[2]!==void 0?(gt.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=v):p[3]!==void 0&&(o=v):o===v?p[0]===">"?(o=i??C,c=-1):p[1]===void 0?c=-2:(c=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?v:p[3]==='"'?pt:dt):o===pt||o===dt?o=v:o===ct||o===ht?o=C:(o=v,i=void 0);let f=o===v&&r[l+1].startsWith("/>")?" ":"";n+=o===C?a+Pt:c>=0?(s.push(d),a.slice(0,c)+mt+a.slice(c)+$+f):a+$+(c===-2?l:f)}return[ft(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},k=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[d,p]=Mt(t,e);if(this.el=r.createElement(d,s),y.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=y.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(mt)){let m=p[o++],f=i.getAttribute(c).split($),H=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:H[2],strings:f,ctor:H[1]==="."?q:H[1]==="?"?F:H[1]==="@"?K:E}),i.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(gt.test(i.tagName)){let c=i.textContent.split($),m=c.length-1;if(m>0){i.textContent=D?D.emptyScript:"";for(let f=0;f<m;f++)i.append(c[f],T()),y.nextNode(),a.push({type:2,index:++n});i.append(c[m],T())}}}else if(i.nodeType===8)if(i.data===_t)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf($,c+1))!==-1;)a.push({type:7,index:n}),c+=$.length-1}n++}}static createElement(t,e){let s=b.createElement("template");return s.innerHTML=t,s}};function w(r,t,e=r,s){if(t===A)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=P(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=w(r,i._$AS(r,t.values),i,s)),t}var Z=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??b).importNode(e,!0);y.currentNode=i;let n=y.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new M(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Y(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=y.nextNode(),o++)}return y.currentNode=b,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},M=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),P(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=k.createElement(ft(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new Z(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=ut.get(t.strings);return e===void 0&&ut.set(t.strings,e=new k(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=at(t).nextSibling;at(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=w(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let l=t,a,d;for(t=n[0],a=0;a<n.length-1;a++)d=w(this,l[s+a],e,a),d===A&&(d=this._$AH[a]),o||=!P(d)||d!==this._$AH[a],d===h?t=h:t!==h&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},q=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},F=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},K=class extends E{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??h)===A)return;let s=this._$AH,i=t===h&&s!==h||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Y=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}};var Lt=J.litHtmlPolyfillSupport;Lt?.(k,M),(J.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new M(t.insertBefore(T(),n),n,void 0,e??{})}return i._$AI(r),i};var X=globalThis,g=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};g._$litElement$=!0,g.finalized=!0,X.litElementHydrateSupport?.({LitElement:g});var Rt=X.litElementPolyfillSupport;Rt?.({LitElement:g});(X.litElementVersions??=[]).push("4.2.2");var Ht="calendar.btoddb_reminders",tt="sensor.btoddb_location_reminders",vt="btoddb_ha_reminders_location",z=r=>String(r).padStart(2,"0");function Nt(r){return`${r.getFullYear()}-${z(r.getMonth()+1)}-${z(r.getDate())}T${z(r.getHours())}:${z(r.getMinutes())}`}function yt(){let r=new Date;return r.setHours(r.getHours()+1,0,0,0),Nt(r)}var L=class extends g{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e}_titleChanged(e){let s=e.target.value;this._fireConfigChanged({...this._config,title:s})}_entityChanged(e){let s=e.detail.value;this._fireConfigChanged({...this._config,entity:s})}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?u``:u`
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
    `}};L.properties={hass:{attribute:!1},_config:{state:!0}},L.styles=U`
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
  `;customElements.define("btoddb-reminders-card-editor",L);var R=class extends g{constructor(){super(...arguments);this._config={type:""};this._items=[];this._mode="time";this._message="";this._when=yt();this._locMessage="";this._locPerson="";this._locZone="";this._locTrigger="enter";this._busy=!1;this._error="";this._entity=Ht;this._lastSignature=""}static getConfigElement(){return document.createElement("btoddb-reminders-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config=e??{type:""},this._entity=e?.entity??""}getCardSize(){let e=this._locationItems().length;return 3+Math.min(this._items.length+e,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(e){if(!e.has("hass")||!this.hass)return;let s=this.hass.states[this._entity],i=s?`${s.state}|${s.last_updated}`:"missing";i!==this._lastSignature&&(this._lastSignature=i,this._fetch())}async _fetch(){if(!this.hass)return;if(!this._entity){this._error="No calendar entity configured. Edit the card to select one.",this._items=[];return}if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let e=new Date;e.setHours(0,0,0,0);let s=new Date;s.setFullYear(s.getFullYear()+1);try{let i=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(s.toISOString())}`),n=Date.now()-6e4;this._items=(i??[]).map(o=>({kind:"time",uid:o.uid??"",summary:o.summary,start:new Date(o.start.dateTime??o.start.date??"")})).filter(o=>o.start.getTime()>=n).sort((o,l)=>o.start.getTime()-l.start.getTime()),this._error=""}catch(i){this._error=`Could not load reminders: ${this._msg(i)}`}}async _add(){let e=this._message.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}this._busy=!0,this._error="";try{await this.hass.callService("btoddb_ha_reminders","create",{message:e,when:this._when},void 0,void 0,!0),this._message="",this._when=yt(),await this._fetch()}catch(s){this._error=`Could not create reminder: ${this._msg(s)}`}finally{this._busy=!1}}async _delete(e){if(e)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:e}),this._items=this._items.filter(s=>s.uid!==e)}catch(s){this._error=`Could not delete reminder: ${this._msg(s)}`}}async _addLocation(){let e=this._locMessage.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._locPerson){this._error="Pick a person to track.";return}if(!this._locZone){this._error="Pick a zone.";return}this._busy=!0,this._error="";try{await this.hass.callService("btoddb_ha_reminders","create_location",{message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger}),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter"}catch(s){this._error=`Could not create reminder: ${this._msg(s)}`}finally{this._busy=!1}}async _deleteLocation(e){if(e)try{await this.hass.callService("btoddb_ha_reminders","delete_location",{uid:e})}catch(s){this._error=`Could not delete reminder: ${this._msg(s)}`}}_locationSensorId(){let e=this.hass?.states??{};if(e[tt]?.attributes?.[vt])return tt;for(let[s,i]of Object.entries(e))if(s.startsWith("sensor.")&&i.attributes?.[vt])return s;return tt}_locationItems(){return(this.hass?.states[this._locationSensorId()]?.attributes?.reminders??[]).map(i=>({kind:"location",uid:i.uid,summary:i.summary,person:i.person,zone:i.zone,trigger:i.trigger,deliveredAt:i.delivered_at?new Date(i.delivered_at):null}))}_entityName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTime(e){try{return e.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_renderTimeAddRow(){return u`
      <div class="add-row">
        <input
          class="message"
          type="text"
          placeholder="New reminder"
          .value=${this._message}
          @input=${e=>{this._message=e.target.value}}
          @keydown=${e=>{e.key==="Enter"&&this._add()}}
        />
        <input
          class="when"
          type="datetime-local"
          .value=${this._when}
          @input=${e=>{this._when=e.target.value}}
        />
        <mwc-button raised ?disabled=${this._busy} @click=${()=>this._add()}>
          Add
        </mwc-button>
      </div>
    `}_renderLocationAddRow(){return u`
      <div class="add-row">
        <input
          class="message"
          type="text"
          placeholder="New reminder"
          .value=${this._locMessage}
          @input=${e=>{this._locMessage=e.target.value}}
        />
        <ha-entity-picker
          class="picker"
          .hass=${this.hass}
          .value=${this._locPerson}
          .label=${"Person"}
          .includeDomains=${["person"]}
          @value-changed=${e=>{this._locPerson=e.detail.value}}
        ></ha-entity-picker>
        <ha-entity-picker
          class="picker"
          .hass=${this.hass}
          .value=${this._locZone}
          .label=${"Zone"}
          .includeDomains=${["zone"]}
          @value-changed=${e=>{this._locZone=e.detail.value}}
        ></ha-entity-picker>
        <select
          class="trigger"
          .value=${this._locTrigger}
          @change=${e=>{this._locTrigger=e.target.value}}
        >
          <option value="enter">Entering</option>
          <option value="leave">Leaving</option>
        </select>
        <mwc-button
          raised
          ?disabled=${this._busy}
          @click=${()=>this._addLocation()}
        >
          Add
        </mwc-button>
      </div>
    `}_renderTimeItem(e){return u`
      <div class="item">
        <ha-icon class="leading" icon="mdi:alarm"></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${this._formatTime(e.start)}</span>
        </div>
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${()=>this._delete(e.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `}_renderLocationItem(e){let i=`${e.trigger==="enter"?"Entering":"Leaving"} ${this._entityName(e.zone)} \xB7 ${this._entityName(e.person)}`,n=e.deliveredAt?`Delivered ${this._formatTime(e.deliveredAt)} \xB7 ${i}`:i;return u`
      <div class="item ${e.deliveredAt?"delivered":""}">
        <ha-icon class="leading" icon="mdi:map-marker"></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${n}</span>
        </div>
        <ha-icon-button
          .label=${"Delete reminder"}
          @click=${()=>this._deleteLocation(e.uid)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </ha-icon-button>
      </div>
    `}render(){let e=this._config.title??"BToddB Reminders",s=this._locationItems(),i=s.filter(l=>!l.deliveredAt),n=s.filter(l=>l.deliveredAt).sort((l,a)=>a.deliveredAt.getTime()-l.deliveredAt.getTime()),o=this._items.length+s.length;return u`
      <ha-card .header=${e}>
        <div class="content">
          <div class="tabs">
            <button
              class="tab ${this._mode==="time"?"active":""}"
              @click=${()=>{this._mode="time"}}
            >
              Time
            </button>
            <button
              class="tab ${this._mode==="location"?"active":""}"
              @click=${()=>{this._mode="location"}}
            >
              Location
            </button>
          </div>

          ${this._mode==="time"?this._renderTimeAddRow():this._renderLocationAddRow()}

          ${this._error?u`<div class="error">${this._error}</div>`:h}

          ${o===0?u`<div class="empty">No reminders.</div>`:u`
                <div class="list">
                  ${this._items.map(l=>this._renderTimeItem(l))}
                  ${i.map(l=>this._renderLocationItem(l))}
                  ${n.map(l=>this._renderLocationItem(l))}
                </div>
              `}
        </div>
      </ha-card>
    `}};R.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_mode:{state:!0},_message:{state:!0},_when:{state:!0},_locMessage:{state:!0},_locPerson:{state:!0},_locZone:{state:!0},_locTrigger:{state:!0},_busy:{state:!0},_error:{state:!0}},R.styles=U`
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
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",R);var Ot="v0.0.26";console.info(`%c BTODDB-HA-REMINDERS %c ${Ot} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});
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
