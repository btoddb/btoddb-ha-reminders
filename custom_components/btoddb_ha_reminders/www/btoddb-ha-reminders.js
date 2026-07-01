var j=globalThis,q=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),ye=new WeakMap,k=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(q&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=ye.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&ye.set(e,i))}return i}toString(){return this.cssText}},ve=s=>new k(typeof s=="string"?s:s+"",void 0,J),$=(s,...i)=>{let e=s.length===1?s[0]:i.reduce((t,r,n)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new k(e,s,J)},be=(s,i)=>{if(q)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),r=j.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,s.appendChild(t)}},X=q?s=>s:s=>s instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return ve(e)})(s):s;var{is:qe,defineProperty:Be,getOwnPropertyDescriptor:Ke,getOwnPropertyNames:Ve,getOwnPropertySymbols:Ze,getPrototypeOf:Qe}=Object,B=globalThis,$e=B.trustedTypes,Ge=$e?$e.emptyScript:"",Je=B.reactiveElementPolyfillSupport,M=(s,i)=>s,ee={toAttribute(s,i){switch(i){case Boolean:s=s?Ge:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,i){let e=s;switch(i){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},xe=(s,i)=>!qe(s,i),we={attribute:!0,type:String,converter:ee,reflect:!1,useDefault:!1,hasChanged:xe};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=we){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(i,t,e);r!==void 0&&Be(this.prototype,i,r)}}static getPropertyDescriptor(i,e,t){let{get:r,set:n}=Ke(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let d=r?.call(this);n?.call(this,a),this.requestUpdate(i,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??we}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let i=Qe(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let e=this.properties,t=[...Ve(e),...Ze(e)];for(let r of t)this.createProperty(r,e[r])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let r of t)e.unshift(X(r))}else i!==void 0&&e.push(X(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return be(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),r=this.constructor._$Eu(i,t);if(r!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:ee).toAttribute(e,t.type);this._$Em=i,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(i,e){let t=this.constructor,r=t._$Eh.get(i);if(r!==void 0&&this._$Em!==r){let n=t.getPropertyOptions(r),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ee;this._$Em=r;let d=a.fromAttribute(e,n.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(i,e,t,r=!1,n){if(i!==void 0){let a=this.constructor;if(r===!1&&(n=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??xe)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:r,wrapped:n},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),n!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),r===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,n]of t){let{wrapped:a}=n,d=this[r];a!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,n,d)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[M("elementProperties")]=new Map,y[M("finalized")]=new Map,Je?.({ReactiveElement:y}),(B.reactiveElementVersions??=[]).push("2.1.2");var oe=globalThis,Ee=s=>s,K=oe.trustedTypes,Ce=K?K.createPolicy("lit-html",{createHTML:s=>s}):void 0,Me="$lit$",b=`lit$${Math.random().toFixed(9).slice(2)}$`,Re="?"+b,Xe=`<${Re}>`,E=document,O=()=>E.createComment(""),H=s=>s===null||typeof s!="object"&&typeof s!="function",de=Array.isArray,et=s=>de(s)||typeof s?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Te=/-->/g,De=/>/g,w=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Se=/'/g,Ae=/"/g,Oe=/^(?:script|style|textarea|title)$/i,le=s=>(i,...e)=>({_$litType$:s,strings:i,values:e}),c=le(1),ft=le(2),yt=le(3),C=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),ke=new WeakMap,x=E.createTreeWalker(E,129);function He(s,i){if(!de(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ce!==void 0?Ce.createHTML(i):i}var tt=(s,i)=>{let e=s.length-1,t=[],r,n=i===2?"<svg>":i===3?"<math>":"",a=R;for(let d=0;d<e;d++){let o=s[d],l,m,h=-1,p=0;for(;p<o.length&&(a.lastIndex=p,m=a.exec(o),m!==null);)p=a.lastIndex,a===R?m[1]==="!--"?a=Te:m[1]!==void 0?a=De:m[2]!==void 0?(Oe.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=w):m[3]!==void 0&&(a=w):a===w?m[0]===">"?(a=r??R,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,l=m[1],a=m[3]===void 0?w:m[3]==='"'?Ae:Se):a===Ae||a===Se?a=w:a===Te||a===De?a=R:(a=w,r=void 0);let g=a===w&&s[d+1].startsWith("/>")?" ":"";n+=a===R?o+Xe:h>=0?(t.push(l),o.slice(0,h)+Me+o.slice(h)+b+g):o+b+(h===-2?d:g)}return[He(s,n+(s[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},L=class s{constructor({strings:i,_$litType$:e},t){let r;this.parts=[];let n=0,a=0,d=i.length-1,o=this.parts,[l,m]=tt(i,e);if(this.el=s.createElement(l,t),x.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=x.nextNode())!==null&&o.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(Me)){let p=m[a++],g=r.getAttribute(h).split(b),v=/([.?@])?(.*)/.exec(p);o.push({type:1,index:n,name:v[2],strings:g,ctor:v[1]==="."?re:v[1]==="?"?se:v[1]==="@"?ne:D}),r.removeAttribute(h)}else h.startsWith(b)&&(o.push({type:6,index:n}),r.removeAttribute(h));if(Oe.test(r.tagName)){let h=r.textContent.split(b),p=h.length-1;if(p>0){r.textContent=K?K.emptyScript:"";for(let g=0;g<p;g++)r.append(h[g],O()),x.nextNode(),o.push({type:2,index:++n});r.append(h[p],O())}}}else if(r.nodeType===8)if(r.data===Re)o.push({type:2,index:n});else{let h=-1;for(;(h=r.data.indexOf(b,h+1))!==-1;)o.push({type:7,index:n}),h+=b.length-1}n++}}static createElement(i,e){let t=E.createElement("template");return t.innerHTML=i,t}};function T(s,i,e=s,t){if(i===C)return i;let r=t!==void 0?e._$Co?.[t]:e._$Cl,n=H(i)?void 0:i._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(i=T(s,r._$AS(s,i.values),r,t)),i}var ie=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,r=(i?.creationScope??E).importNode(e,!0);x.currentNode=r;let n=x.nextNode(),a=0,d=0,o=t[0];for(;o!==void 0;){if(a===o.index){let l;o.type===2?l=new N(n,n.nextSibling,this,i):o.type===1?l=new o.ctor(n,o.name,o.strings,this,i):o.type===6&&(l=new ae(n,this,i)),this._$AV.push(l),o=t[++d]}a!==o?.index&&(n=x.nextNode(),a++)}return x.currentNode=E,r}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},N=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,r){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=T(this,i,e),H(i)?i===u||i==null||i===""?(this._$AH!==u&&this._$AR(),this._$AH=u):i!==this._$AH&&i!==C&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):et(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==u&&H(this._$AH)?this._$AA.nextSibling.data=i:this.T(E.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,r=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=L.createElement(He(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let n=new ie(r,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(i){let e=ke.get(i.strings);return e===void 0&&ke.set(i.strings,e=new L(i)),e}k(i){de(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let n of i)r===e.length?e.push(t=new s(this.O(O()),this.O(O()),this,this.options)):t=e[r],t._$AI(n),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=Ee(i).nextSibling;Ee(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,r,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=i,this.name=e,this._$AM=r,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=u}_$AI(i,e=this,t,r){let n=this.strings,a=!1;if(n===void 0)i=T(this,i,e,0),a=!H(i)||i!==this._$AH&&i!==C,a&&(this._$AH=i);else{let d=i,o,l;for(i=n[0],o=0;o<n.length-1;o++)l=T(this,d[t+o],e,o),l===C&&(l=this._$AH[o]),a||=!H(l)||l!==this._$AH[o],l===u?i=u:i!==u&&(i+=(l??"")+n[o+1]),this._$AH[o]=l}a&&!r&&this.j(i)}j(i){i===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},re=class extends D{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===u?void 0:i}},se=class extends D{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==u)}},ne=class extends D{constructor(i,e,t,r,n){super(i,e,t,r,n),this.type=5}_$AI(i,e=this){if((i=T(this,i,e,0)??u)===C)return;let t=this._$AH,r=i===u&&t!==u||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,n=i!==u&&(t===u||r);r&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},ae=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){T(this,i)}};var it=oe.litHtmlPolyfillSupport;it?.(L,N),(oe.litHtmlVersions??=[]).push("3.3.3");var Le=(s,i,e)=>{let t=e?.renderBefore??i,r=t._$litPart$;if(r===void 0){let n=e?.renderBefore??null;t._$litPart$=r=new N(i.insertBefore(O(),n),n,void 0,e??{})}return r._$AI(s),r};var ce=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Le(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};_._$litElement$=!0,_.finalized=!0,ce.litElementHydrateSupport?.({LitElement:_});var rt=ce.litElementPolyfillSupport;rt?.({LitElement:_});(ce.litElementVersions??=[]).push("4.2.2");var he="calendar.btoddb_reminders",V=14,pe="/calendar?view=dayGridMonth",ue=365,Ne=6e4,Pe="btoddb-ha-reminders-reminders-changed";function Z(s,i,e,t){let r=Number(s);return Number.isFinite(r)?Math.max(e,Math.min(t,Math.floor(r))):i}function U(s,i){return s===!0?"always":s===!1?"never":s==="always"||s==="never"||s==="auto"?s:i}function me(s,i){return s===!0?"always":s===!1?"never":s==="always"||s==="never"||s==="auto"?s:i}function st(s){return typeof s!="string"?pe:s.trim()||pe}function nt(s){let[i,e,t]=s.split("-").map(Number);return new Date(i,e-1,t)}function Ie(s){if(!s)return null;if(s.dateTime){let i=new Date(s.dateTime);return Number.isNaN(i.getTime())?null:i}return s.date?nt(s.date):null}function f(s){return`${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`}function Ue(s){let i=new Date(s);return i.setHours(0,0,0,0),i}function ze(s){let i=new Date(s);return i.setDate(i.getDate()+1),i}function We(s){let i=new Date(s);return i.setDate(i.getDate()-1),i}function at(s,i){return s.getTime()>i.getTime()?s:i}function ot(s,i){return s.getTime()<i.getTime()?s:i}function dt(s,i){return!i||i.getTime()<=s.getTime()?s:new Date(i.getTime()-1)}function lt(s){let i=new Set;return s.filter(e=>{let t=`${e.dedupeKey}|${f(e.displayDate)}`;return i.has(t)?!1:(i.add(t),!0)})}var P=class extends _{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e??{type:""}}_entities(){let e=this._config.entities;return e?e.map(t=>typeof t=="string"?t:t.entity).filter(t=>!!t):[he]}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_titleChanged(e){let t=e.target.value;this._fireConfigChanged({...this._config,title:t})}_dashboardPathChanged(e){let t=e.target.value.trim();this._fireConfigChanged({...this._config,dashboard_path:t||void 0})}_daysChanged(e){let t=Z(e.target.value,V,1,ue);this._fireConfigChanged({...this._config,days:t})}_maxItemsChanged(e){let t=Z(e.target.value,0,0,500);this._fireConfigChanged({...this._config,max_items:t})}_hideEndTimeChanged(e){let t=U(e.target.value,"auto");this._fireConfigChanged({...this._config,hide_end_time:t})}_showCalendarNameChanged(e){let t=me(e.target.value,"auto");this._fireConfigChanged({...this._config,show_calendar_name:t})}_entityChanged(e,t){let r=t.detail.value??"",n=this._entities();r?n[e]=r:e<n.length&&n.splice(e,1),this._fireConfigChanged({...this._config,entities:n})}_removeEntity(e){let t=this._entities();t.splice(e,1),this._fireConfigChanged({...this._config,entities:t})}render(){if(!this.hass||!this._config)return c``;let e=this._entities(),t=[...e,""],r=this._config.days??V,n=U(this._config.hide_end_time,"auto"),a=me(this._config.show_calendar_name,"auto"),d=this._config.max_items??0;return c`
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
            placeholder=${pe}
            .value=${this._config.dashboard_path??""}
            @change=${this._dashboardPathChanged}
          />
        </label>

        <div class="entity-list">
          ${t.map((o,l)=>c`
              <div class="entity-row">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${o}
                  .label=${l<e.length?"Calendar":"Add calendar"}
                  .includeDomains=${["calendar"]}
                  @value-changed=${m=>this._entityChanged(l,m)}
                ></ha-entity-picker>
                ${l<e.length?c`
                      <ha-icon-button
                        .label=${"Remove calendar"}
                        @click=${()=>this._removeEntity(l)}
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
            max=${ue}
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
    `}};P.properties={hass:{attribute:!1},_config:{state:!0}},P.styles=$`
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
  `;customElements.define("btoddb-calendar-list-card-editor",P);var I=class extends _{constructor(){super(...arguments);this._config={type:""};this._entries=[];this._error="";this._loading=!1;this._lastSignature="";this._reminderRefreshTimers=[];this._handleRemindersChanged=e=>{let t=e.detail?.entity;t&&this._entities().some(({entity:r})=>r===t)&&this._scheduleReminderRefresh()}}static getConfigElement(){return document.createElement("btoddb-calendar-list-card-editor")}static getStubConfig(){return{entities:[he],days:V,hide_end_time:"auto"}}setConfig(e){this._config=e??{type:""},this._lastSignature="",this.hass&&this._fetch()}getCardSize(){return 2+Math.min(this._entries.length,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4),window.addEventListener(Pe,this._handleRemindersChanged)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer),window.removeEventListener(Pe,this._handleRemindersChanged),this._clearReminderRefreshTimers()}updated(e){if(!e.has("hass")||!this.hass)return;let t=this._entities().map(({entity:r})=>{let n=this.hass.states[r];return n?`${r}:${n.state}|${n.last_updated}`:`${r}:missing`}).join(";");t!==this._lastSignature&&(this._lastSignature=t,this._fetch())}_entities(){let e=this._config.entities;return(e===void 0?[he]:e).map(r=>typeof r=="string"?{entity:r}:{entity:r.entity,hide_end_time:r.hide_end_time===void 0?void 0:U(r.hide_end_time,"auto")}).filter(r=>!!r.entity)}_days(){return Z(this._config.days,V,1,ue)}_maxItems(){return Z(this._config.max_items,0,0,500)}_globalHideEndTime(){return U(this._config.hide_end_time,"auto")}_showCalendarNameMode(){return me(this._config.show_calendar_name,"auto")}_clearReminderRefreshTimers(){for(let e of this._reminderRefreshTimers)window.clearTimeout(e);this._reminderRefreshTimers=[]}_scheduleReminderRefresh(){this._clearReminderRefreshTimers();for(let e of[0,1e3,3e3])this._reminderRefreshTimers.push(window.setTimeout(()=>{this._fetch()},e))}async _fetch(){if(!this.hass)return;let e=this._entities();if(e.length===0){this._entries=[],this._error="No calendar entities configured. Edit the card to select one.";return}let t=e.filter(({entity:o})=>!this.hass.states[o]),r=e.filter(({entity:o})=>!!this.hass.states[o]);if(r.length===0){this._entries=[],this._error=t.map(({entity:o})=>`Entity ${o} not found.`).join(" ");return}let n=new Date;n.setHours(0,0,0,0);let a=new Date(n);a.setDate(n.getDate()+this._days());let d=Date.now()-Ne;this._loading=!0;try{let o=await Promise.all(r.map(async p=>{try{let g=await this.hass.callApi("GET",`calendars/${p.entity}?start=${encodeURIComponent(n.toISOString())}&end=${encodeURIComponent(a.toISOString())}`);return{entries:this._normalizeEvents(g??[],p,n,a),error:""}}catch(g){return{entries:[],error:`Could not load ${p.entity}: ${this._msg(g)}`}}})),l=o.flatMap(p=>p.entries).filter(p=>(p.end??p.start).getTime()>=d).sort((p,g)=>{let v=p.displayDate.getTime()-g.displayDate.getTime();if(f(p.displayDate)!==f(g.displayDate))return v;if(p.allDay!==g.allDay)return p.allDay?-1:1;let S=Math.max(p.start.getTime(),p.displayDate.getTime()),A=Math.max(g.start.getTime(),g.displayDate.getTime());return S!==A?S-A:p.summary.localeCompare(g.summary)});l=lt(l);let m=this._maxItems();m>0&&(l=l.slice(0,m));let h=[...t.map(({entity:p})=>`Entity ${p} not found.`),...o.map(p=>p.error).filter(Boolean)];this._entries=l,this._error=h.join(" ")}finally{this._loading=!1}}_normalizeEvents(e,t,r,n){let d=this.hass.states[t.entity]?.attributes?.friendly_name??t.entity;return e.flatMap((o,l)=>{let m=Ie(o.start);if(!m)return[];let h=Ie(o.end),p=o.uid??`${t.entity}-${m.toISOString()}-${o.summary??l}`,g=o.uid?`${t.entity}|uid:${o.uid}`:[t.entity,"event",o.summary||"(No title)",m.toISOString(),h?.toISOString()??""].join("|"),v={uid:p,dedupeKey:g,summary:o.summary||"(No title)",start:m,end:h,allDay:!!o.start.date,calendar:t.entity,calendarName:d,hideEndTime:t.hide_end_time===void 0?void 0:U(t.hide_end_time,"auto")},S=at(Ue(m),r),A=ot(Ue(dt(m,h)),We(n));if(S.getTime()>A.getTime())return[];let fe=[];for(let F=S;F.getTime()<=A.getTime();F=ze(F))fe.push({...v,displayDate:F});return fe})}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTimeOnly(e){try{return e.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatDate(e){try{return e.toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return e.toLocaleDateString()}}_formatDateTime(e){try{return e.toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatDayHeader(e){let t=new Date;if(f(e)===f(t))return"Today";let r=ze(t);if(f(e)===f(r))return"Tomorrow";try{return e.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}catch{return e.toLocaleDateString()}}_durationMs(e){return e.end?e.end.getTime()-e.start.getTime():0}_shouldHideEndTime(e){if(e.allDay)return!0;let t=e.hideEndTime??this._globalHideEndTime();return t==="always"?!0:t==="never"?!1:this._durationMs(e)<=Ne}_formatEntryTime(e){if(e.allDay){if(!e.end)return"All day";let t=We(e.end);return f(t)===f(e.start)?"All day":`All day, ${this._formatDate(e.start)} - ${this._formatDate(t)}`}return!e.end||this._shouldHideEndTime(e)?this._formatTimeOnly(e.start):f(e.start)===f(e.end)?`${this._formatTimeOnly(e.start)} - ${this._formatTimeOnly(e.end)}`:`${this._formatDateTime(e.start)} - ${this._formatDateTime(e.end)}`}_shouldShowCalendarName(){let e=this._showCalendarNameMode();return e==="always"?!0:e==="never"?!1:this._entities().length>1}_openCalendarDashboard(){window.history.pushState(null,"",st(this._config.dashboard_path)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_handleCardKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),this._openCalendarDashboard())}_renderRows(){let e=[],t="";for(let r of this._entries){let n=f(r.displayDate);n!==t&&(e.push(c`<div class="day-header">${this._formatDayHeader(r.displayDate)}</div>`),t=n),e.push(this._renderEntry(r))}return e}_renderEntry(e){let t=this._shouldShowCalendarName();return c`
      <div class="item">
        <ha-icon
          class="leading"
          icon=${e.allDay?"mdi:calendar-blank":"mdi:calendar-clock"}
        ></ha-icon>
        <div class="text">
          <span class="summary">${e.summary}</span>
          <span class="time">${this._formatEntryTime(e)}</span>
          ${t?c`<span class="calendar-name">${e.calendarName}</span>`:u}
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
    `}};I.properties={hass:{attribute:!1},_config:{state:!0},_entries:{state:!0},_error:{state:!0},_loading:{state:!0}},I.styles=$`
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
  `;customElements.define("btoddb-calendar-list-card",I);var ct="calendar.btoddb_reminders",ht="btoddb-ha-reminders-reminders-changed",ge="sensor.btoddb_location_reminders",Ye="btoddb_ha_reminders_location",Fe=[{code:"SU",label:"S"},{code:"MO",label:"M"},{code:"TU",label:"T"},{code:"WE",label:"W"},{code:"TH",label:"T"},{code:"FR",label:"F"},{code:"SA",label:"S"}],Q={MO:"Monday",TU:"Tuesday",WE:"Wednesday",TH:"Thursday",FR:"Friday",SA:"Saturday",SU:"Sunday"},je={SU:0,MO:1,TU:2,WE:3,TH:4,FR:5,SA:6},G=s=>String(s).padStart(2,"0");function z(s){return`${s.getFullYear()}-${G(s.getMonth()+1)}-${G(s.getDate())}T${G(s.getHours())}:${G(s.getMinutes())}`}function _e(){let s=new Date;return s.setHours(s.getHours()+1,0,0,0),z(s)}var W=class extends _{constructor(){super(...arguments);this._config={type:""}}setConfig(e){this._config=e}_titleChanged(e){let t=e.target.value;this._fireConfigChanged({...this._config,title:t})}_entityChanged(e){let t=e.detail.value;this._fireConfigChanged({...this._config,entity:t})}_fireConfigChanged(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?c``:c`
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
    `}};W.properties={hass:{attribute:!1},_config:{state:!0}},W.styles=$`
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
  `;customElements.define("btoddb-reminders-card-editor",W);var Y=class extends _{constructor(){super(...arguments);this._config={type:""};this._items=[];this._mode="time";this._message="";this._when=_e();this._repeatOpen=!1;this._freq="daily";this._weekday="MO";this._interval=1;this._monthMode="day";this._monthDay=1;this._monthOrdinal="1";this._monthWeekday="MO";this._locMessage="";this._locPerson="";this._locZone="";this._locTrigger="enter";this._locPersistent=!1;this._busy=!1;this._error="";this._editingUid="";this._timeCollapsed=!1;this._locationCollapsed=!1;this._entity=ct;this._lastSignature=""}static getConfigElement(){return document.createElement("btoddb-reminders-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config=e??{type:""},this._entity=e?.entity??""}getCardSize(){let e=this._locationItems().length,t=this._items.length?this._timeCollapsed?1:this._items.length:0,r=e?this._locationCollapsed?1:e:0;return 3+Math.min(t+r,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(e){if(!e.has("hass")||!this.hass)return;let t=this.hass.states[this._entity],r=t?`${t.state}|${t.last_updated}`:"missing";r!==this._lastSignature&&(this._lastSignature=r,this._fetch())}async _fetch(){if(!this.hass)return;if(!this._entity){this._error="No calendar entity configured. Edit the card to select one.",this._items=[];return}if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let e=new Date;e.setHours(0,0,0,0);let t=new Date;t.setFullYear(t.getFullYear()+1);try{let r=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(t.toISOString())}`),n=Date.now()-6e4,a=new Set;this._items=(r??[]).map(d=>({kind:"time",uid:d.uid??"",summary:d.summary,start:new Date(d.start.dateTime??d.start.date??""),rrule:d.description??""})).filter(d=>d.start.getTime()>=n||d.rrule!=="").sort((d,o)=>d.start.getTime()-o.start.getTime()).filter(d=>d.rrule?a.has(d.uid)?!1:(a.add(d.uid),!0):!0),this._error=""}catch(r){this._error=`Could not load reminders: ${this._msg(r)}`}}_buildRrule(){if(!this._repeatOpen)return"";let e=this._interval>1?`;INTERVAL=${this._interval}`:"";return this._freq==="daily"?`FREQ=DAILY${e}`:this._freq==="weekly"?`FREQ=WEEKLY;BYDAY=${this._weekday}${e}`:this._monthMode==="weekday"?`FREQ=MONTHLY;BYDAY=${this._monthOrdinal}${this._monthWeekday}${e}`:`FREQ=MONTHLY;BYMONTHDAY=${this._monthDay===-1?"-1":String(this._monthDay)}${e}`}_adjustToMonthWeekday(e,t,r){let n=new Date(e),a=je[r]??1,d=new Date(n.getFullYear(),n.getMonth()+1,0).getDate(),o=1;if(t==="-1"){for(let l=d;l>=1;l--)if(new Date(n.getFullYear(),n.getMonth(),l).getDay()===a){o=l;break}}else{let l=parseInt(t,10),m=0;for(let h=1;h<=d;h++)if(new Date(n.getFullYear(),n.getMonth(),h).getDay()===a&&++m===l){o=h;break}}return n.setDate(o),z(n)}_adjustToMonthDay(e,t){let r=new Date(e),n=new Date(r.getFullYear(),r.getMonth()+1,0).getDate();return r.setDate(t===-1?n:Math.min(t,n)),z(r)}_adjustToWeekday(e,t){let r=je[t]??1,n=new Date(e),a=n.getDay(),d=(r-a+7)%7;return n.setDate(n.getDate()+d),z(n)}_notifyTimeRemindersChanged(){window.dispatchEvent(new CustomEvent(ht,{detail:{entity:this._entity}}))}async _add(){let e=this._message.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}let t=this._editingUid,r=this._buildRrule(),n=this._when;r&&this._freq==="weekly"?n=this._adjustToWeekday(n,this._weekday):r&&this._freq==="monthly"&&(this._monthMode==="weekday"?n=this._adjustToMonthWeekday(n,this._monthOrdinal,this._monthWeekday):n=this._adjustToMonthDay(n,this._monthDay));let a={message:e,when:n};r&&(a.rrule=r),t&&!r&&(a.rrule=null),this._busy=!0,this._error="";try{t?(await this.hass.callService("btoddb_ha_reminders","update",{uid:t,...a},void 0,void 0,!0),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create",a,void 0,void 0,!0),this._message="",this._when=_e(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._interval=1,this._monthMode="day",this._monthDay=1,this._monthOrdinal="1",this._monthWeekday="MO",t||(this._timeCollapsed=!1),await this._fetch(),this._notifyTimeRemindersChanged()}catch(d){this._error=`Could not ${t?"update":"create"} reminder: ${this._msg(d)}`}finally{this._busy=!1}}async _delete(e){if(e)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:e}),this._items=this._items.filter(t=>t.uid!==e),this._notifyTimeRemindersChanged()}catch(t){this._error=`Could not delete reminder: ${this._msg(t)}`}}async _addLocation(){let e=this._locMessage.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._locPerson){this._error="Pick a person to track.";return}if(!this._locZone){this._error="Pick a zone.";return}let t=this._editingUid;this._busy=!0,this._error="";try{t?(await this.hass.callService("btoddb_ha_reminders","update_location",{uid:t,message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._editingUid=""):await this.hass.callService("btoddb_ha_reminders","create_location",{message:e,person:this._locPerson,zone:this._locZone,trigger:this._locTrigger,persistent:this._locPersistent}),this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1,t||(this._locationCollapsed=!1)}catch(r){this._error=`Could not ${t?"update":"create"} reminder: ${this._msg(r)}`}finally{this._busy=!1}}_startEditTime(e){if(this._editingUid=e.uid,this._mode="time",this._message=e.summary,this._when=z(e.start),e.rrule){this._repeatOpen=!0;let t=e.rrule.toUpperCase(),r=t.match(/INTERVAL=(\d+)/);if(this._interval=r?parseInt(r[1],10):1,t.includes("FREQ=WEEKLY")){this._freq="weekly";let n=t.match(/BYDAY=(\w+)/);this._weekday=n?n[1]:"MO",this._monthMode="day",this._monthDay=1,this._monthOrdinal="1",this._monthWeekday="MO"}else if(t.includes("FREQ=MONTHLY")){this._freq="monthly";let n=t.match(/BYDAY=(-?[1-4])(MO|TU|WE|TH|FR|SA|SU)/);if(n)this._monthMode="weekday",this._monthOrdinal=n[1],this._monthWeekday=n[2],this._monthDay=1;else{this._monthMode="day";let a=t.match(/BYMONTHDAY=(-?\d+)/);this._monthDay=a?parseInt(a[1],10):e.start.getDate(),this._monthOrdinal="1",this._monthWeekday="MO"}this._weekday="MO"}else this._freq="daily",this._weekday="MO",this._monthMode="day",this._monthDay=1,this._monthOrdinal="1",this._monthWeekday="MO"}else this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._interval=1,this._monthMode="day",this._monthDay=1,this._monthOrdinal="1",this._monthWeekday="MO";this._error=""}_startEditLocation(e){this._editingUid=e.uid,this._mode="location",this._locMessage=e.summary,this._locPerson=e.person,this._locZone=e.zone,this._locTrigger=e.trigger,this._locPersistent=e.persistent,this._error=""}_cancelEdit(){this._editingUid="",this._message="",this._when=_e(),this._repeatOpen=!1,this._freq="daily",this._weekday="MO",this._interval=1,this._monthMode="day",this._monthDay=1,this._monthOrdinal="1",this._monthWeekday="MO",this._locMessage="",this._locPerson="",this._locZone="",this._locTrigger="enter",this._locPersistent=!1,this._error=""}async _deleteLocation(e){if(e)try{await this.hass.callService("btoddb_ha_reminders","delete_location",{uid:e})}catch(t){this._error=`Could not delete reminder: ${this._msg(t)}`}}_locationSensorId(){let e=this.hass?.states??{};if(e[ge]?.attributes?.[Ye])return ge;for(let[t,r]of Object.entries(e))if(t.startsWith("sensor.")&&r.attributes?.[Ye])return t;return ge}_locationItems(){return(this.hass?.states[this._locationSensorId()]?.attributes?.reminders??[]).map(r=>({kind:"location",uid:r.uid,summary:r.summary,person:r.person,zone:r.zone,trigger:r.trigger,persistent:r.persistent??!1,deliveredAt:r.delivered_at?new Date(r.delivered_at):null}))}_entityName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTime(e){try{return e.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_formatTimeOnly(e){try{return e.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}_dayKey(e){return`${e.getFullYear()}-${e.getMonth()}-${e.getDate()}`}_formatDayHeader(e){let t=new Date;if(this._dayKey(e)===this._dayKey(t))return"Today";let r=new Date(t);if(r.setDate(t.getDate()+1),this._dayKey(e)===this._dayKey(r))return"Tomorrow";try{return e.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})}catch{return e.toLocaleDateString()}}_renderDayHeader(e){return c`<div class="day-header">${this._formatDayHeader(e)}</div>`}_intervalPrefix(e){let t=e.match(/INTERVAL=(\d+)/),r=t?parseInt(t[1],10):1;if(r<=1)return"Every";if(r===2)return"Every other";let n=r%100>=11&&r%100<=13?"th":{1:"st",2:"nd",3:"rd"}[r%10]??"th";return`Every ${r}${n}`}_formatRecurrence(e,t){let r=t.toLocaleString(void 0,{hour:"numeric",minute:"2-digit"}),n=e.toUpperCase(),a=this._intervalPrefix(n);if(n.includes("FREQ=DAILY"))return`${a} day at ${r}`;if(n.includes("FREQ=WEEKLY")){let d=n.match(/BYDAY=(\w+)/);if(d){let o=Q[d[1]]??d[1];return`${a} ${o} at ${r}`}return`${a==="Every"?"Weekly":`${a} week`} at ${r}`}if(n.includes("FREQ=MONTHLY")){let d=n.match(/BYDAY=(-1|[1-4])(MO|TU|WE|TH|FR|SA|SU)/);if(d){let p={1:"first",2:"second",3:"third",4:"fourth","-1":"last"}[d[1]]??d[1],g=Q[d[2]]??d[2];return`${a} month on the ${p} ${g} at ${r}`}let o=n.match(/BYMONTHDAY=(-?\d+)/);if(o&&o[1]==="-1")return`${a} month on the last day at ${r}`;let l=o?parseInt(o[1],10):t.getDate(),m=l%100>=11&&l%100<=13?"th":{1:"st",2:"nd",3:"rd"}[l%10]??"th";return`${a} month on the ${l}${m} at ${r}`}return e}_renderSwitch(e,t){return c`
      <label class="repeat-switch">
        <input
          type="checkbox"
          role="switch"
          .checked=${e}
          @change=${r=>t(r.target.checked)}
        />
        <span class="repeat-switch-track"
          ><span class="repeat-switch-thumb"></span
        ></span>
        <span class="repeat-switch-label">Repeat</span>
      </label>
    `}_renderRepeatDisclosure(){return c`
      <div class="repeat-row">
        ${this._renderSwitch(this._repeatOpen,e=>{this._repeatOpen=e})}
        ${this._repeatOpen?c`
              <div class="repeat-body">
                <select
                  class="freq-select"
                  .value=${this._freq}
                  @change=${e=>{this._freq=e.target.value}}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <span class="interval-label">every</span>
                <input
                  class="interval-input"
                  type="number"
                  min="1"
                  .value=${String(this._interval)}
                  @input=${e=>{let t=parseInt(e.target.value,10);this._interval=Number.isFinite(t)&&t>=1?t:1}}
                />
                <span class="interval-label"
                  >${this._freq==="daily"?"day(s)":this._freq==="weekly"?"week(s)":"month(s)"}</span
                >
                ${this._freq==="weekly"?c`
                      <div class="weekday-chips">
                        ${Fe.map(({code:e,label:t})=>c`
                            <button
                              type="button"
                              class="chip ${this._weekday===e?"selected":""}"
                              title=${Q[e]??e}
                              @click=${()=>{this._weekday=e}}
                            >
                              ${t}
                            </button>
                          `)}
                      </div>
                    `:u}
                ${this._freq==="monthly"?c`
                      <div class="month-opts">
                        <select
                          class="month-mode-select"
                          .value=${this._monthMode}
                          @change=${e=>{this._monthMode=e.target.value}}
                        >
                          <option value="day">Day of month</option>
                          <option value="weekday">Day of week</option>
                        </select>
                        ${this._monthMode==="day"?c`
                              <select
                                class="month-day-select"
                                .value=${String(this._monthDay)}
                                @change=${e=>{this._monthDay=parseInt(e.target.value,10)}}
                              >
                                ${Array.from({length:28},(e,t)=>t+1).map(e=>c`<option
                                    value=${e}
                                    ?selected=${this._monthDay===e}
                                  >
                                    ${e}
                                  </option>`)}
                                <option value="-1" ?selected=${this._monthDay===-1}>
                                  Last day
                                </option>
                              </select>
                            `:c`
                              <select
                                class="month-ordinal-select"
                                .value=${this._monthOrdinal}
                                @change=${e=>{this._monthOrdinal=e.target.value}}
                              >
                                <option value="1">First</option>
                                <option value="2">Second</option>
                                <option value="3">Third</option>
                                <option value="4">Fourth</option>
                                <option value="-1">Last</option>
                              </select>
                              <div class="weekday-chips">
                                ${Fe.map(({code:e,label:t})=>c`
                                    <button
                                      type="button"
                                      class="chip ${this._monthWeekday===e?"selected":""}"
                                      title=${Q[e]??e}
                                      @click=${()=>{this._monthWeekday=e}}
                                    >
                                      ${t}
                                    </button>
                                  `)}
                              </div>
                            `}
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
            @input=${t=>{this._message=t.target.value}}
            @keydown=${t=>{t.key==="Enter"&&this._add()}}
          />
          <input
            class="when"
            type="datetime-local"
            .value=${this._when}
            @input=${t=>{this._when=t.target.value}}
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
            @input=${t=>{this._locMessage=t.target.value}}
          />
          <ha-entity-picker
            class="picker"
            .hass=${this.hass}
            .value=${this._locPerson}
            .label=${"Person"}
            .includeDomains=${["person"]}
            @value-changed=${t=>{this._locPerson=t.detail.value}}
          ></ha-entity-picker>
          <ha-entity-picker
            class="picker"
            .hass=${this.hass}
            .value=${this._locZone}
            .label=${"Zone"}
            .includeDomains=${["zone"]}
            @value-changed=${t=>{this._locZone=t.detail.value}}
          ></ha-entity-picker>
          <select
            class="trigger"
            .value=${this._locTrigger}
            @change=${t=>{this._locTrigger=t.target.value}}
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
          ${this._renderSwitch(this._locPersistent,t=>{this._locPersistent=t})}
        </div>
      </div>
    `}_renderTimeRows(){let e=[],t="";for(let r of this._items){let n=this._dayKey(r.start),a=n!==t;a&&(e.push(this._renderDayHeader(r.start)),t=n),e.push(this._renderTimeItem(r,a))}return e}_renderTimeItem(e,t=!1){let r=!!e.rrule,n=r?this._formatRecurrence(e.rrule,e.start):this._formatTimeOnly(e.start);return c`
      <div class="item ${r?"recurring":""} ${t?"day-first":""}">
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
    `}_renderSectionHeading(e,t,r,n,a,d){return c`
      <button
        class="section-heading"
        aria-expanded=${n?"false":"true"}
        aria-controls=${d}
        @click=${a}
      >
        <ha-icon icon=${t}></ha-icon>
        <span class="section-heading-label">${e}</span>
        <span class="section-heading-count">${r}</span>
        <ha-icon
          class="section-heading-chevron ${n?"collapsed":""}"
          icon="mdi:chevron-down"
        ></ha-icon>
      </button>
    `}_renderLocationItem(e,t=!1){let n=`${e.trigger==="enter"?"Entering":"Leaving"} ${this._entityName(e.zone)} \xB7 ${this._entityName(e.person)}`,a=e.deliveredAt?`Delivered ${this._formatTime(e.deliveredAt)} \xB7 ${n}`:e.persistent?`Repeating \xB7 ${n}`:n,d=e.persistent&&!e.deliveredAt;return c`
      <div class="item ${d?"persistent":""} ${e.deliveredAt?"delivered":""} ${t?"section-first":""}">
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
    `}render(){let e=this._config.title??"BToddB Reminders",t=this._locationItems(),r=t.filter(d=>!d.deliveredAt),n=t.filter(d=>d.deliveredAt).sort((d,o)=>o.deliveredAt.getTime()-d.deliveredAt.getTime()),a=this._items.length+t.length;return c`
      <ha-card .header=${e}>
        <div class="content">
          <div class="entry-panel">
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
          </div>

          ${this._error?c`<div class="error">${this._error}</div>`:u}

          ${a===0?c`<div class="empty">No reminders.</div>`:c`
                <div class="list">
                  ${this._items.length?this._renderSectionHeading("Time","mdi:alarm",this._items.length,this._timeCollapsed,()=>{this._timeCollapsed=!this._timeCollapsed},"section-rows-time"):u}
                  <div id="section-rows-time">${this._timeCollapsed?u:this._renderTimeRows()}</div>
                  ${t.length?this._renderSectionHeading("Location","mdi:map-marker",t.length,this._locationCollapsed,()=>{this._locationCollapsed=!this._locationCollapsed},"section-rows-location"):u}
                  <div id="section-rows-location">${this._locationCollapsed?u:[...r,...n].map((d,o)=>this._renderLocationItem(d,this._items.length>0&&o===0))}</div>
                </div>
              `}
        </div>
      </ha-card>
    `}};Y.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_mode:{state:!0},_message:{state:!0},_when:{state:!0},_repeatOpen:{state:!0},_freq:{state:!0},_weekday:{state:!0},_interval:{state:!0},_monthMode:{state:!0},_monthDay:{state:!0},_monthOrdinal:{state:!0},_monthWeekday:{state:!0},_locMessage:{state:!0},_locPerson:{state:!0},_locZone:{state:!0},_locTrigger:{state:!0},_locPersistent:{state:!0},_busy:{state:!0},_error:{state:!0},_editingUid:{state:!0},_timeCollapsed:{state:!0},_locationCollapsed:{state:!0}},Y.styles=$`
    .content {
      padding: 0 16px 12px;
    }
    .entry-panel {
      margin-top: 12px;
      padding: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      background: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 4%,
        transparent
      );
    }
    .tabs {
      display: flex;
      gap: 8px;
    }
    .entry-panel .add-row {
      padding-top: 12px;
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
    .section-heading + .day-header {
      border-top: none;
    }
    .item.day-first {
      border-top: none;
    }
    .item.section-first {
      border-top: none;
    }
    /* Filled, tinted banner for reminder groups; acts as a collapse toggle. */
    .section-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin: 14px 0 2px;
      padding: 9px 12px;
      border-top: none;
      border-right: none;
      border-bottom: none;
      border-left: 4px solid var(--primary-color, #03a9f4);
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      color: var(--primary-color, #03a9f4);
      font-size: 12px;
      font-family: inherit;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      cursor: pointer;
      box-sizing: border-box;
    }
    .section-heading:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 20%, transparent);
    }
    .section-heading:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .list > .section-heading:first-child {
      margin-top: 0;
    }
    .section-heading ha-icon {
      --mdc-icon-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary-color, #03a9f4);
    }
    .section-heading-label {
      flex: 1 1 auto;
    }
    .section-heading-count {
      font-weight: 400;
      font-size: 11px;
      opacity: 0.7;
      text-transform: none;
      letter-spacing: normal;
    }
    .section-heading-chevron {
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .section-heading-chevron.collapsed {
      transform: rotate(-90deg);
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
    /* Repeat toggle switch */
    .repeat-row {
      padding-top: 6px;
    }
    .repeat-switch {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 13px;
      user-select: none;
    }
    .repeat-switch input[type="checkbox"] {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .repeat-switch-track {
      position: relative;
      width: 36px;
      height: 20px;
      background: var(--divider-color, #e0e0e0);
      border-radius: 10px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .repeat-switch input:checked ~ .repeat-switch-track {
      background: var(--primary-color, #03a9f4);
    }
    .repeat-switch-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    .repeat-switch input:checked ~ .repeat-switch-track .repeat-switch-thumb {
      transform: translateX(16px);
    }
    .repeat-switch input:focus-visible ~ .repeat-switch-track {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .repeat-switch-label {
      color: var(--secondary-text-color, #727272);
    }
    .repeat-switch:has(input:checked) .repeat-switch-label {
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
    .month-opts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }
    .month-mode-select,
    .month-day-select,
    .month-ordinal-select {
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
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",Y);var pt="v0.0.73";console.info(`%c BTODDB-HA-REMINDERS %c ${pt} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/ha-reminders"});window.customCards.push({type:"btoddb-calendar-list-card",name:"BToddB Calendar List",description:"Show calendars and reminders as a compact agenda.",preview:!1,documentationURL:"https://github.com/btoddb/ha-reminders"});
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
