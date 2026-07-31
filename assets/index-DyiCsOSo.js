(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`82eeae9401364e56b2ca10cbd0b291f8`,t=window.location.origin+window.location.pathname,n=null,r=null;function i(e){return crypto.getRandomValues(new Uint8Array(e)).reduce((e,t)=>e+`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`[t%66],``)}async function a(e){let t=new TextEncoder().encode(e),n=await window.crypto.subtle.digest(`SHA-256`,t);return btoa(String.fromCharCode.apply(null,new Uint8Array(n))).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function o(){let n=i(64);sessionStorage.setItem(`spotify_code_verifier`,n);let r=await a(n),o=new URL(`https://accounts.spotify.com/authorize`);o.searchParams.append(`response_type`,`code`),o.searchParams.append(`client_id`,e),o.searchParams.append(`scope`,`streaming user-read-email user-read-private user-modify-playback-state`),o.searchParams.append(`redirect_uri`,t),o.searchParams.append(`code_challenge`,r),o.searchParams.append(`code_challenge_method`,`S256`),window.location.href=o.toString()}async function s(n){let r=sessionStorage.getItem(`spotify_code_verifier`);window.history.replaceState({},document.title,window.location.pathname);let i=await(await fetch(`https://accounts.spotify.com/api/token`,{method:`POST`,headers:{"Content-Type":`application/x-www-form-urlencoded`},body:new URLSearchParams({client_id:e,grant_type:`authorization_code`,code:n,redirect_uri:t,code_verifier:r})})).json();if(i.access_token)return sessionStorage.setItem(`spotify_access_token`,i.access_token),i.access_token;throw Error(`Failed to retrieve access token`)}function c(){return sessionStorage.getItem(`spotify_access_token`)}function l(){return new Promise((e,t)=>{if(window.Spotify)return e();window.onSpotifyWebPlaybackSDKReady=()=>e();let n=document.createElement(`script`);n.src=`https://sdk.scdn.co/spotify-player.js`,n.onerror=()=>t(Error(`Failed to load Spotify SDK`)),document.head.appendChild(n)})}async function u(e,t,i){await l();let a=c();n=new Spotify.Player({name:`RockingAround Game`,getOAuthToken:e=>e(a),volume:.8}),n.addListener(`ready`,({device_id:t})=>{r=t,e(t)}),n.addListener(`player_state_changed`,e=>{i&&i(e)}),n.addListener(`initialization_error`,({message:e})=>t(e)),n.addListener(`account_error`,({message:e})=>t(`Requires Spotify Premium`)),await n.connect()}async function d(e){let t=c();await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${r}`,{method:`PUT`,body:JSON.stringify({uris:[`spotify:track:${e}`],position_ms:0}),headers:{"Content-Type":`application/json`,Authorization:`Bearer ${t}`}})}async function f(){n&&await n.togglePlay()}async function p(){return n?await n.getCurrentState():null}var m=`spotify`;async function h(e=`spotify`){m=e,e===`spotify`&&await o()}window.location.origin+window.location.pathname;async function g(){let e=new URLSearchParams(window.location.search).get(`code`);if(e){let t=await s(e),n=sessionStorage.getItem(`pending_song`);return n?(sessionStorage.removeItem(`pending_song`),window.location.href=`${window.location.pathname}?song=${n}`,{authenticated:!0,token:t,provider:`spotify`}):{authenticated:!0,token:t,provider:`spotify`}}return c()?{authenticated:!0,token:c(),provider:`spotify`}:{authenticated:!1}}async function _(e,t,n){m===`spotify`&&await u(e,t,n)}async function v(e){m===`spotify`&&await d(e)}async function y(){m===`spotify`&&await f()}async function b(){return m===`spotify`?await p():null}var x=`https://raw.githubusercontent.com/gerggz/rocking-around/main/src/tracks.csv`;function S(e){let t=e.trim().split(/\r?\n/);if(t.length<2)return{};let n=t[0].split(`,`).map(e=>e.trim()),r={};for(let e=1;e<t.length;e++){let i=t[e];if(!i)continue;let a=(i.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)||[]).map(e=>e.replace(/^"|"$/g,``).trim()),o={};n.forEach((e,t)=>{let n=a[t]||``;(e===`year`||e===`id`)&&(n=Number(n)||n),o[e]=n}),o.id&&(r[o.id]={title:o.title,artist:o.artist,album:o.album,year:o.year,spotify:o.spotify||``,apple:o.apple||``,youtube:o.youtube||``})}return r}var C={};async function w(){try{let e=await fetch(x);if(!e.ok)throw Error(`Failed to fetch tracks CSV`);return C=S(await e.text()),C}catch(e){return console.error(`Error loading dynamic tracks:`,e),{}}}function T(e){return C[e]||null}function E(e,t){e.innerHTML=`
    <div id="login-view" class="view-state">
      <h2>Rockin' Around</h2>
      <div class="status-badge unauthenticated">Not Authenticated</div>
      <p>Log in with a streaming provider to start playing:</p>
      <button id="login-spotify-btn" class="action-btn">Log in with Spotify</button>
    </div>
  `,document.getElementById(`login-spotify-btn`)?.addEventListener(`click`,t)}function D(e,t){e.innerHTML=`
    <div id="dashboard-view" class="view-state">
      <h2>Rockin' Around</h2>
      <div class="status-badge authenticated">CONNECTED (${t.toUpperCase()})</div>
      <p class="dashboard-hint">Pick a card below to launch a track!</p>
    </div>
  `;let n=document.getElementById(`external-content`);n&&(n.innerHTML=`
    <div class="external-section">
      <h3 class="section-title">Select Card</h3>
      <div class="track-grid">
        ${Object.keys(C).map(e=>`<a href="?song=${e}" class="track-link">Card #${String(e).padStart(2,`0`)}</a>`).join(``)}
      </div>
    </div>
  `)}function O(e,t){e.innerHTML=`
    <div id="game-view" class="view-state">
      <p id="status-msg" class="status-msg"></p>

      <div class="player-wrapper">
        <svg class="progress-ring" width="110" height="110" viewBox="0 0 110 110">
          <circle stroke="rgba(0, 0, 0, 0.08)" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
          <circle id="progress-fill" class="progress-ring__fill" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
          <circle id="progress-dot" class="progress-ring__dot" r="4" cx="55" cy="8"/>
        </svg>

        <button id="play-pause-btn" class="play-btn" disabled>▶</button>
      </div>

      <button id="reveal-btn" class="action-btn">Reveal Track Info</button>

      <div class="answer-slot">
        <div id="answer-box" class="answer-card hidden">
          <h4>${t.title}</h4>
          <p>${t.artist}</p>
          <p style="color: var(--text-subtle); font-size: 0.78rem;">${t.album}</p>
          <div class="year-badge">${t.year}</div>
        </div>
      </div>
    </div>
  `;let n=document.getElementById(`external-content`);n&&(n.innerHTML=`
      <button id="back-home-btn" class="outer-back-btn">← Back to Menu</button>
    `,document.getElementById(`back-home-btn`)?.addEventListener(`click`,()=>{window.location.href=`/`}))}var k=document.getElementById(`card-mount`),A=document.getElementById(`external-content`),j=null,M=!1,N=!1,P=null;function F(e,t){let n=document.getElementById(`progress-fill`),r=document.getElementById(`progress-dot`);if(!t||t===0||!n||!r)return;let i=Math.min(e/t,1),a=295.3-i*295.3;n.style.strokeDashoffset=a;let o=i*2*Math.PI;r.setAttribute(`cx`,(55+47*Math.sin(o)).toFixed(2)),r.setAttribute(`cy`,(55-47*Math.cos(o)).toFixed(2))}function I(){L();async function e(){let t=await b();t&&!t.paused?(F(t.position,t.duration),P=requestAnimationFrame(e)):L()}P=requestAnimationFrame(e)}function L(){P&&=(cancelAnimationFrame(P),null)}function R(e){if(!e)return;M=!e.paused;let t=document.getElementById(`play-pause-btn`);t&&(M?(t.textContent=`❚❚`,t.style.paddingLeft=`0px`,I()):(t.textContent=`▶`,t.style.paddingLeft=`3px`,L(),F(e.position,e.duration)))}async function z(){await w();let e=await g(),t=new URLSearchParams(window.location.search),n=t.get(`song`)||t.get(`card`);if(A&&(A.innerHTML=``),!e.authenticated){n&&(sessionStorage.setItem(`pending_song`,n),window.history.replaceState({},document.title,window.location.pathname)),E(k,()=>h(`spotify`));return}if(n){let t=T(n);if(!t)return;j=t[e.provider],O(k,t);let r=document.getElementById(`play-pause-btn`),i=document.getElementById(`reveal-btn`),a=document.getElementById(`answer-box`);r?.addEventListener(`click`,async()=>{N?await y():(await v(j),N=!0)}),i?.addEventListener(`click`,()=>{let e=a.classList.toggle(`hidden`);i.textContent=e?`Reveal Track Info`:`Hide Track Info`}),await _(()=>{r&&(r.disabled=!1)},e=>{console.error(e)},R)}else D(k,e.provider)}z();