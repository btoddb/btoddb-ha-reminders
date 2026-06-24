var k=globalThis,O=k.ShadowRoot&&(k.ShadyCSS===void 0||k.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,I=Symbol(),X=new WeakMap,E=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==I)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(O&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=X.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&X.set(e,t))}return t}toString(){return this.cssText}},tt=r=>new E(typeof r=="string"?r:r+"",void 0,I),z=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new E(e,r,I)},et=(r,t)=>{if(O)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=k.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},B=O?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return tt(e)})(r):r;var{is:yt,defineProperty:vt,getOwnPropertyDescriptor:At,getOwnPropertyNames:bt,getOwnPropertySymbols:wt,getPrototypeOf:St}=Object,N=globalThis,st=N.trustedTypes,Et=st?st.emptyScript:"",xt=N.reactiveElementPolyfillSupport,x=(r,t)=>r,j={toAttribute(r,t){switch(t){case Boolean:r=r?Et:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},rt=(r,t)=>!yt(r,t),it={attribute:!0,type:String,converter:j,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??=Symbol("metadata"),N.litPropertyMetadata??=new WeakMap;var m=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=it){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&vt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=At(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??it}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;let t=St(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){let e=this.properties,s=[...bt(e),...wt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(B(i))}else t!==void 0&&e.push(B(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return et(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:j).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:j;this._$Em=i;let l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??rt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};m.elementStyles=[],m.shadowRootOptions={mode:"open"},m[x("elementProperties")]=new Map,m[x("finalized")]=new Map,xt?.({ReactiveElement:m}),(N.reactiveElementVersions??=[]).push("2.1.2");var J=globalThis,nt=r=>r,D=J.trustedTypes,ot=D?D.createPolicy("lit-html",{createHTML:r=>r}):void 0,pt="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,ut="?"+f,Ct=`<${ut}>`,v=document,T=()=>v.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",G=Array.isArray,Tt=r=>G(r)||typeof r?.[Symbol.iterator]=="function",W=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,ht=/>/g,$=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lt=/'/g,ct=/"/g,mt=/^(?:script|style|textarea|title)$/i,Z=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),S=Z(1),Lt=Z(2),It=Z(3),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),dt=new WeakMap,y=v.createTreeWalker(v,129);function _t(r,t){if(!G(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ot!==void 0?ot.createHTML(t):t}var Pt=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=C;for(let l=0;l<e;l++){let a=r[l],d,p,h=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===C?p[1]==="!--"?o=at:p[1]!==void 0?o=ht:p[2]!==void 0?(mt.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=$):p[3]!==void 0&&(o=$):o===$?p[0]===">"?(o=i??C,h=-1):p[1]===void 0?h=-2:(h=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?$:p[3]==='"'?ct:lt):o===ct||o===lt?o=$:o===at||o===ht?o=C:(o=$,i=void 0);let _=o===$&&r[l+1].startsWith("/>")?" ":"";n+=o===C?a+Ct:h>=0?(s.push(d),a.slice(0,h)+pt+a.slice(h)+f+_):a+f+(h===-2?l:_)}return[_t(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},R=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[d,p]=Pt(t,e);if(this.el=r.createElement(d,s),y.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=y.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(pt)){let u=p[o++],_=i.getAttribute(h).split(f),M=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:M[2],strings:_,ctor:M[1]==="."?q:M[1]==="?"?F:M[1]==="@"?K:w}),i.removeAttribute(h)}else h.startsWith(f)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(mt.test(i.tagName)){let h=i.textContent.split(f),u=h.length-1;if(u>0){i.textContent=D?D.emptyScript:"";for(let _=0;_<u;_++)i.append(h[_],T()),y.nextNode(),a.push({type:2,index:++n});i.append(h[u],T())}}}else if(i.nodeType===8)if(i.data===ut)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(f,h+1))!==-1;)a.push({type:7,index:n}),h+=f.length-1}n++}}static createElement(t,e){let s=v.createElement("template");return s.innerHTML=t,s}};function b(r,t,e=r,s){if(t===A)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=P(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=b(r,i._$AS(r,t.values),i,s)),t}var V=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??v).importNode(e,!0);y.currentNode=i;let n=y.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new H(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Y(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=y.nextNode(),o++)}return y.currentNode=v,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},H=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=b(this,t,e),P(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(v.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=R.createElement(_t(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new V(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=dt.get(t.strings);return e===void 0&&dt.set(t.strings,e=new R(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=nt(t).nextSibling;nt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=b(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let l=t,a,d;for(t=n[0],a=0;a<n.length-1;a++)d=b(this,l[s+a],e,a),d===A&&(d=this._$AH[a]),o||=!P(d)||d!==this._$AH[a],d===c?t=c:t!==c&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},q=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},F=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},K=class extends w{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=b(this,t,e,0)??c)===A)return;let s=this._$AH,i=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Y=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){b(this,t)}};var Rt=J.litHtmlPolyfillSupport;Rt?.(R,H),(J.litHtmlVersions??=[]).push("3.3.3");var ft=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new H(t.insertBefore(T(),n),n,void 0,e??{})}return i._$AI(r),i};var Q=globalThis,g=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ft(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};g._$litElement$=!0,g.finalized=!0,Q.litElementHydrateSupport?.({LitElement:g});var Ht=Q.litElementPolyfillSupport;Ht?.({LitElement:g});(Q.litElementVersions??=[]).push("4.2.2");var gt="calendar.btoddb_reminders",L=r=>String(r).padStart(2,"0");function Ut(r){return`${r.getFullYear()}-${L(r.getMonth()+1)}-${L(r.getDate())}T${L(r.getHours())}:${L(r.getMinutes())}`}function $t(){let r=new Date;return r.setHours(r.getHours()+1,0,0,0),Ut(r)}var U=class extends g{constructor(){super(...arguments);this._config={type:""};this._items=[];this._message="";this._when=$t();this._busy=!1;this._error="";this._entity=gt;this._lastSignature=""}setConfig(e){this._config=e??{type:""},this._entity=e?.entity??gt}getCardSize(){return 3+Math.min(this._items.length,8)}connectedCallback(){super.connectedCallback(),this._refreshTimer=window.setInterval(()=>this._fetch(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&window.clearInterval(this._refreshTimer)}updated(e){if(!e.has("hass")||!this.hass)return;let s=this.hass.states[this._entity],i=s?`${s.state}|${s.last_updated}`:"missing";i!==this._lastSignature&&(this._lastSignature=i,this._fetch())}async _fetch(){if(!this.hass)return;if(!this.hass.states[this._entity]){this._error=`Entity ${this._entity} not found. Is the Reminders integration set up?`,this._items=[];return}let e=new Date;e.setHours(0,0,0,0);let s=new Date;s.setFullYear(s.getFullYear()+1);try{let i=await this.hass.callApi("GET",`calendars/${this._entity}?start=${encodeURIComponent(e.toISOString())}&end=${encodeURIComponent(s.toISOString())}`),n=Date.now()-6e4;this._items=(i??[]).map(o=>({uid:o.uid??"",summary:o.summary,start:new Date(o.start.dateTime??o.start.date??"")})).filter(o=>o.start.getTime()>=n).sort((o,l)=>o.start.getTime()-l.start.getTime()),this._error=""}catch(i){this._error=`Could not load reminders: ${this._msg(i)}`}}async _add(){let e=this._message.trim();if(!e){this._error="Enter a reminder message.";return}if(!this._when){this._error="Pick a date and time.";return}this._busy=!0,this._error="";try{await this.hass.callService("btoddb_ha_reminders","create",{message:e,when:this._when},void 0,void 0,!0),this._message="",this._when=$t(),await this._fetch()}catch(s){this._error=`Could not create reminder: ${this._msg(s)}`}finally{this._busy=!1}}async _delete(e){if(e)try{await this.hass.callWS({type:"calendar/event/delete",entity_id:this._entity,uid:e}),this._items=this._items.filter(s=>s.uid!==e)}catch(s){this._error=`Could not delete reminder: ${this._msg(s)}`}}_msg(e){return e&&typeof e=="object"&&"message"in e?String(e.message):String(e)}_formatTime(e){try{return e.toLocaleString(void 0,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch{return e.toLocaleString()}}render(){let e=this._config.title??"BToddB Reminders";return S`
      <ha-card .header=${e}>
        <div class="content">
          <div class="add-row">
            <input
              class="message"
              type="text"
              placeholder="New reminder"
              .value=${this._message}
              @input=${s=>{this._message=s.target.value}}
              @keydown=${s=>{s.key==="Enter"&&this._add()}}
            />
            <input
              class="when"
              type="datetime-local"
              .value=${this._when}
              @input=${s=>{this._when=s.target.value}}
            />
            <mwc-button
              raised
              ?disabled=${this._busy}
              @click=${()=>this._add()}
            >
              Add
            </mwc-button>
          </div>

          ${this._error?S`<div class="error">${this._error}</div>`:c}

          ${this._items.length===0?S`<div class="empty">No upcoming reminders.</div>`:S`
                <div class="list">
                  ${this._items.map(s=>S`
                      <div class="item">
                        <ha-icon class="leading" icon="mdi:alarm"></ha-icon>
                        <div class="text">
                          <span class="summary">${s.summary}</span>
                          <span class="time">${this._formatTime(s.start)}</span>
                        </div>
                        <ha-icon-button
                          .label=${"Delete reminder"}
                          @click=${()=>this._delete(s.uid)}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </ha-icon-button>
                      </div>
                    `)}
                </div>
              `}
        </div>
      </ha-card>
    `}};U.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_message:{state:!0},_when:{state:!0},_busy:{state:!0},_error:{state:!0}},U.styles=z`
    .content {
      padding: 0 16px 12px;
    }
    .add-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      flex-wrap: wrap;
    }
    .message,
    .when {
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
    .when {
      flex: 0 0 auto;
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
    .time {
      color: var(--secondary-text-color, #727272);
      font-size: 12px;
    }
    ha-icon-button {
      color: var(--secondary-text-color, #727272);
      flex: 0 0 auto;
    }
  `;customElements.get("btoddb-reminders-card")||customElements.define("btoddb-reminders-card",U);var Mt="v0.0.13";console.info(`%c BTODDB-HA-REMINDERS %c ${Mt} `,"color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");window.customCards=window.customCards||[];window.customCards.push({type:"btoddb-reminders-card",name:"BToddB Reminders",description:"Create reminders and see the upcoming ones.",preview:!1,documentationURL:"https://github.com/btoddb/btoddb-ha-reminders"});
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
