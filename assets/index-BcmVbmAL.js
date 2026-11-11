const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dist-CFTgCJvh.js","assets/preload-helper-CP5k6QRi.js","assets/state-BujoNwcN-D2S9hSuT.js","assets/audio-context-store-Bf50rcqa-BmY5WG_b.js","assets/pushkin-C5TU0Pwc-DcIxQwPt.js","assets/load-uTL4eiru-NwnfLQ4I.js","assets/generate-guid-C7EoYu64-By2v9ZFa.js","assets/active-device-mode-changed-OmLVES_4-HokXyxSl.js","assets/active-device-changed-BDbOSq7P-BhnJYPYi.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-CP5k6QRi.js";var t=Object.defineProperty,n=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=n({getCurrentState:()=>ae,handleCallback:()=>f,hasSession:()=>p,initPlayer:()=>te,isCallback:()=>d,login:()=>u,logout:()=>g,pauseTrack:()=>re,playTrack:()=>ne,togglePlay:()=>ie}),i=`82eeae9401364e56b2ca10cbd0b291f8`,a=window.location.origin+window.location.pathname,o=null,s=null;function c(e){return crypto.getRandomValues(new Uint8Array(e)).reduce((e,t)=>e+`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`[t%66],``)}async function l(e){let t=new TextEncoder().encode(e),n=await window.crypto.subtle.digest(`SHA-256`,t);return btoa(String.fromCharCode.apply(null,new Uint8Array(n))).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function u(){let e=c(64),t=`spotify-`+c(16);sessionStorage.setItem(`spotify_code_verifier`,e),sessionStorage.setItem(`spotify_oauth_state`,t);let n=await l(e),r=new URL(`https://accounts.spotify.com/authorize`);r.searchParams.append(`response_type`,`code`),r.searchParams.append(`client_id`,i),r.searchParams.append(`scope`,`streaming user-read-email user-read-private user-modify-playback-state`),r.searchParams.append(`redirect_uri`,a),r.searchParams.append(`code_challenge`,n),r.searchParams.append(`code_challenge_method`,`S256`),r.searchParams.append(`state`,t),window.location.href=r.toString()}function d(e){let t=e.get(`state`);return!!(t&&t===sessionStorage.getItem(`spotify_oauth_state`))}async function f(e){let t=sessionStorage.getItem(`spotify_code_verifier`);sessionStorage.removeItem(`spotify_code_verifier`),sessionStorage.removeItem(`spotify_oauth_state`),window.history.replaceState({},document.title,window.location.pathname);let n=await(await fetch(`https://accounts.spotify.com/api/token`,{method:`POST`,headers:{"Content-Type":`application/x-www-form-urlencoded`},body:new URLSearchParams({client_id:i,grant_type:`authorization_code`,code:e,redirect_uri:a,code_verifier:t})})).json();if(n.access_token)return sessionStorage.setItem(`spotify_access_token`,n.access_token),sessionStorage.setItem(`spotify_token_expires_at`,String(Date.now()+n.expires_in*1e3)),n.access_token;throw Error(`Failed to retrieve access token`)}function p(){return!!m()}function m(){let e=sessionStorage.getItem(`spotify_token_expires_at`);return e&&Number(e)<=Date.now()?(h(),null):sessionStorage.getItem(`spotify_access_token`)}function h(){sessionStorage.removeItem(`spotify_access_token`),sessionStorage.removeItem(`spotify_token_expires_at`)}function g(){h(),sessionStorage.removeItem(`spotify_code_verifier`),o?.disconnect()}function _(){h(),o?.disconnect(),window.location.reload()}function ee(){return new Promise((e,t)=>{if(window.Spotify)return e();window.onSpotifyWebPlaybackSDKReady=()=>e();let n=document.createElement(`script`);n.src=`https://sdk.scdn.co/spotify-player.js`,n.onerror=()=>t(Error(`Failed to load Spotify SDK`)),document.head.appendChild(n)})}async function te(e,t,n){await ee(),o=new Spotify.Player({name:`RockingAround Game`,getOAuthToken:e=>{let t=m();t?e(t):_()},volume:.8}),o.addListener(`ready`,({device_id:t})=>{s=t,e(t)}),o.addListener(`player_state_changed`,e=>{n&&n(e)}),o.addListener(`authentication_error`,_),o.addListener(`initialization_error`,({message:e})=>t(e)),o.addListener(`account_error`,({message:e})=>t(`Requires Spotify Premium`)),await o.connect()}async function ne(e){let t=m();if(!t){_();return}(await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${s}`,{method:`PUT`,body:JSON.stringify({uris:[`spotify:track:${e}`],position_ms:0}),headers:{"Content-Type":`application/json`,Authorization:`Bearer ${t}`}})).status===401&&_()}async function re(){await o?.pause()}async function ie(){o&&await o.togglePlay()}async function ae(){return o?await o.getCurrentState():null}var oe=n({getCurrentState:()=>P,handleCallback:()=>_e,hasSession:()=>fe,initPlayer:()=>ye,isCallback:()=>ge,login:()=>he,logout:()=>O,pauseTrack:()=>xe,playTrack:()=>be,togglePlay:()=>Se}),v=null,y=null,b=null,x=new EventTarget,S=`LvGUYsMTyIdFrQpl`,C=window.location.origin+window.location.pathname,se=`https://login.tidal.com/authorize`,ce=`https://auth.tidal.com/v1/oauth2/token`,w=[`playback`],T=`tidal_session`,le=`/api/tidal/audio`,E=null;function ue(){return E||(E=(async()=>{if(!(`serviceWorker`in navigator))throw Error(`This browser cannot route TIDAL audio (service workers are unavailable).`);let e=new URL(le,window.location.origin).href;await navigator.serviceWorker.register(`/rocking-around/tidal-sw.js?proxy=`+encodeURIComponent(e),{scope:`/rocking-around/`}),await navigator.serviceWorker.ready,!navigator.serviceWorker.controller&&await new Promise((e,t)=>{let n=setTimeout(()=>t(Error(`The TIDAL audio relay did not start. Please reload the page.`)),5e3);navigator.serviceWorker.addEventListener(`controllerchange`,()=>{clearTimeout(n),e()},{once:!0}),navigator.serviceWorker.controller&&(clearTimeout(n),e())})})(),E.catch(()=>{E=null}),E)}function D(){try{return JSON.parse(localStorage.getItem(T))||null}catch{return null}}function de(e){try{localStorage.setItem(T,JSON.stringify(e))}catch{}}function fe(){let e=D();return!!(e?.refreshToken||e?.expires>Date.now())}function O(){try{localStorage.removeItem(T)}catch{}}function pe(e){return Array.from(crypto.getRandomValues(new Uint8Array(e)),e=>`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`[e%66]).join(``)}async function me(e){let t=await crypto.subtle.digest(`SHA-256`,new TextEncoder().encode(e));return btoa(String.fromCharCode(...new Uint8Array(t))).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function he(){let e=pe(64),t=`tidal-`+pe(16);sessionStorage.setItem(`tidal_code_verifier`,e),sessionStorage.setItem(`tidal_oauth_state`,t);let n=new URL(se);n.search=new URLSearchParams({response_type:`code`,client_id:S,redirect_uri:C,scope:w.join(` `),code_challenge_method:`S256`,code_challenge:await me(e),state:t}),window.location.href=n.toString()}function ge(e){let t=e.get(`state`);return!!(t&&t===sessionStorage.getItem(`tidal_oauth_state`))}async function k(e){let t;try{t=await fetch(ce,{method:`POST`,headers:{"Content-Type":`application/x-www-form-urlencoded`},body:new URLSearchParams({client_id:S,...e}),signal:AbortSignal.timeout(12e3)})}catch{throw Error(`Could not reach TIDAL. Please try again.`)}let n=await t.json().catch(()=>null);if(!t.ok||!n?.access_token)throw Error(n?.error_description||`TIDAL login failed. Please log in again.`);let r=D(),i={token:n.access_token,refreshToken:n.refresh_token||r?.refreshToken,expires:Date.now()+Number(n.expires_in||3600)*1e3,grantedScopes:(n.scope||w.join(` `)).split(` `).filter(Boolean),userId:n.user_id??n.user?.userId??r?.userId};return de(i),i}async function _e(e){let t=sessionStorage.getItem(`tidal_code_verifier`);sessionStorage.removeItem(`tidal_code_verifier`),sessionStorage.removeItem(`tidal_oauth_state`),window.history.replaceState({},document.title,window.location.pathname),await k({grant_type:`authorization_code`,code:e,redirect_uri:C,code_verifier:t})}async function A(e){let t=D();if(!t)throw Error(`Please log in to TIDAL to play.`);return!e&&t.expires>Date.now()+6e4?j(t):(y||=(async()=>{if(!t.refreshToken)throw O(),Error(`Your TIDAL login expired. Please log in again.`);try{t=await k({grant_type:`refresh_token`,refresh_token:t.refreshToken})}catch(e){throw O(),e}let e=j(t);return x.dispatchEvent(new CustomEvent(`credentials`,{detail:e})),e})().finally(()=>{y=null}),y)}function j(e){return{clientId:S,token:e.token,expires:e.expires,requestedScopes:w,grantedScopes:e.grantedScopes,...e.userId==null?{}:{userId:String(e.userId)}}}var M=null;async function ve(){return M||(M=(async()=>{if(!window.isSecureContext||!navigator.requestMediaKeySystemAccess)return!1;let e=[{initDataTypes:[`cenc`],audioCapabilities:[{contentType:`audio/mp4; codecs="mp4a.40.2"`,robustness:`SW_SECURE_CRYPTO`}]}];for(let t of[`com.widevine.alpha`,`com.apple.fps.1_0`,`com.apple.fps`])try{return await navigator.requestMediaKeySystemAccess(t,t===`com.widevine.alpha`?e:[{initDataTypes:[`sinf`,`skd`],audioCapabilities:[{contentType:`audio/mp4`}]}]),!0}catch{}return!1})(),M)}var N=`This browser cannot play protected TIDAL audio (no Widevine/FairPlay). Open the app in regular Chrome, Edge, Firefox or Safari with "protected content" / DRM enabled.`;function P(){return v?{paused:v.getPlaybackState()!==`PLAYING`,position:v.getAssetPosition()*1e3,duration:(v.getPlaybackContext()?.actualDuration||30)*1e3}:null}async function ye(t,n,r){try{fe()&&await A(),ue().catch(()=>{}),v=await e(()=>import(`./dist-CFTgCJvh.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8])),v.bootstrap({outputDevices:!1,players:[{player:`shaka`,itemTypes:[`track`]}]}),v.setStreamingWifiAudioQuality(`LOW`),v.setEventSender({sendEvent(){}}),v.setCredentialsProvider({getCredentials:A,bus:e=>x.addEventListener(`credentials`,e)}),v.events.addEventListener(`playback-state-change`,()=>r(P())),v.events.addEventListener(`media-product-transition`,({detail:e})=>{r(P())}),v.events.addEventListener(`ended`,()=>r({...P(),paused:!0})),v.events.addEventListener(`error`,e=>{let t=e.detail?.errorCode||`unknown`;b=Error(t===`S4032`?N:`This TIDAL preview could not play (`+t+`). Please try again.`),n(b.message),r({...P(),paused:!0})}),t()}catch(e){n(e.message)}}async function be(e){if(!/^[0-9]+$/.test(String(e)))throw Error(`This card needs a numeric TIDAL track ID.`);if(!v)throw Error(`The TIDAL player is not ready yet.`);if(!await ve())throw Error(N);await ue(),b=null;let t,n=!1;try{await Promise.race([(async()=>{if(await v.load({productId:String(e),productType:`track`,sourceId:String(e),sourceType:`TRACK`}),n){await v.reset();return}if(b||(await v.play(),b))throw b})(),new Promise((e,r)=>{t=setTimeout(()=>{n=!0,v.reset().catch(()=>{}),r(Error(`The TIDAL preview took too long to load. Please try again.`))},2e4)})])}finally{clearTimeout(t)}}async function xe(){v&&await v.pause()}async function Se(){v&&(v.getPlaybackState()===`PLAYING`?await v.pause():(v.getMediaElement()?.ended&&await v.seek(0),await v.play()))}var F={spotify:r,tidal:oe},I=null;function L(){return F[I]}function R(){let e=sessionStorage.getItem(`pending_song`);return sessionStorage.removeItem(`pending_song`),e?(window.location.href=`${window.location.pathname}?song=${encodeURIComponent(e)}`,!0):!1}function Ce(){return Object.fromEntries(Object.entries(F).map(([e,t])=>[e,t.hasSession()]))}async function z(e){let t=F[e];if(!t)return;let n=new URLSearchParams(window.location.search),r=n.get(`song`)||n.get(`card`);if(r?sessionStorage.setItem(`pending_song`,r):sessionStorage.removeItem(`pending_song`),await B(),sessionStorage.setItem(`selected_provider`,e),t.hasSession()){R()||window.location.reload();return}await t.login()}function we(e){let t=F[e];t&&(t.logout(),sessionStorage.getItem(`selected_provider`)===e&&sessionStorage.removeItem(`selected_provider`),window.location.reload())}async function Te(){let e=new URLSearchParams(window.location.search),t=e.get(`code`);if(t){let n=Object.keys(F).find(t=>F[t].isCallback(e));if(n)return await F[n].handleCallback(t),I=n,sessionStorage.setItem(`selected_provider`,n),R(),{authenticated:!0,provider:n};window.history.replaceState({},document.title,window.location.pathname)}let n=sessionStorage.getItem(`selected_provider`);return I=F[n]?n:Object.keys(F).find(e=>F[e].hasSession())??null,I?{authenticated:!0,provider:I}:{authenticated:!1,provider:null}}async function Ee(e,t,n){if(L()){if(!L().hasSession()){e();return}await L().initPlayer(e,t,n)}}async function De(e){if(L()){if(!L().hasSession()){await z(I);return}await L().playTrack(e)}}async function B(){await L()?.pauseTrack()}async function Oe(){await L()?.togglePlay()}async function ke(){return L()?await L().getCurrentState():null}var Ae=`id,title,artist,album,year,spotify,tidal,apple,youtube,UniqueID\r
1,"Tutti Frutti","Little Richard","Here's Little Richard",1955,2iXcvnD3d1gfLBum0cE5Eg,80391223,,,b082a32d1ea4\r
2,"Hound Dog","Elvis Presley","Elvis: 30 #1 Hits",1956,,5119980,,,ec157a6b390b\r
3,"Banana Boat (Day-O)","Harry Belafonte","Calypso",1956,4fHDlIntTsRGSyTg5UYZYC,674903,,,f38290f0ee93\r
4,"Rockin' Robin","Bobby Day","Rockin' With Robin",1958,4FlYcJnfkeBpowEHJ72Bmt,17593309,,,50ffda0961b9\r
5,"Yakety Yak","The Coasters","Rhino Hi-Five: The Coasters",1958,7demHL0GXA6YmTNqw3Btz8,34399551,,,719a9de727ef\r
6,"Itsy Bitsy Teenie Weenie Yellow Polka-Dot Bikini","Brian Hyland","Greatest Hits",1960,3Aug2RunJbjGiz2CTtWu5l,103382831,,,ab404b71db79\r
7,"(What A) Wonderful World","Sam Cooke","The Man Who Invented Soul",1960,2g2GkH3vZHk4lWzBjgQ6nY,57755161,,,89f8e5972b13\r
8,"The Wanderer","Dion","",1961,,26542771,,,28cd447f6e25\r
9,"Jump in the Line","Harry Belafonte","The Best Of",1961,70mAceS5ArAqVj2OwDE4db,57724211,,,2ce5a04d9bbe\r
10,"Bring It On Home to Me","Sam Cooke","",1962,,4930157,,,6432b876e25b\r
11,"Love Me Do","The Beatles","",1962,,55163408,,,0925a046ea45\r
12,"From Me To You - Mono / Remastered","The Beatles","1",1963,1euKWJfJSfPhgSendPrcXb,55130598,,,2ac1198a228f\r
13,"I Want to Hold Your Hand","The Beatles","Past Masters, Vols. 1 & 2",1963,,55130600,,,de47aeb3f76c\r
14,"She Loves You - Remastered","The Beatles","Past Masters",1963,3MbjEDPm5qtuJxiC86PWKy,55130599,,,1dd9c8d36059\r
15,"Twist And Shout - Remastered 2009","The Beatles","Please Please Me",1963,5ZBeML7Lf3FMEVviTyvi8l,55163257,,,53fc7ae8b802\r
16,"A Hard Day's Night - Remastered 2015","The Beatles","1",1964,0mNQUZEATk2uItMUtiLWK5,55130565,,,5288e5987316\r
17,"Can't Buy Me Love - Remastered 2015","The Beatles","1",1964,7pQAq14Z73YUFMtxCyt0bG,55130571,,,1f9b7f555544\r
18,"You Really Got Me","The Kinks","",1964,,493118769,,,59b26ad6979a\r
19,"My Girl","The Temptations","",1964,,93228739,,,e3cc5add46a6\r
20,"I Can't Help Myself (Sugar Pie, Honey Bunch)","Four Tops","",1965,,77641490,,,daba88969105\r
21,"Help! - Remastered 2015","The Beatles","1",1965,3Smida2eCUsLzDcmZqXEZ3,55130682,,,f18dfeca441e\r
22,"Yesterday - Remastered 2015","The Beatles","1",1965,4E5rL7YL0hVUPqeMSpjEF2,55130694,,,af2c3d264b64\r
23,"(I Can't Get No) Satisfaction - Mono","The Rolling Stones","Out Of Our Heads",1965,2PzU4IB8Dr6mxV3lHuaG34,5693554,,,2285fde4fec1\r
24,"Good Vibrations","The Beach Boys","Made In U.S.A.",1966,,1392966,,,a021518de537\r
25,"Eleanor Rigby","The Beatles","Yellow Submarine",1966,,174078191,,,b3f4cc6c8f57\r
26,"Yellow Submarine - Remastered 2015","The Beatles","1",1966,7zRmGvtSy36Jr19U5OInJT,55130782,,,1585d182a8f8\r
27,"Paint It Black","The Rolling Stones","Through the Past, Darkly (Big Hits, Vol. 2)",1966,,13434396,,,35854f0368e7\r
28,"Ain't No Mountain High Enough","Marvin Gaye","",1967,,105505610,,,6bb15a637076\r
29,"Penny Lane - Remastered 2015","The Beatles","1",1967,7afyyi8zn4FzWbcJ70F56V,55130613,,,08f5b4816fac\r
30,"Light My Fire","The Doors","The Doors",1967,,389264,,,2f298c2d7566\r
31,"Brown Eyed Girl","Van Morrison","",1967,3yrSvpt2l1xhsV9Em88Pul,450090877,,,29f9d83309bb\r
32,"Mrs. Robinson - From ""The Graduate"" Soundtrack","Simon & Garfunkel","Bookends",1968,0iOZM63lendWRTTeKhZBSC,37667986,,,6ca9aead6bfa\r
33,"Do It Again","The Beach Boys","Made In U.S.A.",1968,,17176700,,,6cf9ea5fa71e\r
34,"Hey Jude - Remastered 2015","The Beatles","1",1968,3H7sv3Krffn15BufUuXzf3,55130617,,,f9ddec7d980a\r
35,"Ob-La-Di, Ob-La-Da - Remastered 2009","The Beatles","The Beatles",1968,1gFNm7cXfG1vSMcxPpSxec,55163306,,,56be06c51e62\r
36,"Fortunate Son","Creedence Clearwater Revival","",1969,4BP3uh0hFLFRb5cjsgLqDh,42685477,,,d98f2bdf35d2\r
37,"Spirit In The Sky - Deluxe Edition","Norman Greenbaum","",1969,,428746664,,,e976b0012022\r
38,"Come Together - Remastered 2015","The Beatles","1",1969,7iABnSNZciNepqGtjMQxxd,55130631,,,c6ec978d805d\r
39,"Here Comes The Sun - Remastered 2009","The Beatles","Abbey Road",1969,6dGnYIeXmHdcikdzNNDMm2,55130637,,,bbb9138e9053\r
40,"Have You Ever Seen The Rain","Creedence Clearwater Revival","Pendulum",1970,2LawezPeJhN4AWuSB0GtAU,77701512,,,81c306a821e4\r
41,"In the Summertime","Mungo Jerry","In the Summertime",1970,3RNyGLgSvmVRZ7xKUp8Wgd,490860774,,,2b1297eec081\r
42,"Cecilia","Simon & Garfunkel","",1970,6QhXQOpyYvbpdbyjgAqKdY,650233,,,680d55249384\r
43,"Lola","The Kinks","",1970,0UAJH0k4k3slcE83a9UGCe,491706930,,,1d8d04e41e2c\r
44,"Tiny Dancer","Elton John","",1971,,77652434,,,c93bb9766d29\r
45,"Coconut - Remastered","Harry Nilsson","Nilsson Schmilsson",1971,0LDgn9rOEU8BHOxSAkzzIN,33961730,,,feffb77c4842\r
46,"Brown Sugar","The Rolling Stones","",1971,,3043982,,,9e6489f80f7e\r
47,"Crocodile Rock","Elton John","Classic Elton John",1972,,328924,,,1d81eb7aa634\r
48,"Rocket Man (I Think It's Going To Be A Long, Long Time)","Elton John","Honky Chateau",1972,3gdewACMIVMEWVbyb8O9sY,334634,,,21df3190ed67\r
49,"Brandy (You're a Fine Girl)","Looking Glass","",1972,,4350147,,,0241b8ddb96f\r
50,"Superstition","Stevie Wonder","",1972,,77683246,,,2fa68cb8ab02\r
51,"Hooked On A Feeling","Blue Swede","Hooked On A Feeling",1973,6Ac4NVYYl2U73QiTt11ZKd,2909027,,,7109dec96c6e\r
52,"Goodbye Yellow Brick Road","Elton John","Goodbye Yellow Brick Road",1973,,77611092,,,f310b38e873f\r
53,"Money","Pink Floyd","Dark Side Of The Moon",1973,,55391792,,,ce92a32bcd1d\r
54,"Higher Ground","Stevie Wonder","",1973,,77666303,,,bc60f861ebaa\r
55,"Kung Fu Fighting","Carl Douglas","",1974,,493064051,,,28af07485f5e\r
56,"Rebel Rebel","David Bowie","Changesbowie",1974,,69761304,,,3be3fc1fb5e3\r
57,"Killer Queen","Queen","Queen: Greatest Hits",1974,,534097599,,,9ff74d13af7b\r
58,"Seven Seas of Rhye","Queen","Queen: Greatest Hits",1974,,534098033,,,717279a18ae5\r
59,"Mamma Mia","ABBA","Abba",1975,2TxCwUlqaOH3TIyJqGgR91,1771748,,,51606785a376\r
60,"Right Back Where We Started From","Maxine Nightingale","",1975,00s8dO3RWrFkBqC9JIy6ag,160886870,,,54a56ecb39fd\r
61,"Bohemian Rhapsody - Remastered 2011","Queen","",1975,2GAIycsMaDVtMtdvxzR2xI,534050211,,,0408b8a72999\r
62,"You're My Best Friend - Remastered 2011","Queen","Queen 40 Limited Edition Collector's Box Set",1975,4vEXJ6NvEwS8ptynkNswaa,534050203,,,3facabb0b96d\r
63,"Rich Girl","Daryl Hall & John Oates","The Essential Daryl Hall & John Oates",1976,5E3P9e1hvjyIOlFyqNB5eD,2919752,,,5e3f35acc747\r
64,"Somebody to Love","Queen","Queen: Greatest Hits",1976,,534050356,,,ee3c733dbad1\r
65,"Isn't She Lovely","Stevie Wonder","Songs In The Key Of Life",1976,3vqlZUIT3rEmLaYKDBfb4Q,79419404,,,f90890bf3780\r
66,"Play That Funky Music","Wild Cherry","'70s Greatest Hits",1976,,545672,,,c4b8c1201ca1\r
67,"Mr. Blue Sky","Electric Light Orchestra","Out Of The Blue",1977,74z2lfZ7fj3IqoK71lHkZw,53230853,,,a31eaca050ee\r
68,"The Chain - 2004 Remaster","Fleetwood Mac","",1977,,68714466,,,17eb3756f919\r
69,"Ca Plane Pour Moi","Plastic Bertrand","Plastic Bertrand",1977,4sf4Lq52b2iCoAgpge7a9g,255146671,,,5cf9400aec30\r
70,"We Will Rock You","Queen","",1977,4fVn54cP0hasdSHuJthQj1,541963983,,,6e0bd3cbb805\r
71,"September","Earth, Wind & Fire","Earth, Wind & Fire: Greatest Hits",1978,,106028079,,,482ac15ec794\r
72,"Grease","Frankie Valli","Grease (Soundtrack from the Motion Picture)",1978,,345814004,,,9348c65dc375\r
73,"You're the One That I Want","John Travolta & Olivia Newton-John","Grease (Soundtrack from the Motion Picture)",1978,,498295574,,,76bf2bd05f5b\r
74,"Don't Stop Me Now - Remastered 2011","Queen","Jazz",1978,7hQJA50XrCWABAu5v6QZ4i,534099493,,,51bae400cccb\r
75,"Boogie Wonderland (with The Emotions)","Earth, Wind & Fire","",1979,,15180969,,,876fd504c471\r
76,"Don't Bring Me Down","Electric Light Orchestra","Discovery",1979,4yQUu82EFI8MG6SpI8MAbs,7900624,,,4f73b067d622\r
77,"Escape (The Pina Colada Song)","Rupert Holmes","Partners In Crime",1979,5IMtdHjJ1OtkxbGe4zfUxQ,2286109,,,5e1d2fe1fc9b\r
78,"The Devil Went Down to Georgia","The Charlie Daniels Band","A Decade Of Hits",1979,383Xl5QTigwj3QiA3Qc6S7,4833873,,,17835cd192d2\r
79,"Rapper's Delight","The Sugarhill Gang","",1979,,70470863,,,dd15f9171362\r
80,"It's Still Rock and Roll to Me","Billy Joel","",1980,,1268199,,,78c159b87519\r
81,"You Make My Dreams (Come True)","Daryl Hall & John Oates","The Very Best of Daryl Hall / John Oates",1980,7HX9f8AMBl0vQxAoAzLqhS,560045,,,b329c6c49478\r
82,"9 to 5","Dolly Parton","9 To 5 And Odd Jobs",1980,4w3tQBXhn5345eUXDGBWZG,52534,,,00642d1ef9c3\r
83,"Louisiana Saturday Night","Mel McDaniel","I'm Countryfied",1980,50PU05RTGva8laKDwxED9Y,2893936,,,c6f539f3cd5b\r
84,"Another One Bites The Dust","Queen","",1980,291RmMazWAmDitFuD6NJCv,534099003,,,8af8227d093c\r
85,"Let's Groove","Earth, Wind & Fire","",1981,,15180993,,,bbb3d97f833a\r
86,"Don't Stop Believin'","Journey","",1981,77NNZQSqzLNqh2A9JhLRkg,1781737,,,88abb1c95365\r
87,"Give It To Me Baby","Rick James","",1981,,77815398,,,4e93df11fddf\r
88,"Super Freak","Rick James","",1981,,7451365,,,35bc48664254\r
89,"Maneater","Daryl Hall & John Oates","",1982,,99674926,,,64349187e8c6\r
90,"Nur geträumt","Nena","",1982,,491245788,,,a8ea907904a3\r
91,"Major Tom (Völlig Losgelöst)","Peter Schilling","Major Tom [Voellig Losgeloest]",1982,2qZQtey4lTwvvABVMrO4h8,169150,,,e93519ace455\r
92,"It's Raining Men","The Weather Girls","Success",1982,2IvetNzSZMH5gwjInoyr18,4710246,,,fa72ff20b0bb\r
93,"Rock ""n"" Roll Is King","Electric Light Orchestra","Secret Messages",1983,2EhHWAZrM4zgqqkZx7V291,92153967,,,c8923e81d581\r
94,"Sweet Dreams (Are Made of This) - 2005 Remaster","Eurythmics","Sweet Dreams (Are Made Of This)",1983,1TfqLAPs4K3s2rJMoCokcS,26965,,,aecb33508f6e\r
95,"99 Luftballons","Nena","",1983,2IJftBfq7pJ43tfnOR0RB3,491245790,,,eb2d1c3c4c84\r
96,"True - Single Edit","Spandau Ballet","Gold - The Best of Spandau Ballet",1983,6eDYgjKl4vUgRusxb7THDu,1398639,,,6f00d0254156\r
97,"Dancing In The Dark","Bruce Springsteen","The Essential Bruce Springsteen [Disc 2]",1984,,24385357,,,de24d7edc91d\r
98,"Footloose","Kenny Loggins","",1984,,5279199,,,33094fbdaf20\r
99,"Material Girl","Madonna","",1984,,2123750,,,22de6d0466ba\r
100,"Pride (In The Name Of Love)","U2","",1984,,3142287,,,e1021960c1bb\r
101,"Take on Me","a-ha","Hunting High and Low",1985,2WfaOiMkCvy7F5fcp2zZ8L,391687,,,20ba7a88df33\r
102,"Don't You (Forget About Me) - Remastered","Simple Minds","Celebrate",1985,0A4PZuepTcIQVvA5m7R0M1,7196915,,,1d2bbf334f3a\r
103,"Getcha Back","The Beach Boys","Made In U.S.A.",1985,,1392953,,,471414366b6a\r
104,"Livin' on a Prayer","Bon Jovi","Cross Road",1986,,93177984,,,966776dcca66\r
105,"You Give Love A Bad Name","Bon Jovi","Slippery When Wet",1986,4jlp53Zc5Aq2DQFmu41nvE,93177983,,,2ff98eea0f56\r
106,"You Can Call Me Al","Paul Simon","Graceland (25th Anniversary Deluxe Edition)",1986,0qxYx4F3vm1AOnfux6dDxP,15421944,,,24d32bb5c8f1\r
107,"La Bamba","Los Lobos","La Bamba / Charlena",1987,0uMMLry3hzWGn3q3loqMkm,3248011,,,bdb7f4d7fa6f\r
108,"Fishin' in the Dark","Nitty Gritty Dirt Band","Rhino Hi-Five: Nitty Gritty Dirt Band",1987,19Pwe795pS5bS2Jr57gHK3,3247682,,,70ddeee0c541\r
109,"I Think We're Alone Now","Tiffany","Tiffany",1987,4uvjOKsp7mSjrDhWdkLPBY,20746966,,,d4e1af18adbc\r
110,"With Or Without You","U2","",1987,,1218919,,,54ef6c388afd\r
111,"Song of the South","Alabama","Livin' Lovin' Rockin' Rollin': The 25th Anniversary Collection",1988,2uX5f3x2cObov0iDAPln4o,33918074,,,4e131747989f\r
112,"I'm Gonna Be (500 Miles)","The Proclaimers","",1988,66S14BkJDxgkYxLl5DCqOz,137251,,,9238d6d4adb1\r
113,"Angel Of Harlem","U2","",1988,,2570986,,,ede24afb67c3\r
114,"Desire","U2","",1988,,2570979,,,f0e90222db55\r
115,"We Didn't Start the Fire","Billy Joel","",1989,,1268210,,,68d3579636a4\r
116,"Sacrifice","Elton John","Love Songs",1989,,334676,,,0651d2523fc6\r
117,"Bad Love","Eric Clapton","Journeyman",1989,,250021580,,,d713f0d74e95\r
118,"Pretending","Eric Clapton","Journeyman",1989,,250021578,,,4cbd1ef713d0\r
119,"Boot Scootin' Boogie","Brooks & Dunn","#1s ... and then some",1991,7Fq9RwQxSn3kW85PrDUf0M,15608867,,,1808446faaab\r
120,"Two Princes","Spin Doctors","Pocket Full Of Kryptonite",1991,4ePP9So5xRzspjLFVVbj90,1311444,,,e1979c422a60\r
121,"Mysterious Ways","U2","",1991,,8939007,,,ab6dfe27c4ce\r
122,"One","U2","",1991,,341528698,,,3859353af24a\r
123,"What's Up?","4 Non Blondes","Bigger, Better, Faster, More !",1992,0jWgAnTrNZmOGmqgvHhZEm,634519,,,bc366dd1caa8\r
124,"Chattahoochee","Alan Jackson","A Lot About Livin' (And A Little 'Bout Love)",1992,59kHPbwyyCApYA8RQQEuXm,668708,,,60dca3289669\r
125,"Achy Breaky Heart","Billy Ray Cyrus","The Best Of Billy Ray Cyrus: Cover To Cover",1992,5PuY53BL7j4zjTFPRRA2zL,631991,,,950fec3ed691\r
126,"No Rain","Blind Melon","Blind Melon",1992,6txWz9UapYHVxEd7dDIHXT,1332492,,,e536be30fc37\r
127,"Creep","Radiohead","Pablo Honey",1992,6b2oQwSGFkzsMtQruIWm2p,58990486,,,f076d1b420cb\r
128,"Mr. Jones","Counting Crows","August And Everything After",1993,5DiXcVovI0FcY2s0icWWUu,2569985,,,798bc90f4a82\r
129,"Mr. Smiley","Mustard Plug","Big Daddy Multitude (2010 Re-Issue)",1993,12GEszobr92vUXs4LCdwjK,144599456,,,ecae7ce1a00f\r
130,"Slide Away - Remastered 2004","The Verve","This Is Music: The Singles 92-98",1993,7t2VJA18zdX0bW7W5GNsVb,64529837,,,93b736c5e450\r
131,"Stay (Faraway, So Close!)","U2","The Best Of 1990-2000",1993,,638892,,,750510670df4\r
132,"Can You Feel The Love Tonight","Elton John","Love Songs",1994,,34186764,,,74b50458466d\r
133,"Circle Of Life","Elton John","Love Songs",1994,,34186762,,,60402aff80e9\r
134,"I'm Tore Down","Eric Clapton","From The Cradle",1994,,249998028,,,d672c78020f1\r
135,"Motherless Child","Eric Clapton","From The Cradle",1994,,249998034,,,e708dbdd7564\r
136,"Sold (The Grundy County Auction Incident)","John Michael Montgomery","John Michael Montgomery",1995,0NLBwQBYJhEM9t3KAMPFVR,282053,,,bcc691ec2f95\r
137,"Wonderwall","Oasis","Stop The Clocks",1995,4w7RuuQAVP0JXlAom3z1aC,156876007,,,8e43b6053a16\r
138,"Aeroplane","Red Hot Chili Peppers","One Hot Minute",1995,0VLdJcQUsqHBBwqPp4CIKJ,304823,,,9356cd0cdafc\r
139,"Peaches","The Presidents Of The United States Of America","The Presidents of The United States of America: Ten Year Super Bonus Special Anniversary Edition",1995,3VEFybccRTeWSZRkJxDuNR,482266150,,,dd768b61e26d\r
140,"I Like It, I Love It","Tim McGraw","All I Want",1995,3IvcWWehbBcBR4YZxlGM9R,45156374,,,ce874dce1485\r
141,"The Distance","Cake","Fashion Nugget",1996,,668138,,,b7c1267b888d\r
142,"Beer","Reel Big Fish","Turn The Radio Off",1996,7qEm8Z4KFLdCMlv96KykVd,2994714,,,dea6ec25f040\r
143,"Santeria","Sublime","Sublime",1996,6cJqlSO19vsfCsH1FeFI35,62096434,,,46675a8474b1\r
144,"What I Got","Sublime","Sublime",1996,3oVSsJXNADnYAnZWiEWFJH,62096430,,,f9dafbfeb2a0\r
145,"Save Tonight","Eagle-Eye Cherry","Desireless",1997,1t2Hq2WIBcZINOEnK6mdJG,610923,,,c64ff607e8d1\r
146,"You","Mustard Plug","",1997,,144617625,,,f0bc6484ad63\r
147,"Come on Eileen","Save Ferris","It Means Everything",1997,4Z4xFENnvMnRDPpAx5wpaO,641390,,,9628020594e8\r
148,"The Impression That I Get","The Mighty Mighty Bosstones","Let's Face It",1997,1ru5R5iSawvuMELqKXxLjS,320174834,,,daa26efdce96\r
149,"Bitter Sweet Symphony","The Verve","This Is Music: The Singles 92-98",1997,1WYEDcS7WGjv0rG7rmMX3o,77892506,,,fa709635a955\r
150,"One Week","Barenaked Ladies","Stunt",1998,1C0pmryC2MdXfa7MZ9uIrU,7861567,,,eaf5a1eae08e\r
151,"I'll Make a Man Out of You","Donny Osmond","Mulan",1998,28UMEtwyUUy5u0UWOVHwiI,47940552,,,b288dda4b0bf\r
152,"Take On Me","Reel Big Fish","",1998,,33899608,,,dfd74b5e9a69\r
153,"Closing Time","Semisonic","Feeling Strangely Fine",1998,087OBLtoeS3Q6j0k6tMNAI,96961926,,,a48a2bfc0f7c\r
154,"All The Small Things","blink-182","Enema Of The State",1999,2m1hi0nfMR9vdGC8UcrnwU,173565588,,,046f461ba872\r
155,"Otherside","Red Hot Chili Peppers","Californication",1999,64BbK9SFKH2jk86U3dGj2P,233357,,,38f3efef3088\r
156,"Scar Tissue","Red Hot Chili Peppers","Californication",1999,1G391cbiT3v3Cywg8T7DM1,304805,,,6bc7fba9869a\r
157,"All Star","Smash Mouth","",1999,2P1ZqQq8rQtmV7BLZ0Junn,1300228,,,1a3c9fe5acd1\r
158,"She's so High","Tal Bachman","Tal Bachman",1999,7mnGQesk1TzQLzQ9bYWZPR,1311156,,,c9968ac5d167\r
159,"It's My Life","Bon Jovi","Crush",2000,0v1XpBHnsbkCn7iJ9Ucr1l,35981744,,,7be8f6c32c18\r
160,"Yellow","Coldplay","Parachutes",2000,3AJwUDP919kvQ9QcozQPxg,120272,,,ad27feb2d2b3\r
161,"Beautiful Day","U2","",2000,1VuBmEauSZywQVtqbxNqka,399825,,,f72f8eecb463\r
162,"Walk On","U2","All That You Can't Leave Behind",2000,,7225671,,,e21d6492dd33\r
163,"The Middle","Jimmy Eat World","The Middle",2001,30FHk0GVCbVwoC6jmJTg0r,77624459,,,090c3a788905\r
164,"I'm A Believer - From ""Shrek"" Motion Picture Soundtrack","Smash Mouth","Shrek",2001,0mBL2JwjNYKtdFacHxvtJt,572109,,,ca83ec05d7a9\r
165,"Last Nite","The Strokes","Is This It",2001,3SUusuA9jH1v6PVwtYMbdv,1798871,,,a966fb750521\r
166,"Someday","The Strokes","Is This It",2001,7hm4HTk9encxT0LYC0J6oI,1798946,,,896d2b64db54\r
167,"Island In The Sun","Weezer","Weezer",2001,2MLHyLy5z5l5YRp7momlgw,573345,,,1e711dc0c588\r
168,"Jerk It Out","Caesars","",2002,0O8XCrGlVsaKnErfcTSSFU,157649,,,135540d2b369\r
169,"The Scientist","Coldplay","A Rush of Blood to the Head",2002,75JFxkI2RXiU7L9VXzMkle,128605,,,313d1797ee16\r
170,"This Love","Maroon 5","Songs About Jane: 10th Anniversary Edition",2002,55vBk4ODkxRVSaHbKxWBn6,331558,,,666bbd65556c\r
171,"By the Way","Red Hot Chili Peppers","By the Way",2002,1f2V8U1BiWaC9aJWmpOARe,304859,,,bc3eb055e7fb\r
172,"Dreaming of You","The Coral","The Coral",2002,2BodCfcjTxsHSoQq6uFBlJ,57223530,,,b210e777e83c\r
173,"Beer For My Horses","Toby Keith","Unleashed",2002,7E2DqvnVtbIrFrL5X6YH9Q,569253,,,da89182b2de3\r
174,"What Was I Thinkin'","Dierks Bentley","Dierks Bentley",2003,0r8iDf65NHgFgZOGLwj5r8,1352691,,,2087d02311f3\r
175,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,,,a08eae93f89e\r
176,"Are You Gonna Be My Girl","Jet","Get Born",2003,305WCRhhS10XUcH6AEwZk6,493931266,,,a3d8670793fb\r
177,"Hey Ya!","Outkast","The Way You Move / Hey Ya!",2003,3AszgPDZd9q0DpDFt4HFBy,1772295,,,b5f15a52071e\r
178,"A Moment of Silence","Streetlight Manifesto","Everything Goes Numb",2003,2aF3ytxtQtmlYN56NOGN7w,73530257,,,6a9a49918ea4\r
179,"Everything Went Numb","Streetlight Manifesto","Everything Goes Numb",2003,2I3HfKZFH69dLwhapHrI9o,73530249,,,742bd552bc4a\r
180,"Mr. Brightside","The Killers","Hot Fuss",2003,7oK9VyNzrYvRFo7nQEYkWN,150850052,,,23bf925e8631\r
181,"Seven Nation Army","The White Stripes","Elephant",2003,3m6KkYKdnbffMpGd9Pm9FP,156600940,,,5be4a4c8d506\r
182,"Take Me Out","Franz Ferdinand","Franz Ferdinand",2004,6ooluO7DiEhI1zmK94nRCM,3751639,,,c4c134ad33be\r
183,"Somewhere Only We Know","Keane","Hopes And Fears",2004,0ll8uFnc0nANY35E0Lfxvg,361008130,,,b54e2943ca60\r
184,"Float On","Modest Mouse","Good News For People Who Love Bad News",2004,2lwwrWVKdf3LR9lbbhnr6R,61471,,,72931307f9a4\r
185,"All These Things That I've Done","The Killers","Hot Fuss",2004,0kYUrLVQOfx21xuXu7OGrT,150850057,,,622fde01b8f4\r
186,"Somebody Told Me","The Killers","Hot Fuss",2004,7HGTkn2aX7MNdKs7nV2xBt,23273348,,,bcdd46352ad0\r
187,"Good Directions","Billy Currington","Doin' Somethin' Right",2005,7GQjJEwqlp6m5HNWVQd6OR,35730824,,,88744cb29cfe\r
188,"Before He Cheats","Carrie Underwood","Some Hearts",2005,0ZUo4YjG4saFnEJhdWp9Bt,537082,,,94d5b874f774\r
189,"Jesus, Take the Wheel","Carrie Underwood","Some Hearts",2005,3lec3CzDPAxsZokPph5w87,537079,,,24722b24ec32\r
190,"Dance, Dance","Fall Out Boy","Dance, Dance",2005,5CyMpPsFbJZZm4UlQAW2Yr,3684437,,,8e2d00a14d8c\r
191,"Feel Good Inc.","Gorillaz","Demon Days",2005,0d28khcov6AiegSCpG5TuT,1404361,,,63fbd18c4597\r
192,"Banana Pancakes","Jack Johnson","In Between Dreams",2005,451GvHwY99NKV4zdKPRWmv,77660808,,,6804782e74c8\r
193,"How to Save a Life","The Fray","",2005,5fVZC9GiM4e8vu99W0Xf6J,5119488,,,d31a20312767\r
194,"International Harvester","Craig Morgan","Little Bit Of Life",2006,0Ta3jOf8m9yCSWMVwd8Qlf,487200994,,,a70d997fa511\r
195,"Crazy","Gnarls Barkley","St. Elsewhere",2006,1vxw6aYJls2oq3gW0DujAo,314701,,,08a3311b3f5e\r
196,"Would You Go With Me","Josh Turner","Your Man",2006,1KhrAWvLIjRlQIJtSTgvsi,4036044,,,9148f4193f2d\r
197,"Starlight","Muse","Black Holes and Revelations",2006,3skn2lauGk7Dx6bVIt5DVj,2844707,,,ded037f857fe\r
198,"If You're Going Through Hell (Before The Devil Even Knows)","Rodney Atkins","If You're Going Through Hell",2006,7vSn3VNbzOtPebdj6ZSebj,45156892,,,7b16433f9137\r
199,"Hips Don't Lie (feat. Wyclef Jean)","Shakira","Oral Fixation, Vol. 2 (Expanded Edition)",2006,3ZFTkvIE7kyPt6Nu3PEa7V,438736569,,,57998f39ad24\r
200,"Keasbey Nights","Streetlight Manifesto","Keasbey Nights",2006,0qiGzj3aAC2TuM3sPoWTUJ,73636104,,,13ccecaedc46\r
201,"Chelsea Dagger","The Fratellis","Costello Music",2006,3ItzRpwvKtkDSNdRSjXu7Z,111299175,,,a4ad43371413\r
202,"Fluorescent Adolescent","Arctic Monkeys","Favourite Worst Nightmare",2007,2HYaqJitHc9qiG68vc0JIm,14831207,,,0599a4491424\r
203,"Kids","MGMT","Oracular Spectacular",2007,1jJci4qxiYcOHhQR247rEU,1317019,,,9146ba5d14fe\r
204,"Grace Kelly","MIKA","Life In Cartoon Motion",2007,2SDx0PooHZI1SQKR0y44bs,1219371,,,b039e96b1d1b\r
205,"Somewhere In the Between","Streetlight Manifesto","",2007,1Bk8XNIzzXB3xGfWSLC2qK,73531623,,,607b3d510df1\r
206,"We Will Fall Together","Streetlight Manifesto","",2007,0plo6KjgjTcRhj7Fn8oemk,73531618,,,c3dc7691eaed\r
207,"People Are Crazy","Billy Currington","Little Bit Of Everything",2008,5JnLiuMgRAWoHYOhatFP3s,290729079,,,113327658a35\r
208,"Ain't No Rest for the Wicked","Cage The Elephant","Cage The Elephant",2008,3kb72STxc2959ZqsTwu52i,19573423,,,abb76f07fea9\r
209,"Viva La Vida","Coldplay","",2008,3Fcfwhm8oRrBvBZ8KGhtea,288744882,,,0e3aba851b76\r
210,"Dog Days Are Over","Florence + The Machine","",2008,1YLJVmuzeM2YSUkCCaTNUB,4951057,,,37322c1ea300\r
211,"You and I","Ingrid Michaelson","Be OK",2008,4oeRfmp9XpKWym6YD1WvBP,139906975,,,cac223ce7489\r
212,"Daylight","Matt and Kim","Grand",2008,2I43coEbzFSTMGO3kCjLMB,522225428,,,f3f3ab1c0062\r
213,"A-Punk","Vampire Weekend","Vampire Weekend",2008,5dKBaysNJtfpyNTRa5lqDb,2209795,,,b38c7c2556ae\r
214,"Chicken Fried","Zac Brown Band","The Foundation",2008,0LQtEJt7x0s6knb6RKdRYc,197087480,,,523821ff32e4\r
215,"And We Danced (feat. Ziggy Stardust)","Macklemore","The Unplanned Mixtape",2009,1FCQEg7wOK9IIBuxx63krr,52730117,,,e78d3ede4be6\r
216,"Haven't Met You Yet","Michael Bublé","Crazy Love",2009,4fIWvT19w9PR0VVBuPYpWA,19373470,,,b7c3e70d155e\r
217,"Uprising","Muse","The Resistance",2009,4VqPOruhp5EdPBeR92t6lQ,3083287,,,171a04a555b1\r
218,"Secrets","OneRepublic","Waking Up",2009,0tgnTzjIkj8mVVEh0SNH0t,453505823,,,75d20b7e4fc3\r
219,"Fireflies","Owl City","Ocean Eyes",2009,3DamFFqW32WihKkTVlwTYQ,3140991,,,df8f56b2f3c7\r
220,"Lisztomania","Phoenix","Wolfgang Amadeus Phoenix",2009,4esUVfYnFcCCVHntx9FQCb,390710655,,,cfa02fbe03f4\r
221,"Brown Eyed Girl","Reel Big Fish","Fame, Fortune, And Fornication",2009,2lbAU3IQytWjl9b0LLuztk,385585158,,,dad001840421\r
222,"Butch","Saint Motel","ForPlay",2009,5ZQWNRoJsfkByZFHqCB92J,28204103,,,5e6bc2bf7f59\r
223,"Pumped Up Kicks","Foster The People","Torches",2010,1G5RlnmO3GzNdKCDNSgT5W,25280917,,,d33221c20cfa\r
224,"Give Me Hope","New Politics","A Bad Girl In Harlem",2010,53l4bzW4sr5jKyb8tMv8S7,20067427,,,4eb02fa6dbf4\r
225,"Hell","Streetlight Manifesto","99 Songs of Revolution: Volume I",2010,,73532317,,,9667cc5ced8a\r
226,"Such Great Heights","Streetlight Manifesto","",2010,26rMsVy6Oa4rK9ue7GW0gU,73532326,,,73711bcc9cbd\r
227,"Stuck Like Glue","Sugarland","The Incredible Machine",2010,0JcKdUGNR7zI4jJDLyYXbi,4511573,,,d0ca3f9095c0\r
228,"What You Know","Two Door Cinema Club","Tourist History",2010,6jrMVRReY24qzCfe1BRrww,21410891,,,ff99c950f56d\r
229,"Cough Syrup","Young the Giant","Young The Giant",2010,1UqhkbzB1kuFwt2iy4h29Q,6441308,,,8e70b4808f08\r
230,"My Body","Young the Giant","Young The Giant",2010,0bfY17lNbEp2Wnw6YipXQB,6441306,,,2e9c57c8368e\r
231,"Trojans","Atlas Genius","When It Was Now",2011,0wDEiGfq4pw7FAkYKpkwMo,19690802,,,77020c404fef\r
232,"Safe And Sound","Capital Cities","In A Tidal Wave Of Mystery",2011,0oFvhxNf3mBII26pPI3a5I,174840352,,,67d8a3cc6f07\r
233,"Brighter Than The Sun","Colbie Caillat","",2011,5YTtTbqxUzJHD3CpbNHerP,131069512,,,710e3bba879e\r
234,"Don't Stop (Color on the Walls)","Foster The People","",2011,11EvmoyFXs3aQMgAvL6DOZ,25280919,,,7acd84be8821\r
235,"Houdini","Foster The People","Torches",2011,1izCycxk4xx1Bsy2JDrCIS,25280922,,,d6fa286c8295\r
236,"We Are Young (feat. Janelle Monáe)","fun.","",2011,3ehrxAhYms24KLPG8FZe0W,7984974,,,432e62e9cbfa\r
237,"Everybody Talks","Neon Trees","Everybody Talks",2011,5JGxJFdgOQdJZdmyEzDtTj,140321191,,,34611a6803a6\r
238,"Little Talks","Of Monsters and Men","My Head Is An Animal",2011,2ihCaVdNZmnHZWt0fvAM7B,14367903,,,3fcfa0be3256\r
239,"This Head I Hold","Electric Guest","",2012,1tzPSule9WZ9B8SujHv8fp,43419239,,,8fc146435dcd\r
240,"Some Nights","fun.","Some Nights",2012,31ToclvJik88LlsHemxXFX,14989955,,,7ea8196cc7ca\r
241,"Demons","Imagine Dragons","",2012,1Ntj0hZfncXCQ5hij7igIE,18692667,,,707dde8a63a9\r
242,"Mountain Sound","Of Monsters and Men","My Head Is An Animal",2012,3SPVZJzf1Hs30rB6yXVf2y,14367900,,,fd9e1d440c7e\r
243,"Take a Walk","Passion Pit","Gossamer",2012,4Sfa7hdVkqlM8UW5LsSY3F,16300003,,,e6cfe0c60016\r
244,"Somebody That I Used to Know","Pentatonix","PTX, Vol. 1",2012,5XPSElbh3y0S1Jl0ggpwQr,29712066,,,b3e1490405fa\r
245,"San Francisco","The Mowgli's","Waiting For The Dawn",2012,2eQOMQkStoRUQyq6HGh1iG,35204253,,,ade039090f39\r
246,"Anna Sun","WALK THE MOON","Walk The Moon",2012,3e0yTP5trHBBVvV32jwXqF,15623768,,,a5c8af4a1aab\r
247,"Pompeii","Bastille","",2013,3gbBpTdY8lnQwqxNCcf795,23496115,,,4b10feaa47e6\r
248,"The Phoenix","Fall Out Boy","Save Rock And Roll",2013,53AuxddsgPSlqM619nJhSd,19715655,,,a8360c9c617e\r
249,"The Walker","Fitz and The Tantrums","More Than Just a Dream",2013,0Nk7bSn0MItonkR0GNs3mj,25349519,,,24a2cd156206\r
250,"Counting Stars","OneRepublic","",2013,074cMMOKjFLwdaTjKW1wBs,29862937,,,51f2d5e395ed\r
251,"The Three of Us","Streetlight Manifesto","The Hands That Thieve",2013,2xrRBqEanoBaA0tOgYy18V,73531945,,,0bcadc74288d\r
252,"House of Gold","Twenty One Pilots","Vessel",2013,36tghkPg1AO4HsAzo6YpPp,18371116,,,626fe104da74\r
253,"Unbelievers","Vampire Weekend","Modern Vampires of the City",2013,51DZ0wUocQ8sQfjnibXVcD,20134595,,,23aa30cda273\r
254,"Riptide","Vance Joy","",2013,1KqlVt63Q4bl1VdSlymr5C,303106814,,,81929be570b3\r
255,"Uptown Funk (feat. Bruno Mars)","Mark Ronson","Uptown Special",2014,32OlwWuMpZ6b0aN2RZOeMS,39249713,,,c02d669b43ac\r
256,"Reflections","MisterWives","Our Own House",2014,2PtBhfoPZ6VYtXkrE5FrCH,40954774,,,e5ebb6602b33\r
257,"Cold Cold Man","Saint Motel","My Type EP",2014,6RKGBcDtgzXx21zUjpeu6F,32805227,,,48c62de78549\r
258,"Stacy’s Mom","Scott Bradlee's Postmodern Jukebox","Selfies on Kodachrome",2014,3TOGVJQaCQPE4J3JiSncwG,69185306,,,658d64a45a0d\r
259,"Timber","Scott Bradlee's Postmodern Jukebox","Twist Is The New Twerk",2014,34gz4EkB8fx3JMe4Qb3op1,58875131,,,6ad6bc0dda87\r
260,"Beware the Dog","The Griswolds","Be Impressive",2014,0XhsBJl0pj3V1nA57R0BZW,65096871,,,3df45082d2b9\r
261,"Shut Up and Dance","WALK THE MOON","",2014,1K66si1ZELsRZzg7m7mcps,37896389,,,dd9dd5471570\r
262,"Chasin' Honey","Wild Party","Phantom Pop",2014,0Z0iYAtKYswMYXL3kJtdO4,563756437,,,de878633f5ef\r
263,"Hello","Adele","Hello",2015,0ENSn4fwAbCGeFGVUbXEU3,62300893,,,fa9734f238e3\r
264,"Waiting For Love","Avicii","Stories",2015,6nsLzJfvp5OLd4mgqUJkpq,79272716,,,0db2b23ef480\r
265,"Uma Thurman","Fall Out Boy","",2015,2XW3MZUoXb4MhIVAN7dVzD,39356913,,,d2c5672c3f47\r
266,"South","Hippo Campus","South - Single",2015,64TjzuxG5PJ7payjphrOC0,49686154,,,30a59dace8d2\r
267,"Bad Romance","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,5xrHvVmSF3ui0EKI8FArv3,58875147,,,67b073f89af2\r
268,"Paper Planes","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,1YQY7ODoHmrfDwzgshRBKq,58875153,,,d72581e098ec\r
269,"Take Me To Church","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,2YwlwV98tjcKF664eEAAyV,58875155,,,fc6e7215c86d\r
270,"Tear in My Heart","Twenty One Pilots","Blurryface",2015,3bnVBN67NBEzedqQuWrpP4,45191321,,,25e1c137d593\r
271,"Sweet Talk","Saint Motel","saintmotelevision",2016,6kcHg7XL6SKyPNd78daRBL,66022010,,,7fbc9e64cbc4\r
272,"MMMbop","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,2jt8tEFZ4qZJ1ax3b0Io5f,69185267,,,73c52d6eaac7\r
273,"My Heart Will Go On","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,3qhgkT74IpVAjk5xjNylHC,69185277,,,680b6a706161\r
274,"Too Late","The Happy Fits","Awfully Apeelin'",2016,1dSxgR97icbbeB6Q01VJk4,295387343,,,fc719d70756e\r
275,"By My Side","The Interrupters","Say It Out Loud",2016,2qKwTR3n4kBv0Gr0DAd0Zg,121046448,,,540427a58e02\r
276,"On A Turntable","The Interrupters","Say It Out Loud",2016,5BdbpAak9RUhjwT8fwciZe,121046451,,,c99541a4deba\r
277,"didya think","Arlie","Wait",2017,4HOg84QsolNLzNp08qZ3sX,256364542,,,45c188833fd3\r
278,"Shape of You","Ed Sheeran","÷",2017,7qiZfU4dY1lWllzX7mPBI3,219082768,,,b97a71e2ec0a\r
279,"Delirium Tremendous","Felix Hagan & the Family","Attention Seeker",2017,0wffwRViqvZPRIgAfw1Oab,81450107,,,53d6defe5f4b\r
280,"Buttercup","Hippo Campus","Landmark",2017,6iCJCZqDJjmBxt07Oid6FI,70740155,,,4045bef4b349\r
281,"Feel It Still","Portugal. The Man","Woodstock",2017,6QgjcU0zLnzq5OrUoSZ3OK,74886171,,,10d2023bb8af\r
282,"Shotgun","George Ezra","Staying at Tamara's",2018,4ofwffwvvnbSkrMSCKQDaC,85905133,,,b7d1a82f55df\r
283,"still feel.","half•alive","Now, Not Yet",2018,48XkVAagIoQHCsOlJtXUd5,114925742,,,0bec2509d5bc\r
284,"Down To The Honkytonk","Jake Owen","Greetings From...Jake",2018,1HsoSwqtwGBNIHZM7lPmQR,530162466,,,cf579ccbf87c\r
285,"Caught Up In The Country","Rodney Atkins","Caught Up In The Country",2018,4aGG4VOWGv9RwlYQNsBrkE,103407626,,,165ea5eeee9c\r
286,"Achey Bones","The Happy Fits","Concentrate",2018,3uID7q0TIJR2049Uemxa7r,557877117,,,25b9e9eaffa3\r
287,"Heart of a Dancer","The Happy Fits","Concentrate",2018,6LREFtAefeqdTNdBAdmd99,557877125,,,4098e7a166b5\r
288,"Africa","Weezer","Africa",2018,36Pim2ANczp82lCWIb8GHy,89225164,,,2e16ab2e3d7d\r
289,"Good Vibes","Chris Janson","Real Friends",2019,1XVqh0dC0PIl72f2mQhsVt,103044408,,,cf878d29fde5\r
290,"Kill the Sun","Motherfolk","Family Ghost",2019,34uXlhi3eN9jpO95CgeV0o,324526050,,,55062a027bdf\r
291,"Hell's Comin' with Me","Poor Man's Poison","Hell's Comin' with Me",2019,5N0lmKQfQpXNQNjUGlPKIT,285850539,,,d26db08e3231\r
292,"Sisters","Saint Motel","The Original Motion Picture Soundtrack",2019,64QZsTSNEUiqs8KeOPIrpg,186509846,,,8608aaa7897e\r
293,"Van Horn","Saint Motel","The Original Motion Picture Soundtrack",2019,78bsqObGFUD5ntweePBhIY,119254644,,,ef597b40696f\r
294,"Disco","Surf Curse","Disco",2019,2Lumsra3kuU61wXkEKzKaK,189324485,,,2756df52cb1a\r
295,"honey","Coastal Club","honey",2020,4YCVwSOabpy5DeaxRjUok1,133984011,,,a3cd3da05236\r
296,"Heat Waves","Glass Animals","Dreamland",2020,02MWAaffLxlfxAUY7c5dvx,150502627,,,35cb096eda5d\r
297,"Hazel","Kids That Fly","",2020,,492322033,,,423af8ace5c4\r
298,"SUPERBLOOM","MisterWives","SUPERBLOOM",2020,2HvtedoEeymVWrBPyAMNwZ,135506897,,,c3725f5bb23c\r
299,"She Wants Me (To Be Loved)","The Happy Fits","What Could Be Better",2020,1yS9wpv8GW2c8tHC7P85JJ,556436919,,,361089b5165a\r
300,"Island Honey","Black Pontiac","",2021,4ZVSYUXCqarp67Wd2mrt9E,320834015,,,8179a8f02866\r
301,"its alright :)","Kevin Walkman","its alright :)",2021,66nBMj6cwE9V6LxcpQQpFs,290400852,,,a14a7be68567\r
302,"Make You Make Believe","My Kid Brother","Happy.Mad.Weird.Sad",2021,4Q3uG8mweBRZ9kosJ6C01E,251352904,,,c0846ec4d504\r
303,"good 4 u","Olivia Rodrigo","SOUR",2021,4ZtFanR9U6ndgddUvNcjcG,184786799,,,e58c74b24e75\r
304,"cough drops","almost monday","cough drops",2022,5Jpj3lCgX06bu6STIjUYKN,250815905,,,772b659cbeaf\r
305,"sunburn","almost monday","DIVE",2022,5Q9hC6Z25FeRL9xjJIrIwQ,388023192,,,50df973c57a0\r
306,"strawberry chainsaw","JAWNY","It’s Never Fair, Always True",2022,4lAasiKJZR4CkDygazvpvB,278653944,,,4e221cea74f0\r
307,"Spilt Salt","My Kid Brother","Happy.Mad.Weird.Sad",2022,1qpasIOsd7KIxqOX06FDGB,251352910,,,20866cc22b64\r
308,"Dive Bar Named Nirvana","Dogpark","",2023,,369958199,,,750743b5a896\r
309,"The Implication","Parrotfish","The Implication",2023,5KUK7rDJuv28K10lb1gM7r,291298255,,,c6eda9141c23\r
310,"can't slow down","almost monday","can't slow down",2024,1KdjbgMfPmQQANYVS2IfTJ,365138302,,,cd543b4134fd\r
311,"she likes sports","almost monday","DIVE",2024,0PksrXlYvVJ3gG5wwG1oKx,388023188,,,151ef712acd0\r
312,"you look so good","almost monday","",2024,,388027380,,,46f3787ce288\r
313,"TEXAS HOLD 'EM","Beyoncé","TEXAS HOLD 'EM",2024,7AYmToZ5y67fBjq4RLFbuq,353983142,,,c8de22be7a9d\r
314,"conversation","Coastal Club","all of the things you said",2024,2jpshlQDRRA3Kz9VmAo8x4,367911733,,,94c088594f06\r
315,"sequoia","almost monday","DIVE",2025,3dT6GGcgIy4yptrRA05Mhk,411935179,,,2e4ab5f4b19b\r
316,"Everything You Do","The Happy Fits","Wild in Love",2025,5kdYaZnxUur5ScyK0bVWBU,426887499,,,c0e43898be4b\r
317,"Shake Me","The Happy Fits","",2025,,435492955,,,7675a332570d\r
318,"The Nerve","The Happy Fits","",2025,,435492946,,,7bb5e9cb6aa8\r
`,je=`id,title,artist,album,year,spotify,tidal,apple,youtube,UniqueID\r
1,"Hey, Good Lookin'","Hank Williams","",1951,,94445479,,,cb5c7ec8a6ba\r
2,"I Walk the Line","Johnny Cash","",1956,,504205037,,,a611c6e803ef\r
3,"Crazy","Patsy Cline","",1961,,113299812,,,d5a1f5c3bc72\r
4,"Ring of Fire","Johnny Cash","",1963,,2045087,,,090516a0e733\r
5,"King of the Road","Roger Miller","",1965,,94444943,,,57c6f3ea1638\r
6,"Wichita Lineman","Glen Campbell","",1968,,1563329,,,f0c8ecef5b45\r
7,"Mama Tried","Merle Haggard","",1968,,1338347,,,65f585ae22b3\r
8,"Stand by Your Man","Tammy Wynette","",1968,,2815391,,,6b59ec439015\r
9,"Coal Miner's Daughter","Loretta Lynn","",1970,,94448773,,,e3f037377fef\r
10,"Take Me Home, Country Roads","John Denver","",1971,,35223314,,,f5c546fb7e34\r
11,"Jolene","Dolly Parton","",1973,,54518833,,,cff5b31fece2\r
12,"I Will Always Love You","Dolly Parton","",1974,,54518838,,,5f505aa10b65\r
13,"Luckenbach, Texas (Back to the Basics of Love)","Waylon Jennings","",1977,,40396,,,75f5af7eabdd\r
14,"The Gambler","Kenny Rogers","",1978,,1350603,,,a82d24510a40\r
15,"Mamas Don't Let Your Babies Grow Up to Be Cowboys","Willie Nelson","Greatest Hits (& Some That Will Be)",1978,2SSHYzoxRsFosKl81KRFz7,496151,,,602d47aa50ae\r
16,"Family Tradition","Hank Williams Jr.","",1979,,46996161,,,7cd4efe34439\r
17,"The Devil Went Down to Georgia","The Charlie Daniels Band","A Decade Of Hits",1979,383Xl5QTigwj3QiA3Qc6S7,4833873,,,17835cd192d2\r
18,"9 to 5","Dolly Parton","9 To 5 And Odd Jobs",1980,4w3tQBXhn5345eUXDGBWZG,52534,,,00642d1ef9c3\r
19,"He Stopped Loving Her Today","George Jones","",1980,,1304143,,,d4f2bbf33182\r
20,"Louisiana Saturday Night","Mel McDaniel","I'm Countryfied",1980,50PU05RTGva8laKDwxED9Y,2893936,,,c6f539f3cd5b\r
21,"On the Road Again","Willie Nelson","",1980,,23823025,,,ff1c43d4c79c\r
22,"Mountain Music","Alabama","The Essential Alabama 3.0",1982,68SAQUzxfEW1eKxZvhDDEm,3008364,,,a5b4b09bcb6e\r
23,"Amarillo by Morning","George Strait","",1982,,15300501,,,df9660e3cda9\r
24,"Dixieland Delight","Alabama","",1983,,687189,,,27f58e53201f\r
25,"Fishin' in the Dark","Nitty Gritty Dirt Band","Rhino Hi-Five: Nitty Gritty Dirt Band",1987,19Pwe795pS5bS2Jr57gHK3,3247682,,,70ddeee0c541\r
26,"Song of the South","Alabama","Livin' Lovin' Rockin' Rollin': The 25th Anniversary Collection",1988,2uX5f3x2cObov0iDAPln4o,33918074,,,4e131747989f\r
27,"The Dance","Garth Brooks","",1989,,,,,4849e2a79e76\r
28,"Friends in Low Places","Garth Brooks","",1990,,,,,34a8a95debad\r
29,"Don't Rock the Jukebox","Alan Jackson","",1991,,61318743,,,16f5285f7359\r
30,"Boot Scootin' Boogie","Brooks & Dunn","#1s ... and then some",1991,7Fq9RwQxSn3kW85PrDUf0M,15608867,,,1808446faaab\r
31,"Neon Moon","Brooks & Dunn","",1991,,514754,,,76a1e1a90faa\r
32,"The Night The Lights Went Out In Georgia","Reba McEntire","For My Broken Heart",1991,2MiXC2LfpsoeUP5RvMGEQ3,36266192,,,4ce9e6de682f\r
33,"Chattahoochee","Alan Jackson","A Lot About Livin' (And A Little 'Bout Love)",1992,59kHPbwyyCApYA8RQQEuXm,668708,,,60dca3289669\r
34,"Achy Breaky Heart","Billy Ray Cyrus","The Best Of Billy Ray Cyrus: Cover To Cover",1992,5PuY53BL7j4zjTFPRRA2zL,631991,,,950fec3ed691\r
35,"Should've Been a Cowboy","Toby Keith","",1993,,1764537,,,10ec63215966\r
36,"Check Yes or No","George Strait","",1995,,529249,,,3a39b3b6e563\r
37,"Sold (The Grundy County Auction Incident)","John Michael Montgomery","John Michael Montgomery",1995,0NLBwQBYJhEM9t3KAMPFVR,282053,,,bcc691ec2f95\r
38,"I Like It, I Love It","Tim McGraw","All I Want",1995,3IvcWWehbBcBR4YZxlGM9R,45156374,,,ce874dce1485\r
39,"Man! I Feel Like a Woman!","Shania Twain","",1997,,82489104,,,795f9d6d1d81\r
40,"She Thinks My Tractor's Sexy","Kenny Chesney","",1999,,517010,,,5f9e9745036f\r
41,"Ol' Red","Blake Shelton","Blake Shelton",2001,5wane5dFpp8xgriui6y0c7,3175135,,,caa22ffcdede\r
42,"Ten Rounds with Jose Cuervo","Tracy Byrd","",2001,,,,,d9fdd8d64674\r
43,"Beer For My Horses","Toby Keith","Unleashed",2002,7E2DqvnVtbIrFrL5X6YH9Q,569253,,,da89182b2de3\r
44,"Courtesy Of The Red, White And Blue (The Angry American)","Toby Keith","Unleashed",2002,0M7mWKqwTIaVjYyxfZmtTa,569249,,,9dcdcdbc1ef8\r
45,"What Was I Thinkin'","Dierks Bentley","Dierks Bentley",2003,0r8iDf65NHgFgZOGLwj5r8,1352691,,,2087d02311f3\r
46,"Pickin' Wildflowers","Keith Anderson","Three Chord Country and American Rock & Roll",2004,2GgIDaPLsowybB3WgxLWUj,55594,,,195e3da6b703\r
47,"Good Directions","Billy Currington","Doin' Somethin' Right",2005,7GQjJEwqlp6m5HNWVQd6OR,35730824,,,88744cb29cfe\r
48,"Before He Cheats","Carrie Underwood","Some Hearts",2005,0ZUo4YjG4saFnEJhdWp9Bt,537082,,,94d5b874f774\r
49,"Jesus, Take the Wheel","Carrie Underwood","Some Hearts",2005,3lec3CzDPAxsZokPph5w87,537079,,,24722b24ec32\r
50,"Wasted","Carrie Underwood","Some Hearts",2005,5d98TnYzxQmFE4vKgzWXuT,537076,,,155537babde3\r
51,"International Harvester","Craig Morgan","Little Bit Of Life",2006,0Ta3jOf8m9yCSWMVwd8Qlf,487200994,,,a70d997fa511\r
52,"Little Bit of Life","Craig Morgan","Little Bit Of Life",2006,1jSZ1IETySh2kDTnyfIE0I,487200992,,,528826bf2306\r
53,"Would You Go With Me","Josh Turner","Your Man",2006,1KhrAWvLIjRlQIJtSTgvsi,4036044,,,9148f4193f2d\r
54,"If You're Going Through Hell (Before The Devil Even Knows)","Rodney Atkins","If You're Going Through Hell",2006,7vSn3VNbzOtPebdj6ZSebj,45156892,,,7b16433f9137\r
55,"All-American Girl","Carrie Underwood","Carnival Ride",2007,2dRPQFwPqAmc42mDRnsDQu,1189483,,,ef24e1c2d7d2\r
56,"Firecracker","Josh Turner","Everything Is Fine",2007,5JtRN8PCpxoL03vnIpZXc7,380782652,,,0237c853fee0\r
57,"Gunpowder & Lead","Miranda Lambert","Crazy Ex-Girlfriend",2007,3z1PqYwMtct2Dm4R9lhWnT,23368816,,,c733a244e49b\r
58,"People Are Crazy","Billy Currington","Little Bit Of Everything",2008,5JnLiuMgRAWoHYOhatFP3s,290729079,,,113327658a35\r
59,"Alright","Darius Rucker","Learn To Live",2008,5JlH51YDYsGj2dyEJKKjcN,189448089,,,bf58a264702f\r
60,"Love Story","Taylor Swift","Fearless",2008,1D4PL9B8gOg78jiHg3FvBb,3169112,,,05f46820a01f\r
61,"Chicken Fried","Zac Brown Band","The Foundation",2008,0LQtEJt7x0s6knb6RKdRYc,197087480,,,523821ff32e4\r
62,"A Little More Country Than That","Easton Corbin","Easton Corbin",2009,7LrZ3SczM7zlUkVlhevPp2,3765859,,,629c44997d9d\r
63,"Why Don't We Just Dance","Josh Turner","Haywire",2009,2p07VcUwRZ5sru3mJ0JogS,3736896,,,149a152bf96b\r
64,"Rain Is A Good Thing","Luke Bryan","Doin' My Thing",2009,1YhFtqwcN138S6ng3MT1nN,3132588,,,559532007131\r
65,"Stuck Like Glue","Sugarland","The Incredible Machine",2010,0JcKdUGNR7zI4jJDLyYXbi,4511573,,,d0ca3f9095c0\r
66,"Knee Deep (feat. Jimmy Buffett)","Zac Brown Band","You Get What You Give",2010,60IGhnH20N82dNxKnc8jDd,197086381,,,1cdbcc53ff4a\r
67,"Country Girl (Shake It For Me)","Luke Bryan","Tailgates & Tanlines",2011,0JbSghVDghtFEurrSO8JrC,92495714,,,1bfa38eb1723\r
68,"Real Good Time","Aaron Watson","Real Good Time",2012,3gNZ65teMnR1sAmfAMGJGF,91613362,,,408b0b8046ea\r
69,"That’s Your Cousin","Dean Brody","Dirt",2012,0MK3K4QegjdtzI9iQj6BG2,198792943,,,093bf15157ee\r
70,"Cruise","Florida Georgia Line","Here's To The Good Times",2012,0i5el041vd6nxrGEU8QRxy,18151834,,,91abadafb5e9\r
71,"Wagon Wheel","Darius Rucker","True Believers",2013,3xdjjKMcMOFgo1eQrfbogM,20220065,,,568cb35577ae\r
72,"Sunshine & Whiskey","Frankie Ballard","Sunshine & Whiskey",2014,6aNwDe5YH5YUPlpHkku52w,26017672,,,92104bf9ee15\r
73,"American Kids","Kenny Chesney","The Big Revival",2014,1dgWTMoHwTUnQhOQ8SR5fV,33896902,,,72d8d8982dae\r
74,"Biscuits","Kacey Musgraves","Pageant Material",2015,4vHVfwVi2CEc4r7P1Pr9iu,46674762,,,85e4bdec71c1\r
75,"All the Pretty Girls","Kenny Chesney","Cosmic Hallelujah",2016,66pxmg3Jhjm09tHoWR1wVR,73065934,,,e5847ca01af5\r
76,"Down To The Honkytonk","Jake Owen","Greetings From...Jake",2018,1HsoSwqtwGBNIHZM7lPmQR,530162466,,,cf579ccbf87c\r
77,"Caught Up In The Country","Rodney Atkins","Caught Up In The Country",2018,4aGG4VOWGv9RwlYQNsBrkE,103407626,,,165ea5eeee9c\r
78,"Good Vibes","Chris Janson","Real Friends",2019,1XVqh0dC0PIl72f2mQhsVt,103044408,,,cf878d29fde5\r
79,"Hell's Comin' with Me","Poor Man's Poison","Hell's Comin' with Me",2019,5N0lmKQfQpXNQNjUGlPKIT,285850539,,,d26db08e3231\r
80,"TEXAS HOLD 'EM","Beyoncé","TEXAS HOLD 'EM",2024,7AYmToZ5y67fBjq4RLFbuq,353983142,,,c8de22be7a9d\r
`,Me=`id,title,artist,album,year,spotify,tidal,apple,youtube,UniqueID\r
1,"Hound Dog","Elvis Presley","Elvis: 30 #1 Hits",1956,,5119980,,,ec157a6b390b\r
2,"Yakety Yak","The Coasters","Rhino Hi-Five: The Coasters",1958,7demHL0GXA6YmTNqw3Btz8,34399551,,,719a9de727ef\r
3,"Jump in the Line","Harry Belafonte","The Best Of",1961,70mAceS5ArAqVj2OwDE4db,57724211,,,2ce5a04d9bbe\r
4,"Twist And Shout - Remastered 2009","The Beatles","Please Please Me",1963,5ZBeML7Lf3FMEVviTyvi8l,55163257,,,53fc7ae8b802\r
5,"You Really Got Me","The Kinks","",1964,,493118769,,,59b26ad6979a\r
6,"My Girl","The Temptations","",1964,,93228739,,,e3cc5add46a6\r
7,"Help! - Remastered 2015","The Beatles","1",1965,3Smida2eCUsLzDcmZqXEZ3,55130682,,,f18dfeca441e\r
8,"(I Can't Get No) Satisfaction - Mono","The Rolling Stones","Out Of Our Heads",1965,2PzU4IB8Dr6mxV3lHuaG34,5693554,,,2285fde4fec1\r
9,"Good Vibrations","The Beach Boys","Made In U.S.A.",1966,,1392966,,,a021518de537\r
10,"Yellow Submarine - Remastered 2015","The Beatles","1",1966,7zRmGvtSy36Jr19U5OInJT,55130782,,,1585d182a8f8\r
11,"Paint It Black","The Rolling Stones","Through the Past, Darkly (Big Hits, Vol. 2)",1966,,13434396,,,35854f0368e7\r
12,"Ain't No Mountain High Enough","Marvin Gaye","",1967,,105505610,,,6bb15a637076\r
13,"Brown Eyed Girl","Van Morrison","",1967,3yrSvpt2l1xhsV9Em88Pul,450090877,,,29f9d83309bb\r
14,"Hey Jude - Remastered 2015","The Beatles","1",1968,3H7sv3Krffn15BufUuXzf3,55130617,,,f9ddec7d980a\r
15,"Here Comes The Sun - Remastered 2009","The Beatles","Abbey Road",1969,6dGnYIeXmHdcikdzNNDMm2,55130637,,,bbb9138e9053\r
16,"Have You Ever Seen The Rain","Creedence Clearwater Revival","Pendulum",1970,2LawezPeJhN4AWuSB0GtAU,77701512,,,81c306a821e4\r
17,"In the Summertime","Mungo Jerry","In the Summertime",1970,3RNyGLgSvmVRZ7xKUp8Wgd,490860774,,,2b1297eec081\r
18,"Rocket Man (I Think It's Going To Be A Long, Long Time)","Elton John","Honky Chateau",1972,3gdewACMIVMEWVbyb8O9sY,334634,,,21df3190ed67\r
19,"Superstition","Stevie Wonder","",1972,,77683246,,,2fa68cb8ab02\r
20,"Hooked On A Feeling","Blue Swede","Hooked On A Feeling",1973,6Ac4NVYYl2U73QiTt11ZKd,2909027,,,7109dec96c6e\r
21,"Money","Pink Floyd","Dark Side Of The Moon",1973,,55391792,,,ce92a32bcd1d\r
22,"Mamma Mia","ABBA","Abba",1975,2TxCwUlqaOH3TIyJqGgR91,1771748,,,51606785a376\r
23,"Bohemian Rhapsody - Remastered 2011","Queen","",1975,2GAIycsMaDVtMtdvxzR2xI,534050211,,,0408b8a72999\r
24,"Play That Funky Music","Wild Cherry","'70s Greatest Hits",1976,,545672,,,c4b8c1201ca1\r
25,"Stayin' Alive","Bee Gees","",1977,,68493629,,,9c3c3ded57da\r
26,"Mr. Blue Sky","Electric Light Orchestra","Out Of The Blue",1977,74z2lfZ7fj3IqoK71lHkZw,53230853,,,a31eaca050ee\r
27,"We Will Rock You","Queen","",1977,4fVn54cP0hasdSHuJthQj1,541963983,,,6e0bd3cbb805\r
28,"September","Earth, Wind & Fire","Earth, Wind & Fire: Greatest Hits",1978,,106028079,,,482ac15ec794\r
29,"I Will Survive","Gloria Gaynor","",1978,,114623835,,,7852e9f24b6c\r
30,"Don't Stop Me Now - Remastered 2011","Queen","Jazz",1978,7hQJA50XrCWABAu5v6QZ4i,534099493,,,51bae400cccb\r
31,"You Make My Dreams (Come True)","Daryl Hall & John Oates","The Very Best of Daryl Hall / John Oates",1980,7HX9f8AMBl0vQxAoAzLqhS,560045,,,b329c6c49478\r
32,"9 to 5","Dolly Parton","9 To 5 And Odd Jobs",1980,4w3tQBXhn5345eUXDGBWZG,52534,,,00642d1ef9c3\r
33,"Another One Bites The Dust","Queen","",1980,291RmMazWAmDitFuD6NJCv,534099003,,,8af8227d093c\r
34,"Don't Stop Believin'","Journey","",1981,77NNZQSqzLNqh2A9JhLRkg,1781737,,,88abb1c95365\r
35,"Maneater","Daryl Hall & John Oates","",1982,,99674926,,,64349187e8c6\r
36,"Major Tom (Völlig Losgelöst)","Peter Schilling","Major Tom [Voellig Losgeloest]",1982,2qZQtey4lTwvvABVMrO4h8,169150,,,e93519ace455\r
37,"It's Raining Men","The Weather Girls","Success",1982,2IvetNzSZMH5gwjInoyr18,4710246,,,fa72ff20b0bb\r
38,"Sweet Dreams (Are Made of This) - 2005 Remaster","Eurythmics","Sweet Dreams (Are Made Of This)",1983,1TfqLAPs4K3s2rJMoCokcS,26965,,,aecb33508f6e\r
39,"99 Luftballons","Nena","",1983,2IJftBfq7pJ43tfnOR0RB3,491245790,,,eb2d1c3c4c84\r
40,"Dancing In The Dark","Bruce Springsteen","The Essential Bruce Springsteen [Disc 2]",1984,,24385357,,,de24d7edc91d\r
41,"Material Girl","Madonna","",1984,,2123750,,,22de6d0466ba\r
42,"Take on Me","a-ha","Hunting High and Low",1985,2WfaOiMkCvy7F5fcp2zZ8L,391687,,,20ba7a88df33\r
43,"Don't You (Forget About Me) - Remastered","Simple Minds","Celebrate",1985,0A4PZuepTcIQVvA5m7R0M1,7196915,,,1d2bbf334f3a\r
44,"Livin' on a Prayer","Bon Jovi","Cross Road",1986,,93177984,,,966776dcca66\r
45,"You Give Love A Bad Name","Bon Jovi","Slippery When Wet",1986,4jlp53Zc5Aq2DQFmu41nvE,93177983,,,2ff98eea0f56\r
46,"La Bamba","Los Lobos","La Bamba / Charlena",1987,0uMMLry3hzWGn3q3loqMkm,3248011,,,bdb7f4d7fa6f\r
47,"I Think We're Alone Now","Tiffany","Tiffany",1987,4uvjOKsp7mSjrDhWdkLPBY,20746966,,,d4e1af18adbc\r
48,"With Or Without You","U2","",1987,,1218919,,,54ef6c388afd\r
49,"I'm Gonna Be (500 Miles)","The Proclaimers","",1988,66S14BkJDxgkYxLl5DCqOz,137251,,,9238d6d4adb1\r
50,"We Didn't Start the Fire","Billy Joel","",1989,,1268210,,,68d3579636a4\r
51,"Groove Is in the Heart","Deee-Lite","",1990,,3267941,,,25aee9c89d03\r
52,"Smells Like Teen Spirit","Nirvana","Nirvana",1991,,77610757,,,b3cf41008fb8\r
53,"Two Princes","Spin Doctors","Pocket Full Of Kryptonite",1991,4ePP9So5xRzspjLFVVbj90,1311444,,,e1979c422a60\r
54,"One","U2","",1991,,341528698,,,3859353af24a\r
55,"What's Up?","4 Non Blondes","Bigger, Better, Faster, More !",1992,0jWgAnTrNZmOGmqgvHhZEm,634519,,,bc366dd1caa8\r
56,"No Rain","Blind Melon","Blind Melon",1992,6txWz9UapYHVxEd7dDIHXT,1332492,,,e536be30fc37\r
57,"Creep","Radiohead","Pablo Honey",1992,6b2oQwSGFkzsMtQruIWm2p,58990486,,,f076d1b420cb\r
58,"I Will Always Love You","Whitney Houston","",1992,,5120355,,,7e41e690e01c\r
59,"Mr. Jones","Counting Crows","August And Everything After",1993,5DiXcVovI0FcY2s0icWWUu,2569985,,,798bc90f4a82\r
60,"Zombie","The Cranberries","",1994,,4012757,,,8e17b89be979\r
61,"Gangsta's Paradise","Coolio","",1995,,219775152,,,f218233916ab\r
62,"Wonderwall","Oasis","Stop The Clocks",1995,4w7RuuQAVP0JXlAom3z1aC,156876007,,,8e43b6053a16\r
63,"Santeria","Sublime","Sublime",1996,6cJqlSO19vsfCsH1FeFI35,62096434,,,46675a8474b1\r
64,"Save Tonight","Eagle-Eye Cherry","Desireless",1997,1t2Hq2WIBcZINOEnK6mdJG,610923,,,c64ff607e8d1\r
65,"Bitter Sweet Symphony","The Verve","This Is Music: The Singles 92-98",1997,1WYEDcS7WGjv0rG7rmMX3o,77892506,,,fa709635a955\r
66,"Closing Time","Semisonic","Feeling Strangely Fine",1998,087OBLtoeS3Q6j0k6tMNAI,96961926,,,a48a2bfc0f7c\r
67,"All The Small Things","blink-182","Enema Of The State",1999,2m1hi0nfMR9vdGC8UcrnwU,173565588,,,046f461ba872\r
68,"Mambo No. 5 (a Little Bit of...)","Lou Bega","",1999,,81794041,,,94247bbd2e18\r
69,"Scar Tissue","Red Hot Chili Peppers","Californication",1999,1G391cbiT3v3Cywg8T7DM1,304805,,,6bc7fba9869a\r
70,"All Star","Smash Mouth","",1999,2P1ZqQq8rQtmV7BLZ0Junn,1300228,,,1a3c9fe5acd1\r
71,"One More Time","Daft Punk","",2000,,1550546,,,950c81e13505\r
72,"Island In The Sun","Weezer","Weezer",2001,2MLHyLy5z5l5YRp7momlgw,573345,,,1e711dc0c588\r
73,"This Love","Maroon 5","Songs About Jane: 10th Anniversary Edition",2002,55vBk4ODkxRVSaHbKxWBn6,331558,,,666bbd65556c\r
74,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,,,a08eae93f89e\r
75,"Hey Ya!","Outkast","The Way You Move / Hey Ya!",2003,3AszgPDZd9q0DpDFt4HFBy,1772295,,,b5f15a52071e\r
76,"Mr. Brightside","The Killers","Hot Fuss",2003,7oK9VyNzrYvRFo7nQEYkWN,150850052,,,23bf925e8631\r
77,"Seven Nation Army","The White Stripes","Elephant",2003,3m6KkYKdnbffMpGd9Pm9FP,156600940,,,5be4a4c8d506\r
78,"Take Me Out","Franz Ferdinand","Franz Ferdinand",2004,6ooluO7DiEhI1zmK94nRCM,3751639,,,c4c134ad33be\r
79,"Feel Good Inc.","Gorillaz","Demon Days",2005,0d28khcov6AiegSCpG5TuT,1404361,,,63fbd18c4597\r
80,"Crazy","Gnarls Barkley","St. Elsewhere",2006,1vxw6aYJls2oq3gW0DujAo,314701,,,08a3311b3f5e\r
81,"Hips Don't Lie (feat. Wyclef Jean)","Shakira","Oral Fixation, Vol. 2 (Expanded Edition)",2006,3ZFTkvIE7kyPt6Nu3PEa7V,438736569,,,57998f39ad24\r
82,"Grace Kelly","MIKA","Life In Cartoon Motion",2007,2SDx0PooHZI1SQKR0y44bs,1219371,,,b039e96b1d1b\r
83,"Viva La Vida","Coldplay","",2008,3Fcfwhm8oRrBvBZ8KGhtea,288744882,,,0e3aba851b76\r
84,"Poker Face","Lady Gaga","",2008,,77707019,,,f5214dc31395\r
85,"Fireflies","Owl City","Ocean Eyes",2009,3DamFFqW32WihKkTVlwTYQ,3140991,,,df8f56b2f3c7\r
86,"Pumped Up Kicks","Foster The People","Torches",2010,1G5RlnmO3GzNdKCDNSgT5W,25280917,,,d33221c20cfa\r
87,"Somebody That I Used to Know (feat. Kimbra)","Gotye","",2011,,13467719,,,3b1c0d8765d9\r
88,"Radioactive","Imagine Dragons","Night Visions",2012,7eGNiGg6SE27VkSrpZMVTD,18692664,,,d8044371dc28\r
89,"Get Lucky (Radio Edit) [feat. Pharrell Williams and Nile Rodgers]","Daft Punk","Get Lucky (Radio Edit) [feat. Pharrell Williams and Nile Rodgers]",2013,2Foc5Q5nqNiosCNqttzHof,19823990,,,6c5d469fb8be\r
90,"Uptown Funk (feat. Bruno Mars)","Mark Ronson","Uptown Special",2014,32OlwWuMpZ6b0aN2RZOeMS,39249713,,,c02d669b43ac\r
91,"Hello","Adele","Hello",2015,0ENSn4fwAbCGeFGVUbXEU3,62300893,,,fa9734f238e3\r
92,"Can't Stop the Feeling!","Justin Timberlake","",2016,,60137937,,,bc2b862b80e9\r
93,"Shape of You","Ed Sheeran","÷",2017,7qiZfU4dY1lWllzX7mPBI3,219082768,,,b97a71e2ec0a\r
94,"Shotgun","George Ezra","Staying at Tamara's",2018,4ofwffwvvnbSkrMSCKQDaC,85905133,,,b7d1a82f55df\r
95,"Blinding Lights","The Weeknd","",2019,,134858527,,,23bfdab9e20b\r
96,"Heat Waves","Glass Animals","Dreamland",2020,02MWAaffLxlfxAUY7c5dvx,150502627,,,35cb096eda5d\r
97,"good 4 u","Olivia Rodrigo","SOUR",2021,4ZtFanR9U6ndgddUvNcjcG,184786799,,,e58c74b24e75\r
98,"As It Was","Harry Styles","",2022,,223336898,,,a0d0ffd35fb6\r
99,"Flowers","Miley Cyrus","Endless Summer Vacation",2023,7DSAEUvxU8FajXtRloy8M0,313902266,,,2d0465a2cf31\r
100,"TEXAS HOLD 'EM","Beyoncé","TEXAS HOLD 'EM",2024,7AYmToZ5y67fBjq4RLFbuq,353983142,,,c8de22be7a9d\r
`,Ne=`id,title,artist,album,year,spotify,tidal,apple,youtube,UniqueID\r
1,"Earth Angel","The Penguins","",1954,,,,,985aff792443\r
2,"Get a Job","The Silhouettes","",1957,,8672338,,,dfc639e725bb\r
3,"Monster Mash","Bobby ""Boris"" Pickett","",1962,,35708067,,,cc0aa1d29b0d\r
4,"Pipeline","The Chantays","",1962,,35273958,,,d45058367692\r
5,"Wipe Out","The Surfaris","",1963,,85971720,,,774a89b2904f\r
6,"Psychotic Reaction","Count Five","",1966,,35635758,,,11aabd9055d5\r
7,"Little Bit O' Soul","The Music Explosion","",1967,,3236663,,,58545ab41e95\r
8,"Fire","The Crazy World of Arthur Brown","",1968,,615160,,,00f5345c69d8\r
9,"Spirit In The Sky","Norman Greenbaum","",1969,,428746664,,,155c714b2f58\r
10,"Na Na Hey Hey Kiss Him Goodbye","Steam","",1969,,94435754,,,6c5ab8e7c277\r
11,"Something in the Air","Thunderclap Newman","",1969,,91980877,,,b36410679259\r
12,"In the Summertime","Mungo Jerry","In the Summertime",1970,3RNyGLgSvmVRZ7xKUp8Wgd,490860774,,,2b1297eec081\r
13,"Kung Fu Fighting","Carl Douglas","",1974,,493064051,,,28af07485f5e\r
14,"Play That Funky Music","Wild Cherry","'70s Greatest Hits",1976,,545672,,,c4b8c1201ca1\r
15,"Ca Plane Pour Moi","Plastic Bertrand","Plastic Bertrand",1977,4sf4Lq52b2iCoAgpge7a9g,255146671,,,5cf9400aec30\r
16,"Black Betty","Ram Jam","",1977,,30265305,,,f56362fc8507\r
17,"Ring My Bell","Anita Ward","",1979,,82371353,,,419c97e70cd4\r
18,"Funkytown","Lipps Inc.","",1979,,173304114,,,31154c29ec42\r
19,"Pop Muzik","M","",1979,,490841591,,,a34578360597\r
20,"Video Killed the Radio Star","The Buggles","",1979,,2531405,,,f7e5d7416a9b\r
21,"Tainted Love","Soft Cell","",1981,,571868,,,ca965e59dea6\r
22,"Mickey","Toni Basil","",1981,,384175980,,,5c37d10d24ce\r
23,"Come On Eileen","Dexys Midnight Runners","",1982,,126347035,,,d9ab0f84ccf6\r
24,"Pass the Dutchie","Musical Youth","",1982,,101149201,,,ac86ac0e93b6\r
25,"It's Raining Men","The Weather Girls","Success",1982,2IvetNzSZMH5gwjInoyr18,4710246,,,fa72ff20b0bb\r
26,"Too Shy","Kajagoogoo","",1983,,1379251,,,8f17515e4917\r
27,"Tarzan Boy","Baltimora","",1985,,1527873,,,d15efa30b812\r
28,"Don't Worry, Be Happy","Bobby McFerrin","",1988,,1323432,,,399bac1555c4\r
29,"Groove Is in the Heart","Deee-Lite","",1990,,3267941,,,25aee9c89d03\r
30,"I'm Too Sexy","Right Said Fred","",1991,,303270798,,,0eae98a5d2fe\r
31,"What's Up?","4 Non Blondes","Bigger, Better, Faster, More !",1992,0jWgAnTrNZmOGmqgvHhZEm,634519,,,bc366dd1caa8\r
32,"No Rain","Blind Melon","Blind Melon",1992,6txWz9UapYHVxEd7dDIHXT,1332492,,,e536be30fc37\r
33,"Would I Lie to You?","Charles & Eddie","",1992,,126624134,,,3c9b3fe284da\r
34,"Saturday Night","Whigfield","",1992,,70686669,,,342455f21532\r
35,"What Is Love","Haddaway","",1993,,492802426,,,ec00c63fb753\r
36,"Cotton Eye Joe","Rednex","",1994,,80186819,,,dab67b4be069\r
37,"How Bizarre","OMC","",1995,,79970915,,,ccd74ee57e30\r
38,"Tubthumping","Chumbawamba","",1997,,2893885,,,99596fb0f90e\r
39,"Save Tonight","Eagle-Eye Cherry","Desireless",1997,1t2Hq2WIBcZINOEnK6mdJG,610923,,,c64ff607e8d1\r
40,"Your Woman","White Town","",1997,,492919891,,,fe782f88ffc8\r
41,"Better Off Alone","Alice Deejay","",1998,,47469776,,,d6aa1b649683\r
42,"Blue (Da Ba Dee)","Eiffel 65","",1998,,539111445,,,b7ce4670400b\r
43,"You Get What You Give","New Radicals","",1998,,2529963,,,ba1e4afc1b1f\r
44,"Closing Time","Semisonic","Feeling Strangely Fine",1998,087OBLtoeS3Q6j0k6tMNAI,96961926,,,a48a2bfc0f7c\r
45,"Butterfly","Crazy Town","",1999,,34793,,,daf81efabb57\r
46,"Steal My Sunshine","Len","",1999,,33902226,,,2a58a852a49e\r
47,"Mambo No. 5 (a Little Bit of...)","Lou Bega","",1999,,81794041,,,94247bbd2e18\r
48,"She's so High","Tal Bachman","Tal Bachman",1999,7mnGQesk1TzQLzQ9bYWZPR,1311156,,,c9968ac5d167\r
49,"Who Let the Dogs Out","Baha Men","",2000,,1370716,,,dfcd632865f4\r
50,"Teenage Dirtbag","Wheatus","",2000,,1924,,,6276cdfb4d35\r
51,"The Ketchup Song (Aserejé)","Las Ketchup","",2002,,89218164,,,bf5b4a497e64\r
52,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,,,a08eae93f89e\r
53,"Bad Day","Daniel Powter","",2005,,292734,,,41f84318845e\r
54,"Crazy","Gnarls Barkley","St. Elsewhere",2006,1vxw6aYJls2oq3gW0DujAo,314701,,,08a3311b3f5e\r
55,"Safe And Sound","Capital Cities","In A Tidal Wave Of Mystery",2011,0oFvhxNf3mBII26pPI3a5I,174840352,,,67d8a3cc6f07\r
56,"Somebody That I Used to Know (feat. Kimbra)","Gotye","",2011,,13467719,,,3b1c0d8765d9\r
57,"Let Her Go","Passenger","",2012,,18930892,,,c57c81b294df\r
58,"Best Day Of My Life","American Authors","",2013,,29560407,,,80b7cee4410e\r
59,"Rude","MAGIC!","",2013,,23046116,,,95aeb44771f4\r
60,"Shut Up and Dance","WALK THE MOON","",2014,1K66si1ZELsRZzg7m7mcps,37896389,,,dd9dd5471570\r
`,Pe=`id,title,artist,album,year,spotify,tidal,apple,youtube,UniqueID\r
1,"La Bamba","Ritchie Valens","",1958,,7985177,,,9514688dd506\r
2,"I'm Tore Down","Freddie King","",1961,,203199254,,,fe926d3a07c7\r
3,"Twist and Shout","The Top Notes","",1961,,48589858,,,d6a4caef6b67\r
4,"Twist And Shout - Remastered 2009","The Beatles","Please Please Me",1963,5ZBeML7Lf3FMEVviTyvi8l,55163257,,,53fc7ae8b802\r
5,"Red Rubber Ball","The Cyrkle","",1966,,561370,,,405a171d13e6\r
6,"I'm a Believer","The Monkees","",1966,,22509466,,,51e558ca8486\r
7,"Brown Eyed Girl","Van Morrison","",1967,3yrSvpt2l1xhsV9Em88Pul,450090877,,,29f9d83309bb\r
8,"Hooked on a Feeling","B. J. Thomas","",1968,,52641089,,,7a2e00421692\r
9,"Hooked On A Feeling","Blue Swede","Hooked On A Feeling",1973,6Ac4NVYYl2U73QiTt11ZKd,2909027,,,7109dec96c6e\r
10,"I Will Always Love You","Dolly Parton","",1974,,54518838,,,5f505aa10b65\r
11,"I Will Survive","Gloria Gaynor","",1978,,114623835,,,7852e9f24b6c\r
12,"Come On Eileen","Dexys Midnight Runners","",1982,,126347035,,,d9ab0f84ccf6\r
13,"Africa","Toto","",1982,,539204,,,6c8a0e0565c9\r
14,"Take on Me","a-ha","Hunting High and Low",1985,2WfaOiMkCvy7F5fcp2zZ8L,391687,,,20ba7a88df33\r
15,"La Bamba","Los Lobos","La Bamba / Charlena",1987,0uMMLry3hzWGn3q3loqMkm,3248011,,,bdb7f4d7fa6f\r
16,"Punk Rock Girl","The Dead Milkmen","",1988,,326315773,,,6977fc65a10f\r
17,"I Will Always Love You","Whitney Houston","",1992,,5120355,,,7e41e690e01c\r
18,"I'm Tore Down","Eric Clapton","From The Cradle",1994,,249998028,,,d672c78020f1\r
19,"I Will Survive","Cake","Fashion Nugget",1996,,668143,,,23b29f10f793\r
20,"Hell","Squirrel Nut Zippers","",1996,,63402871,,,d5cd854bc879\r
21,"My Heart Will Go On","Céline Dion","",1997,,10565717,,,b897a27f4933\r
22,"MMMBop","Hanson","",1997,,3712883,,,ade9f1ae095a\r
23,"Come on Eileen","Save Ferris","It Means Everything",1997,4Z4xFENnvMnRDPpAx5wpaO,641390,,,9628020594e8\r
24,"Take On Me","Reel Big Fish","",1998,,33899608,,,dfd74b5e9a69\r
25,"I'm A Believer - From ""Shrek"" Motion Picture Soundtrack","Smash Mouth","Shrek",2001,0mBL2JwjNYKtdFacHxvtJt,572109,,,ca83ec05d7a9\r
26,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,,,a08eae93f89e\r
27,"Such Great Heights","The Postal Service","",2003,,2575089,,,539ac69e8e5c\r
28,"Paper Planes","M.I.A.","",2007,,2205661,,,bfeab1f13419\r
29,"Bad Romance","Lady Gaga","",2009,,77707061,,,5b962824698a\r
30,"Brown Eyed Girl","Reel Big Fish","Fame, Fortune, And Fornication",2009,2lbAU3IQytWjl9b0LLuztk,385585158,,,dad001840421\r
31,"Hell","Streetlight Manifesto","99 Songs of Revolution: Volume I",2010,,73532317,,,9667cc5ced8a\r
32,"Punk Rock Girl","Streetlight Manifesto","99 Songs of Revolution: Volume I",2010,,73532320,,,5ffcd2a47bd1\r
33,"Red Rubber Ball","Streetlight Manifesto","",2010,52DW5npyBrn3QMKcQqQhKS,73532324,,,8b370628cf95\r
34,"Such Great Heights","Streetlight Manifesto","",2010,26rMsVy6Oa4rK9ue7GW0gU,73532326,,,73711bcc9cbd\r
35,"Call Me Maybe","Carly Rae Jepsen","",2011,,17060803,,,4dc5b3e5d72f\r
36,"Somebody That I Used to Know (feat. Kimbra)","Gotye","",2011,,13467719,,,3b1c0d8765d9\r
37,"I Need Your Love (feat. Ellie Goulding)","Calvin Harris","",2012,,17614977,,,6aacd5efd576\r
38,"Somebody That I Used to Know","Pentatonix","PTX, Vol. 1",2012,5XPSElbh3y0S1Jl0ggpwQr,29712066,,,b3e1490405fa\r
39,"Take Me to Church","Hozier","",2013,2EiGECydkS2M8OCcRHQZhT,52892100,,,4637ca0864dc\r
40,"I Need Your Love","Pentatonix","PTX, Vol. 2",2013,5YrtgdqeCgcOu9m0dliQs6,29722845,,,70cb0af4f247\r
41,"Timber (feat. Kesha)","Pitbull","",2013,,22987305,,,522dcdb6fbfb\r
42,"Call Me Maybe","Scott Bradlee's Postmodern Jukebox","Twist Is The New Twerk",2013,4cRPlIJxFb4ydBUgawsnXM,58875135,,,46171943e3e4\r
43,"All About That Bass","Meghan Trainor","",2014,,39450298,,,d07e14dcfa5d\r
44,"All About That Bass","Scott Bradlee's Postmodern Jukebox","Historical Misappropriation",2014,1jZRJKE7GZdiZzVgMS9mv2,58875093,,,43e799a010da\r
45,"Stacy’s Mom","Scott Bradlee's Postmodern Jukebox","Selfies on Kodachrome",2014,3TOGVJQaCQPE4J3JiSncwG,69185306,,,658d64a45a0d\r
46,"Timber","Scott Bradlee's Postmodern Jukebox","Twist Is The New Twerk",2014,34gz4EkB8fx3JMe4Qb3op1,58875131,,,6ad6bc0dda87\r
47,"Bad Romance","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,5xrHvVmSF3ui0EKI8FArv3,58875147,,,67b073f89af2\r
48,"Paper Planes","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,1YQY7ODoHmrfDwzgshRBKq,58875153,,,d72581e098ec\r
49,"Take Me To Church","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,2YwlwV98tjcKF664eEAAyV,58875155,,,fc6e7215c86d\r
50,"MMMbop","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,2jt8tEFZ4qZJ1ax3b0Io5f,69185267,,,73c52d6eaac7\r
51,"My Heart Will Go On","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,3qhgkT74IpVAjk5xjNylHC,69185277,,,680b6a706161\r
52,"Africa","Weezer","Africa",2018,36Pim2ANczp82lCWIb8GHy,89225164,,,2e16ab2e3d7d\r
`;function Fe(e){let[t,...n]=e.trim().split(/\r?\n/),r=t.split(`,`);return n.map(e=>{let t=[...e.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)].map(([,e,t])=>e===void 0?t:e.replaceAll(`""`,`"`));return Object.fromEntries(r.map((e,n)=>[e,t[n]]))})}var V=[{id:`my-hits`,name:`My Hits`,csv:Ae},{id:`country`,name:`Country`,csv:je},{id:`classic`,name:`Classic Hitster`,csv:Me},{id:`one-hit-wonders`,name:`One-Hit Wonders`,csv:Ne},{id:`covers-vs-originals`,name:`Covers vs Originals`,csv:Pe}].map(({id:e,name:t,csv:n})=>({id:e,name:t,tracks:Fe(n)})),H=new Map;for(let{tracks:e}of V)for(let t of e){let e=H.get(t.UniqueID);if(!e)H.set(t.UniqueID,{...t});else for(let n of[`spotify`,`tidal`,`apple`,`youtube`])!e[n]&&t[n]&&(e[n]=t[n])}function U(e){return H.get(e)??null}var W=`pending_random_draw`;function Ie(e,t){return[...new Set(e.tracks.map(e=>e.UniqueID))].filter(e=>{let n=U(e);return t?n?.[t]:n?.spotify||n?.tidal})}function Le(e,t){let n=t[Math.floor(Math.random()*t.length)];sessionStorage.setItem(W,new URLSearchParams({song:n,deck:e.id}).toString()),window.location.href=`?`+new URLSearchParams({song:n})}function Re(e){let t=new URLSearchParams(sessionStorage.getItem(W));return sessionStorage.removeItem(W),e&&t.get(`song`)===e&&window.history.replaceState({...window.history.state,randomDeckId:t.get(`deck`)},``),V.find(t=>t.id===window.history.state?.randomDeckId&&t.tracks.some(t=>t.UniqueID===e))}var G={spotify:`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="currentColor"/>
      <g fill="none" stroke="var(--provider-icon-paper)" stroke-linecap="round">
        <path d="M5.5 9c4.4-1.4 8.7-1 13 1" stroke-width="1.9"/>
        <path d="M6.4 12.4c3.7-1.1 7.2-.7 10.8.9" stroke-width="1.7"/>
        <path d="M7.3 15.6c3-.8 5.8-.5 8.7.8" stroke-width="1.5"/>
      </g>
    </svg>`,tidal:`
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="m4.5 4 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4ZM12 12l4 4-4 4-4-4Z"/>
    </svg>`,none:`
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M9 18.5a3 3 0 1 1-2-2.83V5l12-2v12.5a3 3 0 1 1-2-2.83V6.4L9 7.9Z"/>
    </svg>`},K={spotify:{name:`Spotify`,label:`Spotify · Full tracks`,detail:`Full tracks · Spotify Premium required`},tidal:{name:`TIDAL`,label:`TIDAL · 30s previews`,detail:`30-second previews · TIDAL account required`}};function ze(e,t,n){let r=K[e],i=t===e;return`
      <section class="provider-option" aria-labelledby="${e}-option-title">
        <h3 id="${e}-option-title"><span class="provider-brand-icon">${G[e]}</span>${r.name}</h3>
        <p>${r.detail}</p>
        <button data-select="${e}" class="action-btn" type="button"
                aria-pressed="${i}">${i?`Selected`:n?`Use ${r.name}`:`Connect ${r.name}`}</button>
        ${n?`<button data-disconnect="${e}" class="provider-switch" type="button">Disconnect ${r.name}</button>`:``}
      </section>`}function Be({provider:e,connected:t,onSelect:n,onDisconnect:r}){let i=document.getElementById(`provider-controls`),a=K[e]?.label??`Choose a music provider`;i.innerHTML=`
    <button id="provider-menu-btn" class="provider-control" type="button"
            aria-haspopup="dialog" aria-controls="provider-dialog"
            aria-label="Music provider · ${a}" title="${a}">
      ${G[e]??G.none}
    </button>
    <dialog id="provider-dialog" class="provider-dialog" aria-labelledby="provider-title">
      <div class="provider-dialog-heading">
        <h2 id="provider-title">Music provider</h2>
        <button id="provider-close" class="provider-close" type="button" aria-label="Close music provider options" autofocus>×</button>
      </div>
      ${Object.keys(K).map(n=>ze(n,e,t[n])).join(``)}
      <p id="provider-error" role="status"></p>
    </dialog>
  `;let o=i.querySelector(`#provider-menu-btn`),s=i.querySelector(`#provider-dialog`),c=()=>s.close(),l=()=>{s.open||s.showModal()};o.addEventListener(`click`,l),i.querySelector(`#provider-close`).addEventListener(`click`,c),s.addEventListener(`click`,e=>{let t=s.getBoundingClientRect();e.target===s&&(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&c()}),s.addEventListener(`close`,()=>o.focus());async function u(t){if(t===e){c();return}let r=s.querySelectorAll(`button`);r.forEach(e=>{e.disabled=!0});let a=i.querySelector(`#provider-error`);a.textContent=``;try{await n(t)}catch{a.textContent=`Could not connect. Please try again.`}finally{r.forEach(e=>{e.disabled=!1})}}for(let e of i.querySelectorAll(`[data-select]`))e.addEventListener(`click`,()=>u(e.dataset.select));for(let e of i.querySelectorAll(`[data-disconnect]`))e.addEventListener(`click`,()=>r(e.dataset.disconnect));return l}function Ve(e,t){e.innerHTML=`
    <div id="dashboard-view" class="view-state">
      <h2>Rockin' Around</h2>
    </div>
  `;let n=document.getElementById(`external-content`);if(!n)return;n.innerHTML=`
    <div class="external-section dashboard-controls">
      <form class="card-lookup" id="card-lookup">
        <label class="section-title" for="card-lookup-id">Card Code</label>
        <div class="card-lookup-controls">
          <input id="card-lookup-id" type="text"
                 autocomplete="off" autocapitalize="none" spellcheck="false"
                 aria-describedby="card-lookup-status">
          <button class="action-btn" type="submit">Open Card</button>
        </div>
        <p id="card-lookup-status" role="status"></p>
      </form>
      <h3 id="deck-picker-title" class="section-title">Select Deck</h3>
      <details class="deck-picker">
        <summary aria-labelledby="deck-picker-title deck-selection">
          <span id="deck-selection"></span>
        </summary>
        <ul class="deck-options" aria-labelledby="deck-picker-title">
          ${V.map(e=>`<li><button type="button" data-deck-id="${e.id}">${e.name}</button></li>`).join(``)}
        </ul>
      </details>
      <button id="random-card" class="action-btn" type="button">Play Random Card</button>
      <p id="deck-status" role="status"></p>
    </div>
  `;let r=n.querySelector(`#card-lookup`),i=r.querySelector(`#card-lookup-id`),a=r.querySelector(`#card-lookup-status`);i.addEventListener(`input`,()=>{a.textContent=``,i.removeAttribute(`aria-invalid`)}),r.addEventListener(`submit`,e=>{e.preventDefault();let t=i.value.trim(),n=U(t)??U(t.toLowerCase());if(!n){a.textContent=t?`No card found for that code.`:`Enter a card code.`,i.setAttribute(`aria-invalid`,`true`),i.focus();return}window.location.href=`?`+new URLSearchParams({song:n.UniqueID})});let o=n.querySelector(`.deck-picker`),s=o.querySelector(`summary`),c=o.querySelector(`#deck-selection`),l=o.querySelectorAll(`[data-deck-id]`),u=n.querySelector(`#random-card`),d=n.querySelector(`#deck-status`),f=sessionStorage.getItem(`selected_deck`),p,m=[];function h(e){p=e,c.textContent=e.name;for(let t of l)t.setAttribute(`aria-pressed`,String(t.dataset.deckId===e.id));m=Ie(e,t),u.disabled=m.length===0,d.textContent=u.disabled?`This deck has no ${t===`tidal`?`TIDAL `:t===`spotify`?`Spotify `:``}track IDs yet.`:``}u.addEventListener(`click`,()=>{u.disabled||Le(p,m)});function g(){o.open=!1,s.focus()}for(let e of l)e.addEventListener(`click`,()=>{let t=V.find(t=>t.id===e.dataset.deckId);sessionStorage.setItem(`selected_deck`,t.id),h(t),g()});o.addEventListener(`keydown`,e=>{e.key===`Escape`&&o.open&&(e.preventDefault(),g())}),o.addEventListener(`focusout`,e=>{o.contains(e.relatedTarget)||(o.open=!1)}),h(V.find(e=>e.id===f)??V[0])}function He(e,t,n){e.innerHTML=`
    <div id="game-view" class="view-state">
      <p id="status-msg"  class="status-msg"></p>

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
          <h4 id="track-title"></h4>
          <p id="track-artist"></p>
          <p id="track-album" style="color: var(--text-subtle); font-size: 0.78rem;"></p>
          <div id="track-year" class="year-badge"></div>
        </div>
      </div>
    </div>
  `;for(let n of[`title`,`artist`,`album`,`year`])e.querySelector(`#track-${n}`).textContent=t[n];let r=document.getElementById(`external-content`);if(r){r.innerHTML=`
      ${n?`<button id="next-random-card" class="action-btn" type="button">Next Random Card</button>`:``}
      <button id="back-home-btn" class="outer-back-btn">← Back to Menu</button>
    `;let e=r.querySelector(`#next-random-card`);e?.addEventListener(`click`,async()=>{e.disabled=!0;try{await n()}finally{e.disabled=!1}}),document.getElementById(`back-home-btn`)?.addEventListener(`click`,()=>{window.location.href=`/rocking-around/`})}}var q=document.getElementById(`card-mount`),J=document.getElementById(`external-content`),Y=null,Ue=!1,X=!1,Z=null;function Q(e,t){let n=document.getElementById(`progress-fill`),r=document.getElementById(`progress-dot`);if(!t||t===0||!n||!r)return;let i=Math.min(e/t,1),a=295.3-i*295.3;n.style.strokeDashoffset=a;let o=i*2*Math.PI;r.setAttribute(`cx`,(55+47*Math.sin(o)).toFixed(2)),r.setAttribute(`cy`,(55-47*Math.cos(o)).toFixed(2))}function We(){$();async function e(){let t=await ke();t&&!t.paused?(Q(t.position,t.duration),Z=requestAnimationFrame(e)):$()}Z=requestAnimationFrame(e)}function $(){Z&&=(cancelAnimationFrame(Z),null)}function Ge(e){if(!e)return;Ue=!e.paused;let t=document.getElementById(`play-pause-btn`);t&&(Ue?(t.textContent=`❚❚`,t.style.paddingLeft=`0px`,We()):(t.textContent=`▶`,t.style.paddingLeft=`3px`,$(),Q(e.position,e.duration)))}async function Ke(){let e=await Te(),t=new URLSearchParams(window.location.search),n=t.get(`song`)||t.get(`card`);J&&(J.innerHTML=``);let r=e.authenticated?e.provider:null,i=Be({provider:r,connected:Ce(),onSelect:z,onDisconnect:we}),a=Re(n);if(n){let e=U(n);if(!e){q.innerHTML=`<p>Card not found.</p><a href="/rocking-around/">Back to Menu</a>`;return}Y=e[r];let t=a?Ie(a,r).filter(e=>e!==n):[];He(q,e,t.length?async()=>{if(X)try{await B()}catch(e){console.error(`Could not pause the current card:`,e)}Le(a,t)}:null);let o=document.getElementById(`play-pause-btn`),s=document.getElementById(`reveal-btn`),c=document.getElementById(`answer-box`);if(o?.addEventListener(`click`,async()=>{if(!r){i();return}let e=document.getElementById(`status-msg`);o.disabled=!0,e.textContent=``;try{X?await Oe():(await De(Y),X=!0)}catch(t){e.textContent=t.message||`Could not play this card. Please try again.`}finally{o.disabled=!1}}),s?.addEventListener(`click`,()=>{let e=c.classList.toggle(`hidden`);s.textContent=e?`Reveal Track Info`:`Hide Track Info`}),!r){o.disabled=!1,document.getElementById(`status-msg`).textContent=`Choose a music provider to play.`,i();return}if(!Y){document.getElementById(`status-msg`).textContent=`This card has no ${{spotify:`Spotify`,tidal:`TIDAL`}[r]} track ID yet.`;return}await Ee(()=>{o&&(o.disabled=!1)},e=>{X=!1,document.getElementById(`status-msg`).textContent=String(e)},Ge)}else Ve(q,r)}Ke();