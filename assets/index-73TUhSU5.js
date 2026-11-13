var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=t({getCurrentState:()=>se,handleCallback:()=>f,hasSession:()=>ee,initPlayer:()=>ne,isCallback:()=>d,login:()=>u,logout:()=>h,pauseTrack:()=>ae,playTrack:()=>re,requiresLogin:()=>!0,togglePlay:()=>oe,unlockAudio:()=>ie}),r=`82eeae9401364e56b2ca10cbd0b291f8`,i=window.location.origin+window.location.pathname,a=null,o=null,s=!1;function c(e){return crypto.getRandomValues(new Uint8Array(e)).reduce((e,t)=>e+`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`[t%66],``)}async function l(e){let t=new TextEncoder().encode(e),n=await window.crypto.subtle.digest(`SHA-256`,t);return btoa(String.fromCharCode.apply(null,new Uint8Array(n))).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}async function u(){let e=c(64),t=`spotify-`+c(16);sessionStorage.setItem(`spotify_code_verifier`,e),sessionStorage.setItem(`spotify_oauth_state`,t);let n=await l(e),a=new URL(`https://accounts.spotify.com/authorize`);a.searchParams.append(`response_type`,`code`),a.searchParams.append(`client_id`,r),a.searchParams.append(`scope`,`streaming user-read-email user-read-private user-modify-playback-state`),a.searchParams.append(`redirect_uri`,i),a.searchParams.append(`code_challenge`,n),a.searchParams.append(`code_challenge_method`,`S256`),a.searchParams.append(`state`,t),window.location.href=a.toString()}function d(e){let t=e.get(`state`);return!!(t&&t===sessionStorage.getItem(`spotify_oauth_state`))}async function f(e){let t=sessionStorage.getItem(`spotify_code_verifier`);sessionStorage.removeItem(`spotify_code_verifier`),sessionStorage.removeItem(`spotify_oauth_state`),window.history.replaceState({},document.title,window.location.pathname);let n=await(await fetch(`https://accounts.spotify.com/api/token`,{method:`POST`,headers:{"Content-Type":`application/x-www-form-urlencoded`},body:new URLSearchParams({client_id:r,grant_type:`authorization_code`,code:e,redirect_uri:i,code_verifier:t})})).json();if(n.access_token)return localStorage.setItem(`spotify_access_token`,n.access_token),localStorage.setItem(`spotify_token_expires_at`,String(Date.now()+n.expires_in*1e3)),n.access_token;throw Error(`Failed to retrieve access token`)}function ee(){return!!p()}function p(){let e=localStorage.getItem(`spotify_token_expires_at`);return e&&Number(e)<=Date.now()?(m(),null):localStorage.getItem(`spotify_access_token`)}function m(){localStorage.removeItem(`spotify_access_token`),localStorage.removeItem(`spotify_token_expires_at`)}function h(){m(),sessionStorage.removeItem(`spotify_code_verifier`),a?.disconnect()}function g(){m(),a?.disconnect(),window.location.reload()}function te(){return new Promise((e,t)=>{if(window.Spotify)return e();window.onSpotifyWebPlaybackSDKReady=()=>e();let n=document.createElement(`script`);n.src=`https://sdk.scdn.co/spotify-player.js`,n.onerror=()=>t(Error(`Failed to load Spotify SDK`)),document.head.appendChild(n)})}async function ne(e,t,n,r){await te(),a=new Spotify.Player({name:`RockingAround Game`,getOAuthToken:e=>{let t=p();t?e(t):g()},volume:.8}),a.addListener(`ready`,({device_id:t})=>{o=t,e(t)}),a.addListener(`player_state_changed`,e=>{n&&n(e)}),a.addListener(`autoplay_failed`,()=>r?.()),a.addListener(`authentication_error`,g),a.addListener(`initialization_error`,({message:e})=>t(e)),a.addListener(`account_error`,({message:e})=>t(`Requires Spotify Premium`)),await a.connect()}async function re(e){let t=p();if(!t){g();return}(await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${o}`,{method:`PUT`,body:JSON.stringify({uris:[`spotify:track:${e}`],position_ms:0}),headers:{"Content-Type":`application/json`,Authorization:`Bearer ${t}`}})).status===401&&g()}function ie(){s||!a?.activateElement||(s=!0,a.activateElement().catch(()=>{s=!1}))}async function ae(){await a?.pause()}async function oe(){a&&await a.togglePlay()}async function se(){return a?await a.getCurrentState():null}new EventTarget,window.location.origin+window.location.pathname,`serviceWorker`in navigator&&navigator.serviceWorker.getRegistrations().then(async e=>{let t=e.filter(e=>[e.active,e.waiting,e.installing].some(e=>e?.scriptURL.includes(`tidal-sw.js`)));t.length&&(await Promise.all(t.map(e=>e.unregister())),navigator.serviceWorker.controller?.scriptURL.includes(`tidal-sw.js`)&&window.location.reload())}).catch(()=>{});var ce=t({getCurrentState:()=>ve,handleCallback:()=>me,hasSession:()=>he,initPlayer:()=>ye,isCallback:()=>pe,login:()=>de,logout:()=>fe,pauseTrack:()=>xe,playTrack:()=>be,requiresLogin:()=>!1,togglePlay:()=>Se,unlockAudio:()=>ue}),_=new Map,v=null,y=!1,b=null,x=0;function le(){if(b)return b;let e=new ArrayBuffer(844),t=new DataView(e),n=(e,n)=>[...n].forEach((n,r)=>t.setUint8(e+r,n.charCodeAt(0)));n(0,`RIFF`),t.setUint32(4,836,!0),n(8,`WAVE`),n(12,`fmt `),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,1,!0),t.setUint32(24,8e3,!0),t.setUint32(28,8e3,!0),t.setUint16(32,1,!0),t.setUint16(34,8,!0),n(36,`data`),t.setUint32(40,800,!0);for(let e=0;e<800;e++)t.setUint8(44+e,128);return b=URL.createObjectURL(new Blob([e],{type:`audio/wav`})),b}function S(){return!!b&&v?.src===b}function ue(){y||!v||v.getAttribute(`src`)&&!S()||(y=!0,v.src=le(),v.play().then(()=>{S()&&v.pause()}).catch(()=>{y=!1}))}async function de(){}function fe(){}function pe(){return!1}async function me(){}function he(){return!0}function ge(e){return new Promise((t,n)=>{let r=`__itunesLookup`+Math.random().toString(36).slice(2),i=document.createElement(`script`),a=setTimeout(()=>o(Error(`iTunes did not answer. Please try again.`)),1e4);function o(e,o){clearTimeout(a),delete window[r],i.remove(),e?n(e):t(o)}window[r]=e=>o(null,e),i.onerror=()=>o(Error(`Could not reach iTunes. Please try again.`)),i.src=`https://itunes.apple.com/lookup?`+new URLSearchParams({id:e,entity:`song`,callback:r}),document.head.appendChild(i)})}async function _e(e){if(_.has(e))return _.get(e);let t=(await ge(e))?.results?.find(t=>String(t.trackId)===String(e));if(!t?.previewUrl)throw Error(`iTunes has no preview for this card.`);return _.set(e,t.previewUrl),t.previewUrl}function ve(){return!v||S()?null:{paused:v.paused,ended:v.ended,position:v.currentTime*1e3,duration:(Number.isFinite(v.duration)?v.duration:30)*1e3}}async function ye(e,t,n){v=new Audio,v.preload=`none`;for(let e of[`play`,`pause`,`ended`,`loadedmetadata`])v.addEventListener(e,()=>n(ve()));v.addEventListener(`playing`,()=>{y=!0}),v.addEventListener(`error`,()=>{v.getAttribute(`src`)&&!S()&&t(`This iTunes preview could not play. Please try again.`)}),e()}async function be(e){if(!/^[0-9]+$/.test(String(e)))throw Error(`This card needs a numeric iTunes track ID.`);if(!v)throw Error(`The iTunes player is not ready yet.`);let t=++x,n=await _e(String(e));t===x&&(v.src=n,await v.play())}async function xe(){x++,v?.pause()}async function Se(){if(v)if(v.paused){if(S())return;v.ended&&(v.currentTime=0),await v.play()}else v.pause()}var C={spotify:n,itunes:ce},w=null;function T(){return C[w]}function Ce(){let e=sessionStorage.getItem(`pending_song`);return sessionStorage.removeItem(`pending_song`),e?(window.location.href=`${window.location.pathname}?song=${encodeURIComponent(e)}`,!0):!1}function we(){return Object.fromEntries(Object.entries(C).map(([e,t])=>[e,{connected:t.hasSession(),requiresLogin:t.requiresLogin}]))}async function Te(e){let t=C[e];if(!t)return;let n=new URLSearchParams(window.location.search),r=n.get(`song`)||n.get(`card`);if(r?sessionStorage.setItem(`pending_song`,r):sessionStorage.removeItem(`pending_song`),await E(),localStorage.setItem(`selected_provider`,e),t.hasSession()){Ce()||window.location.reload();return}await t.login()}function Ee(e){let t=C[e];t&&(t.logout(),localStorage.getItem(`selected_provider`)===e&&localStorage.removeItem(`selected_provider`),window.location.reload())}async function De(){let e=new URLSearchParams(window.location.search),t=e.get(`code`);if(t){let n=Object.keys(C).find(t=>C[t].isCallback(e));if(n)return await C[n].handleCallback(t),w=n,localStorage.setItem(`selected_provider`,n),Ce(),{authenticated:!0,provider:n};window.history.replaceState({},document.title,window.location.pathname)}let n=localStorage.getItem(`selected_provider`);return w=C[n]?n:Object.keys(C).find(e=>C[e].hasSession())??null,w?{authenticated:!0,provider:w}:{authenticated:!1,provider:null}}async function Oe(e,t,n,r){if(T()){if(!T().hasSession()){e();return}await T().initPlayer(e,t,n,r)}}function ke(){T()?.unlockAudio?.()}async function Ae(e){if(T()){if(!T().hasSession()){await Te(w);return}await T().playTrack(e)}}async function E(){await T()?.pauseTrack()}async function je(){await T()?.togglePlay()}async function Me(){return T()?await T().getCurrentState():null}var Ne=`id,title,artist,album,year,spotify,tidal,itunes,youtube,UniqueID\r
1,"Tutti Frutti","Little Richard","Here's Little Richard",1955,2iXcvnD3d1gfLBum0cE5Eg,80391223,1440936639,,b082a32d1ea4\r
2,"Hound Dog","Elvis Presley","Elvis: 30 #1 Hits",1956,,5119980,217633921,,ec157a6b390b\r
3,"Banana Boat (Day-O)","Harry Belafonte","Calypso",1956,4fHDlIntTsRGSyTg5UYZYC,674903,1194766566,,f38290f0ee93\r
4,"Rockin' Robin","Bobby Day","Rockin' With Robin",1958,4FlYcJnfkeBpowEHJ72Bmt,17593309,299941623,,50ffda0961b9\r
5,"Yakety Yak","The Coasters","Rhino Hi-Five: The Coasters",1958,7demHL0GXA6YmTNqw3Btz8,34399551,322026451,,719a9de727ef\r
6,"Itsy Bitsy Teenie Weenie Yellow Polka-Dot Bikini","Brian Hyland","Greatest Hits",1960,3Aug2RunJbjGiz2CTtWu5l,103382831,1450974117,,ab404b71db79\r
7,"(What A) Wonderful World","Sam Cooke","The Man Who Invented Soul",1960,2g2GkH3vZHk4lWzBjgQ6nY,57755161,299550144,,89f8e5972b13\r
8,"The Wanderer","Dion","",1961,,26542771,724908444,,28cd447f6e25\r
9,"Jump in the Line","Harry Belafonte","The Best Of",1961,70mAceS5ArAqVj2OwDE4db,57724211,255428769,,2ce5a04d9bbe\r
10,"Bring It On Home to Me","Sam Cooke","",1962,,4930157,1088173103,,6432b876e25b\r
11,"Love Me Do","The Beatles","",1962,,55163408,1441165128,,0925a046ea45\r
12,"From Me To You - Mono / Remastered","The Beatles","1",1963,1euKWJfJSfPhgSendPrcXb,55130598,1440833534,,2ac1198a228f\r
13,"I Want to Hold Your Hand","The Beatles","Past Masters, Vols. 1 & 2",1963,,55130600,1441133632,,de47aeb3f76c\r
14,"She Loves You - Remastered","The Beatles","Past Masters",1963,3MbjEDPm5qtuJxiC86PWKy,55130599,1441133611,,1dd9c8d36059\r
15,"Twist And Shout - Remastered 2009","The Beatles","Please Please Me",1963,5ZBeML7Lf3FMEVviTyvi8l,55163257,1441165136,,53fc7ae8b802\r
16,"A Hard Day's Night - Remastered 2015","The Beatles","1",1964,0mNQUZEATk2uItMUtiLWK5,55130565,1440833544,,5288e5987316\r
17,"Can't Buy Me Love - Remastered 2015","The Beatles","1",1964,7pQAq14Z73YUFMtxCyt0bG,55130571,1440833543,,1f9b7f555544\r
18,"You Really Got Me","The Kinks","",1964,,493118769,1439224911,,59b26ad6979a\r
19,"My Girl","The Temptations","",1964,,93228739,1423301921,,e3cc5add46a6\r
20,"I Can't Help Myself (Sugar Pie, Honey Bunch)","Four Tops","",1965,,77641490,1443096422,,daba88969105\r
21,"Help! - Remastered 2015","The Beatles","1",1965,3Smida2eCUsLzDcmZqXEZ3,55130682,1440833560,,f18dfeca441e\r
22,"Yesterday - Remastered 2015","The Beatles","1",1965,4E5rL7YL0hVUPqeMSpjEF2,55130694,1440833891,,af2c3d264b64\r
23,"(I Can't Get No) Satisfaction - Mono","The Rolling Stones","Out Of Our Heads",1965,2PzU4IB8Dr6mxV3lHuaG34,5693554,1440743544,,2285fde4fec1\r
24,"Good Vibrations","The Beach Boys","Made In U.S.A.",1966,,1392966,1442864874,,a021518de537\r
25,"Eleanor Rigby","The Beatles","Yellow Submarine",1966,,174078191,1441164806,,b3f4cc6c8f57\r
26,"Yellow Submarine - Remastered 2015","The Beatles","1",1966,7zRmGvtSy36Jr19U5OInJT,55130782,1441165123,,1585d182a8f8\r
27,"Paint It Black","The Rolling Stones","Through the Past, Darkly (Big Hits, Vol. 2)",1966,,13434396,1440746670,,35854f0368e7\r
28,"Ain't No Mountain High Enough","Marvin Gaye","",1967,,105505610,1435008045,,6bb15a637076\r
29,"Penny Lane - Remastered 2015","The Beatles","1",1967,7afyyi8zn4FzWbcJ70F56V,55130613,1440833911,,08f5b4816fac\r
30,"Light My Fire","The Doors","The Doors",1967,,389264,1622368633,,2f298c2d7566\r
31,"Brown Eyed Girl","Van Morrison","",1967,3yrSvpt2l1xhsV9Em88Pul,450090877,1838782096,,29f9d83309bb\r
32,"Mrs. Robinson - From ""The Graduate"" Soundtrack","Simon & Garfunkel","Bookends",1968,0iOZM63lendWRTTeKhZBSC,37667986,1463652181,,6ca9aead6bfa\r
33,"Do It Again","The Beach Boys","Made In U.S.A.",1968,,17176700,1443274038,,6cf9ea5fa71e\r
34,"Hey Jude - Remastered 2015","The Beatles","1",1968,3H7sv3Krffn15BufUuXzf3,55130617,1440834224,,f9ddec7d980a\r
35,"Ob-La-Di, Ob-La-Da - Remastered 2009","The Beatles","The Beatles",1968,1gFNm7cXfG1vSMcxPpSxec,55163306,6818178967,,56be06c51e62\r
36,"Fortunate Son","Creedence Clearwater Revival","",1969,4BP3uh0hFLFRb5cjsgLqDh,42685477,1440950725,,d98f2bdf35d2\r
37,"Spirit In The Sky - Deluxe Edition","Norman Greenbaum","",1969,,428746664,1462211356,,e976b0012022\r
38,"Come Together - Remastered 2015","The Beatles","1",1969,7iABnSNZciNepqGtjMQxxd,55130631,1440834242,,c6ec978d805d\r
39,"Here Comes The Sun - Remastered 2009","The Beatles","Abbey Road",1969,6dGnYIeXmHdcikdzNNDMm2,55130637,6818128871,,bbb9138e9053\r
40,"Have You Ever Seen The Rain","Creedence Clearwater Revival","Pendulum",1970,2LawezPeJhN4AWuSB0GtAU,77701512,1440948088,,81c306a821e4\r
41,"In the Summertime","Mungo Jerry","In the Summertime",1970,3RNyGLgSvmVRZ7xKUp8Wgd,490860774,1440741632,,2b1297eec081\r
42,"Cecilia","Simon & Garfunkel","",1970,6QhXQOpyYvbpdbyjgAqKdY,650233,324127936,,680d55249384\r
43,"Lola","The Kinks","",1970,0UAJH0k4k3slcE83a9UGCe,491706930,1542626668,,1d8d04e41e2c\r
44,"Tiny Dancer","Elton John","",1971,,77652434,1452863597,,c93bb9766d29\r
45,"Coconut - Remastered","Harry Nilsson","Nilsson Schmilsson",1971,0LDgn9rOEU8BHOxSAkzzIN,33961730,304815015,,feffb77c4842\r
46,"Brown Sugar","The Rolling Stones","",1971,,3043982,1440830886,,9e6489f80f7e\r
47,"Crocodile Rock","Elton John","Classic Elton John",1972,,328924,1440926343,,1d81eb7aa634\r
48,"Rocket Man (I Think It's Going To Be A Long, Long Time)","Elton John","Honky Chateau",1972,3gdewACMIVMEWVbyb8O9sY,334634,1440910931,,21df3190ed67\r
49,"Brandy (You're a Fine Girl)","Looking Glass","",1972,,4350147,388158216,,0241b8ddb96f\r
50,"Superstition","Stevie Wonder","",1972,,77683246,1440808985,,2fa68cb8ab02\r
51,"Hooked On A Feeling","Blue Swede","Hooked On A Feeling",1973,6Ac4NVYYl2U73QiTt11ZKd,2909027,924503377,,7109dec96c6e\r
52,"Goodbye Yellow Brick Road","Elton John","Goodbye Yellow Brick Road",1973,,77611092,1452863793,,f310b38e873f\r
53,"Money","Pink Floyd","Dark Side Of The Moon",1973,,55391792,1066498948,,ce92a32bcd1d\r
54,"Higher Ground","Stevie Wonder","",1973,,77666303,1440807404,,bc60f861ebaa\r
55,"Kung Fu Fighting","Carl Douglas","",1974,,493064051,1436092826,,28af07485f5e\r
56,"Rebel Rebel","David Bowie","Changesbowie",1974,,69761304,697240823,,3be3fc1fb5e3\r
57,"Killer Queen","Queen","Queen: Greatest Hits",1974,,534097599,6781078353,,9ff74d13af7b\r
58,"Seven Seas of Rhye","Queen","Queen: Greatest Hits",1974,,534098033,6819426400,,717279a18ae5\r
59,"Mamma Mia","ABBA","Abba",1975,2TxCwUlqaOH3TIyJqGgR91,1771748,1440861294,,51606785a376\r
60,"Right Back Where We Started From","Maxine Nightingale","",1975,00s8dO3RWrFkBqC9JIy6ag,160886870,1466590421,,54a56ecb39fd\r
61,"Bohemian Rhapsody - Remastered 2011","Queen","",1975,2GAIycsMaDVtMtdvxzR2xI,534050211,6781024437,,0408b8a72999\r
62,"You're My Best Friend - Remastered 2011","Queen","Queen 40 Limited Edition Collector's Box Set",1975,4vEXJ6NvEwS8ptynkNswaa,534050203,6781024428,,3facabb0b96d\r
63,"Rich Girl","Daryl Hall & John Oates","The Essential Daryl Hall & John Oates",1976,5E3P9e1hvjyIOlFyqNB5eD,2919752,262058983,,5e3f35acc747\r
64,"Somebody to Love","Queen","Queen: Greatest Hits",1976,,534050356,6781024333,,ee3c733dbad1\r
65,"Isn't She Lovely","Stevie Wonder","Songs In The Key Of Life",1976,3vqlZUIT3rEmLaYKDBfb4Q,79419404,1440788554,,f90890bf3780\r
66,"Play That Funky Music","Wild Cherry","'70s Greatest Hits",1976,,545672,260302978,,c4b8c1201ca1\r
67,"Mr. Blue Sky","Electric Light Orchestra","Out Of The Blue",1977,74z2lfZ7fj3IqoK71lHkZw,53230853,1054525017,,a31eaca050ee\r
68,"The Chain - 2004 Remaster","Fleetwood Mac","",1977,,68714466,651880159,,17eb3756f919\r
69,"Ca Plane Pour Moi","Plastic Bertrand","Plastic Bertrand",1977,4sf4Lq52b2iCoAgpge7a9g,255146671,1650622324,,5cf9400aec30\r
70,"We Will Rock You","Queen","",1977,4fVn54cP0hasdSHuJthQj1,541963983,6781080737,,6e0bd3cbb805\r
71,"September","Earth, Wind & Fire","Earth, Wind & Fire: Greatest Hits",1978,,106028079,1456623340,,482ac15ec794\r
72,"Grease","Frankie Valli","Grease (Soundtrack from the Motion Picture)",1978,,345814004,360749620,,9348c65dc375\r
73,"You're the One That I Want","John Travolta & Olivia Newton-John","Grease (Soundtrack from the Motion Picture)",1978,,498295574,1440844700,,76bf2bd05f5b\r
74,"Don't Stop Me Now - Remastered 2011","Queen","Jazz",1978,7hQJA50XrCWABAu5v6QZ4i,534099493,6781076300,,51bae400cccb\r
75,"Boogie Wonderland (with The Emotions)","Earth, Wind & Fire","",1979,,15180969,1456444995,,876fd504c471\r
76,"Don't Bring Me Down","Electric Light Orchestra","Discovery",1979,4yQUu82EFI8MG6SpI8MAbs,7900624,1054530387,,4f73b067d622\r
77,"Escape (The Pina Colada Song)","Rupert Holmes","Partners In Crime",1979,5IMtdHjJ1OtkxbGe4zfUxQ,2286109,1443846163,,5e1d2fe1fc9b\r
78,"The Devil Went Down to Georgia","The Charlie Daniels Band","A Decade Of Hits",1979,383Xl5QTigwj3QiA3Qc6S7,4833873,206130413,,17835cd192d2\r
79,"Rapper's Delight","The Sugarhill Gang","",1979,,70470863,1220781120,,dd15f9171362\r
80,"It's Still Rock and Roll to Me","Billy Joel","",1980,,1268199,158816095,,78c159b87519\r
81,"You Make My Dreams (Come True)","Daryl Hall & John Oates","The Very Best of Daryl Hall / John Oates",1980,7HX9f8AMBl0vQxAoAzLqhS,560045,273750245,,b329c6c49478\r
82,"9 to 5","Dolly Parton","9 To 5 And Odd Jobs",1980,4w3tQBXhn5345eUXDGBWZG,52534,273166378,,00642d1ef9c3\r
83,"Louisiana Saturday Night","Mel McDaniel","I'm Countryfied",1980,50PU05RTGva8laKDwxED9Y,2893936,714696392,,c6f539f3cd5b\r
84,"Another One Bites The Dust","Queen","",1980,291RmMazWAmDitFuD6NJCv,534099003,6781076397,,8af8227d093c\r
85,"Let's Groove","Earth, Wind & Fire","",1981,,15180993,1456444994,,bbb3d97f833a\r
86,"Don't Stop Believin'","Journey","",1981,77NNZQSqzLNqh2A9JhLRkg,1781737,160024096,,88abb1c95365\r
87,"Give It To Me Baby","Rick James","",1981,,77815398,1440805217,,4e93df11fddf\r
88,"Super Freak","Rick James","",1981,,7451365,1440805227,,35bc48664254\r
89,"Maneater","Daryl Hall & John Oates","",1982,,99674926,1444818206,,64349187e8c6\r
90,"Nur geträumt","Nena","",1982,,491245788,1446014712,,a8ea907904a3\r
91,"Major Tom (Völlig Losgelöst)","Peter Schilling","Major Tom [Voellig Losgeloest]",1982,2qZQtey4lTwvvABVMrO4h8,169150,321972589,,e93519ace455\r
92,"It's Raining Men","The Weather Girls","Success",1982,2IvetNzSZMH5gwjInoyr18,4710246,186092391,,fa72ff20b0bb\r
93,"Rock ""n"" Roll Is King","Electric Light Orchestra","Secret Messages",1983,2EhHWAZrM4zgqqkZx7V291,92153967,1059092928,,c8923e81d581\r
94,"Sweet Dreams (Are Made of This) - 2005 Remaster","Eurythmics","Sweet Dreams (Are Made Of This)",1983,1TfqLAPs4K3s2rJMoCokcS,26965,255966421,,aecb33508f6e\r
95,"99 Luftballons","Nena","",1983,2IJftBfq7pJ43tfnOR0RB3,491245790,1446013598,,eb2d1c3c4c84\r
96,"True - Single Edit","Spandau Ballet","Gold - The Best of Spandau Ballet",1983,6eDYgjKl4vUgRusxb7THDu,1398639,697480528,,6f00d0254156\r
97,"Dancing In The Dark","Bruce Springsteen","The Essential Bruce Springsteen [Disc 2]",1984,,24385357,203709340,,de24d7edc91d\r
98,"Footloose","Kenny Loggins","",1984,,5279199,1164757333,,33094fbdaf20\r
99,"Material Girl","Madonna","",1984,,2123750,80815209,,22de6d0466ba\r
100,"Pride (In The Name Of Love)","U2","",1984,,3142287,1443184298,,e1021960c1bb\r
101,"Take on Me","a-ha","Hunting High and Low",1985,2WfaOiMkCvy7F5fcp2zZ8L,391687,1035047668,,20ba7a88df33\r
102,"Don't You (Forget About Me) - Remastered","Simple Minds","Celebrate",1985,0A4PZuepTcIQVvA5m7R0M1,7196915,715894474,,1d2bbf334f3a\r
103,"Getcha Back","The Beach Boys","Made In U.S.A.",1985,,1392953,725824141,,471414366b6a\r
104,"Livin' on a Prayer","Bon Jovi","Cross Road",1986,,93177984,1423285047,,966776dcca66\r
105,"You Give Love A Bad Name","Bon Jovi","Slippery When Wet",1986,4jlp53Zc5Aq2DQFmu41nvE,93177983,1422954999,,2ff98eea0f56\r
106,"You Can Call Me Al","Paul Simon","Graceland (25th Anniversary Deluxe Edition)",1986,0qxYx4F3vm1AOnfux6dDxP,15421944,581741462,,24d32bb5c8f1\r
107,"La Bamba","Los Lobos","La Bamba / Charlena",1987,0uMMLry3hzWGn3q3loqMkm,3248011,342347879,,bdb7f4d7fa6f\r
108,"Fishin' in the Dark","Nitty Gritty Dirt Band","Rhino Hi-Five: Nitty Gritty Dirt Band",1987,19Pwe795pS5bS2Jr57gHK3,3247682,358599883,,70ddeee0c541\r
109,"I Think We're Alone Now","Tiffany","Tiffany",1987,4uvjOKsp7mSjrDhWdkLPBY,20746966,1440672487,,d4e1af18adbc\r
110,"With Or Without You","U2","",1987,,1218919,1440729860,,54ef6c388afd\r
111,"Song of the South","Alabama","Livin' Lovin' Rockin' Rollin': The 25th Anniversary Collection",1988,2uX5f3x2cObov0iDAPln4o,33918074,270490258,,4e131747989f\r
112,"I'm Gonna Be (500 Miles)","The Proclaimers","",1988,66S14BkJDxgkYxLl5DCqOz,137251,693789044,,9238d6d4adb1\r
113,"Angel Of Harlem","U2","",1988,,2570986,1442802624,,ede24afb67c3\r
114,"Desire","U2","",1988,,2570979,1442802183,,f0e90222db55\r
115,"We Didn't Start the Fire","Billy Joel","",1989,,1268210,158816462,,68d3579636a4\r
116,"Sacrifice","Elton John","Love Songs",1989,,334676,1440922295,,0651d2523fc6\r
117,"Bad Love","Eric Clapton","Journeyman",1989,,250021580,1646560491,,d713f0d74e95\r
118,"Pretending","Eric Clapton","Journeyman",1989,,250021578,1646560241,,4cbd1ef713d0\r
119,"Boot Scootin' Boogie","Brooks & Dunn","#1s ... and then some",1991,7Fq9RwQxSn3kW85PrDUf0M,15608867,327212441,,1808446faaab\r
120,"Two Princes","Spin Doctors","Pocket Full Of Kryptonite",1991,4ePP9So5xRzspjLFVVbj90,1311444,169628364,,e1979c422a60\r
121,"Mysterious Ways","U2","",1991,,8939007,1443063767,,ab6dfe27c4ce\r
122,"One","U2","",1991,,341528698,1443063492,,3859353af24a\r
123,"What's Up?","4 Non Blondes","Bigger, Better, Faster, More !",1992,0jWgAnTrNZmOGmqgvHhZEm,634519,1440902348,,bc366dd1caa8\r
124,"Chattahoochee","Alan Jackson","A Lot About Livin' (And A Little 'Bout Love)",1992,59kHPbwyyCApYA8RQQEuXm,668708,258626629,,60dca3289669\r
125,"Achy Breaky Heart","Billy Ray Cyrus","The Best Of Billy Ray Cyrus: Cover To Cover",1992,5PuY53BL7j4zjTFPRRA2zL,631991,1440756026,,950fec3ed691\r
126,"No Rain","Blind Melon","Blind Melon",1992,6txWz9UapYHVxEd7dDIHXT,1332492,725821929,,e536be30fc37\r
127,"Creep","Radiohead","Pablo Honey",1992,6b2oQwSGFkzsMtQruIWm2p,58990486,1097862231,,f076d1b420cb\r
128,"Mr. Jones","Counting Crows","August And Everything After",1993,5DiXcVovI0FcY2s0icWWUu,2569985,1442449547,,798bc90f4a82\r
129,"Mr. Smiley","Mustard Plug","Big Daddy Multitude (2010 Re-Issue)",1993,12GEszobr92vUXs4LCdwjK,144599456,395970118,,ecae7ce1a00f\r
130,"Slide Away - Remastered 2004","The Verve","This Is Music: The Singles 92-98",1993,7t2VJA18zdX0bW7W5GNsVb,64529837,724423883,,93b736c5e450\r
131,"Stay (Faraway, So Close!)","U2","The Best Of 1990-2000",1993,,638892,1440655983,,750510670df4\r
132,"Can You Feel The Love Tonight","Elton John","Love Songs",1994,,34186764,1445733073,,74b50458466d\r
133,"Circle Of Life","Elton John","Love Songs",1994,,34186762,1445732940,,60402aff80e9\r
134,"I'm Tore Down","Eric Clapton","From The Cradle",1994,,249998028,1646544138,,d672c78020f1\r
135,"Motherless Child","Eric Clapton","From The Cradle",1994,,249998034,1646544681,,e708dbdd7564\r
136,"Sold (The Grundy County Auction Incident)","John Michael Montgomery","John Michael Montgomery",1995,0NLBwQBYJhEM9t3KAMPFVR,282053,305123992,,bcc691ec2f95\r
137,"Wonderwall","Oasis","Stop The Clocks",1995,4w7RuuQAVP0JXlAom3z1aC,156876007,1517520101,,8e43b6053a16\r
138,"Aeroplane","Red Hot Chili Peppers","One Hot Minute",1995,0VLdJcQUsqHBBwqPp4CIKJ,304823,945571325,,9356cd0cdafc\r
139,"Peaches","The Presidents Of The United States Of America","The Presidents of The United States of America: Ten Year Super Bonus Special Anniversary Edition",1995,3VEFybccRTeWSZRkJxDuNR,482266150,1861769503,,dd768b61e26d\r
140,"I Like It, I Love It","Tim McGraw","All I Want",1995,3IvcWWehbBcBR4YZxlGM9R,45156374,260042093,,ce874dce1485\r
141,"The Distance","Cake","Fashion Nugget",1996,,668138,254347756,,b7c1267b888d\r
142,"Beer","Reel Big Fish","Turn The Radio Off",1996,7qEm8Z4KFLdCMlv96KykVd,2994714,254840392,,dea6ec25f040\r
143,"Santeria","Sublime","Sublime",1996,6cJqlSO19vsfCsH1FeFI35,62096434,1440839501,,46675a8474b1\r
144,"What I Got","Sublime","Sublime",1996,3oVSsJXNADnYAnZWiEWFJH,62096430,1440839096,,f9dafbfeb2a0\r
145,"Save Tonight","Eagle-Eye Cherry","Desireless",1997,1t2Hq2WIBcZINOEnK6mdJG,610923,171708539,,c64ff607e8d1\r
146,"You","Mustard Plug","",1997,,144617625,487473226,,f0bc6484ad63\r
147,"Come on Eileen","Save Ferris","It Means Everything",1997,4Z4xFENnvMnRDPpAx5wpaO,641390,192859115,,9628020594e8\r
148,"The Impression That I Get","The Mighty Mighty Bosstones","Let's Face It",1997,1ru5R5iSawvuMELqKXxLjS,320174834,1708975446,,daa26efdce96\r
149,"Bitter Sweet Symphony","The Verve","This Is Music: The Singles 92-98",1997,1WYEDcS7WGjv0rG7rmMX3o,77892506,724424003,,fa709635a955\r
150,"One Week","Barenaked Ladies","Stunt",1998,1C0pmryC2MdXfa7MZ9uIrU,7861567,297419042,,eaf5a1eae08e\r
151,"I'll Make a Man Out of You","Donny Osmond","Mulan",1998,28UMEtwyUUy5u0UWOVHwiI,47940552,1440662805,,b288dda4b0bf\r
152,"Take On Me","Reel Big Fish","",1998,,33899608,303194979,,dfd74b5e9a69\r
153,"Closing Time","Semisonic","Feeling Strangely Fine",1998,087OBLtoeS3Q6j0k6tMNAI,96961926,6824623615,,a48a2bfc0f7c\r
154,"All The Small Things","blink-182","Enema Of The State",1999,2m1hi0nfMR9vdGC8UcrnwU,173565588,1440840510,,046f461ba872\r
155,"Otherside","Red Hot Chili Peppers","Californication",1999,64BbK9SFKH2jk86U3dGj2P,233357,947688084,,38f3efef3088\r
156,"Scar Tissue","Red Hot Chili Peppers","Californication",1999,1G391cbiT3v3Cywg8T7DM1,304805,947688081,,6bc7fba9869a\r
157,"All Star","Smash Mouth","",1999,2P1ZqQq8rQtmV7BLZ0Junn,1300228,1440915693,,1a3c9fe5acd1\r
158,"She's so High","Tal Bachman","Tal Bachman",1999,7mnGQesk1TzQLzQ9bYWZPR,1311156,158610105,,c9968ac5d167\r
159,"It's My Life","Bon Jovi","Crush",2000,0v1XpBHnsbkCn7iJ9Ucr1l,35981744,1440813250,,7be8f6c32c18\r
160,"Yellow","Coldplay","Parachutes",2000,3AJwUDP919kvQ9QcozQPxg,120272,1122782283,,ad27feb2d2b3\r
161,"Beautiful Day","U2","",2000,1VuBmEauSZywQVtqbxNqka,399825,1443100723,,f72f8eecb463\r
162,"Walk On","U2","All That You Can't Leave Behind",2000,,7225671,1443101089,,e21d6492dd33\r
163,"The Middle","Jimmy Eat World","The Middle",2001,30FHk0GVCbVwoC6jmJTg0r,77624459,1450030115,,090c3a788905\r
164,"I'm A Believer - From ""Shrek"" Motion Picture Soundtrack","Smash Mouth","Shrek",2001,0mBL2JwjNYKtdFacHxvtJt,572109,1440517522,,ca83ec05d7a9\r
165,"Last Nite","The Strokes","Is This It",2001,3SUusuA9jH1v6PVwtYMbdv,1798871,266377010,,a966fb750521\r
166,"Someday","The Strokes","Is This It",2001,7hm4HTk9encxT0LYC0J6oI,1798946,266376993,,896d2b64db54\r
167,"Island In The Sun","Weezer","Weezer",2001,2MLHyLy5z5l5YRp7momlgw,573345,1440868258,,1e711dc0c588\r
168,"Jerk It Out","Caesars","",2002,0O8XCrGlVsaKnErfcTSSFU,157649,699701391,,135540d2b369\r
169,"The Scientist","Coldplay","A Rush of Blood to the Head",2002,75JFxkI2RXiU7L9VXzMkle,128605,1122776155,,313d1797ee16\r
170,"This Love","Maroon 5","Songs About Jane: 10th Anniversary Edition",2002,55vBk4ODkxRVSaHbKxWBn6,331558,1428782513,,666bbd65556c\r
171,"By the Way","Red Hot Chili Peppers","By the Way",2002,1f2V8U1BiWaC9aJWmpOARe,304859,945578421,,bc3eb055e7fb\r
172,"Dreaming of You","The Coral","The Coral",2002,2BodCfcjTxsHSoQq6uFBlJ,57223530,1083555321,,b210e777e83c\r
173,"Beer For My Horses","Toby Keith","Unleashed",2002,7E2DqvnVtbIrFrL5X6YH9Q,569253,1440510908,,da89182b2de3\r
174,"What Was I Thinkin'","Dierks Bentley","Dierks Bentley",2003,0r8iDf65NHgFgZOGLwj5r8,1352691,1440843561,,2087d02311f3\r
175,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,712721787,,a08eae93f89e\r
176,"Are You Gonna Be My Girl","Jet","Get Born",2003,305WCRhhS10XUcH6AEwZk6,493931266,1778047973,,a3d8670793fb\r
177,"Hey Ya!","Outkast","The Way You Move / Hey Ya!",2003,3AszgPDZd9q0DpDFt4HFBy,1772295,1774799818,,b5f15a52071e\r
178,"A Moment of Silence","Streetlight Manifesto","Everything Goes Numb",2003,2aF3ytxtQtmlYN56NOGN7w,73530257,6809988659,,6a9a49918ea4\r
179,"Everything Went Numb","Streetlight Manifesto","Everything Goes Numb",2003,2I3HfKZFH69dLwhapHrI9o,73530249,6809988365,,742bd552bc4a\r
180,"Mr. Brightside","The Killers","Hot Fuss",2003,7oK9VyNzrYvRFo7nQEYkWN,150850052,1526194192,,23bf925e8631\r
181,"Seven Nation Army","The White Stripes","Elephant",2003,3m6KkYKdnbffMpGd9Pm9FP,156600940,1533513537,,5be4a4c8d506\r
182,"Take Me Out","Franz Ferdinand","Franz Ferdinand",2004,6ooluO7DiEhI1zmK94nRCM,3751639,315844084,,c4c134ad33be\r
183,"Somewhere Only We Know","Keane","Hopes And Fears",2004,0ll8uFnc0nANY35E0Lfxvg,361008130,1440737356,,b54e2943ca60\r
184,"Float On","Modest Mouse","Good News For People Who Love Bad News",2004,2lwwrWVKdf3LR9lbbhnr6R,61471,201257515,,72931307f9a4\r
185,"All These Things That I've Done","The Killers","Hot Fuss",2004,0kYUrLVQOfx21xuXu7OGrT,150850057,1526194197,,622fde01b8f4\r
186,"Somebody Told Me","The Killers","Hot Fuss",2004,7HGTkn2aX7MNdKs7nV2xBt,23273348,1526194195,,bcdd46352ad0\r
187,"Good Directions","Billy Currington","Doin' Somethin' Right",2005,7GQjJEwqlp6m5HNWVQd6OR,35730824,1440768240,,88744cb29cfe\r
188,"Before He Cheats","Carrie Underwood","Some Hearts",2005,0ZUo4YjG4saFnEJhdWp9Bt,537082,214696369,,94d5b874f774\r
189,"Jesus, Take the Wheel","Carrie Underwood","Some Hearts",2005,3lec3CzDPAxsZokPph5w87,537079,214695747,,24722b24ec32\r
190,"Dance, Dance","Fall Out Boy","Dance, Dance",2005,5CyMpPsFbJZZm4UlQAW2Yr,3684437,1440749367,,8e2d00a14d8c\r
191,"Feel Good Inc.","Gorillaz","Demon Days",2005,0d28khcov6AiegSCpG5TuT,1404361,693620735,,63fbd18c4597\r
192,"Banana Pancakes","Jack Johnson","In Between Dreams",2005,451GvHwY99NKV4zdKPRWmv,77660808,1440768764,,6804782e74c8\r
193,"How to Save a Life","The Fray","",2005,5fVZC9GiM4e8vu99W0Xf6J,5119488,821031488,,d31a20312767\r
194,"International Harvester","Craig Morgan","Little Bit Of Life",2006,0Ta3jOf8m9yCSWMVwd8Qlf,487200994,1447675154,,a70d997fa511\r
195,"Crazy","Gnarls Barkley","St. Elsewhere",2006,1vxw6aYJls2oq3gW0DujAo,314701,1741403966,,08a3311b3f5e\r
196,"Would You Go With Me","Josh Turner","Your Man",2006,1KhrAWvLIjRlQIJtSTgvsi,4036044,1440725728,,9148f4193f2d\r
197,"Starlight","Muse","Black Holes and Revelations",2006,3skn2lauGk7Dx6bVIt5DVj,2844707,992221996,,ded037f857fe\r
198,"If You're Going Through Hell (Before The Devil Even Knows)","Rodney Atkins","If You're Going Through Hell",2006,7vSn3VNbzOtPebdj6ZSebj,45156892,162357882,,7b16433f9137\r
199,"Hips Don't Lie (feat. Wyclef Jean)","Shakira","Oral Fixation, Vol. 2 (Expanded Edition)",2006,3ZFTkvIE7kyPt6Nu3PEa7V,438736569,1817217063,,57998f39ad24\r
200,"Keasbey Nights","Streetlight Manifesto","Keasbey Nights",2006,0qiGzj3aAC2TuM3sPoWTUJ,73636104,6810842416,,13ccecaedc46\r
201,"Chelsea Dagger","The Fratellis","Costello Music",2006,3ItzRpwvKtkDSNdRSjXu7Z,111299175,1440665911,,a4ad43371413\r
202,"Fluorescent Adolescent","Arctic Monkeys","Favourite Worst Nightmare",2007,2HYaqJitHc9qiG68vc0JIm,14831207,251499489,,0599a4491424\r
203,"Kids","MGMT","Oracular Spectacular",2007,1jJci4qxiYcOHhQR247rEU,1317019,264720124,,9146ba5d14fe\r
204,"Grace Kelly","MIKA","Life In Cartoon Motion",2007,2SDx0PooHZI1SQKR0y44bs,1219371,1440763492,,b039e96b1d1b\r
205,"Somewhere In the Between","Streetlight Manifesto","",2007,1Bk8XNIzzXB3xGfWSLC2qK,73531623,1232777709,,607b3d510df1\r
206,"We Will Fall Together","Streetlight Manifesto","",2007,0plo6KjgjTcRhj7Fn8oemk,73531618,1232777225,,c3dc7691eaed\r
207,"People Are Crazy","Billy Currington","Little Bit Of Everything",2008,5JnLiuMgRAWoHYOhatFP3s,290729079,1442219690,,113327658a35\r
208,"Ain't No Rest for the Wicked","Cage The Elephant","Cage The Elephant",2008,3kb72STxc2959ZqsTwu52i,19573423,1437697155,,abb76f07fea9\r
209,"Viva La Vida","Coldplay","",2008,3Fcfwhm8oRrBvBZ8KGhtea,288744882,1122773680,,0e3aba851b76\r
210,"Dog Days Are Over","Florence + The Machine","",2008,1YLJVmuzeM2YSUkCCaTNUB,4951057,1470593922,,37322c1ea300\r
211,"You and I","Ingrid Michaelson","Be OK",2008,4oeRfmp9XpKWym6YD1WvBP,139906975,1511264861,,cac223ce7489\r
212,"Daylight","Matt and Kim","Grand",2008,2I43coEbzFSTMGO3kCjLMB,522225428,6767080769,,f3f3ab1c0062\r
213,"A-Punk","Vampire Weekend","Vampire Weekend",2008,5dKBaysNJtfpyNTRa5lqDb,2209795,270425151,,b38c7c2556ae\r
214,"Chicken Fried","Zac Brown Band","The Foundation",2008,0LQtEJt7x0s6knb6RKdRYc,197087480,1585172570,,523821ff32e4\r
215,"And We Danced (feat. Ziggy Stardust)","Macklemore","The Unplanned Mixtape",2009,1FCQEg7wOK9IIBuxx63krr,52730117,,,e78d3ede4be6\r
216,"Haven't Met You Yet","Michael Bublé","Crazy Love",2009,4fIWvT19w9PR0VVBuPYpWA,19373470,668403662,,b7c3e70d155e\r
217,"Uprising","Muse","The Resistance",2009,4VqPOruhp5EdPBeR92t6lQ,3083287,992627891,,171a04a555b1\r
218,"Secrets","OneRepublic","Waking Up",2009,0tgnTzjIkj8mVVEh0SNH0t,453505823,1461280403,,75d20b7e4fc3\r
219,"Fireflies","Owl City","Ocean Eyes",2009,3DamFFqW32WihKkTVlwTYQ,3140991,1440783289,,df8f56b2f3c7\r
220,"Lisztomania","Phoenix","Wolfgang Amadeus Phoenix",2009,4esUVfYnFcCCVHntx9FQCb,390710655,1771710017,,cfa02fbe03f4\r
221,"Brown Eyed Girl","Reel Big Fish","Fame, Fortune, And Fornication",2009,2lbAU3IQytWjl9b0LLuztk,385585158,1767067795,,dad001840421\r
222,"Butch","Saint Motel","ForPlay",2009,5ZQWNRoJsfkByZFHqCB92J,28204103,856418241,,5e6bc2bf7f59\r
223,"Pumped Up Kicks","Foster The People","Torches",2010,1G5RlnmO3GzNdKCDNSgT5W,25280917,435761212,,d33221c20cfa\r
224,"Give Me Hope","New Politics","A Bad Girl In Harlem",2010,53l4bzW4sr5jKyb8tMv8S7,20067427,635054184,,4eb02fa6dbf4\r
225,"Hell","Streetlight Manifesto","99 Songs of Revolution: Volume I",2010,,73532317,1232796916,,9667cc5ced8a\r
226,"Such Great Heights","Streetlight Manifesto","",2010,26rMsVy6Oa4rK9ue7GW0gU,73532326,1232797193,,73711bcc9cbd\r
227,"Stuck Like Glue","Sugarland","The Incredible Machine",2010,0JcKdUGNR7zI4jJDLyYXbi,4511573,1440745401,,d0ca3f9095c0\r
228,"What You Know","Two Door Cinema Club","Tourist History",2010,6jrMVRReY24qzCfe1BRrww,21410891,1771711274,,ff99c950f56d\r
229,"Cough Syrup","Young the Giant","Young The Giant",2010,1UqhkbzB1kuFwt2iy4h29Q,6441308,394992810,,8e70b4808f08\r
230,"My Body","Young the Giant","Young The Giant",2010,0bfY17lNbEp2Wnw6YipXQB,6441306,394992808,,2e9c57c8368e\r
231,"Trojans","Atlas Genius","When It Was Now",2011,0wDEiGfq4pw7FAkYKpkwMo,19690802,586303730,,77020c404fef\r
232,"Safe And Sound","Capital Cities","In A Tidal Wave Of Mystery",2011,0oFvhxNf3mBII26pPI3a5I,174840352,1766005715,,67d8a3cc6f07\r
233,"Brighter Than The Sun","Colbie Caillat","",2011,5YTtTbqxUzJHD3CpbNHerP,131069512,1442920254,,710e3bba879e\r
234,"Don't Stop (Color on the Walls)","Foster The People","",2011,11EvmoyFXs3aQMgAvL6DOZ,25280919,435761223,,7acd84be8821\r
235,"Houdini","Foster The People","Torches",2011,1izCycxk4xx1Bsy2JDrCIS,25280922,435761289,,d6fa286c8295\r
236,"We Are Young (feat. Janelle Monáe)","fun.","",2011,3ehrxAhYms24KLPG8FZe0W,7984974,486040195,,432e62e9cbfa\r
237,"Everybody Talks","Neon Trees","Everybody Talks",2011,5JGxJFdgOQdJZdmyEzDtTj,140321191,1443506997,,34611a6803a6\r
238,"Little Talks","Of Monsters and Men","My Head Is An Animal",2011,2ihCaVdNZmnHZWt0fvAM7B,14367903,1440809330,,3fcfa0be3256\r
239,"This Head I Hold","Electric Guest","",2012,1tzPSule9WZ9B8SujHv8fp,43419239,638896849,,8fc146435dcd\r
240,"Some Nights","fun.","Some Nights",2012,31ToclvJik88LlsHemxXFX,14989955,601186061,,7ea8196cc7ca\r
241,"Demons","Imagine Dragons","",2012,1Ntj0hZfncXCQ5hij7igIE,18692667,1440873339,,707dde8a63a9\r
242,"Mountain Sound","Of Monsters and Men","My Head Is An Animal",2012,3SPVZJzf1Hs30rB6yXVf2y,14367900,1440809063,,fd9e1d440c7e\r
243,"Take a Walk","Passion Pit","Gossamer",2012,4Sfa7hdVkqlM8UW5LsSY3F,16300003,534798882,,e6cfe0c60016\r
244,"Somebody That I Used to Know","Pentatonix","PTX, Vol. 1",2012,5XPSElbh3y0S1Jl0ggpwQr,29712066,877648579,,b3e1490405fa\r
245,"San Francisco","The Mowgli's","Waiting For The Dawn",2012,2eQOMQkStoRUQyq6HGh1iG,35204253,1445876789,,ade039090f39\r
246,"Anna Sun","WALK THE MOON","Walk The Moon",2012,3e0yTP5trHBBVvV32jwXqF,15623768,533488700,,a5c8af4a1aab\r
247,"Pompeii","Bastille","",2013,3gbBpTdY8lnQwqxNCcf795,23496115,1440858321,,4b10feaa47e6\r
248,"The Phoenix","Fall Out Boy","Save Rock And Roll",2013,53AuxddsgPSlqM619nJhSd,19715655,1440862595,,a8360c9c617e\r
249,"The Walker","Fitz and The Tantrums","More Than Just a Dream",2013,0Nk7bSn0MItonkR0GNs3mj,25349519,601357985,,24a2cd156206\r
250,"Counting Stars","OneRepublic","",2013,074cMMOKjFLwdaTjKW1wBs,29862937,1471704175,,51f2d5e395ed\r
251,"The Three of Us","Streetlight Manifesto","The Hands That Thieve",2013,2xrRBqEanoBaA0tOgYy18V,73531945,1232797152,,0bcadc74288d\r
252,"House of Gold","Twenty One Pilots","Vessel",2013,36tghkPg1AO4HsAzo6YpPp,18371116,585128670,,626fe104da74\r
253,"Unbelievers","Vampire Weekend","Modern Vampires of the City",2013,51DZ0wUocQ8sQfjnibXVcD,20134595,613185019,,23aa30cda273\r
254,"Riptide","Vance Joy","",2013,1KqlVt63Q4bl1VdSlymr5C,303106814,1022164261,,81929be570b3\r
255,"Uptown Funk (feat. Bruno Mars)","Mark Ronson","Uptown Special",2014,32OlwWuMpZ6b0aN2RZOeMS,39249713,943946671,,c02d669b43ac\r
256,"Reflections","MisterWives","Our Own House",2014,2PtBhfoPZ6VYtXkrE5FrCH,40954774,1440845906,,e5ebb6602b33\r
257,"Cold Cold Man","Saint Motel","My Type EP",2014,6RKGBcDtgzXx21zUjpeu6F,32805227,886711885,,48c62de78549\r
258,"Stacy’s Mom","Scott Bradlee's Postmodern Jukebox","Selfies on Kodachrome",2014,3TOGVJQaCQPE4J3JiSncwG,69185306,956922189,,658d64a45a0d\r
259,"Timber","Scott Bradlee's Postmodern Jukebox","Twist Is The New Twerk",2014,34gz4EkB8fx3JMe4Qb3op1,58875131,975886729,,6ad6bc0dda87\r
260,"Beware the Dog","The Griswolds","Be Impressive",2014,0XhsBJl0pj3V1nA57R0BZW,65096871,1443749456,,3df45082d2b9\r
261,"Shut Up and Dance","WALK THE MOON","",2014,1K66si1ZELsRZzg7m7mcps,37896389,961298418,,dd9dd5471570\r
262,"Chasin' Honey","Wild Party","Phantom Pop",2014,0Z0iYAtKYswMYXL3kJtdO4,563756437,1443648998,,de878633f5ef\r
263,"Hello","Adele","Hello",2015,0ENSn4fwAbCGeFGVUbXEU3,62300893,1544494392,,fa9734f238e3\r
264,"Waiting For Love","Avicii","Stories",2015,6nsLzJfvp5OLd4mgqUJkpq,79272716,1440834312,,0db2b23ef480\r
265,"Uma Thurman","Fall Out Boy","",2015,2XW3MZUoXb4MhIVAN7dVzD,39356913,1440826718,,d2c5672c3f47\r
266,"South","Hippo Campus","South - Single",2015,64TjzuxG5PJ7payjphrOC0,49686154,1792036706,,30a59dace8d2\r
267,"Bad Romance","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,5xrHvVmSF3ui0EKI8FArv3,58875147,988683281,,67b073f89af2\r
268,"Paper Planes","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,1YQY7ODoHmrfDwzgshRBKq,58875153,988683427,,d72581e098ec\r
269,"Take Me To Church","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,2YwlwV98tjcKF664eEAAyV,58875155,988683429,,fc6e7215c86d\r
270,"Tear in My Heart","Twenty One Pilots","Blurryface",2015,3bnVBN67NBEzedqQuWrpP4,45191321,974485807,,25e1c137d593\r
271,"Sweet Talk","Saint Motel","saintmotelevision",2016,6kcHg7XL6SKyPNd78daRBL,66022010,1141089363,,7fbc9e64cbc4\r
272,"MMMbop","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,2jt8tEFZ4qZJ1ax3b0Io5f,69185267,1133894559,,73c52d6eaac7\r
273,"My Heart Will Go On","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,3qhgkT74IpVAjk5xjNylHC,69185277,1133894642,,680b6a706161\r
274,"Too Late","The Happy Fits","Awfully Apeelin'",2016,1dSxgR97icbbeB6Q01VJk4,295387343,1688380606,,fc719d70756e\r
275,"By My Side","The Interrupters","Say It Out Loud",2016,2qKwTR3n4kBv0Gr0DAd0Zg,121046448,1485069851,,540427a58e02\r
276,"On A Turntable","The Interrupters","Say It Out Loud",2016,5BdbpAak9RUhjwT8fwciZe,121046451,1485069854,,c99541a4deba\r
277,"didya think","Arlie","Wait",2017,4HOg84QsolNLzNp08qZ3sX,256364542,1436497351,,45c188833fd3\r
278,"Shape of You","Ed Sheeran","÷",2017,7qiZfU4dY1lWllzX7mPBI3,219082768,1193700767,,b97a71e2ec0a\r
279,"Delirium Tremendous","Felix Hagan & the Family","Attention Seeker",2017,0wffwRViqvZPRIgAfw1Oab,81450107,1315610602,,53d6defe5f4b\r
280,"Buttercup","Hippo Campus","Landmark",2017,6iCJCZqDJjmBxt07Oid6FI,70740155,1169417219,,4045bef4b349\r
281,"Feel It Still","Portugal. The Man","Woodstock",2017,6QgjcU0zLnzq5OrUoSZ3OK,74886171,1229315050,,10d2023bb8af\r
282,"Shotgun","George Ezra","Staying at Tamara's",2018,4ofwffwvvnbSkrMSCKQDaC,85905133,1331589486,,b7d1a82f55df\r
283,"still feel.","half•alive","Now, Not Yet",2018,48XkVAagIoQHCsOlJtXUd5,114925742,1467959289,,0bec2509d5bc\r
284,"Down To The Honkytonk","Jake Owen","Greetings From...Jake",2018,1HsoSwqtwGBNIHZM7lPmQR,530162466,6776024326,,cf579ccbf87c\r
285,"Caught Up In The Country","Rodney Atkins","Caught Up In The Country",2018,4aGG4VOWGv9RwlYQNsBrkE,103407626,1451246197,,165ea5eeee9c\r
286,"Achey Bones","The Happy Fits","Concentrate",2018,3uID7q0TIJR2049Uemxa7r,557877117,6807992787,,25b9e9eaffa3\r
287,"Heart of a Dancer","The Happy Fits","Concentrate",2018,6LREFtAefeqdTNdBAdmd99,557877125,6807992913,,4098e7a166b5\r
288,"Africa","Weezer","Africa",2018,36Pim2ANczp82lCWIb8GHy,89225164,1450271000,,2e16ab2e3d7d\r
289,"Good Vibes","Chris Janson","Real Friends",2019,1XVqh0dC0PIl72f2mQhsVt,103044408,1478976690,,cf878d29fde5\r
290,"Kill the Sun","Motherfolk","Family Ghost",2019,34uXlhi3eN9jpO95CgeV0o,324526050,1713805994,,55062a027bdf\r
291,"Hell's Comin' with Me","Poor Man's Poison","Hell's Comin' with Me",2019,5N0lmKQfQpXNQNjUGlPKIT,285850539,1679612287,,d26db08e3231\r
292,"Sisters","Saint Motel","The Original Motion Picture Soundtrack",2019,64QZsTSNEUiqs8KeOPIrpg,186509846,1567234497,,8608aaa7897e\r
293,"Van Horn","Saint Motel","The Original Motion Picture Soundtrack",2019,78bsqObGFUD5ntweePBhIY,119254644,1567234498,,ef597b40696f\r
294,"Disco","Surf Curse","Disco",2019,2Lumsra3kuU61wXkEKzKaK,189324485,1574318912,,2756df52cb1a\r
295,"honey","Coastal Club","honey",2020,4YCVwSOabpy5DeaxRjUok1,133984011,1502313579,,a3cd3da05236\r
296,"Heat Waves","Glass Animals","Dreamland",2020,02MWAaffLxlfxAUY7c5dvx,150502627,1508562516,,35cb096eda5d\r
297,"Hazel","Kids That Fly","",2020,,492322033,1763955499,,423af8ace5c4\r
298,"SUPERBLOOM","MisterWives","SUPERBLOOM",2020,2HvtedoEeymVWrBPyAMNwZ,135506897,1513894393,,c3725f5bb23c\r
299,"She Wants Me (To Be Loved)","The Happy Fits","What Could Be Better",2020,1yS9wpv8GW2c8tHC7P85JJ,556436919,6806324530,,361089b5165a\r
300,"Island Honey","Black Pontiac","",2021,4ZVSYUXCqarp67Wd2mrt9E,320834015,1711140929,,8179a8f02866\r
301,"its alright :)","Kevin Walkman","its alright :)",2021,66nBMj6cwE9V6LxcpQQpFs,290400852,1684844247,,a14a7be68567\r
302,"Make You Make Believe","My Kid Brother","Happy.Mad.Weird.Sad",2021,4Q3uG8mweBRZ9kosJ6C01E,251352904,1628466075,,c0846ec4d504\r
303,"good 4 u","Olivia Rodrigo","SOUR",2021,4ZtFanR9U6ndgddUvNcjcG,184786799,1560735856,,e58c74b24e75\r
304,"cough drops","almost monday","cough drops",2022,5Jpj3lCgX06bu6STIjUYKN,250815905,1646155524,,772b659cbeaf\r
305,"sunburn","almost monday","DIVE",2022,5Q9hC6Z25FeRL9xjJIrIwQ,388023192,1760436084,,50df973c57a0\r
306,"strawberry chainsaw","JAWNY","It’s Never Fair, Always True",2022,4lAasiKJZR4CkDygazvpvB,278653944,1668438501,,4e221cea74f0\r
307,"Spilt Salt","My Kid Brother","Happy.Mad.Weird.Sad",2022,1qpasIOsd7KIxqOX06FDGB,251352910,1628466083,,20866cc22b64\r
308,"Dive Bar Named Nirvana","Dogpark","",2023,,369958199,1752583341,,750743b5a896\r
309,"The Implication","Parrotfish","The Implication",2023,5KUK7rDJuv28K10lb1gM7r,291298255,1684548115,,c6eda9141c23\r
310,"can't slow down","almost monday","can't slow down",2024,1KdjbgMfPmQQANYVS2IfTJ,365138302,1788259515,,cd543b4134fd\r
311,"she likes sports","almost monday","DIVE",2024,0PksrXlYvVJ3gG5wwG1oKx,388023188,1760435776,,151ef712acd0\r
312,"you look so good","almost monday","",2024,,388027380,1788259511,,46f3787ce288\r
313,"TEXAS HOLD 'EM","Beyoncé","TEXAS HOLD 'EM",2024,7AYmToZ5y67fBjq4RLFbuq,353983142,1730410734,,c8de22be7a9d\r
314,"conversation","Coastal Club","all of the things you said",2024,2jpshlQDRRA3Kz9VmAo8x4,367911733,1750803446,,94c088594f06\r
315,"sequoia","almost monday","DIVE",2025,3dT6GGcgIy4yptrRA05Mhk,411935179,1788259852,,2e4ab5f4b19b\r
316,"Everything You Do","The Happy Fits","Wild in Love",2025,5kdYaZnxUur5ScyK0bVWBU,426887499,1818895080,,c0e43898be4b\r
317,"Shake Me","The Happy Fits","",2025,,435492955,1813923387,,7675a332570d\r
318,"The Nerve","The Happy Fits","",2025,,435492946,1813923383,,7bb5e9cb6aa8\r
`,Pe=`id,title,artist,album,year,spotify,tidal,itunes,youtube,UniqueID\r
1,"Hey, Good Lookin'","Hank Williams","",1951,,94445479,1705468456,,cb5c7ec8a6ba\r
2,"I Walk the Line","Johnny Cash","",1956,,504205037,1354859052,,a611c6e803ef\r
3,"Crazy","Patsy Cline","",1961,,113299812,1440826094,,d5a1f5c3bc72\r
4,"Ring of Fire","Johnny Cash","",1963,,2045087,251002253,,090516a0e733\r
5,"King of the Road","Roger Miller","",1965,,94444943,1445094813,,57c6f3ea1638\r
6,"Wichita Lineman","Glen Campbell","",1968,,1563329,1443109565,,f0c8ecef5b45\r
7,"Mama Tried","Merle Haggard","",1968,,1338347,724522536,,65f585ae22b3\r
8,"Stand by Your Man","Tammy Wynette","",1968,,2815391,170588744,,6b59ec439015\r
9,"Coal Miner's Daughter","Loretta Lynn","",1970,,94448773,1444119371,,e3f037377fef\r
10,"Take Me Home, Country Roads","John Denver","",1971,,35223314,1482519924,,f5c546fb7e34\r
11,"Jolene","Dolly Parton","",1973,,54518833,1062400330,,cff5b31fece2\r
12,"I Will Always Love You","Dolly Parton","",1974,,54518838,282883579,,5f505aa10b65\r
13,"Luckenbach, Texas (Back to the Basics of Love)","Waylon Jennings","",1977,,40396,284985845,,75f5af7eabdd\r
14,"The Gambler","Kenny Rogers","",1978,,1350603,1440840853,,a82d24510a40\r
15,"Mamas Don't Let Your Babies Grow Up to Be Cowboys","Willie Nelson","Greatest Hits (& Some That Will Be)",1978,2SSHYzoxRsFosKl81KRFz7,496151,422030213,,602d47aa50ae\r
16,"Family Tradition","Hank Williams Jr.","",1979,,46996161,71580161,,7cd4efe34439\r
17,"The Devil Went Down to Georgia","The Charlie Daniels Band","A Decade Of Hits",1979,383Xl5QTigwj3QiA3Qc6S7,4833873,206130413,,17835cd192d2\r
18,"9 to 5","Dolly Parton","9 To 5 And Odd Jobs",1980,4w3tQBXhn5345eUXDGBWZG,52534,273166378,,00642d1ef9c3\r
19,"He Stopped Loving Her Today","George Jones","",1980,,1304143,155664384,,d4f2bbf33182\r
20,"Louisiana Saturday Night","Mel McDaniel","I'm Countryfied",1980,50PU05RTGva8laKDwxED9Y,2893936,714696392,,c6f539f3cd5b\r
21,"On the Road Again","Willie Nelson","",1980,,23823025,158498945,,ff1c43d4c79c\r
22,"Mountain Music","Alabama","The Essential Alabama 3.0",1982,68SAQUzxfEW1eKxZvhDDEm,3008364,381129318,,a5b4b09bcb6e\r
23,"Amarillo by Morning","George Strait","",1982,,15300501,1440849334,,df9660e3cda9\r
24,"Dixieland Delight","Alabama","",1983,,687189,337878309,,27f58e53201f\r
25,"Fishin' in the Dark","Nitty Gritty Dirt Band","Rhino Hi-Five: Nitty Gritty Dirt Band",1987,19Pwe795pS5bS2Jr57gHK3,3247682,358599883,,70ddeee0c541\r
26,"Song of the South","Alabama","Livin' Lovin' Rockin' Rollin': The 25th Anniversary Collection",1988,2uX5f3x2cObov0iDAPln4o,33918074,270490258,,4e131747989f\r
27,"The Dance","Garth Brooks","",1989,,,,,4849e2a79e76\r
28,"Friends in Low Places","Garth Brooks","",1990,,,,,34a8a95debad\r
29,"Don't Rock the Jukebox","Alan Jackson","",1991,,61318743,250107585,,16f5285f7359\r
30,"Boot Scootin' Boogie","Brooks & Dunn","#1s ... and then some",1991,7Fq9RwQxSn3kW85PrDUf0M,15608867,327212441,,1808446faaab\r
31,"Neon Moon","Brooks & Dunn","",1991,,514754,291896531,,76a1e1a90faa\r
32,"The Night The Lights Went Out In Georgia","Reba McEntire","For My Broken Heart",1991,2MiXC2LfpsoeUP5RvMGEQ3,36266192,1440762431,,4ce9e6de682f\r
33,"Chattahoochee","Alan Jackson","A Lot About Livin' (And A Little 'Bout Love)",1992,59kHPbwyyCApYA8RQQEuXm,668708,258626629,,60dca3289669\r
34,"Achy Breaky Heart","Billy Ray Cyrus","The Best Of Billy Ray Cyrus: Cover To Cover",1992,5PuY53BL7j4zjTFPRRA2zL,631991,1440756026,,950fec3ed691\r
35,"Should've Been a Cowboy","Toby Keith","",1993,,1764537,1436536526,,10ec63215966\r
36,"Check Yes or No","George Strait","",1995,,529249,1445734001,,3a39b3b6e563\r
37,"Sold (The Grundy County Auction Incident)","John Michael Montgomery","John Michael Montgomery",1995,0NLBwQBYJhEM9t3KAMPFVR,282053,305123992,,bcc691ec2f95\r
38,"I Like It, I Love It","Tim McGraw","All I Want",1995,3IvcWWehbBcBR4YZxlGM9R,45156374,260042093,,ce874dce1485\r
39,"Man! I Feel Like a Woman!","Shania Twain","",1997,,82489104,1445668856,,795f9d6d1d81\r
40,"She Thinks My Tractor's Sexy","Kenny Chesney","",1999,,517010,254560485,,5f9e9745036f\r
41,"Ol' Red","Blake Shelton","Blake Shelton",2001,5wane5dFpp8xgriui6y0c7,3175135,663118390,,caa22ffcdede\r
42,"Ten Rounds with Jose Cuervo","Tracy Byrd","",2001,,,252562937,,d9fdd8d64674\r
43,"Beer For My Horses","Toby Keith","Unleashed",2002,7E2DqvnVtbIrFrL5X6YH9Q,569253,1440510908,,da89182b2de3\r
44,"Courtesy Of The Red, White And Blue (The Angry American)","Toby Keith","Unleashed",2002,0M7mWKqwTIaVjYyxfZmtTa,569249,1440510903,,9dcdcdbc1ef8\r
45,"What Was I Thinkin'","Dierks Bentley","Dierks Bentley",2003,0r8iDf65NHgFgZOGLwj5r8,1352691,1440843561,,2087d02311f3\r
46,"Pickin' Wildflowers","Keith Anderson","Three Chord Country and American Rock & Roll",2004,2GgIDaPLsowybB3WgxLWUj,55594,253205563,,195e3da6b703\r
47,"Good Directions","Billy Currington","Doin' Somethin' Right",2005,7GQjJEwqlp6m5HNWVQd6OR,35730824,1440768240,,88744cb29cfe\r
48,"Before He Cheats","Carrie Underwood","Some Hearts",2005,0ZUo4YjG4saFnEJhdWp9Bt,537082,214696369,,94d5b874f774\r
49,"Jesus, Take the Wheel","Carrie Underwood","Some Hearts",2005,3lec3CzDPAxsZokPph5w87,537079,214695747,,24722b24ec32\r
50,"Wasted","Carrie Underwood","Some Hearts",2005,5d98TnYzxQmFE4vKgzWXuT,537076,214695587,,155537babde3\r
51,"International Harvester","Craig Morgan","Little Bit Of Life",2006,0Ta3jOf8m9yCSWMVwd8Qlf,487200994,1447675154,,a70d997fa511\r
52,"Little Bit of Life","Craig Morgan","Little Bit Of Life",2006,1jSZ1IETySh2kDTnyfIE0I,487200992,1447675153,,528826bf2306\r
53,"Would You Go With Me","Josh Turner","Your Man",2006,1KhrAWvLIjRlQIJtSTgvsi,4036044,1440725728,,9148f4193f2d\r
54,"If You're Going Through Hell (Before The Devil Even Knows)","Rodney Atkins","If You're Going Through Hell",2006,7vSn3VNbzOtPebdj6ZSebj,45156892,162357882,,7b16433f9137\r
55,"All-American Girl","Carrie Underwood","Carnival Ride",2007,2dRPQFwPqAmc42mDRnsDQu,1189483,265826612,,ef24e1c2d7d2\r
56,"Firecracker","Josh Turner","Everything Is Fine",2007,5JtRN8PCpxoL03vnIpZXc7,380782652,1452787058,,0237c853fee0\r
57,"Gunpowder & Lead","Miranda Lambert","Crazy Ex-Girlfriend",2007,3z1PqYwMtct2Dm4R9lhWnT,23368816,251081801,,c733a244e49b\r
58,"People Are Crazy","Billy Currington","Little Bit Of Everything",2008,5JnLiuMgRAWoHYOhatFP3s,290729079,1442219690,,113327658a35\r
59,"Alright","Darius Rucker","Learn To Live",2008,5JlH51YDYsGj2dyEJKKjcN,189448089,1530253805,,bf58a264702f\r
60,"Love Story","Taylor Swift","Fearless",2008,1D4PL9B8gOg78jiHg3FvBb,3169112,1440924808,,05f46820a01f\r
61,"Chicken Fried","Zac Brown Band","The Foundation",2008,0LQtEJt7x0s6knb6RKdRYc,197087480,1585172570,,523821ff32e4\r
62,"A Little More Country Than That","Easton Corbin","Easton Corbin",2009,7LrZ3SczM7zlUkVlhevPp2,3765859,1445663801,,629c44997d9d\r
63,"Why Don't We Just Dance","Josh Turner","Haywire",2009,2p07VcUwRZ5sru3mJ0JogS,3736896,1443459838,,149a152bf96b\r
64,"Rain Is A Good Thing","Luke Bryan","Doin' My Thing",2009,1YhFtqwcN138S6ng3MT1nN,3132588,724572994,,559532007131\r
65,"Stuck Like Glue","Sugarland","The Incredible Machine",2010,0JcKdUGNR7zI4jJDLyYXbi,4511573,1440745401,,d0ca3f9095c0\r
66,"Knee Deep (feat. Jimmy Buffett)","Zac Brown Band","You Get What You Give",2010,60IGhnH20N82dNxKnc8jDd,197086381,1585307172,,1cdbcc53ff4a\r
67,"Country Girl (Shake It For Me)","Luke Bryan","Tailgates & Tanlines",2011,0JbSghVDghtFEurrSO8JrC,92495714,1617201884,,1bfa38eb1723\r
68,"Real Good Time","Aaron Watson","Real Good Time",2012,3gNZ65teMnR1sAmfAMGJGF,91613362,1408925891,,408b0b8046ea\r
69,"That’s Your Cousin","Dean Brody","Dirt",2012,0MK3K4QegjdtzI9iQj6BG2,198792943,1587351025,,093bf15157ee\r
70,"Cruise","Florida Georgia Line","Here's To The Good Times",2012,0i5el041vd6nxrGEU8QRxy,18151834,1440812204,,91abadafb5e9\r
71,"Wagon Wheel","Darius Rucker","True Believers",2013,3xdjjKMcMOFgo1eQrfbogM,20220065,1469412117,,568cb35577ae\r
72,"Sunshine & Whiskey","Frankie Ballard","Sunshine & Whiskey",2014,6aNwDe5YH5YUPlpHkku52w,26017672,792892086,,92104bf9ee15\r
73,"American Kids","Kenny Chesney","The Big Revival",2014,1dgWTMoHwTUnQhOQ8SR5fV,33896902,904056331,,72d8d8982dae\r
74,"Biscuits","Kacey Musgraves","Pageant Material",2015,4vHVfwVi2CEc4r7P1Pr9iu,46674762,1440873238,,85e4bdec71c1\r
75,"All the Pretty Girls","Kenny Chesney","Cosmic Hallelujah",2016,66pxmg3Jhjm09tHoWR1wVR,73065934,1228748855,,e5847ca01af5\r
76,"Down To The Honkytonk","Jake Owen","Greetings From...Jake",2018,1HsoSwqtwGBNIHZM7lPmQR,530162466,6776024326,,cf579ccbf87c\r
77,"Caught Up In The Country","Rodney Atkins","Caught Up In The Country",2018,4aGG4VOWGv9RwlYQNsBrkE,103407626,1451246197,,165ea5eeee9c\r
78,"Good Vibes","Chris Janson","Real Friends",2019,1XVqh0dC0PIl72f2mQhsVt,103044408,1478976690,,cf878d29fde5\r
79,"Hell's Comin' with Me","Poor Man's Poison","Hell's Comin' with Me",2019,5N0lmKQfQpXNQNjUGlPKIT,285850539,1679612287,,d26db08e3231\r
80,"TEXAS HOLD 'EM","Beyoncé","TEXAS HOLD 'EM",2024,7AYmToZ5y67fBjq4RLFbuq,353983142,1730410734,,c8de22be7a9d\r
`,Fe=`id,title,artist,album,year,spotify,tidal,itunes,youtube,UniqueID\r
1,"Hound Dog","Elvis Presley","Elvis: 30 #1 Hits",1956,,5119980,217633921,,ec157a6b390b\r
2,"Yakety Yak","The Coasters","Rhino Hi-Five: The Coasters",1958,7demHL0GXA6YmTNqw3Btz8,34399551,322026451,,719a9de727ef\r
3,"Jump in the Line","Harry Belafonte","The Best Of",1961,70mAceS5ArAqVj2OwDE4db,57724211,255428769,,2ce5a04d9bbe\r
4,"Twist And Shout - Remastered 2009","The Beatles","Please Please Me",1963,5ZBeML7Lf3FMEVviTyvi8l,55163257,1441165136,,53fc7ae8b802\r
5,"You Really Got Me","The Kinks","",1964,,493118769,1439224911,,59b26ad6979a\r
6,"My Girl","The Temptations","",1964,,93228739,1423301921,,e3cc5add46a6\r
7,"Help! - Remastered 2015","The Beatles","1",1965,3Smida2eCUsLzDcmZqXEZ3,55130682,1440833560,,f18dfeca441e\r
8,"(I Can't Get No) Satisfaction - Mono","The Rolling Stones","Out Of Our Heads",1965,2PzU4IB8Dr6mxV3lHuaG34,5693554,1440743544,,2285fde4fec1\r
9,"Good Vibrations","The Beach Boys","Made In U.S.A.",1966,,1392966,1442864874,,a021518de537\r
10,"Yellow Submarine - Remastered 2015","The Beatles","1",1966,7zRmGvtSy36Jr19U5OInJT,55130782,1441165123,,1585d182a8f8\r
11,"Paint It Black","The Rolling Stones","Through the Past, Darkly (Big Hits, Vol. 2)",1966,,13434396,1440746670,,35854f0368e7\r
12,"Ain't No Mountain High Enough","Marvin Gaye","",1967,,105505610,1435008045,,6bb15a637076\r
13,"Brown Eyed Girl","Van Morrison","",1967,3yrSvpt2l1xhsV9Em88Pul,450090877,1838782096,,29f9d83309bb\r
14,"Hey Jude - Remastered 2015","The Beatles","1",1968,3H7sv3Krffn15BufUuXzf3,55130617,1440834224,,f9ddec7d980a\r
15,"Here Comes The Sun - Remastered 2009","The Beatles","Abbey Road",1969,6dGnYIeXmHdcikdzNNDMm2,55130637,6818128871,,bbb9138e9053\r
16,"Have You Ever Seen The Rain","Creedence Clearwater Revival","Pendulum",1970,2LawezPeJhN4AWuSB0GtAU,77701512,1440948088,,81c306a821e4\r
17,"In the Summertime","Mungo Jerry","In the Summertime",1970,3RNyGLgSvmVRZ7xKUp8Wgd,490860774,1440741632,,2b1297eec081\r
18,"Rocket Man (I Think It's Going To Be A Long, Long Time)","Elton John","Honky Chateau",1972,3gdewACMIVMEWVbyb8O9sY,334634,1440910931,,21df3190ed67\r
19,"Superstition","Stevie Wonder","",1972,,77683246,1440808985,,2fa68cb8ab02\r
20,"Hooked On A Feeling","Blue Swede","Hooked On A Feeling",1973,6Ac4NVYYl2U73QiTt11ZKd,2909027,924503377,,7109dec96c6e\r
21,"Money","Pink Floyd","Dark Side Of The Moon",1973,,55391792,1066498948,,ce92a32bcd1d\r
22,"Mamma Mia","ABBA","Abba",1975,2TxCwUlqaOH3TIyJqGgR91,1771748,1440861294,,51606785a376\r
23,"Bohemian Rhapsody - Remastered 2011","Queen","",1975,2GAIycsMaDVtMtdvxzR2xI,534050211,6781024437,,0408b8a72999\r
24,"Play That Funky Music","Wild Cherry","'70s Greatest Hits",1976,,545672,260302978,,c4b8c1201ca1\r
25,"Stayin' Alive","Bee Gees","",1977,,68493629,1445669633,,9c3c3ded57da\r
26,"Mr. Blue Sky","Electric Light Orchestra","Out Of The Blue",1977,74z2lfZ7fj3IqoK71lHkZw,53230853,1054525017,,a31eaca050ee\r
27,"We Will Rock You","Queen","",1977,4fVn54cP0hasdSHuJthQj1,541963983,6781080737,,6e0bd3cbb805\r
28,"September","Earth, Wind & Fire","Earth, Wind & Fire: Greatest Hits",1978,,106028079,1456623340,,482ac15ec794\r
29,"I Will Survive","Gloria Gaynor","",1978,,114623835,1443818368,,7852e9f24b6c\r
30,"Don't Stop Me Now - Remastered 2011","Queen","Jazz",1978,7hQJA50XrCWABAu5v6QZ4i,534099493,6781076300,,51bae400cccb\r
31,"You Make My Dreams (Come True)","Daryl Hall & John Oates","The Very Best of Daryl Hall / John Oates",1980,7HX9f8AMBl0vQxAoAzLqhS,560045,273750245,,b329c6c49478\r
32,"9 to 5","Dolly Parton","9 To 5 And Odd Jobs",1980,4w3tQBXhn5345eUXDGBWZG,52534,273166378,,00642d1ef9c3\r
33,"Another One Bites The Dust","Queen","",1980,291RmMazWAmDitFuD6NJCv,534099003,6781076397,,8af8227d093c\r
34,"Don't Stop Believin'","Journey","",1981,77NNZQSqzLNqh2A9JhLRkg,1781737,160024096,,88abb1c95365\r
35,"Maneater","Daryl Hall & John Oates","",1982,,99674926,1444818206,,64349187e8c6\r
36,"Major Tom (Völlig Losgelöst)","Peter Schilling","Major Tom [Voellig Losgeloest]",1982,2qZQtey4lTwvvABVMrO4h8,169150,321972589,,e93519ace455\r
37,"It's Raining Men","The Weather Girls","Success",1982,2IvetNzSZMH5gwjInoyr18,4710246,186092391,,fa72ff20b0bb\r
38,"Sweet Dreams (Are Made of This) - 2005 Remaster","Eurythmics","Sweet Dreams (Are Made Of This)",1983,1TfqLAPs4K3s2rJMoCokcS,26965,255966421,,aecb33508f6e\r
39,"99 Luftballons","Nena","",1983,2IJftBfq7pJ43tfnOR0RB3,491245790,1446013598,,eb2d1c3c4c84\r
40,"Dancing In The Dark","Bruce Springsteen","The Essential Bruce Springsteen [Disc 2]",1984,,24385357,203709340,,de24d7edc91d\r
41,"Material Girl","Madonna","",1984,,2123750,80815209,,22de6d0466ba\r
42,"Take on Me","a-ha","Hunting High and Low",1985,2WfaOiMkCvy7F5fcp2zZ8L,391687,1035047668,,20ba7a88df33\r
43,"Don't You (Forget About Me) - Remastered","Simple Minds","Celebrate",1985,0A4PZuepTcIQVvA5m7R0M1,7196915,715894474,,1d2bbf334f3a\r
44,"Livin' on a Prayer","Bon Jovi","Cross Road",1986,,93177984,1423285047,,966776dcca66\r
45,"You Give Love A Bad Name","Bon Jovi","Slippery When Wet",1986,4jlp53Zc5Aq2DQFmu41nvE,93177983,1422954999,,2ff98eea0f56\r
46,"La Bamba","Los Lobos","La Bamba / Charlena",1987,0uMMLry3hzWGn3q3loqMkm,3248011,342347879,,bdb7f4d7fa6f\r
47,"I Think We're Alone Now","Tiffany","Tiffany",1987,4uvjOKsp7mSjrDhWdkLPBY,20746966,1440672487,,d4e1af18adbc\r
48,"With Or Without You","U2","",1987,,1218919,1440729860,,54ef6c388afd\r
49,"I'm Gonna Be (500 Miles)","The Proclaimers","",1988,66S14BkJDxgkYxLl5DCqOz,137251,693789044,,9238d6d4adb1\r
50,"We Didn't Start the Fire","Billy Joel","",1989,,1268210,158816462,,68d3579636a4\r
51,"Groove Is in the Heart","Deee-Lite","",1990,,3267941,72793857,,25aee9c89d03\r
52,"Smells Like Teen Spirit","Nirvana","Nirvana",1991,,77610757,1413921155,,b3cf41008fb8\r
53,"Two Princes","Spin Doctors","Pocket Full Of Kryptonite",1991,4ePP9So5xRzspjLFVVbj90,1311444,169628364,,e1979c422a60\r
54,"One","U2","",1991,,341528698,1443063492,,3859353af24a\r
55,"What's Up?","4 Non Blondes","Bigger, Better, Faster, More !",1992,0jWgAnTrNZmOGmqgvHhZEm,634519,1440902348,,bc366dd1caa8\r
56,"No Rain","Blind Melon","Blind Melon",1992,6txWz9UapYHVxEd7dDIHXT,1332492,725821929,,e536be30fc37\r
57,"Creep","Radiohead","Pablo Honey",1992,6b2oQwSGFkzsMtQruIWm2p,58990486,1097862231,,f076d1b420cb\r
58,"I Will Always Love You","Whitney Houston","",1992,,5120355,388151901,,7e41e690e01c\r
59,"Mr. Jones","Counting Crows","August And Everything After",1993,5DiXcVovI0FcY2s0icWWUu,2569985,1442449547,,798bc90f4a82\r
60,"Zombie","The Cranberries","",1994,,4012757,1440735264,,8e17b89be979\r
61,"Gangsta's Paradise","Coolio","",1995,,219775152,1605189373,,f218233916ab\r
62,"Wonderwall","Oasis","Stop The Clocks",1995,4w7RuuQAVP0JXlAom3z1aC,156876007,1517520101,,8e43b6053a16\r
63,"Santeria","Sublime","Sublime",1996,6cJqlSO19vsfCsH1FeFI35,62096434,1440839501,,46675a8474b1\r
64,"Save Tonight","Eagle-Eye Cherry","Desireless",1997,1t2Hq2WIBcZINOEnK6mdJG,610923,171708539,,c64ff607e8d1\r
65,"Bitter Sweet Symphony","The Verve","This Is Music: The Singles 92-98",1997,1WYEDcS7WGjv0rG7rmMX3o,77892506,724424003,,fa709635a955\r
66,"Closing Time","Semisonic","Feeling Strangely Fine",1998,087OBLtoeS3Q6j0k6tMNAI,96961926,6824623615,,a48a2bfc0f7c\r
67,"All The Small Things","blink-182","Enema Of The State",1999,2m1hi0nfMR9vdGC8UcrnwU,173565588,1440840510,,046f461ba872\r
68,"Mambo No. 5 (a Little Bit of...)","Lou Bega","",1999,,81794041,1322068804,,94247bbd2e18\r
69,"Scar Tissue","Red Hot Chili Peppers","Californication",1999,1G391cbiT3v3Cywg8T7DM1,304805,947688081,,6bc7fba9869a\r
70,"All Star","Smash Mouth","",1999,2P1ZqQq8rQtmV7BLZ0Junn,1300228,1440915693,,1a3c9fe5acd1\r
71,"One More Time","Daft Punk","",2000,,1550546,697195462,,950c81e13505\r
72,"Island In The Sun","Weezer","Weezer",2001,2MLHyLy5z5l5YRp7momlgw,573345,1440868258,,1e711dc0c588\r
73,"This Love","Maroon 5","Songs About Jane: 10th Anniversary Edition",2002,55vBk4ODkxRVSaHbKxWBn6,331558,1428782513,,666bbd65556c\r
74,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,712721787,,a08eae93f89e\r
75,"Hey Ya!","Outkast","The Way You Move / Hey Ya!",2003,3AszgPDZd9q0DpDFt4HFBy,1772295,1774799818,,b5f15a52071e\r
76,"Mr. Brightside","The Killers","Hot Fuss",2003,7oK9VyNzrYvRFo7nQEYkWN,150850052,1526194192,,23bf925e8631\r
77,"Seven Nation Army","The White Stripes","Elephant",2003,3m6KkYKdnbffMpGd9Pm9FP,156600940,1533513537,,5be4a4c8d506\r
78,"Take Me Out","Franz Ferdinand","Franz Ferdinand",2004,6ooluO7DiEhI1zmK94nRCM,3751639,315844084,,c4c134ad33be\r
79,"Feel Good Inc.","Gorillaz","Demon Days",2005,0d28khcov6AiegSCpG5TuT,1404361,693620735,,63fbd18c4597\r
80,"Crazy","Gnarls Barkley","St. Elsewhere",2006,1vxw6aYJls2oq3gW0DujAo,314701,1741403966,,08a3311b3f5e\r
81,"Hips Don't Lie (feat. Wyclef Jean)","Shakira","Oral Fixation, Vol. 2 (Expanded Edition)",2006,3ZFTkvIE7kyPt6Nu3PEa7V,438736569,1817217063,,57998f39ad24\r
82,"Grace Kelly","MIKA","Life In Cartoon Motion",2007,2SDx0PooHZI1SQKR0y44bs,1219371,1440763492,,b039e96b1d1b\r
83,"Viva La Vida","Coldplay","",2008,3Fcfwhm8oRrBvBZ8KGhtea,288744882,1122773680,,0e3aba851b76\r
84,"Poker Face","Lady Gaga","",2008,,77707019,1440818665,,f5214dc31395\r
85,"Fireflies","Owl City","Ocean Eyes",2009,3DamFFqW32WihKkTVlwTYQ,3140991,1440783289,,df8f56b2f3c7\r
86,"Pumped Up Kicks","Foster The People","Torches",2010,1G5RlnmO3GzNdKCDNSgT5W,25280917,435761212,,d33221c20cfa\r
87,"Somebody That I Used to Know (feat. Kimbra)","Gotye","",2011,,13467719,1440754487,,3b1c0d8765d9\r
88,"Radioactive","Imagine Dragons","Night Visions",2012,7eGNiGg6SE27VkSrpZMVTD,18692664,1440873126,,d8044371dc28\r
89,"Get Lucky (Radio Edit) [feat. Pharrell Williams and Nile Rodgers]","Daft Punk","Get Lucky (Radio Edit) [feat. Pharrell Williams and Nile Rodgers]",2013,2Foc5Q5nqNiosCNqttzHof,19823990,1459540658,,6c5d469fb8be\r
90,"Uptown Funk (feat. Bruno Mars)","Mark Ronson","Uptown Special",2014,32OlwWuMpZ6b0aN2RZOeMS,39249713,943946671,,c02d669b43ac\r
91,"Hello","Adele","Hello",2015,0ENSn4fwAbCGeFGVUbXEU3,62300893,1544494392,,fa9734f238e3\r
92,"Can't Stop the Feeling!","Justin Timberlake","",2016,,60137937,1154239184,,bc2b862b80e9\r
93,"Shape of You","Ed Sheeran","÷",2017,7qiZfU4dY1lWllzX7mPBI3,219082768,1193700767,,b97a71e2ec0a\r
94,"Shotgun","George Ezra","Staying at Tamara's",2018,4ofwffwvvnbSkrMSCKQDaC,85905133,1331589486,,b7d1a82f55df\r
95,"Blinding Lights","The Weeknd","",2019,,134858527,1499378607,,23bfdab9e20b\r
96,"Heat Waves","Glass Animals","Dreamland",2020,02MWAaffLxlfxAUY7c5dvx,150502627,1508562516,,35cb096eda5d\r
97,"good 4 u","Olivia Rodrigo","SOUR",2021,4ZtFanR9U6ndgddUvNcjcG,184786799,1560735856,,e58c74b24e75\r
98,"As It Was","Harry Styles","",2022,,223336898,1615585008,,a0d0ffd35fb6\r
99,"Flowers","Miley Cyrus","Endless Summer Vacation",2023,7DSAEUvxU8FajXtRloy8M0,313902266,1674691586,,2d0465a2cf31\r
100,"TEXAS HOLD 'EM","Beyoncé","TEXAS HOLD 'EM",2024,7AYmToZ5y67fBjq4RLFbuq,353983142,1730410734,,c8de22be7a9d\r
`,Ie=`id,title,artist,album,year,spotify,tidal,itunes,youtube,UniqueID\r
1,"Earth Angel","The Penguins","",1954,,,6781090249,,985aff792443\r
2,"Get a Job","The Silhouettes","",1957,,8672338,1423219533,,dfc639e725bb\r
3,"Monster Mash","Bobby ""Boris"" Pickett","",1962,,35708067,82125202,,cc0aa1d29b0d\r
4,"Pipeline","The Chantays","",1962,,35273958,1443860043,,d45058367692\r
5,"Wipe Out","The Surfaris","",1963,,85971720,1359249454,,774a89b2904f\r
6,"Psychotic Reaction","Count Five","",1966,,35635758,1443188539,,11aabd9055d5\r
7,"Little Bit O' Soul","The Music Explosion","",1967,,3236663,715917795,,58545ab41e95\r
8,"Fire","The Crazy World of Arthur Brown","",1968,,615160,1657674276,,00f5345c69d8\r
9,"Spirit In The Sky","Norman Greenbaum","",1969,,428746664,1462211356,,155c714b2f58\r
10,"Na Na Hey Hey Kiss Him Goodbye","Steam","",1969,,94435754,1588817297,,6c5ab8e7c277\r
11,"Something in the Air","Thunderclap Newman","",1969,,91980877,1434905347,,b36410679259\r
12,"In the Summertime","Mungo Jerry","In the Summertime",1970,3RNyGLgSvmVRZ7xKUp8Wgd,490860774,1440741632,,2b1297eec081\r
13,"Kung Fu Fighting","Carl Douglas","",1974,,493064051,1436092826,,28af07485f5e\r
14,"Play That Funky Music","Wild Cherry","'70s Greatest Hits",1976,,545672,260302978,,c4b8c1201ca1\r
15,"Ca Plane Pour Moi","Plastic Bertrand","Plastic Bertrand",1977,4sf4Lq52b2iCoAgpge7a9g,255146671,1650622324,,5cf9400aec30\r
16,"Black Betty","Ram Jam","",1977,,30265305,216088341,,f56362fc8507\r
17,"Ring My Bell","Anita Ward","",1979,,82371353,1296251642,,419c97e70cd4\r
18,"Funkytown","Lipps Inc.","",1979,,173304114,1440894579,,31154c29ec42\r
19,"Pop Muzik","M","",1979,,490841591,1616178598,,a34578360597\r
20,"Video Killed the Radio Star","The Buggles","",1979,,2531405,1444090128,,f7e5d7416a9b\r
21,"Tainted Love","Soft Cell","",1981,,571868,1440517679,,ca965e59dea6\r
22,"Mickey","Toni Basil","",1981,,384175980,1765363476,,5c37d10d24ce\r
23,"Come On Eileen","Dexys Midnight Runners","",1982,,126347035,1490914106,,d9ab0f84ccf6\r
24,"Pass the Dutchie","Musical Youth","",1982,,101149201,1657551871,,ac86ac0e93b6\r
25,"It's Raining Men","The Weather Girls","Success",1982,2IvetNzSZMH5gwjInoyr18,4710246,186092391,,fa72ff20b0bb\r
26,"Too Shy","Kajagoogoo","",1983,,1379251,691676730,,8f17515e4917\r
27,"Tarzan Boy","Baltimora","",1985,,1527873,713600780,,d15efa30b812\r
28,"Don't Worry, Be Happy","Bobby McFerrin","",1988,,1323432,723398328,,399bac1555c4\r
29,"Groove Is in the Heart","Deee-Lite","",1990,,3267941,72793857,,25aee9c89d03\r
30,"I'm Too Sexy","Right Said Fred","",1991,,303270798,715829705,,0eae98a5d2fe\r
31,"What's Up?","4 Non Blondes","Bigger, Better, Faster, More !",1992,0jWgAnTrNZmOGmqgvHhZEm,634519,1440902348,,bc366dd1caa8\r
32,"No Rain","Blind Melon","Blind Melon",1992,6txWz9UapYHVxEd7dDIHXT,1332492,725821929,,e536be30fc37\r
33,"Would I Lie to You?","Charles & Eddie","",1992,,126624134,1632073690,,3c9b3fe284da\r
34,"Saturday Night","Whigfield","",1992,,70686669,79145702,,342455f21532\r
35,"What Is Love","Haddaway","",1993,,492802426,1731384547,,ec00c63fb753\r
36,"Cotton Eye Joe","Rednex","",1994,,80186819,255961201,,dab67b4be069\r
37,"How Bizarre","OMC","",1995,,79970915,1442660221,,ccd74ee57e30\r
38,"Tubthumping","Chumbawamba","",1997,,2893885,713773457,,99596fb0f90e\r
39,"Save Tonight","Eagle-Eye Cherry","Desireless",1997,1t2Hq2WIBcZINOEnK6mdJG,610923,171708539,,c64ff607e8d1\r
40,"Your Woman","White Town","",1997,,492919891,1675516478,,fe782f88ffc8\r
41,"Better Off Alone","Alice Deejay","",1998,,47469776,1631123438,,d6aa1b649683\r
42,"Blue (Da Ba Dee)","Eiffel 65","",1998,,539111445,358200264,,b7ce4670400b\r
43,"You Get What You Give","New Radicals","",1998,,2529963,1440762717,,ba1e4afc1b1f\r
44,"Closing Time","Semisonic","Feeling Strangely Fine",1998,087OBLtoeS3Q6j0k6tMNAI,96961926,6824623615,,a48a2bfc0f7c\r
45,"Butterfly","Crazy Town","",1999,,34793,203304621,,daf81efabb57\r
46,"Steal My Sunshine","Len","",1999,,33902226,459816208,,2a58a852a49e\r
47,"Mambo No. 5 (a Little Bit of...)","Lou Bega","",1999,,81794041,1322068804,,94247bbd2e18\r
48,"She's so High","Tal Bachman","Tal Bachman",1999,7mnGQesk1TzQLzQ9bYWZPR,1311156,158610105,,c9968ac5d167\r
49,"Who Let the Dogs Out","Baha Men","",2000,,1370716,723351644,,dfcd632865f4\r
50,"Teenage Dirtbag","Wheatus","",2000,,1924,1640793116,,6276cdfb4d35\r
51,"The Ketchup Song (Aserejé)","Las Ketchup","",2002,,89218164,1362213727,,bf5b4a497e64\r
52,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,712721787,,a08eae93f89e\r
53,"Bad Day","Daniel Powter","",2005,,292734,63816165,,41f84318845e\r
54,"Crazy","Gnarls Barkley","St. Elsewhere",2006,1vxw6aYJls2oq3gW0DujAo,314701,1741403966,,08a3311b3f5e\r
55,"Safe And Sound","Capital Cities","In A Tidal Wave Of Mystery",2011,0oFvhxNf3mBII26pPI3a5I,174840352,1766005715,,67d8a3cc6f07\r
56,"Somebody That I Used to Know (feat. Kimbra)","Gotye","",2011,,13467719,1440754487,,3b1c0d8765d9\r
57,"Let Her Go","Passenger","",2012,,18930892,1623014090,,c57c81b294df\r
58,"Best Day Of My Life","American Authors","",2013,,29560407,1440851075,,80b7cee4410e\r
59,"Rude","MAGIC!","",2013,,23046116,881629103,,95aeb44771f4\r
60,"Shut Up and Dance","WALK THE MOON","",2014,1K66si1ZELsRZzg7m7mcps,37896389,961298418,,dd9dd5471570\r
`,Le=`id,title,artist,album,year,spotify,tidal,itunes,youtube,UniqueID\r
1,"La Bamba","Ritchie Valens","",1958,,7985177,118142371,,9514688dd506\r
2,"I'm Tore Down","Freddie King","",1961,,203199254,,,fe926d3a07c7\r
3,"Twist and Shout","The Top Notes","",1961,,48589858,,,d6a4caef6b67\r
4,"Twist And Shout - Remastered 2009","The Beatles","Please Please Me",1963,5ZBeML7Lf3FMEVviTyvi8l,55163257,1441165136,,53fc7ae8b802\r
5,"Red Rubber Ball","The Cyrkle","",1966,,561370,797941909,,405a171d13e6\r
6,"I'm a Believer","The Monkees","",1966,,22509466,176080628,,51e558ca8486\r
7,"Brown Eyed Girl","Van Morrison","",1967,3yrSvpt2l1xhsV9Em88Pul,450090877,1838782096,,29f9d83309bb\r
8,"Hooked on a Feeling","B. J. Thomas","",1968,,52641089,6830874263,,7a2e00421692\r
9,"Hooked On A Feeling","Blue Swede","Hooked On A Feeling",1973,6Ac4NVYYl2U73QiTt11ZKd,2909027,924503377,,7109dec96c6e\r
10,"I Will Always Love You","Dolly Parton","",1974,,54518838,282883579,,5f505aa10b65\r
11,"I Will Survive","Gloria Gaynor","",1978,,114623835,1443818368,,7852e9f24b6c\r
12,"Come On Eileen","Dexys Midnight Runners","",1982,,126347035,1490914106,,d9ab0f84ccf6\r
13,"Africa","Toto","",1982,,539204,185717604,,6c8a0e0565c9\r
14,"Take on Me","a-ha","Hunting High and Low",1985,2WfaOiMkCvy7F5fcp2zZ8L,391687,1035047668,,20ba7a88df33\r
15,"La Bamba","Los Lobos","La Bamba / Charlena",1987,0uMMLry3hzWGn3q3loqMkm,3248011,342347879,,bdb7f4d7fa6f\r
16,"Punk Rock Girl","The Dead Milkmen","",1988,,326315773,1714905027,,6977fc65a10f\r
17,"I Will Always Love You","Whitney Houston","",1992,,5120355,388151901,,7e41e690e01c\r
18,"I'm Tore Down","Eric Clapton","From The Cradle",1994,,249998028,1646544138,,d672c78020f1\r
19,"I Will Survive","Cake","Fashion Nugget",1996,,668143,1632472294,,23b29f10f793\r
20,"Hell","Squirrel Nut Zippers","",1996,,63402871,1443757613,,d5cd854bc879\r
21,"My Heart Will Go On","Céline Dion","",1997,,10565717,1745568934,,b897a27f4933\r
22,"MMMBop","Hanson","",1997,,3712883,1440790544,,ade9f1ae095a\r
23,"Come on Eileen","Save Ferris","It Means Everything",1997,4Z4xFENnvMnRDPpAx5wpaO,641390,192859115,,9628020594e8\r
24,"Take On Me","Reel Big Fish","",1998,,33899608,303194979,,dfd74b5e9a69\r
25,"I'm A Believer - From ""Shrek"" Motion Picture Soundtrack","Smash Mouth","Shrek",2001,0mBL2JwjNYKtdFacHxvtJt,572109,1440517522,,ca83ec05d7a9\r
26,"Stacy's Mom","Fountains Of Wayne","Welcome Interstate Managers",2003,27L8sESb3KR79asDUBu8nW,130434,712721787,,a08eae93f89e\r
27,"Such Great Heights","The Postal Service","",2003,,2575089,597937190,,539ac69e8e5c\r
28,"Paper Planes","M.I.A.","",2007,,2205661,296393515,,bfeab1f13419\r
29,"Bad Romance","Lady Gaga","",2009,,77707061,1476095084,,5b962824698a\r
30,"Brown Eyed Girl","Reel Big Fish","Fame, Fortune, And Fornication",2009,2lbAU3IQytWjl9b0LLuztk,385585158,1767067795,,dad001840421\r
31,"Hell","Streetlight Manifesto","99 Songs of Revolution: Volume I",2010,,73532317,1232796916,,9667cc5ced8a\r
32,"Punk Rock Girl","Streetlight Manifesto","99 Songs of Revolution: Volume I",2010,,73532320,1232796929,,5ffcd2a47bd1\r
33,"Red Rubber Ball","Streetlight Manifesto","",2010,52DW5npyBrn3QMKcQqQhKS,73532324,1232796939,,8b370628cf95\r
34,"Such Great Heights","Streetlight Manifesto","",2010,26rMsVy6Oa4rK9ue7GW0gU,73532326,1232797193,,73711bcc9cbd\r
35,"Call Me Maybe","Carly Rae Jepsen","",2011,,17060803,1440874008,,4dc5b3e5d72f\r
36,"Somebody That I Used to Know (feat. Kimbra)","Gotye","",2011,,13467719,1440754487,,3b1c0d8765d9\r
37,"I Need Your Love (feat. Ellie Goulding)","Calvin Harris","",2012,,17614977,1647424714,,6aacd5efd576\r
38,"Somebody That I Used to Know","Pentatonix","PTX, Vol. 1",2012,5XPSElbh3y0S1Jl0ggpwQr,29712066,877648579,,b3e1490405fa\r
39,"Take Me to Church","Hozier","",2013,2EiGECydkS2M8OCcRHQZhT,52892100,900672609,,4637ca0864dc\r
40,"I Need Your Love","Pentatonix","PTX, Vol. 2",2013,5YrtgdqeCgcOu9m0dliQs6,29722845,776187140,,70cb0af4f247\r
41,"Timber (feat. Kesha)","Pitbull","",2013,,22987305,737053283,,522dcdb6fbfb\r
42,"Call Me Maybe","Scott Bradlee's Postmodern Jukebox","Twist Is The New Twerk",2013,4cRPlIJxFb4ydBUgawsnXM,58875135,975886733,,46171943e3e4\r
43,"All About That Bass","Meghan Trainor","",2014,,39450298,1737553019,,d07e14dcfa5d\r
44,"All About That Bass","Scott Bradlee's Postmodern Jukebox","Historical Misappropriation",2014,1jZRJKE7GZdiZzVgMS9mv2,58875093,914637855,,43e799a010da\r
45,"Stacy’s Mom","Scott Bradlee's Postmodern Jukebox","Selfies on Kodachrome",2014,3TOGVJQaCQPE4J3JiSncwG,69185306,956922189,,658d64a45a0d\r
46,"Timber","Scott Bradlee's Postmodern Jukebox","Twist Is The New Twerk",2014,34gz4EkB8fx3JMe4Qb3op1,58875131,975886729,,6ad6bc0dda87\r
47,"Bad Romance","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,5xrHvVmSF3ui0EKI8FArv3,58875147,988683281,,67b073f89af2\r
48,"Paper Planes","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,1YQY7ODoHmrfDwzgshRBKq,58875153,988683427,,d72581e098ec\r
49,"Take Me To Church","Scott Bradlee's Postmodern Jukebox","Emoji Antique",2015,2YwlwV98tjcKF664eEAAyV,58875155,988683429,,fc6e7215c86d\r
50,"MMMbop","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,2jt8tEFZ4qZJ1ax3b0Io5f,69185267,1133894559,,73c52d6eaac7\r
51,"My Heart Will Go On","Scott Bradlee's Postmodern Jukebox","Squad Goals",2016,3qhgkT74IpVAjk5xjNylHC,69185277,1133894642,,680b6a706161\r
52,"Africa","Weezer","Africa",2018,36Pim2ANczp82lCWIb8GHy,89225164,1450271000,,2e16ab2e3d7d\r
`;function Re(e){let[t,...n]=e.trim().split(/\r?\n/),r=t.split(`,`);return n.map(e=>{let t=[...e.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)].map(([,e,t])=>e===void 0?t:e.replaceAll(`""`,`"`));return Object.fromEntries(r.map((e,n)=>[e,t[n]]))})}var D=[{id:`my-hits`,name:`My Hits`,csv:Ne},{id:`country`,name:`Country`,csv:Pe},{id:`classic`,name:`Classic Hitster`,csv:Fe},{id:`one-hit-wonders`,name:`One-Hit Wonders`,csv:Ie},{id:`covers-vs-originals`,name:`Covers vs Originals`,csv:Le}].map(({id:e,name:t,csv:n})=>({id:e,name:t,tracks:Re(n)})),ze=new Map;for(let{tracks:e}of D)for(let t of e){let e=ze.get(t.UniqueID);if(!e)ze.set(t.UniqueID,{...t});else for(let n of[`spotify`,`tidal`,`itunes`,`youtube`])!e[n]&&t[n]&&(e[n]=t[n])}function O(e){return ze.get(e)??null}function Be(e,t){return[...new Set(e.tracks.map(e=>e.UniqueID))].filter(e=>{let n=O(e);return t?n?.[t]:n?.spotify||n?.tidal||n?.itunes})}function Ve(e){return e[Math.floor(Math.random()*e.length)]}function He(e,t){let n=D.filter(t=>t.tracks.some(t=>t.UniqueID===e));return n.find(e=>e.id===t)??n[0]}var k=(e,t=``)=>`
  <svg viewBox="0 0 24 24" ${t} aria-hidden="true" focusable="false">${e}</svg>`,A={play:k(`<path d="M8.5 5.6v12.8a1.1 1.1 0 0 0 1.7.92l9.6-6.4a1.1 1.1 0 0 0 0-1.84l-9.6-6.4a1.1 1.1 0 0 0-1.7.92Z"/>`,`fill="currentColor"`),pause:k(`<rect x="6" y="5" width="4.2" height="14" rx="1.4"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.4"/>`,`fill="currentColor"`),spotify:k(`<circle cx="12" cy="12" r="11" fill="currentColor"/><g fill="none" stroke="var(--provider-icon-paper)" stroke-linecap="round"><path d="M5.5 9c4.4-1.4 8.7-1 13 1" stroke-width="1.9"/><path d="M6.4 12.4c3.7-1.1 7.2-.7 10.8.9" stroke-width="1.7"/><path d="M7.3 15.6c3-.8 5.8-.5 8.7.8" stroke-width="1.5"/></g>`),tidal:k(`<path d="m4.5 4 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4Zm7.5 0 4 4-4 4-4-4ZM12 12l4 4-4 4-4-4Z"/>`,`fill="currentColor"`),itunes:k(`<circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M10 16.2a2 2 0 1 1-1.3-1.87V7.6l7-1.4v8.1a2 2 0 1 1-1.3-1.87V8.3L10 9.2Z" fill="var(--provider-icon-paper)"/>`),scan:k(`<path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5"/><g fill="currentColor" stroke="none"><rect x="8" y="8" width="3.2" height="3.2" rx=".6"/><rect x="12.8" y="8" width="3.2" height="3.2" rx=".6"/><rect x="8" y="12.8" width="3.2" height="3.2" rx=".6"/><rect x="12.8" y="12.8" width="1.6" height="1.6" rx=".3"/><rect x="14.4" y="14.4" width="1.6" height="1.6" rx=".3"/></g>`,`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`),note:k(`<path d="M9 18.5a3 3 0 1 1-2-2.83V5l12-2v12.5a3 3 0 1 1-2-2.83V6.4L9 7.9Z"/>`,`fill="currentColor"`)},Ue=e=>A[e]??A.note;function We(e,t){if(e.showModal(),!t)return;let n=t.getBoundingClientRect();e.style.setProperty(`--origin-x`,`${n.left+n.width/2-e.offsetLeft}px`),e.style.setProperty(`--origin-y`,`${n.top+n.height/2-e.offsetTop}px`),e.style.setProperty(`--ball-x`,String(n.width/e.offsetWidth)),e.style.setProperty(`--ball-y`,String(n.height/e.offsetHeight))}function Ge(e){e.close();let t=e.getAnimations?.()??[];if(!t.length)return Promise.resolve();let n=Promise.all(t.map(e=>e.finished.catch(()=>{}))),r=new Promise(e=>setTimeout(e,700));return Promise.race([n,r])}var Ke=new Set([`spotify`,`itunes`]),qe={spotify:{name:`Spotify`,label:`Spotify · Full tracks`,detail:`Full tracks · Spotify Premium required`},tidal:{name:`TIDAL`,label:`TIDAL · 30s previews`,detail:`30-second previews · TIDAL account required`},itunes:{name:`iTunes`,label:`iTunes · 30s previews`,detail:`30-second previews courtesy of iTunes · No account needed`}};function Je(e,t,{connected:n,requiresLogin:r}){let i=qe[e],a=t===e;return`
      <section class="provider-option" aria-labelledby="${e}-option-title">
        <h3 id="${e}-option-title"><span class="provider-brand-icon">${Ue(e)}</span>${i.name}</h3>
        <p>${i.detail}</p>
        <button data-select="${e}" class="action-btn" type="button"
                aria-pressed="${a}">${a?`Selected`:n?`Use ${i.name}`:`Connect ${i.name}`}</button>
        ${n&&r?`<button data-disconnect="${e}" class="provider-switch" type="button">Disconnect ${i.name}</button>`:``}
      </section>`}function Ye({provider:e,accounts:t,onSelect:n,onDisconnect:r}){let i=document.getElementById(`provider-controls`),a=qe[e]?.label??`Choose a music provider`;i.innerHTML=`
    <button id="provider-menu-btn" class="provider-control${Ke.has(e)?` provider-control--logo`:``}" type="button"
            aria-haspopup="dialog" aria-controls="provider-dialog"
            aria-label="Music provider · ${a}" title="${a}">
      ${Ue(e)}
    </button>
    <dialog id="provider-dialog" class="provider-dialog" aria-labelledby="provider-title">
      <div class="provider-dialog-heading">
        <h2 id="provider-title">Play with…</h2>
        <button id="provider-close" class="provider-close" type="button" aria-label="Close music provider options" autofocus>×</button>
      </div>
      ${Object.keys(qe).filter(e=>t[e]).map(n=>Je(n,e,t[n])).join(``)}
      <p id="provider-error" role="status"></p>
    </dialog>
  `;let o=i.querySelector(`#provider-menu-btn`),s=i.querySelector(`#provider-dialog`),c=()=>s.close(),l=()=>{s.open||We(s,o)};o.addEventListener(`click`,l),i.querySelector(`#provider-close`).addEventListener(`click`,c),s.addEventListener(`click`,e=>{let t=s.getBoundingClientRect();e.target===s&&(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&c()}),s.addEventListener(`close`,()=>o.focus());async function u(t){if(t===e){c();return}let r=s.querySelectorAll(`button`);r.forEach(e=>{e.disabled=!0});let a=i.querySelector(`#provider-error`);a.textContent=``;try{await n(t)}catch{a.textContent=`Could not connect. Please try again.`}finally{r.forEach(e=>{e.disabled=!1})}}for(let e of i.querySelectorAll(`[data-select]`))e.addEventListener(`click`,()=>u(e.dataset.select));for(let e of i.querySelectorAll(`[data-disconnect]`))e.addEventListener(`click`,()=>r(e.dataset.disconnect));return l}function Xe(e,t,{onOpenCard:n}){e.innerHTML=`
    <div id="dashboard-view" class="view-state">
      <h2>Rockin' Around</h2>
    </div>
  `;let r=document.getElementById(`external-content`);if(!r)return;r.innerHTML=`
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
          ${D.map(e=>`<li><button type="button" data-deck-id="${e.id}">${e.name}</button></li>`).join(``)}
        </ul>
      </details>
      <button id="random-card" class="action-btn" type="button">Random Card</button>
      <p id="deck-status" role="status"></p>
    </div>
  `;let i=r.querySelector(`#card-lookup`),a=i.querySelector(`#card-lookup-id`),o=i.querySelector(`#card-lookup-status`);a.addEventListener(`input`,()=>{o.textContent=``,a.removeAttribute(`aria-invalid`)}),i.addEventListener(`submit`,e=>{e.preventDefault();let t=a.value.trim(),r=O(t)??O(t.toLowerCase());if(!r){o.textContent=t?`No card found for that code.`:`Enter a card code.`,a.setAttribute(`aria-invalid`,`true`),a.focus();return}n(r.UniqueID)});let s=r.querySelector(`.deck-picker`),c=s.querySelector(`summary`),l=s.querySelector(`#deck-selection`),u=s.querySelectorAll(`[data-deck-id]`),d=r.querySelector(`#random-card`),f=r.querySelector(`#deck-status`),ee=sessionStorage.getItem(`selected_deck`),p,m=[];function h(e){p=e,l.textContent=e.name;for(let t of u)t.setAttribute(`aria-pressed`,String(t.dataset.deckId===e.id));m=Be(e,t),d.disabled=m.length===0,f.textContent=d.disabled?`This deck has no ${{spotify:`Spotify `,tidal:`TIDAL `,itunes:`iTunes `}[t]??``}track IDs yet.`:``}d.addEventListener(`click`,()=>{d.disabled||n(Ve(m),p)});function g(){s.open=!1,c.focus()}for(let e of u)e.addEventListener(`click`,()=>{let t=D.find(t=>t.id===e.dataset.deckId);sessionStorage.setItem(`selected_deck`,t.id),h(t),g()});s.addEventListener(`keydown`,e=>{e.key===`Escape`&&s.open&&(e.preventDefault(),g())}),s.addEventListener(`focusout`,e=>{s.contains(e.relatedTarget)||(s.open=!1)}),h(D.find(e=>e.id===ee)??D[0])}var j=!0,Ze=window.matchMedia(`(prefers-reduced-motion: reduce)`),Qe=295.3,$e=()=>`
  <div class="player-wrapper">
    <svg class="progress-ring" width="110" height="110" viewBox="0 0 110 110">
      <circle stroke="rgba(0, 0, 0, 0.08)" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
      <circle id="progress-fill" class="progress-ring__fill" stroke-width="4" fill="transparent" r="47" cx="55" cy="55"/>
      <circle id="progress-dot" class="progress-ring__dot" r="4" cx="55" cy="8"/>
    </svg>

    <button id="play-pause-btn" class="play-btn" aria-label="Play" disabled>${A.play}</button>
  </div>`;function et(e){let t=document.getElementById(`progress-fill`),n=document.getElementById(`progress-dot`);if(!t||!n)return;t.style.strokeDashoffset=Qe-e*Qe;let r=e*2*Math.PI;n.setAttribute(`cx`,(55+47*Math.sin(r)).toFixed(2)),n.setAttribute(`cy`,(55-47*Math.cos(r)).toFixed(2))}var M=54,N=106,P=46,F=17,tt=8,I=36,nt=100,rt=24,it=19,at=[30,92],ot=[130,92],st=900,ct=[`#2d6a4f`,`#3a8362`,`#eec04c`,`#c98a4b`,`#6b4423`],lt={play:`<path d="M21.6 14.8 L28.4 ${it} L21.6 23.2Z"/>`,pause:`<rect x="20.2" y="15" width="2.8" height="8" rx=".9"/><rect x="25" y="15" width="2.8" height="8" rx=".9"/>`},ut=e=>`
  <g class="cassette-hub" data-cx="${e}">
    <circle cx="${e}" cy="${P}" r="7" fill="#e4e1d8"/>
    <circle cx="${e}" cy="${P}" r="4.6" fill="#3f4448"/>
    ${[0,60,120,180,240,300].map(t=>`<rect x="${e-.9}" y="40" width="1.8" height="3" fill="#3f4448" transform="rotate(${t} ${e} ${P})"/>`).join(``)}
  </g>`,dt=()=>{let e=32/ct.length;return`
  <div class="cassette-wrapper">
    <button id="play-pause-btn" class="cassette-btn" aria-label="Play" disabled>
      <svg viewBox="0 0 160 100" aria-hidden="true" focusable="false">
        <defs><clipPath id="cassette-window"><rect x="38" y="34" width="84" height="24" rx="12"/></clipPath></defs>
        <rect x="2" y="2" width="156" height="96" rx="7" fill="#3f4448"/>
        <circle cx="8" cy="8" r="2.3" fill="#2a2e31"/><circle cx="152" cy="8" r="2.3" fill="#2a2e31"/>
        <circle cx="8" cy="92" r="2.3" fill="#2a2e31"/><circle cx="152" cy="92" r="2.3" fill="#2a2e31"/>
        <rect x="12" y="8" width="136" height="70" rx="4" fill="#f3e6c4"/>
        ${ct.map((t,n)=>`<rect x="12" y="${(30+n*e).toFixed(2)}" width="136" height="${(e+.3).toFixed(2)}" fill="${t}"/>`).join(``)}
        <rect x="38" y="34" width="84" height="24" rx="12" fill="#2a2e31"/>
        <g clip-path="url(#cassette-window)">
          <line class="cassette-tape-l" stroke="#5a4636" stroke-width="1.4"/>
          <line class="cassette-tape-r" stroke="#5a4636" stroke-width="1.4"/>
          <circle class="cassette-pack-l" cx="${M}" cy="${P}" r="${F}" fill="#5a4636"/>
          <circle class="cassette-pack-r" cx="${N}" cy="${P}" r="${tt}" fill="#5a4636"/>
        </g>
        ${ut(M)}${ut(N)}
        <rect x="${I}" y="17" width="${nt}" height="4" rx="2" fill="#e2d3a8"/>
        <rect class="cassette-bar" x="${I}" y="17" width="0" height="4" rx="2" fill="#2d6a4f"/>
        <circle class="cassette-bar-dot" cx="${I}" cy="19" r="3" fill="#3a8362"/>
        <circle cx="${rt}" cy="${it}" r="8" fill="#2d6a4f"/>
        <g class="cassette-icon" fill="#f4f8f5">${lt.play}</g>
        <path d="M38 98 L46 81 L114 81 L122 98Z" fill="#34393c"/>
        <circle cx="80" cy="88" r="2.3" fill="#2a2e31"/>
        <circle cx="56" cy="92" r="2.4" fill="#1e2124"/><circle cx="68" cy="93" r="1.8" fill="#1e2124"/>
        <circle cx="92" cy="93" r="1.8" fill="#1e2124"/><circle cx="104" cy="92" r="2.4" fill="#1e2124"/>
        <line x1="45" y1="96.6" x2="115" y2="96.6" stroke="#7a5f48" stroke-width="1.4"/>
        <circle cx="45" cy="94.6" r="2" fill="#e4e1d8"/><circle cx="115" cy="94.6" r="2" fill="#e4e1d8"/>
      </svg>
    </button>
  </div>`};function ft(e,t,[n,r],i){let a=n-e,o=r-P,s=Math.atan2(o,a)+i*Math.acos(t/Math.hypot(a,o));return[e+t*Math.cos(s),P+t*Math.sin(s)]}function pt(e,[t,n],[r,i]){e.setAttribute(`x1`,t.toFixed(2)),e.setAttribute(`y1`,n.toFixed(2)),e.setAttribute(`x2`,r),e.setAttribute(`y2`,i)}function mt(e,t){let n=document.getElementById(`play-pause-btn`);if(!n?.classList.contains(`cassette-btn`))return;let r=e=>n.querySelector(e),i=F-9*e,a=tt+9*e;r(`.cassette-pack-l`).setAttribute(`r`,i),r(`.cassette-pack-r`).setAttribute(`r`,a),pt(r(`.cassette-tape-l`),ft(M,i,at,1),at),pt(r(`.cassette-tape-r`),ft(N,a,ot,-1),ot),r(`.cassette-bar`).setAttribute(`width`,nt*e),r(`.cassette-bar-dot`).setAttribute(`cx`,I+nt*e);let[o,s]=n.querySelectorAll(`.cassette-hub`);if(Ze.matches||!t){o.removeAttribute(`transform`),s.removeAttribute(`transform`);return}let c=st*t/9,l=-c*Math.log(F/i),u=-c*Math.log(a/tt);o.setAttribute(`transform`,`rotate(${l.toFixed(2)} ${M} ${P})`),s.setAttribute(`transform`,`rotate(${u.toFixed(2)} ${N} ${P})`)}function ht(){return j?dt():$e()}function gt(e,t){if(e)if(e.setAttribute(`aria-label`,t?`Pause`:`Play`),j){let n=e.querySelector(`.cassette-icon`);n&&(n.innerHTML=t?lt.pause:lt.play)}else e.innerHTML=t?A.pause:A.play}function _t(e,t){if(!t)return;let n=Math.min(Math.max(e/t,0),1);j?mt(n,t/1e3):et(n)}function vt(){j?mt(0,0):et(0)}var yt=()=>`
      <div id="answer-slot" class="answer-slot answer-slot--insert">
        <div id="answer-reveal" class="answer-reveal" inert>
          <div class="insert-clip">
            <div id="answer-box" class="insert-card">
              <span id="track-title" class="insert-title"></span>
              <div class="insert-row">
                <span id="track-artist"></span>
                <span id="track-year" class="insert-year"></span>
              </div>
              <span id="track-album"></span>
            </div>
          </div>
        </div>
      </div>`;function bt(e,t,{onNext:n,onBack:r}){e.innerHTML=`
    <div id="game-view" class="view-state">
      ${ht()}

      <button id="reveal-btn" class="action-btn" aria-expanded="false" aria-controls="answer-reveal">Reveal Track Info</button>

      <p id="status-msg" class="status-msg" role="status"></p>

      ${yt()}
    </div>
  `,vt();for(let n of[`title`,`artist`,`album`,`year`])e.querySelector(`#track-${n}`).textContent=t[n];let i=document.getElementById(`external-content`);if(i){i.innerHTML=`
      <button id="next-random-card" class="action-btn" type="button" ${n?``:`disabled`}>Random Card</button>
      <button id="back-home-btn" class="outer-back-btn">← Back to Menu</button>
    `;let e=i.querySelector(`#next-random-card`);e.addEventListener(`click`,async()=>{if(n){e.disabled=!0;try{await n()}finally{e.disabled=!1}}}),document.getElementById(`back-home-btn`)?.addEventListener(`click`,()=>r())}}var xt=`https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js`,St=null;function Ct(){return window.jsQR?Promise.resolve(window.jsQR):(St??=new Promise((e,t)=>{let n=document.createElement(`script`);n.src=xt,n.async=!0,n.onload=()=>window.jsQR?e(window.jsQR):t(Error(`The QR reader could not start.`)),n.onerror=()=>{St=null,n.remove(),t(Error(`Could not load the QR reader. Check your connection and try again.`))},document.head.appendChild(n)}),St)}async function wt(){if(`BarcodeDetector`in window)try{if((await window.BarcodeDetector.getSupportedFormats()).includes(`qr_code`)){let e=new window.BarcodeDetector({formats:[`qr_code`]});return async t=>(await e.detect(t))[0]?.rawValue??null}}catch{}let e=await Ct(),t=document.createElement(`canvas`),n=t.getContext(`2d`,{willReadFrequently:!0});return async r=>{let i=Math.min(1,640/Math.max(r.videoWidth,r.videoHeight)),a=Math.round(r.videoWidth*i),o=Math.round(r.videoHeight*i);if(!a||!o)return null;t.width=a,t.height=o,n.drawImage(r,0,0,a,o);let s=n.getImageData(0,0,a,o);return e(s.data,a,o)?.data??null}}function Tt(e){let t=String(e).trim();try{let e=new URL(t);t=e.searchParams.get(`song`)||e.searchParams.get(`card`)||``}catch{}return t=t.trim(),O(t)?t:O(t.toLowerCase())?t.toLowerCase():null}function Et(e){return window.isSecureContext?e?.name===`NotAllowedError`?`Camera access is blocked. Allow the camera for this site in your browser settings, then try again.`:e?.name===`NotFoundError`||e?.name===`OverconstrainedError`?`No camera was found on this device.`:e?.name===`NotReadableError`?`The camera is busy in another app. Close it and try again.`:e?.message||`Could not start the camera.`:`The camera only works when the site is opened over https.`}function Dt({onCard:e}){let t=document.getElementById(`scan-controls`);if(!t)return()=>{};t.innerHTML=`
    <button id="scan-btn" class="scan-control" type="button"
            aria-haspopup="dialog" aria-controls="scan-dialog"
            aria-label="Scan a card" title="Scan a card">${A.scan}</button>
    <dialog id="scan-dialog" class="provider-dialog scan-dialog" aria-labelledby="scan-title">
      <div class="provider-dialog-heading">
        <h2 id="scan-title">Scan a card</h2>
        <button id="scan-close" class="provider-close" type="button" aria-label="Close the scanner" autofocus>×</button>
      </div>
      <div class="scan-viewport">
        <video id="scan-video" muted playsinline></video>
        <div class="scan-frame" aria-hidden="true"></div>
      </div>
      <p id="scan-status" class="scan-status" role="status"></p>
      <form id="scan-code-form" class="card-lookup scan-code-form" novalidate>
        <div class="card-lookup-controls">
          <input id="scan-code-input" type="text" placeholder="Card code" aria-label="Card code"
                 autocomplete="off" autocapitalize="none" spellcheck="false"
                 aria-describedby="scan-status">
          <button class="action-btn" type="submit">Open</button>
        </div>
      </form>
    </dialog>
  `;let n=t.querySelector(`#scan-btn`),r=t.querySelector(`#scan-dialog`),i=t.querySelector(`#scan-video`),a=t.querySelector(`#scan-status`),o=t.querySelector(`#scan-code-form`),s=t.querySelector(`#scan-code-input`),c=null,l=0;function u(){c?.getTracks().forEach(e=>e.stop()),c=null,i.srcObject=null}let d=()=>r.close();async function f(t){await Ge(r),e(t)}async function ee(e,t){let n=``;for(;t===l;){if(i.readyState>=2){let r=null;try{r=await e(i)}catch{}if(t!==l)return;if(r){let e=Tt(r);if(e){f(e);return}r!==n&&(n=r,a.textContent=`That QR code isn’t one of the game cards.`)}}await new Promise(e=>setTimeout(e,150))}}async function p(){if(r.open)return;let e=++l;if(We(r,n),a.textContent=``,s.value=``,s.removeAttribute(`aria-invalid`),!navigator.mediaDevices?.getUserMedia){a.textContent=Et();return}let t=wt();t.catch(()=>{});try{let n=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:`environment`}},audio:!1});if(e!==l){n.getTracks().forEach(e=>e.stop());return}c=n,i.srcObject=c,await i.play();let r=await t;if(e!==l)return;ee(r,e)}catch(t){if(e!==l)return;u(),a.textContent=Et(t)}}return o.addEventListener(`submit`,e=>{e.preventDefault();let t=s.value.trim(),n=t?Tt(t):null;if(!n){a.textContent=t?`No card found for that code.`:`Enter a card code.`,s.setAttribute(`aria-invalid`,`true`),s.focus();return}f(n)}),s.addEventListener(`input`,()=>{s.removeAttribute(`aria-invalid`),(a.textContent===`No card found for that code.`||a.textContent===`Enter a card code.`)&&(a.textContent=``)}),n.addEventListener(`click`,p),t.querySelector(`#scan-close`).addEventListener(`click`,d),r.addEventListener(`click`,e=>{let t=r.getBoundingClientRect();e.target===r&&(e.clientX<t.left||e.clientX>t.right||e.clientY<t.top||e.clientY>t.bottom)&&d()}),r.addEventListener(`close`,()=>{l++,u(),n.focus()}),document.addEventListener(`visibilitychange`,()=>{document.hidden&&r.open&&d()}),p}var L=document.getElementById(`card-mount`),R=document.getElementById(`external-content`),z=document.querySelector(`.card-board`),B=window.matchMedia(`(prefers-reduced-motion: reduce)`),V=`playback_paused`,H=null,U=()=>{},W=null,G=null,K=!1,q=!1,J=null,Y=0;function Ot(){try{return sessionStorage.getItem(V)===`1`}catch{return!1}}function kt(e){try{e?sessionStorage.setItem(V,`1`):sessionStorage.removeItem(V)}catch{}}function X(e){let t=document.getElementById(`status-msg`);t&&(t.textContent=e)}for(let e of[`pointerdown`,`pointerup`,`touchend`,`keydown`])document.addEventListener(e,()=>ke(),{capture:!0});document.addEventListener(`keydown`,e=>{e.key===`Tab`&&document.documentElement.classList.add(`keyboard-nav`)}),document.addEventListener(`pointerdown`,()=>{document.documentElement.classList.remove(`keyboard-nav`)});function At(e,t){_t(e,t)}function jt(){Z();async function e(){let t=await Me();t&&!t.paused?(At(t.position,t.duration),J=requestAnimationFrame(e)):Z()}J=requestAnimationFrame(e)}function Z(){J&&=(cancelAnimationFrame(J),null)}function Mt(e){if(!e)return;K=!e.paused;let t=document.getElementById(`play-pause-btn`);t&&(K?(gt(t,!0),X(``),jt()):(gt(t,!1),Z(),At(e.ended?0:e.position,e.duration)))}function Nt(){q=!0,X(`Tap play to start the music.`)}function Pt(){return W||(W=new Promise(e=>{Oe(()=>e(!0),t=>{q=!1,X(String(t)),e(!1)},Mt,Nt).catch(t=>{X(t?.message||String(t)),e(!1)})}),W)}async function Ft(e){let t=document.getElementById(`play-pause-btn`);t&&(t.disabled=!0),X(``);try{await Ae(G),e===Y&&(q=!0)}catch(t){if(e!==Y)return;t?.name===`NotAllowedError`?Nt():X(t?.message||`Could not play this card. Please try again.`)}finally{e===Y&&t&&(t.disabled=!1)}}function It(e,t,{autoplay:n=!0}={}){let r=++Y;Z(),q=!1,K=!1;let i=O(e);if(!i){E().catch(()=>{}),L.innerHTML=`<p>Card not found.</p><a href="/rocking-around/">Back to Menu</a>`,R&&(R.innerHTML=``);return}G=H?i[H]:null;let a=t??He(e,window.history.state?.randomDeckId??sessionStorage.getItem(`selected_deck`)),o=Be(a,H).filter(t=>t!==e);bt(L,i,{onNext:o.length?()=>Wt(Ve(o),a):null,onBack:Gt});let s=document.getElementById(`play-pause-btn`),c=document.getElementById(`reveal-btn`),l=document.getElementById(`answer-slot`),u=document.getElementById(`answer-reveal`);s?.addEventListener(`click`,async()=>{if(!H){U();return}if(ke(),kt(K),!q){await Ft(r);return}s.disabled=!0,X(``);try{await je()}catch(e){X(e?.message||`Could not play this card. Please try again.`)}finally{s.disabled=!1}});function d(){let e=u.firstElementChild,t=c.getBoundingClientRect(),n=u.getBoundingClientRect(),r=n.width/u.offsetWidth||1,i=c.offsetWidth,a=c.offsetHeight,o=i/(e.offsetWidth||i),s=a/(e.offsetHeight||a),l=Math.min(parseFloat(getComputedStyle(c).borderTopLeftRadius)||0,a/2);e.style.setProperty(`--origin-x`,`${(t.left+t.width/2-n.left)/r}px`),e.style.setProperty(`--origin-y`,`${(t.top+t.height/2-n.top)/r}px`),e.style.setProperty(`--ball-x`,String(o)),e.style.setProperty(`--ball-y`,String(s)),e.style.setProperty(`--pill-radius`,`${l/o}px / ${l/s}px`),getComputedStyle(e).transform}c?.addEventListener(`click`,()=>{d();let e=l.classList.toggle(`is-open`);u.inert=!e,c.setAttribute(`aria-expanded`,String(e)),c.textContent=e?`Hide Track Info`:`Reveal Track Info`});let f=!!(H&&G&&n&&!Ot());if(f||E().catch(()=>{}),!H){s.disabled=!1,X(`Choose a music provider to play.`),U();return}if(!G){X(`This card has no ${{spotify:`Spotify`,tidal:`TIDAL`,itunes:`iTunes`}[H]} track ID yet.`);return}Pt().then(e=>{r!==Y||!e||(s&&(s.disabled=!1),f&&Ft(r))})}function Lt(){Y++,Z(),q=!1,E().catch(()=>{}),Xe(L,H,{onOpenCard:Wt})}var Rt=0,zt=null,Bt={left:{axis:`Y`,sign:-1},right:{axis:`Y`,sign:1},up:{axis:`X`,sign:1},down:{axis:`X`,sign:-1}};function Vt(){let e=Object.keys(Bt).filter(e=>e!==zt);return zt=e[Math.floor(Math.random()*e.length)],Bt[zt]}function Q(e,t,n=1){return{transform:`perspective(1400px) rotate${e}(${t}deg)${n===1?``:` scale(${n})`}`}}var $={flip(){let{axis:e,sign:t}=Vt();return{out:[[Q(e,0),Q(e,t*90,.96)],{duration:220,easing:`cubic-bezier(0.55, 0, 0.9, 0.5)`}],in:[[Q(e,-t*90,.96),{...Q(e,t*6),offset:.75},Q(e,0)],{duration:380,easing:`cubic-bezier(0.2, 0.8, 0.3, 1)`}]}},drop(){return{in:[[{transform:`translateY(-70px) scale(1.14)`,opacity:0},{transform:`translateY(0) scale(0.97)`,opacity:1,offset:.62},{transform:`translateY(-4px) scale(1.01)`,offset:.82},{transform:`none`,opacity:1}],{duration:440,easing:`cubic-bezier(0.4, 0, 0.6, 1)`}]}}};function Ht(e){if(document.documentElement.classList.remove(`arriving`),!z?.animate)return;if(B.matches){z.animate([{opacity:0},{opacity:1}],{duration:200,easing:`ease-out`});return}let[t,n]=$[e]().in;z.animate(t,{...n,fill:`backwards`}),R?.animate([{opacity:0,transform:`translateY(8px)`},{opacity:1,transform:`none`}],{duration:320,delay:200,easing:`ease-out`,fill:`backwards`})}async function Ut(e,t=`flip`){let n=++Rt;if(!z||!z.animate){e();return}if(B.matches){e(),L.animate([{opacity:0},{opacity:1}],{duration:200,easing:`ease-out`}),R?.animate([{opacity:0},{opacity:1}],{duration:200,easing:`ease-out`});return}let r=($[t]??$.flip)(),[i,a]=r.out,[o,s]=r.in,c=R?.animate([{opacity:1},{opacity:0}],{duration:180,easing:`ease-in`,fill:`forwards`}),l=z.animate(i,{...a,fill:`forwards`});await l.finished.catch(()=>{}),n===Rt&&(e(),l.cancel(),c?.cancel(),z.animate(o,s),R?.animate([{opacity:0,transform:`translateY(8px)`},{opacity:1,transform:`none`}],{duration:320,delay:120,easing:`ease-out`,fill:`backwards`}))}function Wt(e,t=null){window.history.pushState({randomDeckId:t?.id??null},``,`?`+new URLSearchParams({song:e})),window.scrollTo({top:0,behavior:B.matches?`auto`:`smooth`}),Ut(()=>It(e,t))}function Gt(){window.history.pushState({},``,`/rocking-around/`),Ut(Lt)}function Kt(){let e=new URLSearchParams(window.location.search);return e.get(`song`)||e.get(`card`)}window.addEventListener(`popstate`,()=>{let e=Kt();Ut(e?()=>It(e):Lt)});async function qt(){let e;try{e=await De()}catch(e){throw document.documentElement.classList.remove(`arriving`),e}let t=Kt();if(R&&(R.innerHTML=``),H=e.authenticated?e.provider:null,U=Ye({provider:H,accounts:we(),onSelect:Te,onDisconnect:Ee}),Dt({onCard:e=>Wt(e)}),H&&Pt(),t){It(t);let e=z?.querySelector(`.frame-bg`);await Promise.race([e?.decode?.().catch(()=>{}),new Promise(e=>setTimeout(e,1200))]),Ht(`drop`)}else Lt()}qt();