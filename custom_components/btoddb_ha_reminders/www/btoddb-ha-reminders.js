var L=globalThis,D=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),st=new WeakMap,E=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(D&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=st.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&st.set(e,t))}return t}toString(){return this.cssText}},rt=r=>new E(typeof r=="string"?r:r+"",void 0,W),H=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new E(e,r,W)},nt=(r,t)=>{if(D)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=L.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},q=D?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return rt(e)})(r):r;var{is:xt,defineProperty:wt,getOwnPropertyDescriptor:Et,getOwnPropertyNames:St,getOwnPropertySymbols:Ct,getPrototypeOf:kt}=Object,I=globalThis,ot=I.trustedTypes,Tt=ot?ot.emptyScript:"",Pt=I.reactiveElementPolyfillSupport,S=(r,t)=>r,B={toAttribute(r,t){switch(t){case Boolean:r=r?Tt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},lt=(r,t)=>!xt(r,t),at={attribute:!0,type:String,converter:B,reflect:!1,useDefault:!1,hasChanged:lt};Symbol.metadata??=Symbol("metadata"),I.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=at){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&wt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:n}=Et(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let a=s?.call(this);n?.call(this,o),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??at}static _$Ei(){if(this.hasOwnProperty(S("elementProperties")))return;let t=kt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(S("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S("properties"))){let e=this.properties,i=[...St(e),...Ct(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(q(s))}else t!==void 0&&e.push(q(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:B).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:B;this._$Em=s;let a=o.fromAttribute(e,n.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(t!==void 0){let o=this.constructor;if(s===!1&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??lt)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,a=this[s];o!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,n,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[S("elementProperties")]=new Map,g[S("finalized")]=new Map,Pt?.({ReactiveElement:g}),(I.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,ct=r=>r,N=Q.trustedTypes,dt=N?N.createPolicy("lit-html",{createHTML:r=>r}):void 0,mt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,ft="?"+v,Rt=`<${ft}>`,b=document,k=()=>b.createComment(""),T=r=>r===null||typeof r!="object"&&typeof r!="function",J=Array.isArray,Ut=r=>J(r)||typeof r?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,pt=/>/g,y=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ut=/'/g,_t=/"/g,vt=/^(?:script|style|textarea|title)$/i,G=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),p=G(1),Yt=G(2),jt=G(3),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),gt=new WeakMap,$=b.createTreeWalker(b,129);function yt(r,t){if(!J(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return dt!==void 0?dt.createHTML(t):t}var Ot=(r,t)=>{let e=r.length-1,i=[],s,n=t===2?"<svg>":t===3?"<math>":"",o=C;for(let a=0;a<e;a++){let l=r[a],h,u,d=-1,_=0;for(;_<l.length&&(o.lastIndex=_,u=o.exec(l),u!==null);)_=o.lastIndex,o===C?u[1]==="!--"?o=ht:u[1]!==void 0?o=pt:u[2]!==void 0?(vt.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=y):u[3]!==void 0&&(o=y):o===y?u[0]===">"?(o=s??C,d=-1):u[1]===void 0?d=-2:(d=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?y:u[3]==='"'?_t:ut):o===_t||o===ut?o=y:o===ht||o===pt?o=C:(o=y,s=void 0);let f=o===y&&r[a+1].startsWith("/>")?" ":"";n+=o===C?l+Rt:d>=0?(i.push(h),l.slice(0,d)+mt+l.slice(d)+v+f):l+v+(d===-2?a:f)}return[yt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},P=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0,a=t.length-1,l=this.parts,[h,u]=Ot(t,e);if(this.el=r.createElement(h,i),$.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=$.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let d of s.getAttributeNames())if(d.endsWith(mt)){let _=u[o++],f=s.getAttribute(d).split(v),M=/([.?@])?(.*)/.exec(_);l.push({type:1,index:n,name:M[2],strings:f,ctor:M[1]==="."?F:M[1]==="?"?Z:M[1]==="@"?K:w}),s.removeAttribute(d)}else d.startsWith(v)&&(l.push({type:6,index:n}),s.removeAttribute(d));if(vt.test(s.tagName)){let d=s.textContent.split(v),_=d.length-1;if(_>0){s.textContent=N?N.emptyScript:"";for(let f=0;f<_;f++)s.append(d[f],k()),$.nextNode(),l.push({type:2,index:++n});s.append(d[_],k())}}}else if(s.nodeType===8)if(s.data===ft)l.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf(v,d+1))!==-1;)l.push({type:7,index:n}),d+=v.length-1}n++}}static createElement(t,e){let i=b.createElement("template");return i.innerHTML=t,i}};function x(r,t,e=r,i){if(t===A)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,n=T(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=x(r,s._$AS(r,t.values),s,i)),t}var j=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??b).importNode(e,!0);$.currentNode=s;let n=$.nextNode(),o=0,a=0,l=i[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new R(n,n.nextSibling,this,t):l.type===1?h=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(h=new V(n,this,t)),this._$AV.push(h),l=i[++a]}o!==l?.index&&(n=$.nextNode(),o++)}return $.currentNode=b,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},R=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=x(this,t,e),T(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ut(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(b.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(yt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new j(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=gt.get(t.strings);return e===void 0&&gt.set(t.strings,e=new P(t)),e}k(t){J(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let n of t)s===e.length?e.push(i=new r(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=ct(t).nextSibling;ct(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,s){let n=this.strings,o=!1;if(n===void 0)t=x(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let a=t,l,h;for(t=n[0],l=0;l<n.length-1;l++)h=x(this,a[i+l],e,l),h===A&&(h=this._$AH[l]),o||=!T(h)||h!==this._$AH[l],h===c?t=c:t!==c&&(t+=(h??"")+n[l+1]),this._$AH[l]=h}o&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},F=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},Z=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},K=class extends w{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=x(this,t,e,0)??c)===A)return;let i=this._$AH,s=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==c&&(i===c||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},V=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){x(this,t)}};var Mt=Q.litHtmlPolyfillSupport;Mt?.(P,R),(Q.litHtmlVersions??=[]).push("3.3.3");var $t=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let n=e?.renderBefore??null;i._$litPart$=s=new R(t.insertBefore(k(),n),n,void 0,e??{})}return s._$AI(r),s};var X=globalThis,m=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};m._$litElement$=!0,m.finalized=!0,X.litElementHydrateSupport?.({LitElement:m});var Lt=X.litElementPolyfillSupport;Lt?.({LitElement:m});(X.litElementVersions??=[]).push("4.2.2");var Dt="calendar.btoddb_reminders",tt="sensor.btoddb_location_reminders",bt="btoddb_ha_reminders_location",Ht=[{code:"SU",label:"S"},{code:"MO",label:"M"},{code:"TU",label:"T"},{code:"WE",label:"W"},{code:"TH",label:"T"},{code:"FR",label:"F"},{code:"SA",label:"S"}],At={MO:"Monday",TU:"Tuesday",WE:"Wednesday",TH:"Thursday",FR:"Friday",SA:"Saturday",SU:"Sunday"},It={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6},z=r=>String(r).padStart(2,"0");function it(r){return`${r.getFullYear()}-${z(r.getMonth()+1)}-${z(r.getDate())}T${z(r.getHours())}:${z(r.getMinutes())}`}function et(){let r=new Date;return r.setHours(r.getHours()+1,0,0,0),it(r)}var U=class extends m{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e}_titleChanged(e){let i=e.target.value;this._fireConfigChanged({...this._config,title:i})}_entityChanged(e){let i=e.detail.value;this._fireConfigChanged({...this._config,entity:i})}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?p``:p`
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
    `}};U.properties={hass:{attribute:!1},_config:{state:!0}},U.styles=H`
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
  `;customElements.define("btoddb-reminders-card-editor",U);var O=class extends m{constructor(){super(...arguments);this._config={type:""};this._items=[];this._mode="time";this._message="";this._when=et();this._repeatOpen=!1;this._freq="daily";this._weekday="MO";this._locMessage="";this._locPerson="";this._locZone="";this._locTrigger="enter";this._locPersistent=!1;this._busy=!1;this._error="";this._editingUid="";this._entity=Dt;this._lastSignature=""}static getConfigElement(){return document.createElement("btoddb-reminders-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config=e??{type:""},this._entity=e?.entity??""}getCardSize(){let e=this._locationItems().length;return 3+Math.min(this._items.length+e,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(e){if(!e.has("hass")||!this.hass)return;let i=this.hass.states[this._entity],s=i?`${i.state}|${i.last_updated}`:"missing";s!==this._lastSignature&&(this._lastSignature=s,this._fetch())}async _fetch(){if(!this.hass)return;if(!this._entity){this._error="No calendar entity configured. Edit the card to select one.",this._items=[];return}if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let e=new Date;e.setHours(0,0,0,0);let i=new Date;i.setFullYear(i.getFullYear()+1);try{let s=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(i.toISOString())}`),n=Date.now()-6e4,o=new Set;this._items=(s??[]).map(a=>({kind:"time",uid:a.uid??"",summary:a.summary,start:new Date(a.start.dateTime??a.start.date??""),rrule:a.description??""})).filter(a=>a.start.getTime()>=n||a.rrule!=="").sort((a,l)=>a.start.getTime()-l.start.getTime()).filter(a=>a.rrule?o.has(a.uid)?!1:(o.add(a.uid),!0):!0),this._error=""}catch(s){this._error=`Could not load reminders: ${this._msg(s)}`}}_buildRrule(){return this._repeatOpen?this._freq==="daily"?"FREQ=DAILY":`FREQ=WEEKLY;BYDAY=${this._weekday}`:""}_adjustToWeekday(e,i){let s=It[i]??1,n=new Date(e),o=n.getDay(),a=(s-o+7)%7;return n.setDate(n.getDate()+a),it(n)}async _add(){let e=this._message.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}let i=this._editingUid,s=this._buildRrule(),n=this._when;s&&this._freq==="weekly"&&(n=this._adjustToWeekday(n,this._weekday));let o={message:e,when:n};s&&(o.rrule=s),i&&!s&&(o.rrule=null),this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update",{uid:i,...o},void 0,void 0,!0),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create",o,void 0,void 0,!0),this._message="",this._when=et(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",await this._fetch()}catch(a){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(a)}`}finally{this._busy=!1}}async _delete(e){if(e)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:e}),this._items=this._items.filter(i=>i.uid!==e)}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}async _addLocation(){let e=this._locMessage.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._locPerson){this._error="Pick a person to track.";return}if(!this._locZone){this._error="Pick a zone.";return}let i=this._editingUid;this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update_location",{uid:i,message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create_location",{message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1}catch(s){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(s)}`}finally{this._busy=!1}}_startEditTime(e){if(this._editingUid=e.uid,this._mode="time",this._message=e.summary,this._when=it(e.start),e.rrule){this._repeatOpen=!0;let i=e.rrule.toUpperCase();if(i.includes("FREQ=WEEKLY")){this._freq="weekly";let s=i.match(/BYDAY=(\w+)/);this._weekday=s?s[1]:"MO"}else this._freq="daily",this._weekday="MO"}else this._repeatOpen=!1,this._freq="daily",this._weekday="MO";this._error=""}_startEditLocation(e){this._editingUid=e.uid,this._mode="location",this._locMessage=e.summary,this._locPerson=e.person,this._locZone=e.zone,this._locTrigger=e.trigger,this._locPersistent=e.persistent,this._error=""}_cancelEdit(){this._editingUid="",this._message="",this._when=et(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1,this._error=""}async _deleteLocation(e){if(e)try{await this.hass.callService("btoddb_ha_reminders","delete_location",{uid:e})}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}_locationSensorId(){let e=this.hass?.states??{};if(e[tt]?.attributes?.[bt])return tt;for(let[i,s]of Object.entries(e))if(i.startsWith("sensor.")&&s.attributes?.[bt])return i;return tt}_locationItems(){return(this.hass?.states[this._locationSensorId()]?.attributes?.reminders??[]).map(s=>({kind:"location",uid:s.uid,summary:s.summary,person:s.person,zone:s.zone,trigger:s.trigger,persistent:s.persistent??!1,deliveredAt:s.delivered_at?new Date(s.delivered_at):null}))}_entityName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTime(e){try{return e.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatRecurrence(e,i){let s=i.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"}),n=e.toUpperCase();if(n.includes("FREQ=DAILY"))return`Every day at ${s}`;if(n.includes("FREQ=WEEKLY")){let o=n.match(/BYDAY=(\w+)/);return o?`Every ${At[o[1]]??o[1]} at ${s}`:`Weekly at ${s}`}return e}_renderRepeatDisclosure(){return p`
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
        ${this._repeatOpen?p`
              <div class="repeat-body">
                <select
                  class="freq-select"
                  .value=${this._freq}
                  @change=${e=>{this._freq=e.target.value}}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                ${this._freq==="weekly"?p`
                      <div class="weekday-chips">
                        ${Ht.map(({code:e,label:i})=>p`
                            <button
                              type="button"
                              class="chip ${this._weekday===e?"selected":""}"
                              title=${At[e]??e}
                              @click=${()=>{this._weekday=e}}
                            >
                              ${i}
                            </button>
                          `)}
                      </div>
                    `:c}
              </div>
            `:c}
      </div>
    `}_renderTimeAddRow(){let e=!!this._editingUid;return p`
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
          ${e?p`<button
                type="button"
                class="btn btn-secondary"
                ?disabled=${this._busy}
                @click=${()=>this._cancelEdit()}
              >
                Cancel
              </button>`:c}
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this._busy}
            @click=${()=>this._add()}
          >
            ${e?"Save":"Add"}
          </button>
        </div>
        ${this._renderRepeatDisclosure()}
      </div>
    `}_renderLocationAddRow(){let e=!!this._editingUid;return p`
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
          ${e?p`<button type="button" class="btn btn-secondary" ?disabled=${this._busy} @click=${()=>this._cancelEdit()}>Cancel</button>`:c}
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this._busy}
            @click=${()=>this._addLocation()}
          >
            ${e?"Save":"Add"}
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
    `}_renderTimeItem(e){let i=!!e.rrule,s=i?this._formatRecurrence(e.rrule,e.start):this._formatTime(e.start);return p`
      <div class="item ${i?"recurring":""}">
        <ha-icon
          class="leading"
          icon=${i?"mdi:repeat":"mdi:alarm"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${s}</span>
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
    `}_renderLocationItem(e){let s=`${e.trigger==="enter"?"Entering":"Leaving"} ${this._entityName(e.zone)} \xB7 ${this._entityName(e.person)}`,n=e.deliveredAt?`Delivered ${this._formatTime(e.deliveredAt)} \xB7 ${s}`:e.persistent?`Repeating \xB7 ${s}`:s,o=e.persistent&&!e.deliveredAt;return p`
      <div class="item ${o?"persistent":""} ${e.deliveredAt?"delivered":""}">
        <ha-icon class="leading" icon=${o?"mdi:map-marker-path":"mdi:map-marker"}></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${n}</span>
        </div>
        ${e.deliveredAt?c:p`<ha-icon-button
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
    `}render(){let e=this._config.title??"BToddB Reminders",i=this._locationItems(),s=i.filter(a=>!a.deliveredAt),n=i.filter(a=>a.deliveredAt).sort((a,l)=>l.deliveredAt.getTime()-a.deliveredAt.getTime()),o=this._items.length+i.length;return p`
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

          ${this._error?p`<div class="error">${this._error}</div>`:c}

          ${o===0?p`<div class="empty">No reminders.</div>`:p`
                <div class="list">
                  ${this._items.map(a=>this._renderTimeItem(a))}
                  ${s.map(a=>this._renderLocationItem(a))}
                  ${n.map(a=>this._renderLocationItem(a))}
                </div>
              `}
        </div>
      </ha-card>
    `}};O.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_mode:{state:!0},_message:{state:!0},_when:{state:!0},_repeatOpen:{state:!0},_freq:{state:!0},_weekday:{state:!0},_locMessage:{state:!0},_locPerson:{state:!0},_locZone:{state:!0},_locTrigger:{state:!0},_locPersistent:{state:!0},_busy:{state:!0},_error:{state:!0},_editingUid:{state:!0}},O.styles=H`
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
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",O);var Nt="v0.0.38";console.info(`%c BTODDB-HA-REMINDERS %c ${Nt} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});
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
