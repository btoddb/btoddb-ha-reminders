var Y=globalThis,j=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),fe=new WeakMap,k=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(j&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=fe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&fe.set(e,t))}return t}toString(){return this.cssText}},ve=s=>new k(typeof s=="string"?s:s+"",void 0,G),b=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((i,r,n)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new k(e,s,G)},ye=(s,t)=>{if(j)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),r=Y.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},Q=j?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return ve(e)})(s):s;var{is:Ye,defineProperty:je,getOwnPropertyDescriptor:Ke,getOwnPropertyNames:qe,getOwnPropertySymbols:Be,getPrototypeOf:Ve}=Object,K=globalThis,$e=K.trustedTypes,Ze=$e?$e.emptyScript:"",Ge=K.reactiveElementPolyfillSupport,R=(s,t)=>s,J={toAttribute(s,t){switch(t){case Boolean:s=s?Ze:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},xe=(s,t)=>!Ye(s,t),be={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:xe};Symbol.metadata??=Symbol("metadata"),K.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&je(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){let{get:r,set:n}=Ke(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let d=r?.call(this);n?.call(this,a),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??be}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Ve(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,i=[...qe(e),...Be(e)];for(let r of i)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let r of i)e.unshift(Q(r))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ye(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:J).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let n=i.getPropertyOptions(r),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:J;this._$Em=r;let d=a.fromAttribute(e,n.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(t,e,i,r=!1,n){if(t!==void 0){let a=this.constructor;if(r===!1&&(n=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??xe)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:n},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),n!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,n]of i){let{wrapped:a}=n,d=this[r];a!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,n,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[R("elementProperties")]=new Map,v[R("finalized")]=new Map,Ge?.({ReactiveElement:v}),(K.reactiveElementVersions??=[]).push("2.1.2");var ne=globalThis,we=s=>s,q=ne.trustedTypes,Ee=q?q.createPolicy("lit-html",{createHTML:s=>s}):void 0,ke="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Re="?"+$,Qe=`<${Re}>`,E=document,L=()=>E.createComment(""),P=s=>s===null||typeof s!="object"&&typeof s!="function",ae=Array.isArray,Je=s=>ae(s)||typeof s?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ce=/-->/g,Ae=/>/g,x=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Te=/'/g,Se=/"/g,Me=/^(?:script|style|textarea|title)$/i,oe=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),c=oe(1),ft=oe(2),vt=oe(3),C=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),De=new WeakMap,w=E.createTreeWalker(E,129);function Le(s,t){if(!ae(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ee!==void 0?Ee.createHTML(t):t}var Xe=(s,t)=>{let e=s.length-1,i=[],r,n=t===2?"<svg>":t===3?"<math>":"",a=M;for(let d=0;d<e;d++){let o=s[d],h,m,p=-1,l=0;for(;l<o.length&&(a.lastIndex=l,m=a.exec(o),m!==null);)l=a.lastIndex,a===M?m[1]==="!--"?a=Ce:m[1]!==void 0?a=Ae:m[2]!==void 0?(Me.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=x):m[3]!==void 0&&(a=x):a===x?m[0]===">"?(a=r??M,p=-1):m[1]===void 0?p=-2:(p=a.lastIndex-m[2].length,h=m[1],a=m[3]===void 0?x:m[3]==='"'?Se:Te):a===Se||a===Te?a=x:a===Ce||a===Ae?a=M:(a=x,r=void 0);let g=a===x&&s[d+1].startsWith("/>")?" ":"";n+=a===M?o+Qe:p>=0?(i.push(h),o.slice(0,p)+ke+o.slice(p)+$+g):o+$+(p===-2?d:g)}return[Le(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},H=class s{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let n=0,a=0,d=t.length-1,o=this.parts,[h,m]=Xe(t,e);if(this.el=s.createElement(h,i),w.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=w.nextNode())!==null&&o.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(ke)){let l=m[a++],g=r.getAttribute(p).split($),y=/([.?@])?(.*)/.exec(l);o.push({type:1,index:n,name:y[2],strings:g,ctor:y[1]==="."?te:y[1]==="?"?ie:y[1]==="@"?re:T}),r.removeAttribute(p)}else p.startsWith($)&&(o.push({type:6,index:n}),r.removeAttribute(p));if(Me.test(r.tagName)){let p=r.textContent.split($),l=p.length-1;if(l>0){r.textContent=q?q.emptyScript:"";for(let g=0;g<l;g++)r.append(p[g],L()),w.nextNode(),o.push({type:2,index:++n});r.append(p[l],L())}}}else if(r.nodeType===8)if(r.data===Re)o.push({type:2,index:n});else{let p=-1;for(;(p=r.data.indexOf($,p+1))!==-1;)o.push({type:7,index:n}),p+=$.length-1}n++}}static createElement(t,e){let i=E.createElement("template");return i.innerHTML=t,i}};function A(s,t,e=s,i){if(t===C)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl,n=P(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=A(s,r._$AS(s,t.values),r,i)),t}var ee=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??E).importNode(e,!0);w.currentNode=r;let n=w.nextNode(),a=0,d=0,o=i[0];for(;o!==void 0;){if(a===o.index){let h;o.type===2?h=new N(n,n.nextSibling,this,t):o.type===1?h=new o.ctor(n,o.name,o.strings,this,t):o.type===6&&(h=new se(n,this,t)),this._$AV.push(h),o=i[++d]}a!==o?.index&&(n=w.nextNode(),a++)}return w.currentNode=E,r}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},N=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),P(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Je(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=H.createElement(Le(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let n=new ee(r,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=De.get(t.strings);return e===void 0&&De.set(t.strings,e=new H(t)),e}k(t){ae(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let n of t)r===e.length?e.push(i=new s(this.O(L()),this.O(L()),this,this.options)):i=e[r],i._$AI(n),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=we(t).nextSibling;we(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(t,e=this,i,r){let n=this.strings,a=!1;if(n===void 0)t=A(this,t,e,0),a=!P(t)||t!==this._$AH&&t!==C,a&&(this._$AH=t);else{let d=t,o,h;for(t=n[0],o=0;o<n.length-1;o++)h=A(this,d[i+o],e,o),h===C&&(h=this._$AH[o]),a||=!P(h)||h!==this._$AH[o],h===u?t=u:t!==u&&(t+=(h??"")+n[o+1]),this._$AH[o]=h}a&&!r&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},te=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},ie=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},re=class extends T{constructor(t,e,i,r,n){super(t,e,i,r,n),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??u)===C)return;let i=this._$AH,r=t===u&&i!==u||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==u&&(i===u||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},se=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var et=ne.litHtmlPolyfillSupport;et?.(H,N),(ne.litHtmlVersions??=[]).push("3.3.3");var Pe=(s,t,e)=>{let i=e?.renderBefore??t,r=i._$litPart$;if(r===void 0){let n=e?.renderBefore??null;i._$litPart$=r=new N(t.insertBefore(L(),n),n,void 0,e??{})}return r._$AI(s),r};var de=globalThis,_=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};_._$litElement$=!0,_.finalized=!0,de.litElementHydrateSupport?.({LitElement:_});var tt=de.litElementPolyfillSupport;tt?.({LitElement:_});(de.litElementVersions??=[]).push("4.2.2");var le="calendar.btoddb_reminders",B=14,ce="/calendar?view=dayGridMonth",he=365,He=6e4,Ne="btoddb-ha-reminders-reminders-changed";function V(s,t,e,i){let r=Number(s);return Number.isFinite(r)?Math.max(e,Math.min(i,Math.floor(r))):t}function U(s,t){return s===!0?"always":s===!1?"never":s==="always"||s==="never"||s==="auto"?s:t}function pe(s,t){return s===!0?"always":s===!1?"never":s==="always"||s==="never"||s==="auto"?s:t}function it(s){return typeof s!="string"?ce:s.trim()||ce}function rt(s){let[t,e,i]=s.split("-").map(Number);return new Date(t,e-1,i)}function Ie(s){if(!s)return null;if(s.dateTime){let t=new Date(s.dateTime);return Number.isNaN(t.getTime())?null:t}return s.date?rt(s.date):null}function f(s){return`${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`}function Oe(s){let t=new Date(s);return t.setHours(0,0,0,0),t}function Ue(s){let t=new Date(s);return t.setDate(t.getDate()+1),t}function ze(s){let t=new Date(s);return t.setDate(t.getDate()-1),t}function st(s,t){return s.getTime()>t.getTime()?s:t}function nt(s,t){return s.getTime()<t.getTime()?s:t}function at(s,t){return!t||t.getTime()<=s.getTime()?s:new Date(t.getTime()-1)}function ot(s){let t=new Set;return s.filter(e=>{let i=`${e.dedupeKey}|${f(e.displayDate)}`;return t.has(i)?!1:(t.add(i),!0)})}var I=class extends _{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e??{type:""}}_entities(){let e=this._config.entities;return e?e.map(i=>typeof i=="string"?i:i.entity).filter(i=>!!i):[le]}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_titleChanged(e){let i=e.target.value;this._fireConfigChanged({...this._config,title:i})}_dashboardPathChanged(e){let i=e.target.value.trim();this._fireConfigChanged({...this._config,dashboard_path:i||void 0})}_daysChanged(e){let i=V(e.target.value,B,1,he);this._fireConfigChanged({...this._config,days:i})}_maxItemsChanged(e){let i=V(e.target.value,0,0,500);this._fireConfigChanged({...this._config,max_items:i})}_hideEndTimeChanged(e){let i=U(e.target.value,"auto");this._fireConfigChanged({...this._config,hide_end_time:i})}_showCalendarNameChanged(e){let i=pe(e.target.value,"auto");this._fireConfigChanged({...this._config,show_calendar_name:i})}_entityChanged(e,i){let r=i.detail.value??"",n=this._entities();r?n[e]=r:e<n.length&&n.splice(e,1),this._fireConfigChanged({...this._config,entities:n})}_removeEntity(e){let i=this._entities();i.splice(e,1),this._fireConfigChanged({...this._config,entities:i})}render(){if(!this.hass||!this._config)return c``;let e=this._entities(),i=[...e,""],r=this._config.days??B,n=U(this._config.hide_end_time,"auto"),a=pe(this._config.show_calendar_name,"auto"),d=this._config.max_items??0;return c`
      <div class="card-config">
        <input
          class="field"
          type="text"
          placeholder="Title (optional)"
          .value=${this._config.title??""}
          @change=${this._titleChanged}
        />

        <label>
          <span>Dashboard path</span>
          <input
            class="field"
            type="text"
            placeholder=${ce}
            .value=${this._config.dashboard_path??""}
            @change=${this._dashboardPathChanged}
          />
        </label>

        <div class="entity-list">
          ${i.map((o,h)=>c`
              <div class="entity-row">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${o}
                  .label=${h<e.length?"Calendar":"Add calendar"}
                  .includeDomains=${["calendar"]}
                  @value-changed=${m=>this._entityChanged(h,m)}
                ></ha-entity-picker>
                ${h<e.length?c`
                      <ha-icon-button
                        .label=${"Remove calendar"}
                        @click=${()=>this._removeEntity(h)}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </ha-icon-button>
                    `:u}
              </div>
            `)}
        </div>

        <label>
          <span>Days</span>
          <input
            class="field"
            type="number"
            min="1"
            max=${he}
            .value=${String(r)}
            @change=${this._daysChanged}
          />
        </label>

        <label>
          <span>Hide end time</span>
          <select
            class="field"
            .value=${n}
            @change=${this._hideEndTimeChanged}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </label>

        <label>
          <span>Calendar name</span>
          <select
            class="field"
            .value=${a}
            @change=${this._showCalendarNameChanged}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </label>

        <label>
          <span>Max items</span>
          <input
            class="field"
            type="number"
            min="0"
            max="500"
            .value=${String(d)}
            @change=${this._maxItemsChanged}
          />
        </label>
      </div>
    `}};I.properties={hass:{attribute:!1},_config:{state:!0}},I.styles=b`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .entity-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .entity-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .entity-row ha-entity-picker {
      flex: 1 1 auto;
      min-width: 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      font-weight: 500;
    }
    .field,
    ha-entity-picker {
      width: 100%;
    }
    .field {
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
  `;customElements.define("btoddb-calendar-list-card-editor",I);var O=class extends _{constructor(){super(...arguments);this._config={type:""};this._entries=[];this._error="";this._loading=!1;this._lastSignature="";this._reminderRefreshTimers=[];this._handleRemindersChanged=e=>{let i=e.detail?.entity;i&&this._entities().some(({entity:r})=>r===i)&&this._scheduleReminderRefresh()}}static getConfigElement(){return document.createElement("btoddb-calendar-list-card-editor")}static getStubConfig(){return{entities:[le],days:B,hide_end_time:"auto"}}setConfig(e){this._config=e??{type:""},this._lastSignature="",this.hass&&this._fetch()}getCardSize(){return 2+Math.min(this._entries.length,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4),window.addEventListener(Ne,this._handleRemindersChanged)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer),window.removeEventListener(Ne,this._handleRemindersChanged),this._clearReminderRefreshTimers()}updated(e){if(!e.has("hass")||!this.hass)return;let i=this._entities().map(({entity:r})=>{let n=this.hass.states[r];return n?`${r}:${n.state}|${n.last_updated}`:`${r}:missing`}).join(";");i!==this._lastSignature&&(this._lastSignature=i,this._fetch())}_entities(){let e=this._config.entities;return(e===void 0?[le]:e).map(r=>typeof r=="string"?{entity:r}:{entity:r.entity,hide_end_time:r.hide_end_time===void 0?void 0:U(r.hide_end_time,"auto")}).filter(r=>!!r.entity)}_days(){return V(this._config.days,B,1,he)}_maxItems(){return V(this._config.max_items,0,0,500)}_globalHideEndTime(){return U(this._config.hide_end_time,"auto")}_showCalendarNameMode(){return pe(this._config.show_calendar_name,"auto")}_clearReminderRefreshTimers(){for(let e of this._reminderRefreshTimers)window.clearTimeout(e);this._reminderRefreshTimers=[]}_scheduleReminderRefresh(){this._clearReminderRefreshTimers();for(let e of[0,1e3,3e3])this._reminderRefreshTimers.push(window.setTimeout(()=>{this._fetch()},e))}async _fetch(){if(!this.hass)return;let e=this._entities();if(e.length===0){this._entries=[],this._error="No calendar entities configured. Edit the card to select one.";return}let i=e.filter(({entity:o})=>!this.hass.states[o]),r=e.filter(({entity:o})=>!!this.hass.states[o]);if(r.length===0){this._entries=[],this._error=i.map(({entity:o})=>`Entity ${o} not found.`).join(" ");return}let n=new Date;n.setHours(0,0,0,0);let a=new Date(n);a.setDate(n.getDate()+this._days());let d=Date.now()-He;this._loading=!0;try{let o=await Promise.all(r.map(async l=>{try{let g=await this.hass.callApi("GET",`calendars/${l.entity}?start=${encodeURIComponent(n.toISOString())}&end=${encodeURIComponent(a.toISOString())}`);return{entries:this._normalizeEvents(g??[],l,n,a),error:""}}catch(g){return{entries:[],error:`Could not load ${l.entity}: ${this._msg(g)}`}}})),h=o.flatMap(l=>l.entries).filter(l=>(l.end??l.start).getTime()>=d).sort((l,g)=>{let y=l.displayDate.getTime()-g.displayDate.getTime();if(f(l.displayDate)!==f(g.displayDate))return y;if(l.allDay!==g.allDay)return l.allDay?-1:1;let S=Math.max(l.start.getTime(),l.displayDate.getTime()),D=Math.max(g.start.getTime(),g.displayDate.getTime());return S!==D?S-D:l.summary.localeCompare(g.summary)});h=ot(h);let m=this._maxItems();m>0&&(h=h.slice(0,m));let p=[...i.map(({entity:l})=>`Entity ${l} not found.`),...o.map(l=>l.error).filter(Boolean)];this._entries=h,this._error=p.join(" ")}finally{this._loading=!1}}_normalizeEvents(e,i,r,n){let d=this.hass.states[i.entity]?.attributes?.friendly_name??i.entity;return e.flatMap((o,h)=>{let m=Ie(o.start);if(!m)return[];let p=Ie(o.end),l=o.uid??`${i.entity}-${m.toISOString()}-${o.summary??h}`,g=o.uid?`${i.entity}|uid:${o.uid}`:[i.entity,"event",o.summary||"(No title)",m.toISOString(),p?.toISOString()??""].join("|"),y={uid:l,dedupeKey:g,summary:o.summary||"(No title)",start:m,end:p,allDay:!!o.start.date,calendar:i.entity,calendarName:d,hideEndTime:i.hide_end_time===void 0?void 0:U(i.hide_end_time,"auto")},S=st(Oe(m),r),D=nt(Oe(at(m,p)),ze(n));if(S.getTime()>D.getTime())return[];let _e=[];for(let W=S;W.getTime()<=D.getTime();W=Ue(W))_e.push({...y,displayDate:W});return _e})}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTimeOnly(e){try{return e.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatDate(e){try{return e.toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return e.toLocaleDateString()}}_formatDateTime(e){try{return e.toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatDayHeader(e){let i=new Date;if(f(e)===f(i))return"Today";let r=Ue(i);if(f(e)===f(r))return"Tomorrow";try{return e.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}catch{return e.toLocaleDateString()}}_durationMs(e){return e.end?e.end.getTime()-e.start.getTime():0}_shouldHideEndTime(e){if(e.allDay)return!0;let i=e.hideEndTime??this._globalHideEndTime();return i==="always"?!0:i==="never"?!1:this._durationMs(e)<=He}_formatEntryTime(e){if(e.allDay){if(!e.end)return"All day";let i=ze(e.end);return f(i)===f(e.start)?"All day":`All day, ${this._formatDate(e.start)} - ${this._formatDate(i)}`}return!e.end||this._shouldHideEndTime(e)?this._formatTimeOnly(e.start):f(e.start)===f(e.end)?`${this._formatTimeOnly(e.start)} - ${this._formatTimeOnly(e.end)}`:`${this._formatDateTime(e.start)} - ${this._formatDateTime(e.end)}`}_shouldShowCalendarName(){let e=this._showCalendarNameMode();return e==="always"?!0:e==="never"?!1:this._entities().length>1}_openCalendarDashboard(){window.history.pushState(null,"",it(this._config.dashboard_path)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_handleCardKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),this._openCalendarDashboard())}_renderRows(){let e=[],i="";for(let r of this._entries){let n=f(r.displayDate);n!==i&&(e.push(c`<div class="day-header">${this._formatDayHeader(r.displayDate)}</div>`),i=n),e.push(this._renderEntry(r))}return e}_renderEntry(e){let i=this._shouldShowCalendarName();return c`
      <div class="item">
        <ha-icon
          class="leading"
          icon=${e.allDay?"mdi:calendar-blank":"mdi:calendar-clock"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${this._formatEntryTime(e)}</span>
          ${i?c`<span class="calendar-name">${e.calendarName}</span>`:u}
        </div>
      </div>
    `}render(){let e=this._config.title??"Agenda";return c`
      <ha-card
        .header=${e}
        role="button"
        tabindex="0"
        @click=${this._openCalendarDashboard}
        @keydown=${this._handleCardKeydown}
      >
        <div class="content">
          ${this._error?c`<div class="error">${this._error}</div>`:u}
          ${this._entries.length===0?c`<div class="empty">
                ${this._loading?"Loading events...":"No upcoming events."}
              </div>`:c`<div class="list">${this._renderRows()}</div>`}
        </div>
      </ha-card>
    `}};O.properties={hass:{attribute:!1},_config:{state:!0},_entries:{state:!0},_error:{state:!0},_loading:{state:!0}},O.styles=b`
    .content {
      padding: 0 16px 12px;
    }
    ha-card {
      cursor: pointer;
    }
    ha-card:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .error {
      margin: 12px 0 0;
      padding: 8px;
      border-radius: 4px;
      background: var(--error-color, #db4437);
      color: white;
      font-size: 13px;
    }
    .empty {
      padding: 18px 0 8px;
      color: var(--secondary-text-color, #727272);
      font-size: 14px;
    }
    .list {
      padding-top: 8px;
    }
    .day-header {
      padding: 14px 0 6px;
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .leading {
      flex: 0 0 auto;
      color: var(--primary-color, #03a9f4);
    }
    .text {
      min-width: 0;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .summary {
      overflow-wrap: anywhere;
      color: var(--primary-text-color, #212121);
      font-size: 14px;
      line-height: 1.3;
    }
    .time,
    .calendar-name {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
      line-height: 1.3;
    }
  `;customElements.define("btoddb-calendar-list-card",O);var dt="calendar.btoddb_reminders",lt="btoddb-ha-reminders-reminders-changed",ue="sensor.btoddb_location_reminders",Fe="btoddb_ha_reminders_location",ct=[{code:"SU",label:"S"},{code:"MO",label:"M"},{code:"TU",label:"T"},{code:"WE",label:"W"},{code:"TH",label:"T"},{code:"FR",label:"F"},{code:"SA",label:"S"}],We={MO:"Monday",TU:"Tuesday",WE:"Wednesday",TH:"Thursday",FR:"Friday",SA:"Saturday",SU:"Sunday"},ht={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6},Z=s=>String(s).padStart(2,"0");function ge(s){return`${s.getFullYear()}-${Z(s.getMonth()+1)}-${Z(s.getDate())}T${Z(s.getHours())}:${Z(s.getMinutes())}`}function me(){let s=new Date;return s.setHours(s.getHours()+1,0,0,0),ge(s)}var z=class extends _{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e}_titleChanged(e){let i=e.target.value;this._fireConfigChanged({...this._config,title:i})}_entityChanged(e){let i=e.detail.value;this._fireConfigChanged({...this._config,entity:i})}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?c``:c`
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
    `}};z.properties={hass:{attribute:!1},_config:{state:!0}},z.styles=b`
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
  `;customElements.define("btoddb-reminders-card-editor",z);var F=class extends _{constructor(){super(...arguments);this._config={type:""};this._items=[];this._mode="time";this._message="";this._when=me();this._repeatOpen=!1;this._freq="daily";this._weekday="MO";this._interval=1;this._locMessage="";this._locPerson="";this._locZone="";this._locTrigger="enter";this._locPersistent=!1;this._busy=!1;this._error="";this._editingUid="";this._entity=dt;this._lastSignature=""}static getConfigElement(){return document.createElement("btoddb-reminders-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config=e??{type:""},this._entity=e?.entity??""}getCardSize(){let e=this._locationItems().length;return 3+Math.min(this._items.length+e,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(e){if(!e.has("hass")||!this.hass)return;let i=this.hass.states[this._entity],r=i?`${i.state}|${i.last_updated}`:"missing";r!==this._lastSignature&&(this._lastSignature=r,this._fetch())}async _fetch(){if(!this.hass)return;if(!this._entity){this._error="No calendar entity configured. Edit the card to select one.",this._items=[];return}if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let e=new Date;e.setHours(0,0,0,0);let i=new Date;i.setFullYear(i.getFullYear()+1);try{let r=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(i.toISOString())}`),n=Date.now()-6e4,a=new Set;this._items=(r??[]).map(d=>({kind:"time",uid:d.uid??"",summary:d.summary,start:new Date(d.start.dateTime??d.start.date??""),rrule:d.description??""})).filter(d=>d.start.getTime()>=n||d.rrule!=="").sort((d,o)=>d.start.getTime()-o.start.getTime()).filter(d=>d.rrule?a.has(d.uid)?!1:(a.add(d.uid),!0):!0),this._error=""}catch(r){this._error=`Could not load reminders: ${this._msg(r)}`}}_buildRrule(){if(!this._repeatOpen)return"";let e=this._interval>1?`;INTERVAL=${this._interval}`:"";return this._freq==="daily"?`FREQ=DAILY${e}`:`FREQ=WEEKLY;BYDAY=${this._weekday}${e}`}_adjustToWeekday(e,i){let r=ht[i]??1,n=new Date(e),a=n.getDay(),d=(r-a+7)%7;return n.setDate(n.getDate()+d),ge(n)}_notifyTimeRemindersChanged(){window.dispatchEvent(new CustomEvent(lt,{detail:{entity:this._entity}}))}async _add(){let e=this._message.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}let i=this._editingUid,r=this._buildRrule(),n=this._when;r&&this._freq==="weekly"&&(n=this._adjustToWeekday(n,this._weekday));let a={message:e,when:n};r&&(a.rrule=r),i&&!r&&(a.rrule=null),this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update",{uid:i,...a},void 0,void 0,!0),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create",a,void 0,void 0,!0),this._message="",this._when=me(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._interval=1,await this._fetch(),this._notifyTimeRemindersChanged()}catch(d){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(d)}`}finally{this._busy=!1}}async _delete(e){if(e)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:e}),this._items=this._items.filter(i=>i.uid!==e),this._notifyTimeRemindersChanged()}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}async _addLocation(){let e=this._locMessage.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._locPerson){this._error="Pick a person to track.";return}if(!this._locZone){this._error="Pick a zone.";return}let i=this._editingUid;this._busy=!0,this._error="";try{i?(await this.hass.callService("btoddb_ha_reminders","update_location",{uid:i,message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create_location",{message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1}catch(r){this._error=`Could not ${i?"update":"create"} reminder: ${this._msg(r)}`}finally{this._busy=!1}}_startEditTime(e){if(this._editingUid=e.uid,this._mode="time",this._message=e.summary,this._when=ge(e.start),e.rrule){this._repeatOpen=!0;let i=e.rrule.toUpperCase(),r=i.match(/INTERVAL=(\d+)/);if(this._interval=r?parseInt(r[1],10):1,i.includes("FREQ=WEEKLY")){this._freq="weekly";let n=i.match(/BYDAY=(\w+)/);this._weekday=n?n[1]:"MO"}else this._freq="daily",this._weekday="MO"}else this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._interval=1;this._error=""}_startEditLocation(e){this._editingUid=e.uid,this._mode="location",this._locMessage=e.summary,this._locPerson=e.person,this._locZone=e.zone,this._locTrigger=e.trigger,this._locPersistent=e.persistent,this._error=""}_cancelEdit(){this._editingUid="",this._message="",this._when=me(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._interval=1,this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1,this._error=""}async _deleteLocation(e){if(e)try{await this.hass.callService("btoddb_ha_reminders","delete_location",{uid:e})}catch(i){this._error=`Could not delete reminder: ${this._msg(i)}`}}_locationSensorId(){let e=this.hass?.states??{};if(e[ue]?.attributes?.[Fe])return ue;for(let[i,r]of Object.entries(e))if(i.startsWith("sensor.")&&r.attributes?.[Fe])return i;return ue}_locationItems(){return(this.hass?.states[this._locationSensorId()]?.attributes?.reminders??[]).map(r=>({kind:"location",uid:r.uid,summary:r.summary,person:r.person,zone:r.zone,trigger:r.trigger,persistent:r.persistent??!1,deliveredAt:r.delivered_at?new Date(r.delivered_at):null}))}_entityName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTime(e){try{return e.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatTimeOnly(e){try{return e.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_dayKey(e){return`${e.getFullYear()}-${e.getMonth()}-${e.getDate()}`}_formatDayHeader(e){let i=new Date;if(this._dayKey(e)===this._dayKey(i))return"Today";let r=new Date(i);if(r.setDate(i.getDate()+1),this._dayKey(e)===this._dayKey(r))return"Tomorrow";try{return e.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}catch{return e.toLocaleDateString()}}_renderDayHeader(e){return c`<div class="day-header">${this._formatDayHeader(e)}</div>`}_intervalPrefix(e){let i=e.match(/INTERVAL=(\d+)/),r=i?parseInt(i[1],10):1;if(r<=1)return"Every";if(r===2)return"Every other";let n=r%100>=11&&r%100<=13?"th":{1:"st",2:"nd",3:"rd"}[r%10]??"th";return`Every ${r}${n}`}_formatRecurrence(e,i){let r=i.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"}),n=e.toUpperCase(),a=this._intervalPrefix(n);if(n.includes("FREQ=DAILY"))return`${a} day at ${r}`;if(n.includes("FREQ=WEEKLY")){let d=n.match(/BYDAY=(\w+)/);if(d){let o=We[d[1]]??d[1];return`${a} ${o} at ${r}`}return`${a==="Every"?"Weekly":`${a} week`} at ${r}`}return e}_renderRepeatDisclosure(){return c`
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
        ${this._repeatOpen?c`
              <div class="repeat-body">
                <select
                  class="freq-select"
                  .value=${this._freq}
                  @change=${e=>{this._freq=e.target.value}}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <span class="interval-label">every</span>
                <input
                  class="interval-input"
                  type="number"
                  min="1"
                  .value=${String(this._interval)}
                  @input=${e=>{let i=parseInt(e.target.value,10);this._interval=Number.isFinite(i)&&i>=1?i:1}}
                />
                <span class="interval-label"
                  >${this._freq==="daily"?"day(s)":"week(s)"}</span
                >
                ${this._freq==="weekly"?c`
                      <div class="weekday-chips">
                        ${ct.map(({code:e,label:i})=>c`
                            <button
                              type="button"
                              class="chip ${this._weekday===e?"selected":""}"
                              title=${We[e]??e}
                              @click=${()=>{this._weekday=e}}
                            >
                              ${i}
                            </button>
                          `)}
                      </div>
                    `:u}
              </div>
            `:u}
      </div>
    `}_renderTimeAddRow(){let e=!!this._editingUid;return c`
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
          ${e?c`<button
                type="button"
                class="btn btn-secondary"
                ?disabled=${this._busy}
                @click=${()=>this._cancelEdit()}
              >
                Cancel
              </button>`:u}
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
    `}_renderLocationAddRow(){let e=!!this._editingUid;return c`
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
          ${e?c`<button type="button" class="btn btn-secondary" ?disabled=${this._busy} @click=${()=>this._cancelEdit()}>Cancel</button>`:u}
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
    `}_renderTimeRows(){let e=[],i="";for(let r of this._items){let n=this._dayKey(r.start),a=n!==i;a&&(e.push(this._renderDayHeader(r.start)),i=n),e.push(this._renderTimeItem(r,a))}return e}_renderTimeItem(e,i=!1){let r=!!e.rrule,n=r?this._formatRecurrence(e.rrule,e.start):this._formatTimeOnly(e.start);return c`
      <div class="item ${r?"recurring":""} ${i?"day-first":""}">
        <ha-icon
          class="leading"
          icon=${r?"mdi:repeat":"mdi:alarm"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${n}</span>
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
    `}_renderSectionDivider(){return c`
      <div class="section-divider">
        <ha-icon icon="mdi:map-marker"></ha-icon>
        <span>Location</span>
      </div>
    `}_renderLocationItem(e,i=!1){let n=`${e.trigger==="enter"?"Entering":"Leaving"} ${this._entityName(e.zone)} \xB7 ${this._entityName(e.person)}`,a=e.deliveredAt?`Delivered ${this._formatTime(e.deliveredAt)} \xB7 ${n}`:e.persistent?`Repeating \xB7 ${n}`:n,d=e.persistent&&!e.deliveredAt;return c`
      <div class="item ${d?"persistent":""} ${e.deliveredAt?"delivered":""} ${i?"section-first":""}">
        <ha-icon class="leading" icon=${d?"mdi:map-marker-path":"mdi:map-marker"}></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${a}</span>
        </div>
        ${e.deliveredAt?u:c`<ha-icon-button
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
    `}render(){let e=this._config.title??"BToddB Reminders",i=this._locationItems(),r=i.filter(d=>!d.deliveredAt),n=i.filter(d=>d.deliveredAt).sort((d,o)=>o.deliveredAt.getTime()-d.deliveredAt.getTime()),a=this._items.length+i.length;return c`
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

          ${this._error?c`<div class="error">${this._error}</div>`:u}

          ${a===0?c`<div class="empty">No reminders.</div>`:c`
                <div class="list">
                  ${this._renderTimeRows()}
                  ${i.length&&this._items.length?this._renderSectionDivider():u}
                  ${[...r,...n].map((d,o)=>this._renderLocationItem(d,this._items.length>0&&o===0))}
                </div>
              `}
        </div>
      </ha-card>
    `}};F.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_mode:{state:!0},_message:{state:!0},_when:{state:!0},_repeatOpen:{state:!0},_freq:{state:!0},_weekday:{state:!0},_interval:{state:!0},_locMessage:{state:!0},_locPerson:{state:!0},_locZone:{state:!0},_locTrigger:{state:!0},_locPersistent:{state:!0},_busy:{state:!0},_error:{state:!0},_editingUid:{state:!0}},F.styles=b`
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
    .item.section-first {
      border-top: none;
    }
    /* Bold divider between the time and location reminder groups. */
    .section-divider {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--secondary-text-color, #727272);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 10px 0 4px;
      margin-top: 8px;
      border-top: 3px double var(--divider-color, #e0e0e0);
    }
    .section-divider ha-icon {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--secondary-text-color, #727272);
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
    .interval-input {
      width: 48px;
      height: 36px;
      padding: 0 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      color-scheme: light dark;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
    .interval-label {
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
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
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",F);var pt="v0.0.61";console.info(`%c BTODDB-HA-REMINDERS %c ${pt} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});window.customCards.push({type:"btoddb-calendar-list-card",name:"BToddB Calendar List",description:"Show calendars and reminders as a compact agenda.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
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
