export function mountDaybook(root, bridge = {}) {
  const TZ = bridge.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
  const TZ_SHORT = (() => { try { return new Intl.DateTimeFormat('en-US',{timeZone:TZ,timeZoneName:'short'}).formatToParts(new Date()).find(x=>x.type==='timeZoneName')?.value || ''; } catch { return ''; } })();
  const enc = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
  const LINEN = enc(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".95 .045" numOctaves="3" seed="4" stitchTiles="stitch" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".045 .95" numOctaves="3" seed="9" stitchTiles="stitch" result="b"/><feTurbulence type="fractalNoise" baseFrequency=".012 .3" numOctaves="2" seed="2" stitchTiles="stitch" result="c"/><feComposite in="a" in2="b" operator="arithmetic" k2=".44" k3=".44" result="w"/><feComposite in="w" in2="c" operator="arithmetic" k2=".85" k3=".22" result="x"/><feColorMatrix in="x" values="0 0 0 0 .33 0 0 0 0 .28 0 0 0 0 .21 1.9 0 0 0 -.86"/></filter><rect width="240" height="240" filter="url(#f)"/></svg>`);
  const STROKES = [
    `<path d="M14 92C70 52 170 30 300 44C340 48 372 58 392 70L386 98C330 84 250 80 170 92C110 101 60 116 22 132Z"/>`,
    `<path d="M10 120C60 82 120 70 200 72C270 74 330 64 390 30L394 62C346 98 280 112 214 112C140 112 76 124 18 150Z"/>`,
    `<path d="M40 30C120 26 210 40 290 62C330 74 360 92 380 118L352 132C320 110 268 98 200 90C140 84 80 82 30 70Z"/>`,
  ].map((p,i) => enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none"><filter id="d" x="-8%" y="-40%" width="116%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".011 .085" numOctaves="3" seed="${3+i*5}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency=".003 .42" numOctaves="2" seed="${8+i}" result="s"/><feColorMatrix in="s" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 4.2 -1.25" result="t"/><feComposite in="d" in2="t" operator="in"/></filter><g fill="#fff" filter="url(#d)">${p}</g></svg>`));
  const scalePx = src => src.split(/(@(?:media|container|supports)[^{]*\{|url\((?:"[^"]*"|'[^']*'|[^)]*)\))/).map((part, i) => i % 2 ? part : part.replace(/(-?\d*\.?\d+)px\b/g, (m, n) => Math.abs(parseFloat(n)) < 3 ? m : `calc(${n}px*var(--s,1))`)).join('');
  const css = scalePx(`
.db{--db-serif:var(--bonsai-font-brand,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif);--db-sans:var(--kay-font-sans,-apple-system,BlinkMacSystemFont,"Google Sans Flex","Inter",system-ui,sans-serif);--db-ink:#202c27;--db-ink-2:rgba(32,44,39,.74);--db-muted:rgba(32,44,39,.56);--db-faint:rgba(32,44,39,.38);--db-hair:rgba(32,44,39,.09);--db-hair-2:rgba(32,44,39,.15);--db-paper:#fbfaf6;--db-linen:#f2eee5;--db-tile:#ece6da;--db-card:#fffefb;--db-terracotta:#a9532e;--db-ochre:#c79a4b;--db-sage:#7e8f7a;--db-forest:#3e5a4a;--db-shadow:0 1px 1px rgba(32,44,39,.04),0 2px 6px -2px rgba(32,44,39,.06),0 12px 28px -18px rgba(32,44,39,.22);--db-shadow-lift:0 1px 1px rgba(32,44,39,.05),0 6px 14px -6px rgba(32,44,39,.1),0 22px 40px -22px rgba(32,44,39,.3);--db-band:var(--bonsai-band-3,linear-gradient(100deg,#e9dcc7 0%,#c79a4b 30%,#a9532e 55%,#5f6e66 80%,#2c3a34 100%));--db-band-soft:var(--bonsai-band-1,linear-gradient(100deg,#f1ebdf,#e7d3b8 55%,#d9a77f));--db-ease:cubic-bezier(.22,.61,.36,1);--db-glide:cubic-bezier(.16,1,.3,1);--db-spring:cubic-bezier(.34,1.32,.64,1);--db-blend:multiply;display:grid;grid-template-columns:minmax(360px,42%) minmax(0,1fr);height:100%;min-height:0;overflow:hidden;color:var(--db-ink);font:13px/1.5 var(--db-sans);font-feature-settings:"tnum" 1,"ss01" 1;-webkit-font-smoothing:antialiased;background:var(--db-paper);isolation:isolate;position:relative}
.db.dark{--db-ink:#eff3e9;--db-ink-2:rgba(239,243,233,.8);--db-muted:rgba(239,243,233,.6);--db-faint:rgba(239,243,233,.4);--db-hair:rgba(239,243,233,.09);--db-hair-2:rgba(239,243,233,.16);--db-paper:#151c19;--db-linen:#1a221e;--db-tile:#222b26;--db-card:#212a25;--db-shadow:0 1px 1px rgba(0,0,0,.2),0 12px 28px -18px rgba(0,0,0,.7);--db-shadow-lift:0 2px 4px rgba(0,0,0,.25),0 24px 40px -22px rgba(0,0,0,.8);--db-band:var(--bonsai-band-3,linear-gradient(100deg,#2c3a34,#5f6e66 30%,#a9532e 60%,#c79a4b));--db-band-soft:var(--bonsai-band-1,linear-gradient(100deg,#1a221e,#3a3128 60%,#6b4a33));--db-blend:screen}
.db *{box-sizing:border-box}:where(.db) :where(button,input){font:inherit;color:inherit}:where(.db) :where(button){cursor:pointer;border:0;background:none;padding:0;text-align:left;transition:transform .55s var(--db-spring),background-color .35s var(--db-ease),color .35s var(--db-ease),box-shadow .55s var(--db-glide),opacity .35s var(--db-ease),border-color .35s var(--db-ease)}.db button:active:not(:disabled){transform:scale(.985)}.db button:focus-visible,.db input:focus-visible,.db [tabindex]:focus-visible{outline:2px solid color-mix(in srgb,var(--db-forest) 70%,transparent);outline-offset:3px;border-radius:10px}:where(.db) :where(svg){fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;width:15px;height:15px;flex-shrink:0}:where(.db) :where(h1,h2,h3,p){margin:0}.db svg.db-art{width:100%;height:100%;stroke:none;display:block}
.db-left,.db-right{min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden;position:relative}.db-left>*,.db-right>*{position:relative;z-index:1}.db-left:before,.db-right:before{content:'';position:absolute;inset:0;background-image:${LINEN};background-size:180px 180px;opacity:.13;mix-blend-mode:var(--db-blend);pointer-events:none;z-index:0}.db-right{background:var(--db-linen);border-left:1px solid var(--db-hair);container-type:inline-size}.db-right:before{opacity:.3}.db-right:after{content:'';position:absolute;left:0;right:0;top:0;height:230px;background:var(--db-band-soft) 30% 40%/cover;opacity:.42;mix-blend-mode:var(--db-blend);-webkit-mask-image:linear-gradient(#000 0%,rgba(0,0,0,.35) 45%,transparent 100%);mask-image:linear-gradient(#000 0%,rgba(0,0,0,.35) 45%,transparent 100%);pointer-events:none;z-index:0}
.db-head{flex-shrink:0;padding:40px 56px 18px;position:relative}.db-eyebrow{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--db-faint)}.db-title{font-family:var(--db-serif);font-weight:400;font-size:44px;line-height:1.02;letter-spacing:-.025em;margin-top:6px!important}.db-right .db-title{color:var(--db-ink-2)}.db-sub{font-size:12.5px;color:var(--db-muted);margin-top:8px!important;display:flex;flex-wrap:wrap;gap:4px 14px}.db-sub b{font-weight:500;color:var(--db-ink-2)}.db-allday{font-size:11px;color:var(--db-faint);margin-top:4px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-tools{position:absolute;top:40px;right:40px;display:flex;align-items:center;gap:4px}.db-icon{display:grid;place-items:center;width:32px;height:32px;color:var(--db-muted)!important;border-radius:999px}.db-icon:hover:not(:disabled){color:var(--db-ink)!important;background:var(--db-hair)}.db-icon:disabled{opacity:.25;cursor:default}.db-range{font-family:var(--db-serif);font-size:15px;color:var(--db-ink-2);margin-right:8px;white-space:nowrap;letter-spacing:-.01em}
.db-today{position:relative;flex:1;min-height:0}.db-plot{position:absolute;inset:14px 0 34px 0}.db-hour{position:absolute;left:56px;font-size:10.5px;color:var(--db-faint);transform:translateY(-50%);line-height:1}.db-rule{position:absolute;left:102px;width:calc(37% + 8px);border-top:1px solid var(--db-hair)}.db-track{position:absolute;top:0;bottom:0;left:110px;width:37%}
.db-te{position:absolute;padding:9px 13px;background:var(--db-card);border:1px solid var(--db-hair);border-radius:12px;overflow:hidden;min-height:28px;box-shadow:var(--db-shadow)}.db-aura{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;border-radius:inherit}.db-aura b{position:absolute;display:block;background:radial-gradient(closest-side,var(--c,#ece6dc) 0%,color-mix(in srgb,var(--c,#ece6dc) 70%,transparent) 55%,transparent 100%);opacity:var(--o,.85);filter:blur(var(--blur,14px));will-change:transform,border-radius;animation:db-drift var(--t,9s) ease-in-out var(--d,0s) infinite alternate,db-morph var(--t2,12s) ease-in-out var(--d2,0s) infinite alternate;transform-origin:50% 50%}.db.dark .db-aura b{opacity:calc(var(--o,.85) * .3)}.db-te>:not(.db-aura),.db-ev>:not(.db-aura),.db-chip>:not(.db-aura){position:relative;z-index:1}.db-chip .db-aura b{--blur:9px}.db-page[aria-hidden="true"] .db-aura b{animation-play-state:paused}.db-ev.imported .db-aura,.db-chip.imported .db-aura{opacity:.55}.db-ev.hold .db-aura,.db-chip.hold .db-aura{opacity:.5}.db-te.past .db-aura{opacity:.6}.db-te strong{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12.5px;font-weight:550;line-height:1.35;letter-spacing:-.005em}.db-te small{display:block;font-size:11px;color:var(--db-muted);margin-top:1px}.db-te.short{display:flex;gap:8px;align-items:baseline;padding:5px 13px}.db-te.short strong{-webkit-line-clamp:1;min-width:0}.db-te.short small{white-space:nowrap;flex-shrink:0;margin:0}.db-te.short.ctx{padding-right:22px}.db-te.short.ctx:after{top:50%;margin-top:-2.5px}.db-te.past{opacity:.5}.db-te:hover,.db-ev:hover{transform:translateY(-1px);box-shadow:var(--db-shadow-lift)}.db-te.ctx:after,.db-ev.ctx:after{content:'';position:absolute;top:10px;right:10px;width:5px;height:5px;border-radius:50%;background:var(--db-terracotta);opacity:.75}
.db-open{position:absolute;left:0;width:100%;border-radius:12px;border:1px dashed var(--db-hair-2);flex-direction:column;justify-content:center;align-items:flex-start;background:linear-gradient(180deg,color-mix(in srgb,var(--db-linen) 70%,transparent),transparent);display:flex;align-items:center;gap:8px;padding:0 14px;font-family:var(--db-serif);font-style:italic;font-size:13px;color:var(--db-muted)!important;overflow:hidden}.db-open{flex-wrap:nowrap;padding:12px 16px!important;gap:9px!important}.db-open .db-open-idea{flex:0 0 auto;margin-top:0!important}.db-open span{font-family:var(--db-sans);font-style:normal;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--db-faint)}.db-open:hover{border-color:var(--db-sage);color:var(--db-ink)!important;background:color-mix(in srgb,var(--db-sage) 9%,transparent)}
.db-now{position:absolute;left:102px;width:calc(37% + 8px);border-top:1px solid var(--db-terracotta);pointer-events:none;z-index:3;transition:top 1.2s var(--db-glide)}.db-now:before{content:'';position:absolute;left:-4px;top:-4px;width:7px;height:7px;border-radius:50%;background:var(--db-terracotta)}.db-now span{position:absolute;left:-58px;top:-8px;width:50px;text-align:right;font-size:10.5px;font-weight:600;line-height:1;color:var(--db-terracotta)}.db-empty{position:absolute;top:2px;left:0;right:0;font-family:var(--db-serif);font-style:italic;font-size:14px;color:var(--db-muted);line-height:1.6}
.db-notes{position:absolute;top:0;bottom:0;left:calc(110px + 37% + 52px);right:56px;display:flex;flex-direction:column;gap:34px;overflow:hidden}.db-note{display:block;color:var(--db-muted);flex-shrink:0}.db-note .db-eyebrow{display:flex;align-items:center;gap:7px;margin-bottom:6px}.db-note .db-eyebrow i{width:14px;height:6px;border-radius:6px;background:var(--db-band) 60% 50%/400% auto;display:inline-block}.db-note strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:17px;line-height:1.3;letter-spacing:-.01em;color:var(--db-ink);margin-bottom:5px}.db-note .db-clamp{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;line-height:1.65}.db-note:hover strong{color:var(--db-forest)}.db-link{display:inline-flex;align-items:center;gap:6px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:11.5px;font-weight:500;color:var(--db-ink-2);margin-top:9px;border-bottom:1px solid var(--db-hair-2);padding-bottom:1px}.db-link svg{width:12px;height:12px}.db-plinth{flex:0 1 190px;min-height:0;margin-top:auto;position:relative;border-radius:16px;overflow:hidden;background:var(--db-tile)}.db-plinth:before,.db-tile .db-frame:before,.db-thumb:before{content:'';position:absolute;inset:0;background-image:${LINEN};background-size:150px 150px;opacity:.55;mix-blend-mode:var(--db-blend)}
.db-promptwrap{flex-shrink:0;display:flex;justify-content:center;padding:6px 56px 2px}.db-context{width:min(600px,100%);margin:0;flex-shrink:0;display:flex;gap:8px;align-items:center;background:var(--db-card);border:1px solid var(--db-hair);border-radius:999px;padding:5px 5px 5px 20px;box-shadow:var(--db-shadow);transition:box-shadow .5s var(--db-glide),border-color .3s}.db-context:focus-within{border-color:var(--db-hair-2);box-shadow:var(--db-shadow-lift)}.db-context input{border:0;outline:none!important;background:none;min-width:0;width:100%;padding:7px 0;font-size:13px}.db-context input::placeholder{color:var(--db-faint)}.db-context button{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--db-ink);color:var(--db-paper)}.db-context button:hover{transform:translateX(1px)}.db-context svg{width:14px;height:14px}
.db-views{--tw:76px;display:inline-flex;margin-top:24px;position:relative;padding:3px;border-radius:999px;background:color-mix(in srgb,var(--db-ink) 6%,transparent);box-shadow:inset 0 0 0 1px var(--db-hair)}.db-views button{position:relative;z-index:1;width:var(--tw);height:28px;text-align:center;font-size:12px;font-weight:500;color:var(--db-muted);border-radius:999px}.db-views button[aria-selected="true"]{color:var(--db-ink)}.db-views button:hover{color:var(--db-ink)}.db-views i{position:absolute;top:3px;left:3px;width:var(--tw);height:28px;border-radius:999px;background:var(--db-card);box-shadow:0 1px 2px rgba(32,44,39,.1),0 4px 10px -4px rgba(32,44,39,.18);transform:translateX(calc(var(--tab,0) * var(--tw)));transition:transform .7s var(--db-spring)}
.db-pager{flex:1 1 0;min-height:0;position:relative;overflow:hidden;overscroll-behavior:contain;touch-action:pan-y;outline:none;cursor:grab}.db-pager.dragging{cursor:grabbing;user-select:none}.db-pager.dragging button{pointer-events:none}.db-rail{display:flex;height:100%;will-change:transform;transform:translate3d(0,0,0)}.db-pager::-webkit-scrollbar{display:none}.db-page{flex:0 0 100%;min-width:0;min-height:0;padding:12px 56px 12px;display:grid;max-height:100%;overflow:hidden}.db-pager.enter .db-page{animation:db-in .8s var(--db-glide) both}
.db-page.d3{grid-template-columns:repeat(3,minmax(0,1fr));gap:40px}.db-page.db-strip{display:flex!important;flex:0 0 auto!important;max-width:none;padding:12px 36px!important;gap:0!important}.db-strip.d3>.db-col{flex:0 0 calc((100cqw - 72px) / 3);padding:0 20px}.db-strip.d7>.db-col{flex:0 0 calc((100cqw - 72px) / 7);padding:0 6px}.db-strip>.db-col[inert] .db-aura b{animation-play-state:paused}.db-strip>.db-col{transition:opacity .5s var(--db-ease)}.db-strip>.db-col[inert]{opacity:.35}.db-pager:has(.db-strip){-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 36px,#000 calc(100% - 36px),transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 36px,#000 calc(100% - 36px),transparent 100%)}.db-page.d7{grid-template-columns:repeat(7,minmax(0,1fr));gap:14px}.db-col{display:flex;flex-direction:column;min-height:0;min-width:0;border-radius:14px}.db-col-head{padding:0 2px 16px;display:flex;align-items:baseline;gap:10px;white-space:nowrap;overflow:hidden;border-bottom:1px solid var(--db-hair);margin-bottom:22px}.db-col-head .db-eyebrow{font-size:9.5px}.db-col-head .db-num{font-family:var(--db-serif);font-size:30px;line-height:1;letter-spacing:-.02em;color:var(--db-ink)}.db-col-head .db-mon{font-size:11px;color:var(--db-muted)}.db-col-head .db-mark{margin-left:auto;font-size:10px;color:var(--db-muted);border:1px solid var(--db-hair-2);border-radius:999px;padding:1px 8px}.db-page.d7 .db-col-head{flex-direction:column;align-items:flex-start;gap:3px;padding-bottom:10px;margin-bottom:10px}.db-page.d7 .db-col-head .db-num{font-size:22px}
.db-col-body{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;padding:2px 2px 12px}.db-col-body::-webkit-scrollbar{display:none}.db-page.d3 .db-col-body{container-type:size;container-name:day}.db-col-body>*{flex-shrink:0}
.db-ev{position:relative;overflow:hidden;padding:13px 16px;background:var(--db-card);border:1px solid var(--db-hair);border-radius:12px;box-shadow:var(--db-shadow)}.db-ev small{display:block;font-size:11px;color:var(--db-muted)}.db-ev strong{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12.5px;font-weight:550;line-height:1.38;margin-top:1px}.db-ev em{display:block;font-style:normal;font-size:10.5px;color:var(--db-faint);margin-top:4px}.db-ev.imported{background:color-mix(in srgb,var(--db-card) 55%,transparent);box-shadow:none}.db-ev.hold{background:transparent;border:1px dashed var(--db-hair-2);box-shadow:none}
.db-tile{display:block;width:100%;color:var(--db-muted)!important}.db-tile .db-frame{display:block;position:relative;height:var(--h,132px);border-radius:16px;overflow:hidden;background:var(--db-tile);box-shadow:inset 0 0 0 1px var(--db-hair),0 18px 30px -26px rgba(32,44,39,.45);transition:transform .7s var(--db-spring),box-shadow .6s var(--db-glide)}.db-tile:hover .db-frame{transform:translateY(-2px) scale(1.005);box-shadow:inset 0 0 0 1px var(--db-hair-2),0 26px 40px -28px rgba(32,44,39,.55)}.db-tile .db-cap{display:block;padding:10px 4px 0}.db-tile .db-eyebrow{display:block}.db-tile strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:15.5px;line-height:1.32;color:var(--db-ink);margin-top:4px;letter-spacing:-.01em}.db-tile p{font-size:11.5px;line-height:1.6;margin-top:3px!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.db-tile .db-hold{display:inline-block;margin-top:7px;font-size:11px;font-weight:500;color:var(--db-forest);opacity:0;transform:translateY(3px);transition:opacity .4s var(--db-ease),transform .6s var(--db-spring)}.db-tile:hover .db-hold,.db-tile:focus-visible .db-hold{opacity:1;transform:none}
.db-smear.m0{--m:${STROKES[0]}}.db-smear.m1{--m:${STROKES[1]}}.db-smear.m2{--m:${STROKES[2]}}.db-smear{position:absolute;display:block;left:var(--x,6%);top:var(--y,10%);width:var(--w,78%);height:var(--hh,52%);transform:rotate(var(--r,-6deg));background:var(--db-band) var(--bp,50%) 50%/var(--bs,260%) auto;-webkit-mask:var(--m) center/100% 100% no-repeat;mask:var(--m) center/100% 100% no-repeat;opacity:.92;mix-blend-mode:var(--db-blend);pointer-events:none}.db-frame svg.db-art{position:absolute;inset:0}
.db-folio{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start;padding:10px 10px 14px;background:var(--db-card);border:1px solid var(--db-hair);border-radius:14px;box-shadow:var(--db-shadow);color:var(--db-muted)!important}.db-folio:hover{transform:translateY(-1px);box-shadow:var(--db-shadow-lift)}.db-folio .db-thumb{display:block;position:relative;height:74px;border-radius:9px;overflow:hidden;background:var(--db-tile)}.db-folio>span:last-child{display:block;padding:0 4px}.db-folio strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:15px;line-height:1.3;color:var(--db-ink);margin-top:3px;letter-spacing:-.01em}.db-folio p{font-size:11.5px;line-height:1.55;margin-top:3px!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.db-folio .db-link{margin-top:7px}
.db-accept-row{display:flex;justify-content:flex-start;margin-top:8px}.db-accept{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 11px 0 8px!important;border:1px solid var(--db-hair-2)!important;border-radius:999px;font-size:11.5px;font-weight:500;color:var(--db-ink-2)!important;background:color-mix(in srgb,var(--db-card) 60%,transparent)!important}.db-accept svg,.db-accepted svg,.db-pill svg,.db-doc-held svg{width:13px;height:13px;stroke-width:1.8}.db-accept:hover{background:var(--db-ink)!important;border-color:var(--db-ink)!important;color:var(--db-paper)!important}.db-accept:disabled{opacity:.6}.db-accepted{display:inline-flex;align-items:center;gap:5px;height:26px;font-size:11.5px;font-weight:500;color:var(--db-forest)}.db-pill{gap:7px}.db-doc-held{display:inline-flex;align-items:center;gap:7px}.db-idea-main,.db-tile-main{display:block;width:100%;text-align:left;color:inherit!important}.db-tile-main:hover .db-frame{transform:translateY(-2px) scale(1.005);box-shadow:inset 0 0 0 1px var(--db-hair-2),0 26px 40px -28px rgba(32,44,39,.55)}.db-open-main{display:flex;align-items:center;justify-content:flex-start;width:100%;gap:8px;color:inherit!important;font:inherit}.db-open .db-open-idea{display:flex!important;align-items:center;gap:10px;flex-wrap:wrap}.db-open .db-open-idea>button:first-child{font-family:var(--db-sans);font-size:11.5px;color:var(--db-muted)!important;text-decoration:underline;text-decoration-color:var(--db-hair-2);text-underline-offset:3px}.db-sel{position:absolute;left:0;width:100%;border-radius:12px;background:color-mix(in srgb,var(--db-ochre) 13%,transparent);border:1px solid color-mix(in srgb,var(--db-ochre) 50%,transparent);z-index:4;pointer-events:none;padding:8px 12px;animation:db-pop .4s var(--db-spring) both}.db-sel[hidden]{display:none}.db-sel span{font-size:11px;font-weight:600;color:var(--db-ink-2)}.db-plot.selecting{cursor:ns-resize;user-select:none}.db-chipsel{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;height:28px;padding:0 4px 0 11px;border-radius:999px;background:color-mix(in srgb,var(--db-ochre) 16%,transparent);font-size:12px;font-weight:500;color:var(--db-ink-2);white-space:nowrap}.db-chipsel button{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;color:var(--db-muted)!important}.db-chipsel button:hover{background:var(--db-hair)!important}.db-plan{margin-left:auto;align-self:center;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;color:var(--db-faint)!important;opacity:.0}.db-col:hover .db-plan,.db-plan:focus-visible{opacity:1}.db-plan:hover{background:var(--db-hair)!important;color:var(--db-ink)!important}.db-col-head .db-mark+.db-plan{margin-left:6px}.db-col.past .db-ev{opacity:.9;background:color-mix(in srgb,var(--db-card) 70%,transparent)}.db-col.past .db-col-head .db-num{color:var(--db-ink-2)}.db-learn{display:block;font-family:var(--db-serif);font-style:italic!important;font-size:12px!important;color:var(--db-faint)!important;margin-top:6px!important}.db-learn.done{color:var(--db-forest)!important;font-style:normal!important;font-family:var(--db-sans);font-size:11px!important}.db-ev:hover .db-learn:not(.done){color:var(--db-ink-2)!important}.db-swap{animation:db-swap .6s var(--db-glide)}@keyframes db-swap{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.db-note.reply strong{color:var(--db-forest)}.db-options{border-top:1px solid var(--db-hair);margin:0 0 30px}.db-option{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:16px 2px;border-bottom:1px solid var(--db-hair)}.db-option>div{min-width:0}.db-option strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:18px;line-height:1.35;color:var(--db-ink);margin-top:3px}.db-option p{font-size:13px;line-height:1.6;color:var(--db-muted);margin:4px 0 0!important}.db-option p.db-doc-hint{font-size:12px}.db-option .db-accept,.db-option .db-accepted{flex-shrink:0;margin-top:4px}.db-lasttime{margin:-14px 0 32px;padding:16px 18px;border-radius:14px;border:1px solid var(--db-hair-2);background:color-mix(in srgb,var(--db-sage) 7%,transparent)}.db-lasttime p{font-family:var(--db-serif);font-size:15.5px;line-height:1.6;color:var(--db-ink-2);margin:6px 0 4px!important}.db-setup .db-doc-title{font-size:44px}.db-setup-h{font-family:var(--db-serif);font-weight:400;font-size:22px;margin:6px 0 10px!important}.db-connect-row strong{font-size:17px}.db-menu-connect{display:flex;align-items:center;gap:6px;width:100%;padding:6px 0!important;color:var(--db-ink-2)!important;font-size:12px}.db-menu-connect svg{width:13px;height:13px}.db-menu-connect:hover{color:var(--db-ink)!important}.db-col-body>[hidden]{display:none!important}.db-slotwrap{position:relative;height:0;margin-bottom:-14px;z-index:3}.db-slot{position:absolute;left:0;right:0;top:-15px;height:16px;padding:0!important;display:flex;align-items:center;justify-content:center;background:transparent!important;border:0!important;cursor:pointer}.db-slotwrap:first-child .db-slot{top:-19px}.db-slot-line{position:absolute;left:6px;right:6px;top:50%;border-top:1px solid color-mix(in srgb,var(--db-sage) 75%,transparent);opacity:0;transform:scaleX(.4);transition:opacity .3s var(--db-ease),transform .5s var(--db-glide)}.db-slot-plus{position:relative;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:var(--db-paper);border:1px solid color-mix(in srgb,var(--db-sage) 80%,transparent);color:var(--db-ink-2);opacity:0;transform:scale(.6);transition:opacity .3s var(--db-ease),transform .5s var(--db-spring),background .25s,color .25s,border-color .25s}.db-slot-plus svg{width:11px;height:11px;stroke-width:2}.db-slot:hover .db-slot-line,.db-slot:focus-visible .db-slot-line{opacity:1;transform:none}.db-slot:hover .db-slot-plus,.db-slot:focus-visible .db-slot-plus{opacity:1;transform:none}.db-slot:hover .db-slot-plus{background:var(--db-ink);border-color:var(--db-ink);color:var(--db-paper)}.db-slot:focus-visible{outline:none!important}.db-page.d3 .db-col-body{overflow:clip;overflow-clip-margin:24px}.db-newev{display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;margin:0 0 32px;padding:18px 20px;border-radius:14px;background:color-mix(in srgb,var(--db-card) 72%,transparent);border:1px solid var(--db-hair)}.db-newev label{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--db-faint)}.db-newev .db-ne-cal{grid-column:1/-1}.db-newev select{appearance:none;-webkit-appearance:none;font:15px var(--db-serif);color:var(--db-ink);background:transparent;border:0;border-bottom:1px solid var(--db-hair-2);padding:6px 18px 7px 0;outline:none;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--db-muted) 50%),linear-gradient(135deg,var(--db-muted) 50%,transparent 50%);background-position:calc(100% - 8px) 55%,calc(100% - 4px) 55%;background-size:4px 4px;background-repeat:no-repeat}.db-newev select:focus{border-bottom-color:var(--db-ink)}.db-option-actions{display:flex;gap:6px;flex-shrink:0;margin-top:4px}.db-rise{animation:db-rise .8s var(--db-glide) backwards;animation-delay:var(--d,0ms)}@keyframes db-rise{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}.db-fresh{animation:db-bloom 1s var(--db-spring) backwards}@keyframes db-bloom{0%{opacity:0;transform:translateY(10px) scale(.86)}55%{opacity:1}100%{transform:none}}.db-fresh:after{content:'';position:absolute;inset:-4px;border-radius:16px;border:1.5px solid color-mix(in srgb,var(--db-ochre) 70%,transparent);opacity:0;animation:db-ring 1.4s var(--db-glide) .15s;pointer-events:none}.db-idea.db-fresh,.db-chip.db-fresh,.db-open-idea.db-fresh{position:relative}@keyframes db-ring{0%{opacity:.9;transform:scale(.96)}100%{opacity:0;transform:scale(1.06)}}.db-scan{position:relative}.db-scan:before{content:'';position:absolute;left:-8px;right:-8px;top:0;height:90px;border-radius:14px;background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--db-ochre) 22%,transparent) 50%,transparent);pointer-events:none;z-index:2;animation:db-sweep 1.1s var(--db-ease) forwards}@keyframes db-sweep{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(calc(var(--sweep,420px)))}}.db-agent{position:absolute;left:0;top:0;z-index:7;pointer-events:none;opacity:0;transform:translate3d(-60px,-60px,0);transition:transform .9s cubic-bezier(.2,.9,.25,1),opacity .45s var(--db-ease);will-change:transform}.db-agent.on{opacity:1}.db-agent svg{position:absolute;left:-3px;top:-3px;width:22px;height:22px;fill:var(--db-ink);stroke:var(--db-paper);stroke-width:1.4;filter:drop-shadow(0 3px 6px rgba(32,44,39,.3))}.db-agent span{position:absolute;left:16px;top:16px;padding:3px 9px;border-radius:999px;background:var(--db-ink);color:var(--db-paper);font-size:10.5px;font-weight:600;letter-spacing:.02em;white-space:nowrap;box-shadow:0 6px 16px -8px rgba(32,44,39,.5)}.db-agent-halo{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;background:color-mix(in srgb,var(--db-ochre) 35%,transparent);opacity:0}.db-agent.tap .db-agent-halo{animation:db-tap .7s var(--db-glide)}@keyframes db-tap{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}.db-context.working{border-color:transparent;background:linear-gradient(var(--db-card),var(--db-card)) padding-box,linear-gradient(90deg,var(--db-hair-2),var(--db-ochre),var(--db-sage),var(--db-hair-2)) border-box;background-size:100% 100%,300% 100%;animation:db-flow 2.4s linear infinite}.db-context.working input::placeholder{color:var(--db-ink-2)}.db-context.working button{opacity:.4}@keyframes db-flow{to{background-position:0 0,300% 0}}.db-sk{display:block;border-radius:8px;background:linear-gradient(100deg,color-mix(in srgb,var(--db-ink) 6%,transparent) 30%,color-mix(in srgb,var(--db-ink) 11%,transparent) 50%,color-mix(in srgb,var(--db-ink) 6%,transparent) 70%);background-size:240% 100%;animation:db-shimmer 1.8s var(--db-ease) infinite}@keyframes db-shimmer{from{background-position:120% 0}to{background-position:-120% 0}}.db-sk-today{position:relative;flex:1;padding:24px 56px;display:grid;grid-template-columns:40% 1fr;grid-auto-rows:min-content;gap:18px 40px}.db-sk-today>.db-sk{grid-column:1;width:100%!important}.db-sk-notes{grid-column:2;grid-row:1/4;display:flex;flex-direction:column;gap:10px}.db-sk-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;padding:20px 56px}.db-sk-col{display:flex;flex-direction:column;gap:14px}.db-step{display:inline-flex;align-items:baseline;gap:2px}.db-step-in{animation:db-rise .6s var(--db-glide)}.db-dots{display:inline-flex;gap:3px;margin-left:3px}.db-dots b{width:3px;height:3px;border-radius:50%;background:currentColor;opacity:.3;animation:db-dot 1.2s var(--db-ease) infinite}.db-dots b:nth-child(2){animation-delay:.18s}.db-dots b:nth-child(3){animation-delay:.36s}@keyframes db-dot{0%,100%{opacity:.25;transform:none}40%{opacity:1;transform:translateY(-2px)}}.db-idea.working,.db-chip.working{background:linear-gradient(100deg,transparent 30%,color-mix(in srgb,var(--db-ochre) 12%,transparent) 50%,transparent 70%);background-size:240% 100%;animation:db-shimmer 1.6s var(--db-ease) infinite;border-style:dashed!important}.db-note.reply.working strong:after{content:'';display:inline-block;width:14px;height:6px;margin-left:6px;vertical-align:middle;background:radial-gradient(circle,currentColor 1.4px,transparent 1.8px) 0 50%/5px 6px repeat-x;opacity:.5;animation:db-dotsbg 1.2s steps(3) infinite}@keyframes db-dotsbg{from{width:4px}to{width:16px}}.db-progress{position:absolute;left:0;right:0;top:0;height:2px;overflow:hidden;z-index:4}.db-progress:before{content:'';position:absolute;top:0;bottom:0;width:30%;background:linear-gradient(90deg,transparent,var(--db-ochre),var(--db-sage),transparent);animation:db-prog 1.6s var(--db-ease) infinite}@keyframes db-prog{from{left:-30%}to{left:100%}}.is-busy{position:relative;pointer-events:none}.is-busy svg{opacity:0}.is-busy:before{content:'';position:absolute;left:10px;top:50%;width:11px;height:11px;margin-top:-6px;border-radius:50%;border:1.6px solid currentColor;border-right-color:transparent;animation:db-spin .7s linear infinite}@keyframes db-spin{to{transform:rotate(360deg)}}.db-accepted{animation:db-pop .55s var(--db-spring) both}.db-accepted svg path,.db-doc-held svg path{stroke-dasharray:24;stroke-dashoffset:24;animation:db-draw .5s var(--db-ease) .15s forwards}@keyframes db-draw{to{stroke-dashoffset:0}}.db-now:before{animation:db-breath 2.6s var(--db-ease) infinite}@keyframes db-breath{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--db-terracotta) 45%,transparent)}50%{box-shadow:0 0 0 5px color-mix(in srgb,var(--db-terracotta) 0%,transparent)}}.db-docpage>*{animation:db-rise .7s var(--db-glide) backwards}.db-docpage>*:nth-child(1){animation-delay:40ms}.db-docpage>*:nth-child(2){animation-delay:90ms}.db-docpage>*:nth-child(3){animation-delay:140ms}.db-docpage>*:nth-child(4){animation-delay:190ms}.db-docpage>*:nth-child(5){animation-delay:240ms}.db-docpage>*:nth-child(6){animation-delay:290ms}.db-docpage>*:nth-child(n+7){animation-delay:340ms}.db-option{animation:db-rise .7s var(--db-glide) backwards}.db-options .db-option:nth-child(1){animation-delay:260ms}.db-options .db-option:nth-child(2){animation-delay:340ms}.db-options .db-option:nth-child(3){animation-delay:420ms}.db-options .db-option:nth-child(4){animation-delay:500ms}.db-options .db-option:nth-child(n+5){animation-delay:580ms}.db-te,.db-ev,.db-idea,.db-folio,.db-tile .db-frame,.db-chip,.db-note{transition:transform .6s var(--db-spring),box-shadow .6s var(--db-glide),opacity .4s var(--db-ease),background .3s}.db-ev:hover,.db-te:hover{transform:translateY(-2px) scale(1.008)}.db-idea:hover{transform:translateY(-1px)}.db-note:hover{transform:translateX(2px)}.db-evwrap,.db-notewrap{position:relative}.db-idea,.db-tile{position:relative}.db-x{position:absolute;top:6px;right:6px;z-index:3;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:14px;line-height:1;color:var(--db-muted)!important;background:color-mix(in srgb,var(--db-paper) 86%,transparent)!important;border:1px solid var(--db-hair)!important;opacity:0;transform:scale(.7);transition:opacity .25s var(--db-ease),transform .45s var(--db-spring),background .2s,color .2s;text-align:center!important}.db-evwrap:hover>.db-x,.db-notewrap:hover>.db-x,.db-idea:hover>.db-x,.db-tile:hover>.db-x,.db-x:focus-visible{opacity:1;transform:none}.db-x:hover{background:var(--db-ink)!important;color:var(--db-paper)!important;border-color:var(--db-ink)!important}.db-notewrap>.db-x{top:-2px;right:-6px}.db-tile>.db-x{top:8px;right:8px}.db-evwrap>.db-ev,.db-evwrap>.db-folio,.db-notewrap>.db-note{width:100%}.db-evwrap:hover>.db-ev.ctx:after{opacity:0}.db-toast{display:flex;align-items:center;gap:14px}.db-undo{font-weight:600;color:var(--db-paper)!important;text-decoration:underline;text-underline-offset:3px;opacity:.9}.db-undo:hover{opacity:1}.db-danger{color:#9a3b2a!important;border-color:color-mix(in srgb,#9a3b2a 30%,transparent)!important}.db-danger.armed{background:#9a3b2a!important;color:#fff!important;border-color:#9a3b2a!important}.db-idea{display:block;width:100%;padding:12px 14px;border:1px solid var(--db-hair-2)!important;border-radius:12px;background:transparent;color:var(--db-muted)!important;text-align:left}.db-idea:hover{border-color:color-mix(in srgb,var(--db-ink) 28%,transparent)!important;color:var(--db-ink-2)!important}.db-idea .db-eyebrow{display:block;font-size:9px;margin-bottom:5px}.db-idea strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:14px;line-height:1.4;color:var(--db-ink-2)}.db-idea span.db-d{display:block;font-size:11.5px;line-height:1.5;margin-top:3px}.db-open .db-open-idea{display:block;font-family:var(--db-sans);font-style:normal;font-size:11.5px;line-height:1.5;color:var(--db-muted);margin-top:6px;max-width:30em;text-transform:none;letter-spacing:0}.db-chip.idea{background:transparent;box-shadow:none;border:1px solid var(--db-hair-2);font-family:var(--db-serif);font-style:italic;color:var(--db-muted)}.db-chip.idea b{font-weight:400}.db-cell i.idea:before{background:none;border:1px solid var(--db-faint);border-radius:2px;width:7px;height:7px;margin:0}.db-interests{display:grid;gap:30px;margin:0 0 30px}.db-interests h2{font-family:var(--db-serif);font-weight:400;font-size:22px;margin:0 0 10px!important}.db-interests p.db-doc-hint{margin:0 0 12px!important}.db-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.db-tag{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 6px 0 14px;border:1px solid var(--db-hair-2);border-radius:999px;font-size:13px;color:var(--db-ink-2)}.db-tag button{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:var(--db-faint)!important}.db-tag button:hover{background:var(--db-hair)!important;color:var(--db-ink)!important}.db-add{display:flex;gap:8px;align-items:center;border-bottom:1px solid var(--db-hair-2);padding:4px 0}.db-add input{flex:1;min-width:0;border:0;outline:none!important;background:none;font:16px var(--db-serif);padding:8px 0;color:var(--db-ink)}.db-add input::placeholder{color:var(--db-faint);font-style:italic}.db-add button{font-size:12px;font-weight:500;color:var(--db-muted)!important;padding:6px 10px!important;border-radius:999px}.db-add button:hover{background:var(--db-hair)!important;color:var(--db-ink)!important}.db-aside{display:block;font-family:var(--db-serif);font-style:italic;font-size:13px;line-height:1.55;color:var(--db-muted);padding:2px 0 2px 12px;border-left:1px solid var(--db-hair-2)}.db-aside strong{font-weight:400;color:var(--db-ink-2)}.db-ad{display:block;font-size:11px;color:var(--db-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.db-quiet{font-family:var(--db-serif);font-style:italic;font-size:13px;color:var(--db-faint);line-height:1.6}.db-openday .db-frame{--h:112px}
.db-chip{position:relative;display:block;width:100%;padding:7px 9px;border-radius:9px;background:var(--db-card);border:1px solid var(--db-hair);box-shadow:0 1px 2px rgba(32,44,39,.04);font-size:11.5px;line-height:1.35;overflow:hidden}.db-chip.paper:before,.db-chip.rest:before{content:'';position:absolute}.db-chip span{display:block;font-size:10px;color:var(--db-muted)}.db-chip b{font-weight:550;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.db-chip.imported{background:transparent;box-shadow:none}.db-chip.hold{background:transparent;border-style:dashed;box-shadow:none}.db-chip.paper,.db-chip.rest{background:transparent;border:0;box-shadow:none;padding:4px 0 4px 18px;font-family:var(--db-serif);font-style:italic;font-size:12px;color:var(--db-muted)}.db-chip.paper:before,.db-chip.rest:before{left:0;top:50%;bottom:auto;width:12px;height:5px;border-radius:5px;transform:translateY(-50%);background:var(--db-band) 60% 50%/400% auto}.db-chip.paper b,.db-chip.rest b{font-weight:400}.db-chip:hover{transform:translateY(-1px)}.db-more{font-size:11px;color:var(--db-muted)}.db-more:hover{color:var(--db-ink)}
.db-page.dm{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.db-mgrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-auto-rows:minmax(0,1fr);min-height:0;overflow:hidden;border-left:1px solid var(--db-hair);border-top:1px solid var(--db-hair);border-radius:3px;background:color-mix(in srgb,var(--db-card) 28%,transparent)}.db-wd{font-size:9.5px;font-weight:600;letter-spacing:.14em;color:var(--db-faint);padding:8px 10px;border-right:1px solid var(--db-hair);border-bottom:1px solid var(--db-hair)}.db-cell{min-height:0;overflow:hidden;padding:8px 9px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--db-hair)!important;border-bottom:1px solid var(--db-hair)!important;border-radius:0}.db-cell:hover{background:color-mix(in srgb,var(--db-card) 80%,transparent)}.db-cell b{font-family:var(--db-serif);font-size:15px;font-weight:400;color:var(--db-ink-2);margin-bottom:3px;line-height:22px;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;margin-left:-3px}.db-cell.today b{color:var(--db-terracotta);box-shadow:inset 0 0 0 1px var(--db-terracotta)}.db-cell.out{opacity:.32}.db-cell.past{opacity:.55}.db-cell i{font-style:normal;font-size:10.5px;color:var(--db-ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:5px}.db-cell i:before{content:'';width:9px;height:9px;margin:0 -2px;border-radius:50%;background:radial-gradient(circle,var(--c,var(--db-faint)) 0 34%,transparent 72%);flex-shrink:0}.db-cell i.paper,.db-cell i.rest{font-family:var(--db-serif);font-style:italic;color:var(--db-muted)}.db-cell i.paper:before,.db-cell i.rest:before{width:10px;height:4px;border-radius:4px;background:var(--db-band) 60% 50%/400% auto}.db-cell i.more:before{display:none}.db-cell i.more{color:var(--db-faint)}
.db-flash{animation:db-flash 1.8s var(--db-glide)}.db-foot{padding:10px 64px 30px;display:flex;justify-content:space-between;gap:10px;font-size:11px;color:var(--db-faint);flex-shrink:0}.db-foot button{font-size:11px;color:var(--db-faint)}.db-foot button:hover{color:var(--db-ink)}
.db-menu{position:absolute;top:72px;right:24px;z-index:6;width:280px;max-height:calc(100% - 96px);overflow:auto;background:var(--db-card);border:1px solid var(--db-hair);padding:18px;border-radius:18px;box-shadow:var(--db-shadow-lift);font-size:12px;color:var(--db-muted);animation:db-pop .5s var(--db-spring) both;transform-origin:top right}.db-menu h3{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--db-faint);margin:16px 0 8px}.db-menu h3:first-child{margin-top:0}.db-menu label{display:flex;align-items:center;gap:10px;margin:7px 0;color:var(--db-ink-2);cursor:pointer}.db-menu label .db-sw{width:8px;height:8px;border-radius:50%;flex-shrink:0}.db-menu input{appearance:none;-webkit-appearance:none;margin:0 0 0 auto;order:3;width:28px;height:16px;border-radius:999px;background:var(--db-hair-2);position:relative;cursor:pointer;transition:background .3s var(--db-ease)}.db-menu input:after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .5s var(--db-spring)}.db-menu input:checked{background:var(--db-forest)}.db-menu input:checked:after{transform:translateX(12px)}.db-menu .db-src-row{margin:8px 0;line-height:1.5}.db-menu .db-src-row b{display:flex;align-items:center;gap:6px;font-weight:500;color:var(--db-ink-2)}.db-menu .db-src-row b:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--s,var(--db-faint))}.db-menu .db-refresh{margin-top:16px;width:100%;height:34px;border-radius:999px;text-align:center;background:var(--db-ink);color:var(--db-paper);font-weight:500}
.db-toast{position:absolute;bottom:84px;left:50%;transform:translateX(-50%);background:var(--db-ink);color:var(--db-paper);padding:10px 18px;border-radius:999px;box-shadow:var(--db-shadow-lift);font-size:12px;z-index:8;max-width:85%;animation:db-toast .6s var(--db-spring) both}
.db-docwrap{position:relative;z-index:1;flex:1;min-height:0;display:flex;flex-direction:column;animation:db-doc-in .6s var(--db-glide) both}.db-docbar{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:20px 24px 8px 22px}.db-back{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 13px 0 8px!important;border-radius:999px;font-size:12.5px;font-weight:500;color:var(--db-ink-2)!important}.db-back:hover{background:var(--db-hair)!important}.db-back svg{width:14px;height:14px}.db-save{margin-left:auto;font-size:11px;color:var(--db-faint);white-space:nowrap}.db-restore{font-size:11px;color:var(--db-muted)!important;padding:5px 11px!important;border-radius:999px;border:1px solid var(--db-hair)!important}.db-restore:hover{color:var(--db-ink)!important;border-color:var(--db-hair-2)!important}
.db-docscroll{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--db-hair-2) transparent}.db-docpage{max-width:640px;margin:0 auto;padding:16px 44px 90px}.db-kicker{display:flex;align-items:center;gap:9px;font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--db-faint)}.db-kicker i{width:8px;height:8px;border-radius:50%;background:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 45%,transparent),0 0 12px var(--c)}
.db-doc-title{font-family:var(--db-serif);font-weight:400;font-size:40px;line-height:1.12;letter-spacing:-.025em;margin:14px 0 10px!important;outline:none;word-break:break-word}.db-doc-dek{font-family:var(--db-serif);font-style:italic;font-size:19px;line-height:1.5;color:var(--db-muted);outline:none;margin:0 0 20px!important}.db-doc-title:empty:before,.db-doc-dek:empty:before{content:attr(data-placeholder);color:var(--db-faint)}.db-byline{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--db-muted);padding-bottom:22px;border-bottom:1px solid var(--db-hair);margin:0 0 28px!important}.db-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:var(--db-band) 55% 50%/520% auto;box-shadow:inset 0 0 0 1px rgba(32,44,39,.08)}
.db-hero{position:relative;height:230px;border-radius:18px;overflow:hidden;background:var(--db-tile);margin:0 0 30px;box-shadow:inset 0 0 0 1px var(--db-hair),0 24px 40px -34px rgba(32,44,39,.5)}.db-hero:before{content:'';position:absolute;inset:0;background-image:${LINEN};background-size:150px 150px;opacity:.55;mix-blend-mode:var(--db-blend)}.db-hero-aura{height:96px;background:var(--db-card);box-shadow:inset 0 0 0 1px var(--db-hair)}.db-hero-aura:before{display:none}.db-hero-aura .db-aura b{--blur:26px}
.db-facts{display:grid;grid-template-columns:72px minmax(0,1fr);gap:9px 16px;font-size:13.5px;line-height:1.55;margin:0 0 32px;padding:18px 20px;border-radius:14px;background:color-mix(in srgb,var(--db-card) 72%,transparent);border:1px solid var(--db-hair)}.db-facts dt{color:var(--db-faint);font-size:12px;padding-top:1px}.db-facts dd{margin:0;color:var(--db-ink);word-break:break-word}.db-facts a{color:var(--db-forest);text-underline-offset:3px}
.db-doc-body{position:relative;font-family:var(--db-serif);font-size:18.5px;line-height:1.78;color:var(--db-ink);outline:none;min-height:140px;caret-color:var(--db-terracotta)}.db-doc-body>*:first-child{margin-top:0!important}.db-doc-body p{margin:0 0 1.05em!important}.db-doc-body h2{font-family:var(--db-serif);font-weight:500;font-size:25px;letter-spacing:-.015em;line-height:1.3;margin:1.5em 0 .45em!important}.db-doc-body h3{font-family:var(--db-sans);font-weight:600;font-size:15px;letter-spacing:.01em;margin:1.4em 0 .4em!important}.db-doc-body blockquote{margin:1.2em 0;padding-left:20px;border-left:2px solid var(--db-ink);font-style:italic;color:var(--db-ink-2)}.db-doc-body ul,.db-doc-body ol{padding-left:1.3em;margin:0 0 1.05em}.db-doc-body li{margin:.3em 0}.db-doc-body a{color:var(--db-forest);text-underline-offset:3px}.db-doc-body em{color:var(--db-muted)}.db-doc-body.is-empty:before{content:attr(data-placeholder);position:absolute;top:0;left:0;right:0;color:var(--db-faint);font-style:italic;pointer-events:none}.db-doc-body ::selection,.db-doc-title::selection,.db-doc-dek::selection{background:color-mix(in srgb,var(--db-ochre) 28%,transparent)}
.db-agenda{margin:0 0 32px;border-top:1px solid var(--db-hair)}.db-agenda>*{position:relative;display:grid;grid-template-columns:118px minmax(0,1fr);gap:14px;width:100%;padding:14px 2px;border-bottom:1px solid var(--db-hair)!important;font-size:14px;line-height:1.45;text-align:left}.db-agenda span{color:var(--db-muted);font-size:12.5px;padding-top:1px}.db-agenda b{font-weight:500;color:var(--db-ink)}.db-agenda small{display:block;font-weight:400;color:var(--db-muted);font-size:12.5px;margin-top:2px}.db-agenda button:hover b{color:var(--db-forest)}.db-agenda button:before{content:'';position:absolute;left:-14px;top:21px;width:7px;height:7px;border-radius:50%;background:var(--c,transparent);box-shadow:0 0 8px var(--c,transparent)}
.db-doc-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:36px;padding-top:24px;border-top:1px solid var(--db-hair)}.db-pill{height:38px;padding:0 19px!important;border-radius:999px;background:var(--db-ink)!important;color:var(--db-paper)!important;font-size:13px;font-weight:500;display:inline-flex;align-items:center;text-decoration:none;box-shadow:0 10px 24px -14px rgba(32,44,39,.7)}.db-pill:hover{transform:translateY(-1px)}.db-pill:disabled{opacity:.5}.db-doc-hint{font-size:12.5px;color:var(--db-muted);line-height:1.55}.db-doc-held{font-size:13px;font-weight:500;color:var(--db-forest)}.db-doc-note{font-size:12.5px;color:var(--db-muted);margin-top:12px!important;min-height:1px}.db-doc-foot{font-size:11.5px;line-height:1.65;color:var(--db-faint);margin-top:30px!important;word-break:break-all}
.db-bubble{position:absolute;z-index:9;display:flex;gap:2px;padding:4px;border-radius:12px;background:var(--db-ink);box-shadow:var(--db-shadow-lift);transform:translate(-50%,-100%);animation:db-pop .3s var(--db-spring)}.db-bubble[hidden]{display:none}.db-bubble button{width:30px;height:28px;border-radius:8px;color:var(--db-paper)!important;font-size:13px;display:grid;place-items:center;text-align:center}.db-bubble button:hover{background:rgba(255,255,255,.14)}
@keyframes db-doc-in{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
@container (max-width:620px){.db-docpage{padding-left:24px;padding-right:24px}.db-doc-title{font-size:32px}}
@media(max-width:1080px){.db-docpage{padding-left:28px;padding-right:28px}.db-doc-title{font-size:34px}}
@keyframes db-drift{0%{transform:translate3d(0,0,0) rotate(0deg) scale(1)}33%{transform:translate3d(var(--x1),var(--y1),0) rotate(var(--r1)) scale(var(--s1))}66%{transform:translate3d(var(--x2),var(--y2),0) rotate(var(--r2)) scale(var(--s2))}100%{transform:translate3d(var(--x3),var(--y3),0) rotate(var(--r3)) scale(var(--s3))}}@keyframes db-morph{0%{border-radius:var(--b1)}50%{border-radius:var(--b2)}100%{border-radius:var(--b3)}}@keyframes db-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes db-pop{from{opacity:0;transform:translateY(8px) scale(.975)}to{opacity:1;transform:none}}@keyframes db-toast{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes db-flash{0%{background:color-mix(in srgb,var(--db-sage) 16%,transparent)}100%{background:transparent}}
@container day (max-height:600px){.db-tile .db-frame{height:66px!important}.db-tile p,.db-tile .db-hold{display:none}.db-tile .db-cap{padding-top:7px}.db-tile strong{font-size:14.5px}.db-folio .db-thumb{display:none}.db-folio{padding:12px 13px}.db-ev{padding:8px 12px}.db-ev em{display:none}}
@media(max-height:840px){.db-head{padding-top:22px;padding-bottom:10px}.db-title{font-size:38px}.db-views{margin-top:12px}.db-col-head{padding-bottom:10px;margin-bottom:10px}.db-col-head .db-num{font-size:26px}.db-tools{top:22px}}
@container (max-width:620px){.db-page.d3{gap:14px;padding-left:24px;padding-right:24px}.db-page.d7{gap:5px;padding-left:20px;padding-right:20px}.db-page.dm{padding-left:20px;padding-right:20px}.db-chip span{display:none}.db-cell{padding:5px}.db-cell i{font-size:0;gap:0}.db-cell i:before{width:6px;height:6px}.db-range{display:none}.db-head{padding-left:24px;padding-right:24px}.db-foot{padding-left:24px;padding-right:24px}.db-tile p{display:none}}
@media(max-width:1080px){.db-head{padding-left:36px;padding-right:36px}.db-tools{right:24px}.db-hour{left:36px}.db-rule,.db-now{left:80px}.db-track{left:88px}.db-notes{left:calc(88px + 37% + 32px);right:36px;gap:28px}.db-promptwrap{padding-left:36px;padding-right:36px}.db-page{padding-left:36px;padding-right:36px}.db-page.d3{gap:28px}.db-foot{padding-left:36px;padding-right:36px}.db-title{font-size:38px}}
@media(max-width:860px){.db{grid-template-columns:1fr;height:auto;overflow:visible}.db-left{height:min(640px,92vh)}.db-right{height:min(660px,92vh);border-left:0;border-top:1px solid var(--db-hair)}.db-toast{position:fixed}}
@media(prefers-reduced-motion:reduce){.db *:not(.db-aura b){animation:none!important;transition:none!important}.db-aura b{animation-name:db-breathe!important;animation-duration:14s!important}}@keyframes db-breathe{0%,100%{opacity:var(--o,.85)}50%{opacity:calc(var(--o,.85) * .7)}}
.db-headrow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;column-gap:16px;margin-top:6px}
.db-headrow .db-title{margin-top:0!important;white-space:nowrap}
.db-headrow .db-views{margin-top:0!important;justify-self:center}
.db-headrow .db-tools{position:static!important;justify-self:end}
.db-right>.db-head{padding-bottom:16px}
.db-headrow[data-fit=tight] .db-title{font-size:34px}.db-headrow[data-fit=tight] .db-views{--tw:62px}.db-headrow[data-fit=tight] .db-range{font-size:13.5px;margin-right:2px}
.db-headrow[data-fit=compact] .db-title{font-size:29px}.db-headrow[data-fit=compact] .db-views{--tw:56px}.db-headrow[data-fit=compact] .db-views button{font-size:11.5px}.db-headrow[data-fit=compact] .db-range{font-size:13px;margin-right:0}.db-headrow[data-fit=compact]{column-gap:12px}
.db-headrow[data-fit=wrap]{grid-template-columns:minmax(0,1fr) auto;row-gap:12px}.db-headrow[data-fit=wrap] .db-title{font-size:34px}.db-headrow[data-fit=wrap] .db-views{grid-row:2;grid-column:1/-1;justify-self:start}
.db-seg{display:flex;gap:2px;padding:3px;border-radius:999px;background:var(--db-hair);margin:2px 0 10px}.db-seg button{flex:1;padding:6px 8px;border-radius:999px;font-size:12px;color:var(--db-muted);text-align:center;transition:background .3s var(--db-ease),color .3s}.db-seg button[aria-pressed=true]{background:var(--db-card);color:var(--db-ink);box-shadow:var(--db-shadow)}
.db-startover{color:var(--db-muted)!important}.db-startover.armed{color:#9a3b2a!important}
.db.db-theming,.db.db-theming *{transition:background-color .6s var(--db-ease),color .6s var(--db-ease),border-color .6s var(--db-ease),box-shadow .6s var(--db-ease)!important}
.db-ob{grid-column:1/-1;position:relative;display:flex;flex-direction:column;height:100%;min-height:0;overflow-y:auto;background:var(--db-paper);isolation:isolate}
.db-ob:before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background-image:${LINEN};opacity:.32;mix-blend-mode:var(--db-blend)}
.db-ob-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:26px 40px 0;min-height:56px}
.db-ob-mark{display:flex;color:var(--db-ink)}.db-ob-mark svg{width:30px;height:30px}.db-ob-mark.small svg{width:22px;height:22px;opacity:.8}
.db-ob-progress{display:flex;gap:6px;justify-self:center}.db-ob-progress i{width:22px;height:3px;border-radius:2px;background:var(--db-hair-2);transition:background .5s var(--db-ease),width .6s var(--db-glide)}.db-ob-progress i.on{background:var(--db-ink);width:34px}
.db-ob-stage{flex:1 0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px 40px 56px}
.db-ob-col{width:100%;max-width:58rem;transition:opacity .24s var(--db-ease),transform .24s var(--db-ease)}.db-ob-col.leaving{opacity:0;transform:translateY(-8px)}
.db-ob-kicker{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--db-faint)}
.db-ob-title{font-family:var(--db-serif);font-weight:400;font-size:42px;line-height:1.08;letter-spacing:-.02em;margin:16px 0 0;color:var(--db-ink)}
.db-ob-lede{max-width:34rem;margin:12px 0 0;font-size:15.5px;line-height:1.55;color:var(--db-ink-2);min-height:1.55em}
.db-ob-caret{display:inline-block;width:1.5px;height:1.05em;margin-left:2px;vertical-align:-3px;background:currentColor;animation:db-ob-caret 1s steps(1) infinite}
@keyframes db-ob-caret{50%{opacity:0}}
.db-ob-points{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:34px 0 0;padding:0;list-style:none}
.db-ob-point{display:grid;grid-template-rows:96px auto 1fr;padding-bottom:20px;border:1px solid var(--db-hair-2);border-radius:14px;background:var(--db-card);overflow:hidden;box-shadow:var(--db-shadow)}
.db-ob-band{background-image:var(--db-band);background-size:260% auto;opacity:.92}
.db-ob-icon{position:relative;z-index:1;display:grid;place-items:center;width:34px;height:34px;margin:-17px 0 0 18px;border:1px solid var(--db-hair-2);border-radius:9px;background:var(--db-card);color:var(--db-ink-2)}.db-ob-icon svg{width:17px;height:17px}
.db-ob-point-body{padding:12px 18px 0}.db-ob-point strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:19px;line-height:1.25;color:var(--db-ink)}.db-ob-point-body>span{display:block;margin-top:5px;font-size:13px;line-height:1.5;color:var(--db-muted)}
.db-ob-cta-row{display:flex;align-items:center;gap:20px;margin-top:34px}
.db-ob-cta{display:inline-flex;align-items:center;gap:9px;padding:10px 20px 11px;border-radius:999px;background:var(--db-ink);color:var(--db-paper)!important;font-family:var(--db-serif);font-size:18px;line-height:1;letter-spacing:-.01em;transition:transform .5s var(--db-glide),box-shadow .25s var(--db-ease),opacity .3s}
.db-ob-cta:hover{transform:translateY(-2px);box-shadow:0 16px 36px -14px rgba(32,44,39,.45)}.db-ob-cta:disabled{opacity:.32;pointer-events:none}
.db-ob-arr{font-family:var(--db-sans);font-size:14px;transition:transform .25s var(--db-ease)}.db-ob-cta:hover .db-ob-arr{transform:translateX(4px)}
.db-ob-link{font-size:13px;color:var(--db-muted);text-decoration:underline;text-decoration-color:var(--db-hair-2);text-underline-offset:4px;transition:color .2s}.db-ob-link:hover{color:var(--db-ink)}
.db-ob-rows{display:grid;gap:10px;max-width:40rem;margin-top:30px}
.db-ob-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border:1px solid var(--db-hair-2);border-radius:14px;background:var(--db-card);box-shadow:var(--db-shadow);transition:border-color .4s var(--db-ease)}
.db-ob-row strong{display:block;font-family:var(--db-serif);font-weight:400;font-size:18px;color:var(--db-ink)}.db-ob-row span{display:block;margin-top:2px;font-size:12.5px;color:var(--db-muted)}
.db-ob-row.on{border-color:color-mix(in srgb,#5f7d63 40%,var(--db-hair-2))}
.db-ob-connect{flex-shrink:0;padding:8px 16px;border-radius:999px;border:1px solid var(--db-hair-2);font-size:13px;font-weight:500;color:var(--db-ink);transition:background .25s,border-color .25s,transform .4s var(--db-spring)}.db-ob-connect:hover{background:var(--db-ink);color:var(--db-paper);border-color:var(--db-ink);transform:translateY(-1px)}.db-ob-connect:disabled{opacity:.6;pointer-events:none}
.db-ob-done{display:inline-flex!important;align-items:center;gap:6px;margin:0!important;font-size:13px!important;color:#5f7d63!important}.db-ob-done svg{width:15px;height:15px}
.db-ob-chips{display:flex;flex-wrap:wrap;gap:8px;max-width:44rem;margin-top:30px}
.db-ob-chip{padding:9px 16px;border-radius:999px;border:1px solid var(--db-hair-2);font-size:14px;color:var(--db-ink-2);background:var(--db-card);transition:background .3s var(--db-ease),color .3s,border-color .3s,transform .45s var(--db-spring)}.db-ob-chip:hover{transform:translateY(-1px)}.db-ob-chip[aria-pressed=true]{background:var(--db-ink);color:var(--db-paper);border-color:var(--db-ink)}
.db-ob-field{display:block;max-width:26rem;margin-top:26px}.db-ob-field span{display:block;font-size:12px;color:var(--db-muted)}.db-ob-field input{width:100%;margin-top:6px;padding:8px 0;border:0;border-bottom:1px solid var(--db-hair-2);background:transparent;font-family:var(--db-serif);font-size:20px;color:var(--db-ink);outline:none;transition:border-color .3s}.db-ob-field input:focus{border-color:var(--db-ink)}
.db-ob-looks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;max-width:44rem;margin-top:30px}
.db-ob-look{padding:12px 12px 14px;border:1px solid var(--db-hair-2);border-radius:14px;background:var(--db-card);text-align:left;transition:border-color .3s,box-shadow .3s,transform .45s var(--db-spring)}.db-ob-look:hover{transform:translateY(-2px)}.db-ob-look[aria-pressed=true]{border-color:var(--db-ink);box-shadow:0 0 0 1px var(--db-ink)}.db-ob-look strong{display:block;margin-top:10px;font-family:var(--db-serif);font-weight:400;font-size:17px;color:var(--db-ink)}
.db-ob-mini{display:grid;grid-template-columns:1fr 1.5fr;grid-template-rows:repeat(3,1fr);gap:5px;height:86px;padding:8px;border-radius:9px;background:#f6f3ec;border:1px solid rgba(32,44,39,.08)}.db-ob-mini i{border-radius:4px;background:#e6e0d3}.db-ob-mini i:first-child{grid-row:1/4;background:#fbfaf6;border:1px solid rgba(32,44,39,.07)}
.db-ob-mini.dark{background:#1a221e;border-color:rgba(239,243,233,.08)}.db-ob-mini.dark i{background:#29332e}.db-ob-mini.dark i:first-child{background:#151c19;border-color:rgba(239,243,233,.07)}
.db-ob-mini.auto{background:linear-gradient(120deg,#f6f3ec 0 50%,#1a221e 50% 100%)}.db-ob-mini.auto i{background:color-mix(in srgb,#e6e0d3 50%,#29332e)}.db-ob-mini.auto i:first-child{background:linear-gradient(120deg,#fbfaf6 0 60%,#151c19 60%)}
.db-ob-steps{display:grid;gap:12px;margin:30px 0 0;padding:0;list-style:none}.db-ob-steps li{display:flex;align-items:center;gap:12px;font-size:14.5px;color:var(--db-faint);transition:color .4s var(--db-ease)}.db-ob-steps li i{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:1px solid var(--db-hair-2);color:transparent;transition:background .4s var(--db-ease),color .4s,border-color .4s}.db-ob-steps li i svg{width:13px;height:13px}
.db-ob-steps li.now{color:var(--db-ink-2)}.db-ob-steps li.now i{border-color:var(--db-ink);animation:db-ob-pulse 1.4s var(--db-ease) infinite}.db-ob-steps li.done{color:var(--db-ink)}.db-ob-steps li.done i{background:var(--db-ink);border-color:var(--db-ink);color:var(--db-paper)}
@keyframes db-ob-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--db-ink) 30%,transparent)}50%{box-shadow:0 0 0 6px transparent}}
.db-ob [data-beat]{animation:db-ob-arrive .6s var(--db-ease) both}
.db-ob [data-beat="0"]{animation-delay:.15s}.db-ob [data-beat="1"]{animation-delay:.3s}.db-ob [data-beat="2"]{animation-delay:.45s}.db-ob [data-beat="3"]{animation-delay:calc(.6s + var(--d,0) * .09s)}.db-ob [data-beat="4"]{animation-delay:.9s}
.db-ob[data-step=welcome]:not(.lifted) .db-ob-point,.db-ob[data-step=welcome]:not(.lifted) .db-ob-cta-row{animation:none;opacity:0;visibility:hidden}
.db-ob[data-step=welcome].lifted .db-ob-point{animation:db-ob-rise .9s var(--db-ease) both;animation-delay:calc(.5s + var(--d,0) * .55s)}.db-ob[data-step=welcome].lifted .db-ob-cta-row{animation:db-ob-arrive .6s var(--db-ease) both;animation-delay:2.1s}
.db-ob.still [data-beat],.db-ob.still.lifted .db-ob-point,.db-ob.still.lifted .db-ob-cta-row{animation:none!important;opacity:1;visibility:visible}
@keyframes db-ob-arrive{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes db-ob-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(max-width:860px){.db-ob{height:auto;min-height:100%}.db-ob-points,.db-ob-looks{grid-template-columns:1fr}.db-ob-title{font-size:32px}.db-ob-top,.db-ob-stage{padding-left:24px;padding-right:24px}}
.db-morph{animation:db-become 1s var(--db-glide) both}
.db-saving{position:absolute;top:10px;right:10px;width:7px;height:7px;border-radius:50%;background:var(--db-ink-2);animation:db-ob-pulse 1.2s var(--db-ease) infinite;z-index:2}
@keyframes db-become{0%{background-color:transparent;box-shadow:inset 0 0 0 1px var(--db-hair-2);transform:scale(.97)}55%{transform:scale(1.02)}100%{transform:none}}
.db-morph .db-aura{animation:db-aura-in 1.4s var(--db-ease) .15s both}
@keyframes db-aura-in{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
.db-setup-card{display:block;width:100%;margin-bottom:22px;padding:14px 16px 15px;border-radius:14px;border:1px solid var(--db-hair-2);background:var(--db-card);box-shadow:var(--db-shadow);text-align:left;transition:transform .45s var(--db-spring),box-shadow .3s var(--db-ease);animation:db-ob-arrive .6s var(--db-ease) .3s both}
.db-setup-card:hover{transform:translateY(-2px);box-shadow:var(--db-shadow-lift)}
.db-setup-card .db-eyebrow{display:flex;align-items:center;gap:6px}.db-setup-card .db-eyebrow svg{width:13px;height:13px;color:var(--db-terracotta)}
.db-setup-card strong{display:block;margin-top:7px;font-family:var(--db-serif);font-weight:400;font-size:19px;line-height:1.2;color:var(--db-ink)}
.db-setup-go{display:inline-flex;align-items:center;gap:6px;margin-top:9px;font-size:12.5px;color:var(--db-ink-2)}.db-setup-card:hover .db-ob-arr{transform:translateX(4px)}
.db-promptwrap{position:relative}
.db-whom{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%);width:min(440px,92%);padding:16px 16px 12px;border-radius:16px;border:1px solid var(--db-hair-2);background:var(--db-card);box-shadow:var(--db-shadow-lift);z-index:6;text-align:left;animation:db-whom-in .45s var(--db-glide) both}
@keyframes db-whom-in{from{opacity:0;transform:translate(-50%,10px) scale(.98)}to{opacity:1;transform:translate(-50%,0)}}
.db-whom strong{display:block;margin-top:4px;font-family:var(--db-serif);font-weight:400;font-size:21px;line-height:1.2;color:var(--db-ink)}
.db-whom-list{display:grid;gap:6px;margin-top:12px}
.db-whom-list button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border-radius:11px;border:1px solid var(--db-hair-2);text-align:left;transition:border-color .25s var(--db-ease),transform .4s var(--db-spring),background .25s}
.db-whom-list button:hover,.db-whom-list button:focus-visible{border-color:var(--db-ink);transform:translateY(-1px)}
.db-whom-list b{font-weight:500;font-size:14px;color:var(--db-ink)}.db-whom-list span{font-size:12px;color:var(--db-muted)}.db-whom-list .new b{font-weight:400;color:var(--db-ink-2)}
.db-whom .db-ob-link{display:inline-block;margin-top:10px}
.db-person{display:block;margin-bottom:7px}.db-person b{font-weight:500}.db-person small{display:block;font-size:11.5px;line-height:1.45;color:var(--db-muted)}
.db-tag small{margin-left:4px;font-size:11px;color:var(--db-muted)}
.db-seekcard{position:relative;overflow:hidden;padding:12px 14px 13px;border-radius:12px;border:1px dashed color-mix(in srgb,var(--db-ink) 32%,transparent);background:color-mix(in srgb,var(--db-card) 60%,transparent);animation:db-ob-arrive .4s var(--db-ease) both}
.db-seekcard .db-eyebrow{display:flex;align-items:center;gap:6px}.db-seekcard strong{display:block;margin-top:5px;font-size:13.5px;font-weight:500;color:var(--db-ink-2)}
.db-seek-bar{position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,transparent,var(--db-ink),transparent) no-repeat;background-size:40% 100%;animation:db-seek-run 1.2s var(--db-ease) infinite;opacity:.55}
@keyframes db-seek-run{from{background-position:-60% 0}to{background-position:160% 0}}
.db-seek{position:absolute;left:0;right:0;z-index:2;overflow:hidden;border-radius:10px;border:1px dashed color-mix(in srgb,var(--db-ink) 38%,transparent);background:color-mix(in srgb,var(--db-ink) 5%,transparent);pointer-events:none;animation:db-ob-arrive .4s var(--db-ease) both}
.db-seek span{position:absolute;top:6px;left:10px;font-size:11.5px;color:var(--db-ink-2)}.db-seek b{font-weight:600}
.db-seekchip{border-style:dashed!important;opacity:.85}
/* Bonsai fades page tops under the tab strip; Today never scrolls, so hide that fade in Today's own pane only. */
[data-pane-body]:has(.db)>.pane-body-top-fade{display:none}
.db-tl-hover{position:absolute;left:-10px;right:-10px;top:0;height:18px;margin-top:-9px;z-index:5;display:flex;align-items:center;gap:8px;opacity:0;pointer-events:none;transition:opacity .2s var(--db-ease),top .12s var(--db-ease)}
.db-tl-hover.on{opacity:1;pointer-events:auto;cursor:pointer}
.db-tl-hover b{position:absolute;right:calc(100% + 6px);font-size:10.5px;font-weight:600;color:var(--db-terracotta);white-space:nowrap}
.db-tl-hover i{flex:1;height:1px;background:var(--db-terracotta);opacity:.6}
.db-tl-hover span{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--db-ink);color:var(--db-paper);box-shadow:var(--db-shadow);transition:transform .35s var(--db-spring)}.db-tl-hover:hover span{transform:scale(1.12)}
.db-tl-hover span svg{width:12px;height:12px}
.db-home{margin-right:8px;padding:3px 10px 4px;border-radius:999px;border:1px solid var(--db-hair-2);font-size:11.5px;font-weight:500;color:var(--db-ink-2);white-space:nowrap;transition:background .2s,color .2s,border-color .2s;animation:db-ob-arrive .35s var(--db-ease) both}.db-home:hover{background:var(--db-ink);color:var(--db-paper);border-color:var(--db-ink)}.db-home[hidden]{display:none}
.db-moss{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}.db-moss img{position:absolute;display:block;user-select:none;-webkit-user-drag:none}
@media(max-width:860px){.db-moss{display:none}}
.db-sky{--sky-ink:rgba(32,44,39,.8);--sky-clay:#cf8a6a;--sky-sage:#a9b8a3;--sky-ochre:#dcb978;--sky-paper:#fbfaf6;position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1;color:var(--sky-ink)}
.db-sky.dark{--sky-ink:rgba(239,243,233,.78);--sky-clay:#b5745a;--sky-sage:#7f9079;--sky-ochre:#b89a5e;--sky-paper:#dcd6c8}
.db-bird{position:absolute;width:calc(var(--bw)*var(--s,1));height:auto;opacity:.6;overflow:visible;animation:db-bird-fly var(--dur) linear var(--delay) infinite}
.db-bird path{fill:none;stroke:currentColor;stroke-width:2.2px;stroke-linecap:round;vector-effect:non-scaling-stroke}
.db-bird .w1{animation:db-flap var(--flap) steps(1,end) var(--flapd) infinite}
.db-bird .w2{animation:db-flap var(--flap) steps(1,end) calc(var(--flapd) - var(--flap) / 2) infinite}
@keyframes db-flap{0%,49.9%{opacity:1}50%,100%{opacity:0}}
@keyframes db-bird-fly{0%{left:var(--bx0);top:var(--by0)}100%{left:var(--bx1);top:var(--by1)}}
.db-drifter{position:absolute;left:0;opacity:.92;animation:db-sky-drift var(--dur) linear both}
@keyframes db-sky-drift{0%{left:var(--bfrom)}100%{left:var(--bto)}}
.db-balloon-bob{animation:db-balloon-bob 6.5s ease-in-out infinite alternate;transform-origin:50% 20%}
@keyframes db-balloon-bob{0%{transform:translateY(0) rotate(-2deg)}100%{transform:translateY(-14px) rotate(2.4deg)}}
.db-kite-bob{animation:db-kite-bob 5.2s ease-in-out infinite alternate;transform-origin:50% 30%}
@keyframes db-kite-bob{0%{transform:translateY(0) rotate(-7deg)}100%{transform:translateY(-18px) rotate(6deg)}}
.db-kite-tail{animation:db-kite-wag 1.6s ease-in-out infinite alternate;transform-origin:40px 70px;transform-box:view-box}
@keyframes db-kite-wag{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}
.db-balloon-svg,.db-kite-svg{width:100%;height:auto;display:block;overflow:visible}
@media(prefers-reduced-motion:reduce){.db-sky{display:none}}
`);
  const paths = {plus:'<path d="M12 5.5v13M5.5 12h13"/>',check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',leaf:'<path d="M5.5 18.5C5.5 10 10.5 5 19 5c0 8.5-5 13.5-13.5 13.5Z"/><path d="M5.5 18.5 13 11"/>',more:'<circle cx="5" cy="12" r="1.1"/><circle cx="12" cy="12" r="1.1"/><circle cx="19" cy="12" r="1.1"/>',left:'<path d="m14.5 6-6 6 6 6"/>',right:'<path d="m9.5 6 6 6-6 6"/>',doc:'<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Zm0 0v5h5M8.5 13h7m-7 3.5h5"/>',arrow:'<path d="M5 12h14m-5.5-6 6 6-6 6"/>',up:'<path d="M12 19V5m-6 6 6-6 6 6"/>',moon:'<path d="M19 14.6A7.4 7.4 0 0 1 9.4 5a7.4 7.4 0 1 0 9.6 9.6Z"/>',sun:'<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',cal:'<rect x="4.5" y="5.5" width="15" height="14" rx="2.5"/><path d="M4.5 10h15M9 3.5v4M15 3.5v4"/>',spark:'<path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/>',shield:'<path d="M12 3.5 5.5 6v5.5c0 4 2.8 7.4 6.5 9 3.7-1.6 6.5-5 6.5-9V6L12 3.5Z"/><path d="m9.2 12.2 2 2 3.6-3.8"/>'};
  const palette = ['#e4ecf5','#f9ebdc','#e6efe1','#f0e7f2','#f2ede5','#f1efe0'];
  const hash = s => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const prng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  function aura(id){
    const r = prng(hash(id)), R = (a,b) => a + (b-a)*r(), p = n => Math.round(n);
    const shape = () => `${p(R(34,66))}% ${p(R(34,66))}% ${p(R(34,66))}% ${p(R(34,66))}% / ${p(R(34,66))}% ${p(R(34,66))}% ${p(R(34,66))}% ${p(R(34,66))}%`;
    const place = [() => `left:${p(R(-20,6))}%;top:${p(R(-50,-10))}%;width:${p(R(50,76))}%;height:${p(R(120,180))}%`, () => `left:${p(R(42,74))}%;top:${p(R(20,70))}%;width:${p(R(30,52))}%;height:${p(R(80,130))}%`, () => `left:${p(R(10,40))}%;top:${p(R(55,95))}%;width:${p(R(24,40))}%;height:${p(R(60,100))}%`];
    const sgn = () => r() > .5 ? 1 : -1, pct = (a,b) => `${(sgn()*R(a,b)).toFixed(1)}%`, deg = (a,b) => `${(sgn()*R(a,b)).toFixed(1)}deg`;
    const now = Date.now() / 1000;
    const blob = i => { const t = R(7,11), t2 = R(9,14), b1 = shape(); return `<b style="${place[i]()};border-radius:${b1};--b1:${b1};--b2:${shape()};--b3:${shape()};--o:${R(i ? .3 : .45, i ? .42 : .6).toFixed(2)};--x1:${pct(12,26)};--y1:${pct(10,22)};--x2:${pct(14,30)};--y2:${pct(12,24)};--x3:${pct(8,20)};--y3:${pct(8,18)};--r1:${deg(8,20)};--r2:${deg(10,24)};--r3:${deg(6,16)};--s1:${R(1.06,1.2).toFixed(2)};--s2:${R(.86,.96).toFixed(2)};--s3:${R(1,1.12).toFixed(2)};--t:${t.toFixed(1)}s;--t2:${t2.toFixed(1)}s;--d:-${((now + R(0,40)) % (2*t)).toFixed(2)}s;--d2:-${((now + R(0,40)) % (2*t2)).toFixed(2)}s"></b>`; };
    return `<i class="db-aura" aria-hidden="true">${blob(0)}${blob(1)}${r() > .4 ? blob(2) : ''}</i>`;
  }
  const ic = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[n] || paths.doc}</svg>`;
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const md = s => e(s).split(/\n/).map(l => /^#{1,3} /.test(l) ? `<h3>${l.replace(/^#+ /,'')}</h3>` : /^\s*[-*] /.test(l) ? `<li>${l.replace(/^\s*[-*] /,'')}</li>` : l.trim() ? `<p>${l}</p>` : '').join('').replace(/(?:<li>.*?<\/li>)+/g, m => `<ul>${m}</ul>`).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  let seq = 0;
  function art(kind){
    const u = 'db' + (++seq) + kind[0], s = (seq % 7) + 1;
    const grain = `<filter id="${u}g" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="3" seed="${s}" result="n"/><feDiffuseLighting in="n" surfaceScale="1.15" diffuseConstant="1.08" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="56"/></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1="1.06" result="m"/><feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`;
    const sandf = `<filter id="${u}d" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="${s+3}" result="n"/><feDiffuseLighting in="n" surfaceScale=".7" diffuseConstant="1.12" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="62"/></feDiffuseLighting><feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1="1.04" result="m"/><feComposite in="m" in2="SourceGraphic" operator="in"/></filter>`;
    const blur = `<filter id="${u}b" x="-40%" y="-120%" width="180%" height="340%"><feGaussianBlur stdDeviation="5.5"/></filter><filter id="${u}c" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.6"/></filter>`;
    const shadow = (cx,cy,rx,ry,o=.34) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2e251d" opacity="${o}" filter="url(#${u}b)"/><ellipse cx="${cx}" cy="${cy-1}" rx="${rx*.62}" ry="${ry*.42}" fill="#1f1913" opacity="${o*.9}" filter="url(#${u}c)"/>`;
    const peb = (cx,cy,rx,ry,k=0) => `M${cx-rx} ${cy+ry*.12}C${cx-rx} ${cy-ry*1.02} ${cx+rx*(.3+k)} ${cy-ry*1.16} ${cx+rx} ${cy-ry*.18}C${cx+rx*1.05} ${cy+ry*.72} ${cx+rx*.22} ${cy+ry*1.1} ${cx-rx*.32} ${cy+ry}C${cx-rx*.82} ${cy+ry*.92} ${cx-rx*1.02} ${cy+ry*.56} ${cx-rx} ${cy+ry*.12}Z`;
    const grad = (id,a,b,cx='34%',cy='26%') => `<radialGradient id="${u}${id}" cx="${cx}" cy="${cy}" r="85%"><stop offset="0" stop-color="${a}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${b}" stop-opacity=".96"/></radialGradient>`;
    const stone = (id,cx,cy,rx,ry,a,b,k=0) => `<path d="${peb(cx,cy,rx,ry,k)}" fill="url(#${u}${id})" filter="url(#${u}g)"/><ellipse cx="${cx-rx*.28}" cy="${cy-ry*.45}" rx="${rx*.42}" ry="${ry*.28}" fill="#fff" opacity=".22" filter="url(#${u}c)"/>`;
    const sandPatch = (cx,cy,rx,ry,rings,ox,oy) => `<clipPath id="${u}k"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath><radialGradient id="${u}sg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#e9dfcc"/><stop offset=".85" stop-color="#ddd0b8"/><stop offset="1" stop-color="#ddd0b8" stop-opacity="0"/></radialGradient><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}sg)" filter="url(#${u}d)"/><g clip-path="url(#${u}k)" fill="none">${rings.map(r=>`<ellipse cx="${ox}" cy="${oy+1}" rx="${r}" ry="${r*.26}" stroke="#b9a98d" stroke-width="1.5" opacity=".55"/><ellipse cx="${ox}" cy="${oy-.6}" rx="${r}" ry="${r*.26}" stroke="#f7f1e6" stroke-width="1" opacity=".7"/>`).join('')}</g>`;
    let defs = grain + sandf + blur, body = '';
    if (kind === 'stones') {
      defs += grad('s1','#a9a69d','#6d6a62') + grad('s2','#8b8a83','#4d4c47') + grad('s3','#c2b9aa','#8b8274');
      body = sandPatch(168,150,150,36,[62,78,94,110,126],170,148) + shadow(170,149,58,9) + stone('s1',170,136,52,17,0,0,.05) + shadow(166,124,36,5,.3) + stone('s2',166,116,36,13,0,0,-.08) + shadow(172,104,22,3,.28) + stone('s3',172,98,23,9,0,0,.1);
    } else if (kind === 'water') {
      defs += `<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f706b"/><stop offset=".6" stop-color="#8e9c94"/><stop offset="1" stop-color="#b3bdb4"/></linearGradient><linearGradient id="${u}cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdbb9e"/><stop offset="1" stop-color="#93806a"/></linearGradient>` + grad('p','#57534c','#2f2d29');
      body = shadow(160,156,104,11,.32) + `<path d="M64 116C66 148 104 162 160 162C216 162 254 148 256 116Z" fill="url(#${u}cl)" filter="url(#${u}g)"/><ellipse cx="160" cy="116" rx="96" ry="29" fill="#d8c8ac" filter="url(#${u}g)"/><ellipse cx="160" cy="118" rx="86" ry="23.5" fill="url(#${u}w)"/><ellipse cx="160" cy="118" rx="86" ry="23.5" fill="none" stroke="#3a3a33" stroke-width="3" opacity=".16" filter="url(#${u}c)"/><g opacity=".72" filter="url(#${u}c)"><path d="${peb(146,123,15,6)}" fill="url(#${u}p)"/></g><ellipse cx="146" cy="122" rx="28" ry="7.5" fill="none" stroke="#eef2ec" stroke-width=".8" opacity=".38"/><ellipse cx="146" cy="122" rx="44" ry="11" fill="none" stroke="#eef2ec" stroke-width=".7" opacity=".2"/><path d="M100 109C138 101 186 101 224 110" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity=".42" filter="url(#${u}c)"/>`;
    } else if (kind === 'soil') {
      defs += `<filter id="${u}o" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${s+5}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="3" seed="${s+1}" result="t"/><feDiffuseLighting in="t" surfaceScale="2.2" diffuseConstant="1.15" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="50"/></feDiffuseLighting><feComposite in="l" in2="d" operator="arithmetic" k1="1.1" result="m"/><feComposite in="m" in2="d" operator="in"/></filter><radialGradient id="${u}m" cx="48%" cy="18%" r="80%"><stop offset="0" stop-color="#6a4c37"/><stop offset=".55" stop-color="#3d2a1e"/><stop offset="1" stop-color="#271a12"/></radialGradient><linearGradient id="${u}lf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8c477"/><stop offset="1" stop-color="#58773a"/></linearGradient>`;
      const crumbs = [[96,154,3],[108,158,2],[238,156,2.6],[250,153,1.8],[126,160,1.6],[224,161,1.6],[84,157,1.4]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#3b291d"/>`).join('');
      body = shadow(172,155,90,10,.42) + `<g filter="url(#${u}o)"><path d="M84 154C98 128 130 104 170 100C208 97 242 124 262 154Z" fill="url(#${u}m)"/>${crumbs}</g><path d="M171 101C172 90 169 80 172 64" stroke="#5f7d42" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M172 70C160 57 144 58 137 65C148 75 162 77 172 70Z" fill="url(#${u}lf)"/><path d="M171 69C183 53 200 51 209 57C201 69 185 74 171 69Z" fill="url(#${u}lf)"/><path d="M171 70C160 66 150 65 141 65M172 68C184 63 195 59 205 57" stroke="#eef5dc" stroke-width=".8" opacity=".55" fill="none"/>`;
    } else if (kind === 'paper') {
      defs += `<filter id="${u}e" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${s}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/></filter><linearGradient id="${u}f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".07"/><stop offset=".51" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>` + grad('bs','#5b5e5d','#212322');
      body = shadow(168,152,96,11,.24) + `<g filter="url(#${u}e)"><rect x="78" y="76" width="172" height="74" rx="2" fill="#ece5d6" transform="rotate(-6 164 113)"/><rect x="88" y="82" width="168" height="72" rx="2" fill="#f8f4ea" transform="rotate(3 172 118)"/></g><rect x="88" y="82" width="168" height="72" fill="url(#${u}f)" transform="rotate(3 172 118)"/>` + shadow(222,142,28,5,.48) + stone('bs',218,130,27,12,0,0,.06);
    } else {
      defs += grad('s1','#8f8c84','#55534d');
      body = sandPatch(160,130,170,54,[22,34,46,58,70,82],206,128) + `<g opacity=".5">${[96,108,152,164].map(y=>`<path d="M-10 ${y}C80 ${y-2} 240 ${y+2} 340 ${y}" stroke="#b9a98d" stroke-width="1.3" fill="none"/>`).join('')}</g>` + shadow(206,132,24,4,.32) + stone('s1',206,124,22,9,0,0,.08);
    }
    return `<svg class="db-art" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${defs}</defs>${body}</svg>`;
  }
  const smear = (i, o = {}) => `<i class="db-smear m${i % STROKES.length}" style="--x:${o.x||'4%'};--y:${o.y||'8%'};--w:${o.w||'84%'};--hh:${o.h||'58%'};--r:${o.r||'-5deg'};--bp:${o.bp||'50%'};--bs:${o.bs||'260%'}"></i>`;
  const SCENES = {stones:[0,{bp:'62%',y:'6%',r:'-7deg'}], water:[1,{bp:'12%',y:'14%',x:'10%',w:'80%',r:'4deg'}], soil:[2,{bp:'85%',y:'4%',h:'64%',r:'-2deg'}], paper:[0,{bp:'38%',y:'20%',x:'20%',w:'70%',h:'50%',r:'8deg'}], sand:[1,{bp:'70%',y:'6%',h:'46%',w:'70%',x:'26%',r:'-3deg'}]};
  const scene = k => { const [i,o] = SCENES[k] || SCENES.stones; return smear(i,o) + art(k); };
  const artFor = x => x.art || (x.type === 'artifact' ? 'paper' : /grow|learn|read|garden|outside|exhibit|museum|plant|walk/i.test(x.title + ' ' + x.body) ? 'soil' : /water|tea|bath|swim|sleep|morning|quiet|nothing/i.test(x.title + ' ' + x.body) ? 'water' : 'stones');
  const dateKey = d => new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
  const clock = d => new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d);
  const date = s => new Date(s + 'T12:00:00Z');
  const add = (s,n) => { const d = date(s); d.setUTCDate(d.getUTCDate()+n); return d.toISOString().slice(0,10); };
  const diff = (a,b) => Math.round((date(b)-date(a))/864e5);
  const label = (s,o) => new Intl.DateTimeFormat('en-US',{timeZone:'UTC',...o}).format(date(s));
  const time = s => { if(!s) return 'All day'; let [h,m] = s.split(':').map(Number); h %= 24; return `${h%12||12}${m?':'+String(m).padStart(2,'0'):''}${h>=12?'pm':'am'}`; };
  const span = x => x.start ? `${time(x.start)}${x.end?' to '+time(x.end):''}` : 'All day';
  const mins = s => s ? s.split(':').reduce((a,v,i)=>a+Number(v)*(i?1:60),0) : null;
  const hm = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  const dur = m => m >= 60 ? `${Math.floor(m/60)}h${m%60?' '+(m%60)+'m':''}` : `${m}m`;
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const hostDark = () => { const a = document.documentElement.dataset?.colorScheme; if (a) return a === 'dark'; const bg = getComputedStyle(document.documentElement).getPropertyValue('--kay-color-bg-base').trim(); if (/^#([0-9a-f]{6})/i.test(bg)) { const n = parseInt(bg.slice(1,7),16); return ((n>>16)*.3 + ((n>>8)&255)*.59 + (n&255)*.11) < 110; } return !!window.matchMedia?.('(prefers-color-scheme: dark)').matches; };
  // Text a person reads uses calendar times (7pm, 8:15pm, 12am), never 24-hour times like 19:00.
  function humanTimes(t){
    if (typeof t !== 'string') return t;
    return t.replace(/(^|[^\d:./])((?:[01]?\d|2[0-3])):([0-5]\d)(?!\d|:|\s?(?:am|pm|a\.m\.|p\.m\.)\b)/gi, (m, pre, hh, mm) => {
      const h = Number(hh); if (h > 0 && h < 12 && hh[0] !== '0') return m;
      return `${pre}${h % 12 || 12}${mm === '00' ? '' : ':' + mm}${h >= 12 ? 'pm' : 'am'}`;
    });
  }
  function humanizeData(d){
    if (!d || typeof d !== 'object') return d;
    for (const n of d.notes || []) { n.title = humanTimes(n.title); n.body = humanTimes(n.body); if (n.label) n.label = humanTimes(n.label); }
    for (const x of d.events || []) if (Array.isArray(x.context)) x.context.forEach(c => { if (c && typeof c.text === 'string') c.text = humanTimes(c.text); });
    for (const k of ['briefs', 'docs', 'artifacts']) { const b = d[k]; if (b && typeof b === 'object') for (const key of Object.keys(b)) { const v = b[key]; if (typeof v === 'string') b[key] = humanTimes(v); else if (v && typeof v === 'object') for (const f of ['title', 'dek', 'body', 'html']) if (typeof v[f] === 'string') v[f] = humanTimes(v[f]); } }
    return d;
  }
  function humanizePlans(list){ for (const p0 of list || []) { for (const f of ['title', 'reply', 'replyBody', 'note']) if (typeof p0[f] === 'string') p0[f] = humanTimes(p0[f]); for (const it of p0.items || []) { it.title = humanTimes(it.title); it.body = humanTimes(it.body); } } return list; }
  const isDark = () => prefs?.theme === 'dark' ? true : prefs?.theme === 'light' ? false : hostDark();
  const today = dateKey(new Date()), tomorrow = add(today,1);
  let data = humanizeData(bridge.initialData) || null, view = '3', page = {'3':0,'7':0,month:0}, hidden = new Set(), menu = false, accepted = new Set(), busy = false, origin = null, toastTimer, disposed = false, lastError = '', contextDraft = '', contextHint = '', flash = null, anim = 0, animating = false, wheelAcc = 0, wheelLock = false, wheelQuiet = 0, scrollRaf = 0;
  const style = document.createElement('style'); style.textContent = css; root.append(style);
  const shell = document.createElement('div'); shell.className = 'db'; root.append(shell);
  // ---- Sky: Collide's birds, kite and the seldom hot air balloon, redrawn in Daybook's palette ----
  const sky = document.createElement('div'); sky.className = 'db-sky'; sky.setAttribute('aria-hidden', 'true');
  if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
  root.append(sky);
  // ---- Sheet moss: a few realistic clumps, only at the corners and the far left edge of Today ----
  const mossLayer = document.createElement('div'); mossLayer.className = 'db-moss'; mossLayer.setAttribute('aria-hidden', 'true'); root.append(mossLayer);
  function mossSVG(seed, w, h, dark){
    let r = seed * 9301 + 49297; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    const S = n => (seed * 13 + n * 7) % 997 + 1;
    // A lobed outline: several overlapping mounds inside the clump's footprint.
    const n = 5 + Math.floor(rnd() * 3), blobs = [];
    for (let k = 0; k < n; k++) { const a = rnd() * Math.PI * 2, d = rnd() * 0.42; const rx = w * (0.16 + rnd() * 0.12), ry = h * (0.17 + rnd() * 0.13); blobs.push(`<ellipse cx="${(w / 2 + Math.cos(a) * d * w * 0.5).toFixed(1)}" cy="${(h / 2 + Math.sin(a) * d * h * 0.45).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}"/>`); }
    const tint = dark ? '0.26 0 0 0 0.11  0.28 0 0 0 0.15  0.14 0 0 0 0.07  0 0 0 0 1' : '0.36 0 0 0 0.18  0.37 0 0 0 0.23  0.19 0 0 0 0.10  0 0 0 0 1';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
  <filter id="m" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${(14 / Math.max(w, h)).toFixed(4)}" numOctaves="3" seed="${S(1)}" result="lump"/>
  <feDisplacementMap in="SourceGraphic" in2="lump" scale="${Math.round(Math.min(w, h) * 0.22)}" xChannelSelector="R" yChannelSelector="G" result="blob"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${S(2)}" result="fray"/>
  <feDisplacementMap in="blob" in2="fray" scale="4" xChannelSelector="R" yChannelSelector="G" result="shape"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.5 0.36" numOctaves="5" seed="${S(3)}" result="grain"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="${S(5)}" result="mottle"/>
  <feComposite in="grain" in2="mottle" operator="arithmetic" k2="0.72" k3="0.38" k4="-0.08" result="mixed"/>
  <feColorMatrix in="mixed" type="matrix" values="${tint}" result="tint"/>
  <feGaussianBlur in="shape" stdDeviation="${(Math.min(w, h) * 0.09).toFixed(1)}" result="dome"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="4" seed="${S(4)}" result="bump"/>
  <feComposite in="dome" in2="bump" operator="arithmetic" k2="1" k3="0.45" result="height"/>
  <feDiffuseLighting in="height" surfaceScale="6" diffuseConstant="1.1" lighting-color="${dark ? '#c4ceac' : '#f6f7e2'}" result="light"><feDistantLight azimuth="225" elevation="48"/></feDiffuseLighting>
  <feComposite in="tint" in2="light" operator="arithmetic" k1="1.45" k2="0.05" result="lit"/>
  <feComposite in="lit" in2="shape" operator="in" result="moss"/>
  <feGaussianBlur in="shape" stdDeviation="3" result="soft"/>
  <feOffset in="soft" dy="3" result="drop"/>
  <feColorMatrix in="drop" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.11  0 0 0 0 0.06  0 0 0 0.28 0" result="shadow"/>
  <feMerge><feMergeNode in="shadow"/><feMergeNode in="moss"/></feMerge>
  </filter></defs>
  <g fill="#000" filter="url(#m)">${blobs.join('')}</g></svg>`;
  }
  const MOSS_SPOTS = [
    {seed: 11, w: 150, h: 110, css: 'right:-50px;top:-46px', rot: 12},
    {seed: 7, w: 124, h: 86, css: 'right:-38px;bottom:-48px', rot: -10},
  ];
  // The left edge: one thin, continuous seam of sheet moss, drawn at the window's real height so the texture never stretches.
  function mossStripSVG(H, k, dark){
    const W = Math.round(48 * k), pts = [], seed = 31;
    let r = seed * 9301 + 49297; const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    const ph1 = rnd() * 6, ph2 = rnd() * 6;
    for (let y = 0; y <= H; y += 14) {
      const t = y / H, corner = Math.max(0, 1 - t / 0.09) ** 2 * 18 + Math.max(0, 1 - (1 - t) / 0.11) ** 2 * 22;
      const w = (8 + 3.2 * Math.sin(y / 96 + ph1) + 2.2 * Math.sin(y / 31 + ph2) + rnd() * 2 + corner) * k;
      pts.push(`${Math.max(3 * k, w).toFixed(1)},${y}`);
    }
    const tint = dark ? '0.26 0 0 0 0.11  0.28 0 0 0 0.15  0.14 0 0 0 0.07  0 0 0 0 1' : '0.36 0 0 0 0.18  0.37 0 0 0 0.23  0.19 0 0 0 0.10  0 0 0 0 1';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none"><defs>
<filter id="s" x="-20%" y="-2%" width="160%" height="104%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.03 0.012" numOctaves="3" seed="${seed}" result="lump"/>
<feDisplacementMap in="SourceGraphic" in2="lump" scale="${(9 * k).toFixed(1)}" xChannelSelector="R" yChannelSelector="G" result="blob"/>
<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${seed + 3}" result="fray"/>
<feDisplacementMap in="blob" in2="fray" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="shape"/>
<feTurbulence type="fractalNoise" baseFrequency="0.5 0.36" numOctaves="5" seed="${seed + 5}" result="grain"/>
<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="${seed + 7}" result="mottle"/>
<feComposite in="grain" in2="mottle" operator="arithmetic" k2="0.72" k3="0.38" k4="-0.08" result="mixed"/>
<feColorMatrix in="mixed" type="matrix" values="${tint}" result="tint"/>
<feGaussianBlur in="shape" stdDeviation="${(3 * k).toFixed(1)}" result="dome"/>
<feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" seed="${seed + 9}" result="bump"/>
<feComposite in="dome" in2="bump" operator="arithmetic" k2="1" k3="0.45" result="height"/>
<feDiffuseLighting in="height" surfaceScale="5" diffuseConstant="1.1" lighting-color="${dark ? '#c4ceac' : '#f6f7e2'}" result="light"><feDistantLight azimuth="225" elevation="48"/></feDiffuseLighting>
<feComposite in="tint" in2="light" operator="arithmetic" k1="1.45" k2="0.05" result="lit"/>
<feComposite in="lit" in2="shape" operator="in" result="moss"/>
<feGaussianBlur in="shape" stdDeviation="2" result="soft"/><feOffset in="soft" dx="2" dy="1" result="drop"/>
<feColorMatrix in="drop" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.11  0 0 0 0 0.06  0 0 0 0.24 0" result="shadow"/>
<feMerge><feMergeNode in="shadow"/><feMergeNode in="moss"/></feMerge></filter></defs>
<path d="M-12,-4 L${pts.join(' L')} L-12,${H + 4} Z" fill="#000" filter="url(#s)"/></svg>`;
  }
  let mossDark = null, mossH = 0, mossTimer = 0;
  function paintMoss(dark, force){
    const H = Math.round(mossLayer.clientHeight || root.clientHeight || 0);
    if (!force && mossDark === dark && mossLayer.childElementCount && Math.abs(H - mossH) < 24) return;
    mossDark = dark; mossH = H;
    const strip = H > 200 ? `<img class="db-moss-strip" alt="" src="data:image/svg+xml,${encodeURIComponent(mossStripSVG(H, scale, dark))}" style="left:0;top:0;bottom:0;width:${Math.round(48 * scale)}px;height:100%">` : '';
    mossLayer.innerHTML = strip + MOSS_SPOTS.map(m => `<img alt="" src="data:image/svg+xml,${encodeURIComponent(mossSVG(m.seed, m.w, m.h, dark))}" style="${m.css.replace(/(-?\d+)px/g, (x, n) => `calc(${n}px*var(--s,1))`)};width:calc(${m.w}px*var(--s,1));height:calc(${m.h}px*var(--s,1));transform:rotate(${m.rot}deg)">`).join('');
  }
  let scale = 1;
  function applyScale(){
    const r = shell.getBoundingClientRect(), w = r.width || innerWidth, h = r.height || innerHeight, raw = Math.min(w / 1240, h / 800);
    const next = Math.round(Math.max(1, Math.min(1.5, 1 + (raw - 1) * .85)) * 100) / 100;
    if (next === scale && shell.style.getPropertyValue('--s')) return false;
    scale = next; shell.style.setProperty('--s', String(next)); sky.style.setProperty('--s', String(next)); mossLayer.style.setProperty('--s', String(next)); return true;
  }
  applyScale();
  const rr = (a, b) => a + Math.random() * (b - a);
  const ink = w => `stroke="currentColor" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"`;
  function flocks(){
    const out = [], n = 2 + Math.floor(Math.random() * 2);
    for (let f = 0; f < n; f++) {
      const size = Math.random() < .4 ? 1 : 3 + Math.floor(Math.random() * 3), rtl = Math.random() < .5, dur = rr(38, 72), delay = -rr(0, dur), y = rr(4, 30), drift = rr(-8, 8), bw = rr(13, 19), x0 = rtl ? 106 : -6, x1 = x0 + (rtl ? -112 : 112);
      for (let l = 0; l < size; l++) {
        const back = l * bw * .9 * (rtl ? 1 : -1), up = l === 0 ? 0 : (l % 2 ? -1 : 1) * Math.ceil(l / 2) * bw * .55;
        out.push(`<svg class="db-bird" viewBox="0 0 26 14" style="--bx0:calc(${x0}% + ${back.toFixed(1)}px*var(--s,1));--bx1:calc(${x1}% + ${back.toFixed(1)}px*var(--s,1));--by0:calc(${y.toFixed(1)}% + ${up.toFixed(1)}px*var(--s,1));--by1:calc(${(y + drift).toFixed(1)}% + ${up.toFixed(1)}px*var(--s,1));--dur:${dur.toFixed(0)}s;--delay:${delay.toFixed(1)}s;--flap:${rr(.5, .85).toFixed(2)}s;--flapd:-${rr(0, .8).toFixed(2)}s;--bw:${bw.toFixed(1)}px"><path class="w1" d="M2 10 Q8 2 13 8 Q18 2 24 10"/><path class="w2" d="M2 6 Q8 10 13 7 Q18 10 24 6"/></svg>`);
      }
    }
    return out.join('');
  }
  const ENVELOPE = 'M40 6 C14 6 6 30 10 44 C14 58 28 66 40 66 C52 66 66 58 70 44 C74 30 66 6 40 6 Z';
  const balloonSvg = v => {
    const env = v === 0 ? `<path d="${ENVELOPE}" style="fill:var(--sky-clay)" ${ink(2.2)}/><path d="M40 6 C30 20 30 52 40 66" fill="none" ${ink(1.5)}/><path d="M40 6 C50 20 50 52 40 66" fill="none" ${ink(1.5)}/>`
      : v === 1 ? `<path d="${ENVELOPE}" style="fill:var(--sky-sage)" ${ink(2.2)}/><path d="M11 38 C24 46 56 46 69 38" fill="none" style="stroke:var(--sky-paper)" stroke-width="6"/><path d="M11 38 C24 46 56 46 69 38" fill="none" ${ink(1.5)}/>`
      : `<path d="${ENVELOPE}" style="fill:var(--sky-paper)" ${ink(2.2)}/><path d="M18 30 L26 38 L34 30 L42 38 L50 30 L58 38 L64 32" fill="none" style="stroke:var(--sky-clay)" stroke-width="3.2" stroke-linejoin="round"/><path d="M40 6 L40 -6 L54 -2 L40 4 Z" style="fill:var(--sky-ochre)" ${ink(1.5)}/>`;
    return `<svg class="db-balloon-svg" viewBox="-6 -10 92 118">${env}<path d="M28 64 L32 84 M52 64 L48 84 M40 66 L40 84" fill="none" ${ink(1.5)}/><path d="M31 84 h18 v14 h-18 Z" style="fill:var(--sky-paper)" ${ink(2.2)}/><path d="M31 91 h18" fill="none" ${ink(1.5)}/></svg>`;
  };
  const KITE = `<svg class="db-kite-svg" viewBox="0 0 80 124"><path d="M40 4 L72 34 L40 70 L8 34 Z" style="fill:var(--sky-sage)" ${ink(2.2)}/><path d="M40 4 L40 70 M8 34 L72 34" fill="none" ${ink(1.3)} opacity=".55"/><g class="db-kite-tail"><path d="M40 70 C30 82 50 92 40 104 C32 112 44 116 40 120" fill="none" ${ink(1.8)}/><path d="M33 84 l7 -3 M47 96 l-7 -3 M36 110 l7 -3" fill="none" style="stroke:var(--sky-clay)" stroke-width="2.6" stroke-linecap="round"/></g></svg>`;
  function drifter(kind){
    const ltr = Math.random() < .5, dur = rr(70, 100), w = kind === 'balloon' ? rr(42, 54) : rr(32, 42), top = kind === 'balloon' ? rr(5, 18) : rr(4, 16);
    const el = document.createElement('div'); el.className = `db-drifter db-${kind}`;
    el.style.cssText = `top:${top.toFixed(1)}%;width:calc(${w.toFixed(0)}px*var(--s,1));--bfrom:${ltr ? '-12%' : '112%'};--bto:${ltr ? '112%' : '-12%'};--dur:${dur.toFixed(0)}s`;
    el.innerHTML = kind === 'balloon' ? `<div class="db-balloon-bob">${balloonSvg(Math.floor(Math.random() * 3))}</div>` : `<div class="db-kite-bob">${KITE}</div>`;
    el.addEventListener('animationend', ev => { if (ev.target === el) el.remove(); });
    sky.append(el);
  }
  function maybeDrift(first){
    const now = Date.now(), get = k => { try { return +localStorage.getItem('daybook.sky.' + k) || 0; } catch { return now; } }, put = k => { try { localStorage.setItem('daybook.sky.' + k, String(now)); } catch {} };
    if (!sky.querySelector('.db-balloon') && now - get('balloon') > 8 * 6e4 && (first || Math.random() < .3)) { put('balloon'); drifter('balloon'); }
    else if (!sky.querySelector('.db-drifter') && now - get('kite') > 3 * 6e4 && Math.random() < (first ? .75 : .4)) { put('kite'); drifter('kite'); }
  }
  const calmSky = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let skyTimer = 0;
  if (!calmSky) { sky.innerHTML = flocks(); maybeDrift(true); skyTimer = setInterval(() => { if (!document.hidden) maybeDrift(false); }, 3 * 6e4); }
  const bubble = document.createElement('div'); bubble.className = 'db-bubble'; bubble.hidden = true; bubble.setAttribute('role','toolbar'); bubble.setAttribute('aria-label','Format text');
  bubble.innerHTML = [['bold','<b>B</b>','Bold'],['italic','<i style="font-family:Georgia,serif">i</i>','Italic'],['h2','H','Heading'],['quote','“','Quote'],['list','•','List']].map(([c,l,n])=>`<button type="button" data-format="${c}" aria-label="${n}">${l}</button>`).join('');
  const DOCS_KEY = 'daybook-docs'; let docs = {}; const stacks = {left:[], right:[]}, dirty = {left:false, right:false}, saveText = {left:'', right:''}, saveTimers = {}, returnFocus = {left:null, right:null};
  const cal = id => (data?.calendars||[]).find(c=>c.id===id) || {};
  const softHex = (hex, k = 0.84) => { const m = String(hex || '').trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let h = m[1]; if (h.length === 3) h = h.split('').map(c0 => c0 + c0).join(''); const n = parseInt(h, 16), base = [246, 243, 236]; const ch = i => Math.round(((n >> (16 - 8 * i)) & 255) * (1 - k) + base[i] * k); return '#' + [0, 1, 2].map(i => ch(i).toString(16).padStart(2, '0')).join(''); };
  const color = id => { const c = cal(id); const soft = c.color ? softHex(c.color) : null; if (soft) return soft; const i = (data?.calendars||[]).findIndex(x=>x.id===id); return palette[Math.max(0,i)%palette.length]; };
  const imported = x => cal(x.sourceId).kind === 'imported' || x.sourceId === 'partiful';
  const hold = x => /hold|tentative/i.test(x.status||'') || /^hold\b/i.test(x.title||'');
  const marker = x => x.kind === 'workingLocation' || (!x.start && /^(home|office|remote)$/i.test(x.title||''));
  const PREFS_KEY = 'daybook-prefs'; let prefs = {dismissed: [], hiddenEvents: [], theme: 'auto'}, undoFn = null;
  const isDismissed = id => prefs.dismissed.some(d => d.id === id);
  const isHiddenEv = id => prefs.hiddenEvents.some(d => d.id === id);
  async function loadPrefs(){ try { const v = bridge.loadPrefs ? await bridge.loadPrefs() : JSON.parse(localStorage.getItem(PREFS_KEY) || 'null'); if (v) { prefs = {dismissed: v.dismissed || [], hiddenEvents: v.hiddenEvents || [], theme: ['auto','light','dark'].includes(v.theme) ? v.theme : 'auto', owner: v.owner || '', onboarded: v.onboarded, hasSnapshot: v.hasSnapshot, setup: v.setup || {}, accepted: Array.isArray(v.accepted) ? v.accepted : []}; prefs.accepted.forEach(id => accepted.add(id)); } } catch {} }
  async function savePrefs(){ if (bridge.savePrefs) await bridge.savePrefs(prefs); else localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); }
  const visible = d => [...(data?.events||[]).filter(x=>x.date===d && !hidden.has(x.sourceId) && !isHiddenEv(x.id)), ...acceptedOn(d)];
  const morph = new Set(), saving = new Set();
  // A suggestion you accepted is an event now: a white card in its calendar's color, until the calendar's own copy arrives.
  function acceptedOn(d){
    const out = [];
    for (const id of accepted) {
      const n = findNote(id), sg = n && suggestionFor(n); if (!sg || sg.date !== d) continue;
      if ((data?.events||[]).some(x => x.date === d && x.start === sg.start && String(x.title).trim() === String(sg.title).trim())) continue;
      const c = (data?.calendars||[]).find(k => k.accountId === sg.accountId && (k.calendarId === sg.calendarId || (sg.calendarId === 'primary' && k.kind === 'primary'))) || writableCal();
      if (c.id && hidden.has(c.id)) continue;
      out.push({id: 'acc-' + id, noteId: id, title: sg.title, date: d, start: sg.start, end: sg.end, sourceId: c.id || '', accepted: true, location: n.address || ''});
    }
    return out;
  }
  let services = bridge.services || null, connecting = '', setupDismissed = false;
  const CAL = [['gcal','Google Calendar','Each Google account you add'],['microsoft.account','Outlook','Outlook calendar and mail together'],['apple-calendar.access','Apple Calendar','iCloud and anything else on this Mac']];
  const MAIL = [['gmail','Gmail','Context for meetings, from the same Google accounts'],['apple-mail.access','Apple Mail','Every account in the Mail app on this Mac']];
  const svc = id => (services||[]).find(x=>x.id===id);
  const anyCalendar = () => CAL.some(([id])=>svc(id)?.connected) || (!services && (data?.calendars||[]).length > 0);
  const needsSetup = () => !!services && !setupDismissed && !CAL.some(([id])=>svc(id)?.connected);
  function connectRow([id, name, hint]){
    const st = svc(id), on = st?.connected, busyNow = connecting === id, label = on ? (st.accounts?.length ? st.accounts.slice(0,2).join(', ') + (st.accounts.length > 2 ? ` and ${st.accounts.length - 2} more` : '') : 'Connected') : hint;
    if (st && st.available === false && !on) return '';
    return `<div class="db-option db-connect-row"><div><strong>${e(name)}</strong><p>${e(label)}</p></div>${on ? `<span class="db-accepted">${ic('check')}Connected</span>` : `<button class="db-accept" data-action="connect:${e(id)}" ${busyNow?'disabled':''}>${busyNow?'Opening…':`${ic('plus')}Connect`}</button>`}</div>`;
  }
  function setupView(){
    return `<section class="db-left" aria-label="Today · Set up"><div class="db-docwrap" data-side="left"><div class="db-docscroll"><article class="db-docpage db-setup"><p class="db-kicker">Welcome</p><h1 class="db-doc-title">Bring your days in.</h1><p class="db-doc-dek">Connect the calendars you already use. Today keeps them in one quiet view, and your agent prepares what is coming.</p><div class="db-hero">${scene('stones')}</div><h2 class="db-setup-h">Calendars</h2><div class="db-options">${CAL.map(connectRow).join('')}</div><h2 class="db-setup-h">Email, for context</h2><p class="db-doc-hint" style="margin:-4px 0 12px">Optional. Your agent reads related mail to prepare meetings. Nothing is sent.</p><div class="db-options">${MAIL.map(connectRow).join('')}</div><div class="db-doc-actions">${anyCalendar()?`<button class="db-pill" data-action="setup-done">${ic('check')}Show my calendar</button>`:''}<button class="db-restore" data-action="setup-skip">Not now</button></div><p class="db-doc-foot">Connections are Bonsai's own sign-in, the same as App Store → Installed. Today never sends mail or invites anyone. It only adds a private block to your calendar when you press Accept.</p></article></div></div></section>`;
  }
  // ---- Onboarding: Bonsai's welcome, then four short steps (calendars, email, interests, look) ----
  const MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.25" y="4.75" width="17.5" height="16" rx="3.5"/><path d="M8 3v3.5M16 3v3.5"/><path d="M9.1 17.6h5.8c.9 0 1.6-.5 1.6-1.15s-.7-1.15-1.6-1.15H9.1c-.9 0-1.6.5-1.6 1.15s.7 1.15 1.6 1.15Z"/><path d="M10.2 15.1h3.6c.7 0 1.2-.42 1.2-.95s-.5-.95-1.2-.95h-3.6c-.7 0-1.2.42-1.2.95s.5.95 1.2.95Z"/><path d="M11.3 12.9h1.4c.45 0 .8-.32.8-.7s-.35-.7-.8-.7h-1.4c-.45 0-.8.32-.8.7s.35.7.8.7Z"/></svg>';
  const person = bridge.person || null;
  const firstName = () => String(person?.firstName || '').trim();
  const OB_STEPS = ['welcome', 'calendars', 'mail', 'you', 'look', 'ready'];
  const OB_TOPICS = ['Reading', 'Museums', 'Live music', 'Running', 'Yoga', 'Long walks', 'Cooking', 'Coffee spots', 'Art', 'Film'];
  const OB_LEDE = 'I’m Today. I keep your calendars in one calm view and prepare what’s coming.';
  const OB_POINTS = [['cal', 'Today, in focus', 'Every calendar on one quiet timeline, with only what matters next.'], ['spark', 'The days ahead, prepared', 'Briefs before meetings, open time found, small ideas for rest.'], ['shield', 'Nothing goes out for you', 'Accept adds a private block. No one is invited, and nothing is sent.']];
  const OB_READY = ['Reading your calendars', 'Checking each account', 'Looking for related mail', 'Preparing your notes'];
  let ob = null, obTimer = 0, obTickTimer = 0, demoData = null, booted = false;
  const PREVIEW_SERVICES = () => [...CAL, ...MAIL].map(([id]) => ({id, available: true, connected: false, accounts: []}));
  let newer = '';
  const vnum = v => String(v || '').split('.').map(n => parseInt(n, 10) || 0);
  const isNewer = (a0, b0) => { const x = vnum(a0), y = vnum(b0); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
  async function checkLatest(){ try { const v = bridge.latest ? await bridge.latest() : ''; if (v && bridge.version && isNewer(v, bridge.version)) { newer = v; render({only: 'left'}); } } catch {} }
  const SETUP_STEPS = ['calendars', 'mail', 'you', 'look'];
  const setupLeft = () => SETUP_STEPS.filter(k => prefs.setup?.[k] !== 'done');
  function resumeSetup(){ beginOnboarding(); ob.step = 'calendars'; ob.resume = true; render(); }
  function beginOnboarding(){ ob = {step: 'welcome', shown: '', typed: false, picks: new Set(interests.topics || []), book: '', readyAt: 0}; menu = false; stacks.left.length = 0; stacks.right.length = 0; }
  function obRow([id, name, hint], k){
    const st = svc(id), on = !!st?.connected, busyNow = connecting === id;
    if (st && st.available === false && !on) return '';
    const who = on && st.accounts?.length ? st.accounts.slice(0, 2).join(', ') + (st.accounts.length > 2 ? ` and ${st.accounts.length - 2} more` : '') : '';
    return `<div class="db-ob-row ${on ? 'on' : ''}" data-beat="3" style="--d:${k}"><div><strong>${e(name)}</strong><span>${e(on ? (who || 'Connected') : hint)}</span></div>${on ? `<span class="db-ob-done">${ic('check')}Connected</span>` : `<button class="db-ob-connect" data-action="connect:${e(id)}" ${busyNow ? 'disabled' : ''}>${busyNow ? 'Opening…' : 'Connect'}</button>`}</div>`;
  }
  function onboardView(still){
    const st = ob.step, idx = OB_STEPS.indexOf(st), cal = anyCalendar();
    const head = (k, t, l) => `<p class="db-ob-kicker" data-beat="0">${k}</p><h1 class="db-ob-title" data-beat="1">${t}</h1><p class="db-ob-lede" data-beat="2">${l}</p>`;
    const next = (label, dis, act = 'ob-next') => `<button class="db-ob-cta" data-action="${act}" ${dis ? 'disabled' : ''}>${label}<span class="db-ob-arr" aria-hidden="true">→</span></button>`;
    const back = '<button class="db-ob-link" data-action="ob-back">Back</button>';
    let body = '';
    if (st === 'welcome') body = `<div class="db-ob-head"><span class="db-ob-mark" data-beat="0">${MARK}</span><h1 class="db-ob-title" data-beat="1">${firstName() ? `Nice to meet you, ${e(firstName())}.` : 'Nice to meet you.'}</h1><p class="db-ob-lede db-ob-type" data-beat="2" data-type="${e(OB_LEDE)}">${ob.typed ? e(OB_LEDE) : ''}</p></div><ul class="db-ob-points">${OB_POINTS.map(([i, t, l], k) => `<li class="db-ob-point" data-beat="3" style="--d:${k}"><span class="db-ob-band" style="background-position:${['6% 40%', '50% 62%', '94% 30%'][k]}"></span><span class="db-ob-icon">${ic(i)}</span><span class="db-ob-point-body"><strong>${t}</strong><span>${l}</span></span></li>`).join('')}</ul><div class="db-ob-cta-row" data-beat="4">${next('Let’s go')}</div>`;
    else if (st === 'calendars') body = head('Step 1 of 4', 'Bring your days in.', 'Connect the calendars you already use. Each account stays yours, and you can add more later.') + `<div class="db-ob-rows">${CAL.map(obRow).join('')}</div><div class="db-ob-cta-row" data-beat="4">${next('Continue', !cal)}${cal ? '' : '<button class="db-ob-link" data-action="ob-skip">Not now</button>'}${back}</div>`;
    else if (st === 'mail') body = head('Step 2 of 4', 'Add email, for context.', 'Optional. Your agent reads related mail to prepare your meetings. It never sends anything.') + `<div class="db-ob-rows">${MAIL.map(obRow).join('')}</div><div class="db-ob-cta-row" data-beat="4">${next('Continue')}<button class="db-ob-link" data-action="ob-skip">Skip</button>${back}</div>`;
    else if (st === 'you') body = head('Step 3 of 4', 'What fills your free time?', 'Pick a few. When your calendar has room, Today suggests something quiet that fits.') + `<div class="db-ob-chips" data-beat="3">${OB_TOPICS.map(t => `<button class="db-ob-chip" data-action="ob-chip:${e(t)}" aria-pressed="${ob.picks.has(t)}">${e(t)}</button>`).join('')}</div><label class="db-ob-field" data-beat="3" style="--d:1"><span>A book you’re reading</span><input name="ob-book" value="${e(ob.book)}" placeholder="Optional" autocomplete="off" maxlength="160"></label><div class="db-ob-cta-row" data-beat="4">${next('Continue')}<button class="db-ob-link" data-action="ob-skip">Skip</button>${back}</div>`;
    else if (st === 'look') body = head('Step 4 of 4', 'Pick a look.', 'Change it any time with the moon at the top of Today.') + `<div class="db-ob-looks">${[['auto', 'Match Bonsai'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l], k) => `<button class="db-ob-look" data-action="ob-look:${v}" aria-pressed="${(prefs.theme || 'auto') === v}" data-beat="3" style="--d:${k}"><span class="db-ob-mini ${v}"><i></i><i></i><i></i><i></i></span><strong>${l}</strong></button>`).join('')}</div><div class="db-ob-cta-row" data-beat="4">${next('Continue')}${back}</div>`;
    else body = head('All set', data && cal ? 'You’re all set.' : cal ? 'Your first look is on its way.' : 'You’re in.', data && cal ? `Today is ready with your calendars.${setupLeft().length ? ' You can finish the rest any time from Today.' : ''}` : cal ? 'I’m reading your calendars and preparing your notes. The first time takes a minute or two, and you can open Today while it works.' : 'Connect a calendar any time from the card in Today.') + (cal ? `<ul class="db-ob-steps" data-beat="3">${OB_READY.map(t => `<li><i aria-hidden="true">${ic('check')}</i>${t}</li>`).join('')}</ul>` : '') + `<div class="db-ob-cta-row" data-beat="4">${next('Open Today', false, 'ob-finish')}</div>`;
    const progress = st !== 'welcome' && st !== 'ready' ? `<div class="db-ob-progress" aria-label="Step ${idx} of 4">${[1, 2, 3, 4].map(n => `<i class="${n <= idx ? 'on' : ''}"></i>`).join('')}</div>` : '<span></span>';
    return `<section class="db-ob ${still ? 'still' : ''} ${ob.typed || st !== 'welcome' ? 'lifted' : ''}" data-step="${st}" aria-label="Welcome to Today"><div class="db-ob-top"><span class="db-ob-mark small">${st === 'welcome' ? '' : MARK}</span>${progress}<span></span></div><div class="db-ob-stage"><div class="db-ob-col">${body}</div></div></section>`;
  }
  function afterOnboardRender(){
    if (ob.step === 'welcome' && !ob.typed) typeLede();
    if (ob.step === 'ready') obTick();
    if (ob.step === 'you') shell.querySelector('[name="ob-book"]')?.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); obNext(); } });
    shell.querySelector('.db-ob-cta:not([disabled])')?.focus({preventScroll: true});
  }
  function typeLede(){
    const el = shell.querySelector('.db-ob-type'); if (!el) return;
    const text = el.dataset.type;
    const done = () => { ob.typed = true; el.textContent = text; shell.querySelector('.db-ob')?.classList.add('lifted'); };
    if (bridge.fast || reduced()) { done(); return; }
    el.innerHTML = '<span></span><i class="db-ob-caret"></i>'; const out = el.firstChild; let i = 0;
    clearTimeout(obTimer);
    const step = () => { if (!ob || ob.step !== 'welcome' || !out.isConnected) return; i++; out.textContent = text.slice(0, i); if (i >= text.length) { ob.typed = true; obTimer = setTimeout(() => { el.querySelector('.db-ob-caret')?.remove(); shell.querySelector('.db-ob')?.classList.add('lifted'); }, 280); return; } obTimer = setTimeout(step, text[i - 1] === ' ' ? 48 : 24); };
    obTimer = setTimeout(step, 700);
  }
  function obGo(step){
    clearTimeout(obTimer);
    const col = shell.querySelector('.db-ob-col');
    const swap = () => { if (!ob) return; ob.step = step; render(); if (step === 'ready') obReady(); };
    if (col && !reduced() && !bridge.fast) { col.classList.add('leaving'); setTimeout(swap, 240); } else swap();
  }
  function obNext(skip){
    if (!ob) return;
    const st = ob.step;
    if (SETUP_STEPS.includes(st) && !(st === 'calendars' && !skip && !anyCalendar())) { prefs.setup = {...(prefs.setup || {}), [st]: skip ? 'skipped' : 'done'}; savePrefs().catch(() => {}); }
    if (st === 'calendars' && !skip && !anyCalendar()) return;
    if (st === 'calendars' && anyCalendar() && !data && !busy && bridge.load) refresh();
    if (st === 'you' && !skip) {
      const book = ob.book.trim();
      interests.topics = [...new Set([...(interests.topics || []), ...ob.picks])];
      if (book && !(interests.reading || []).some(r => String(r).toLowerCase() === book.toLowerCase())) interests.reading = [...(interests.reading || []), book];
      saveInterests().catch(() => {});
    }
    obGo(OB_STEPS[Math.min(OB_STEPS.length - 1, OB_STEPS.indexOf(st) + 1)]);
  }
  function obBack(){ if (ob) obGo(OB_STEPS[Math.max(0, OB_STEPS.indexOf(ob.step) - 1)]); }
  function obReady(){
    ob.readyAt = Date.now();
    if (!bridge.load && demoData && anyCalendar()) setTimeout(() => { if (!disposed && !data) { data = demoData; demoData = null; } }, bridge.fast ? 150 : 3600);
    else if (anyCalendar() && !data && !busy) refresh();
    clearInterval(obTickTimer); obTickTimer = setInterval(obTick, 400);
  }
  function obTick(){
    if (!ob || ob.step !== 'ready') { clearInterval(obTickTimer); return; }
    const list = [...shell.querySelectorAll('.db-ob-steps li')]; if (!list.length) return;
    const per = bridge.load ? 2600 : 860, n = data ? list.length : Math.min(list.length - 1, Math.floor((Date.now() - (ob.readyAt || Date.now())) / per));
    list.forEach((li, k) => { li.classList.toggle('done', k < n); li.classList.toggle('now', k === n && !data); });
    if (data) clearInterval(obTickTimer);
  }
  function obFinish(){
    clearInterval(obTickTimer); clearTimeout(obTimer);
    prefs.onboarded = true; if (person?.id) prefs.owner = person.id; savePrefs().catch(() => {});
    ob = null;
    if (!data && demoData) { data = demoData; demoData = null; }
    if (!data && anyCalendar() && !busy) refresh();
    render({cascade: true});
  }
  function setTheme(t){
    if (!['auto', 'light', 'dark'].includes(t)) return;
    prefs.theme = t; savePrefs().catch(() => {});
    shell.classList.add('db-theming'); applyTheme(); setTimeout(() => shell.classList.remove('db-theming'), 750);
    const d = isDark();
    shell.querySelectorAll('[data-action="theme-toggle"]').forEach(b => { b.innerHTML = ic(d ? 'sun' : 'moon'); b.setAttribute('aria-pressed', String(d)); b.setAttribute('aria-label', d ? 'Light mode' : 'Dark mode'); b.title = d ? 'Light mode' : 'Dark mode'; });
    shell.querySelectorAll('[data-action^="theme:"],[data-action^="ob-look:"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.action.split(':')[1] === t)));
  }
  function applyTheme(){
    const d = isDark(); shell.classList.toggle('dark', d); sky.classList.toggle('dark', d); paintMoss(d);
    if (bridge.textures) { const tx = d ? bridge.textures.dark : bridge.textures.light; shell.style.setProperty('--db-band', `url("${tx.band}")`); shell.style.setProperty('--db-band-soft', `url("${tx.soft}")`); }
  }
  function startOverClick(btn){
    if (!btn.dataset.confirm) { btn.dataset.confirm = '1'; btn.textContent = 'Clear this app and start over?'; btn.classList.add('armed'); setTimeout(() => { if (btn.isConnected) { delete btn.dataset.confirm; btn.textContent = 'Start over as a new user'; btn.classList.remove('armed'); } }, 4000); return; }
    startOver();
  }
  async function startOver(){
    try { if (bridge.resetApp) await bridge.resetApp(); } catch (err) { showToast(err.message || 'The app could not be cleared.'); return; }
    if (!bridge.resetApp) { try { Object.keys(localStorage).filter(k => k.startsWith('daybook-')).forEach(k => localStorage.removeItem(k)); } catch {} }
    prefs = {dismissed: [], hiddenEvents: [], theme: 'auto', onboarded: false, owner: person?.id || '', setup: {}, accepted: []};
    interests = {reading: [], topics: [], near: ''}; docs = {}; plans = []; people = []; accepted.clear(); hidden.clear(); ideaCache = []; ideaKey = '';
    if (!bridge.load) { demoData = demoData || data; services = PREVIEW_SERVICES(); }
    data = null; lastError = ''; setupDismissed = false;
    await savePrefs().catch(() => {});
    beginOnboarding(); render();
  }
  async function connect(id){
    if (!bridge.connect) {
      if (ob && services) { connecting = id; render(); await sleep(bridge.fast ? 40 : 1100); const sv = svc(id); if (sv) { sv.connected = true; sv.accounts = ['you@example.com']; } connecting = ''; render(); showToast('Connected in this preview.'); return; }
      showToast('Connecting works in the installed app.'); return;
    }
    connecting = id; render({only:'left'});
    const res = await bridge.connect(id);
    connecting = '';
    if (res?.ok) { showToast(`${res.displayName || 'Connected'}${res.accountLabel ? ' · ' + res.accountLabel : ''}`); if (!data || needsSetup()) refresh(); }
    else if (res && !res.cancelled) showToast(res.reason || 'The sign-in did not finish.');
    render();
  }
  const allNotes = () => [...(data?.notes||[]), ...localIdeas(), ...planList()].filter(n => !isDismissed(n.id));
  const notesOn = d => allNotes().filter(x=>x.date===d && !accepted.has(x.id) && !(x.sourceId && hidden.has(x.sourceId)));
  const INTEREST_KEY = 'daybook-interests'; let interests = {reading:[], topics:[], near:''}, ideaCache = [], ideaKey = '';
  async function loadInterests(){ try { const v = bridge.loadInterests ? await bridge.loadInterests() : JSON.parse(localStorage.getItem(INTEREST_KEY) || 'null'); if (v) interests = {reading:v.reading||[], topics:v.topics||[], near:v.near||''}; } catch {} ideaKey = ''; }
  async function saveInterests(){ ideaKey = ''; if (bridge.saveInterests) await bridge.saveInterests(interests); else localStorage.setItem(INTEREST_KEY, JSON.stringify(interests)); }
  function localIdeas(){
    const planned = (data?.notes||[]).filter(n=>n.type==='idea' && n.ideaKind==='read').map(n=>n.title.toLowerCase());
    const books = (interests.reading||[]).filter(b=>!planned.some(t=>t.includes(b.toLowerCase()))).slice(0,3); if (!books.length || !data) return [];
    const key = books.join('|') + (data.fetchedAt||'') + [...hidden].join(','); if (key === ideaKey) return ideaCache; ideaKey = key;
    const out = [], nowMin = mins(clock(new Date()));
    for (let k = 0; k < 5 && out.length < 3; k++) {
      const d = add(today, k);
      const evs = (data.events||[]).filter(x=>x.date===d && x.start && !hidden.has(x.sourceId) && !imported(x)).map(x=>({s:mins(x.start), e:Math.max(mins(x.end)??mins(x.start)+60, mins(x.start)+20)}));
      const from = k === 0 ? Math.max(nowMin + 15, 600) : 600, gaps = openGaps(evs, from, 1290).filter(([a,b]) => b - a >= 60);
      if (!gaps.length) continue;
      const [a,b] = gaps.sort((p,q)=>(q[1]-q[0])-(p[1]-p[0]))[0], start = Math.ceil((a + 10)/15)*15;
      if (b - start < 30) continue;
      const book = books[out.length % books.length];
      out.push({id:`read-${d}`, date:d, time:hm(start), type:'idea', ideaKind:'read', local:true, title:`Read ${book}`, body:`${dur(b-a)} free from ${time(hm(a))}. Thirty quiet pages is plenty.`});
    }
    return (ideaCache = out);
  }
  const rangeEnd = () => data?.coverage?.rangeEnd || add(today,30);
  const rel = d => d===today ? 'Today' : d===tomorrow ? 'Tomorrow' : label(d,{weekday:'long'});
  const cls = x => [imported(x)?'imported':'', hold(x)?'hold':'', x.context?.length?'ctx':''].join(' ');
  const showToast = (text, undo) => { if (/is not authorized for plugin|has not granted it/i.test(String(text))) text = 'Today needs permission to run your agent. In App Store, open Installed, then Today, and allow it under Permissions.'; shell.querySelector('.db-toast')?.remove(); undoFn = undo || null; const t = document.createElement('div'); t.className='db-toast'; t.setAttribute('role','status'); t.textContent=text; if (undo) { const b = document.createElement('button'); b.className = 'db-undo'; b.dataset.action = 'undo'; b.textContent = 'Undo'; t.append(b); } shell.append(t); clearTimeout(toastTimer); toastTimer=setTimeout(()=>{ t.remove(); undoFn = null; }, undo ? 6500 : 4200); };
  function dayItems(d){
    const ev = visible(d), nn = notesOn(d);
    const markers = ev.filter(marker), allDay = ev.filter(x=>!x.start && !marker(x));
    const timed = [...ev.filter(x=>x.start).map(x=>({kind:'event',x,at:mins(x.start)})), ...nn.map(x=>({kind:x.type,x,at:mins(x.time)??720}))].sort((a,b)=>a.at-b.at);
    return {markers, allDay, timed};
  }
  // The 3-day and week views are one strip of days, a week back through the loaded range; each step is one day.
  const STRIP_PAD = 36, stripStart = add(today, -7);
  const strip = v => v !== 'month';
  const dayIndex = d => diff(stripStart, d);
  const before = v => v === 'month' ? 0 : dayIndex(tomorrow);
  page['3'] = before('3'); page['7'] = before('7');
  const pageCount = v => { if (v==='month') { const a = date(today), b = date(rangeEnd()); return Math.max(1,(b.getUTCFullYear()-a.getUTCFullYear())*12 + b.getUTCMonth()-a.getUTCMonth()+1); } return Math.max(1, dayIndex(rangeEnd()) + 1 - Number(v) + 1); };
  const stepW = () => { const pg = shell.querySelector('.db-pager'), w = pg?.clientWidth || 1; return strip(view) ? (w - STRIP_PAD * scale * 2) / Number(view) : w; };
  const visibleCol = day => { const c = shell.querySelector(`.db-right .db-col[data-day="${day}"]`); return c && !c.inert ? c : null; };
  const monthStart = i => { const d = date(today); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth()+i); return d.toISOString().slice(0,10); };
  const pageStart = (v,i) => v==='month' ? monthStart(i) : add(stripStart, i);
  const isBack = (v,i) => v !== 'month' && pageStart(v,i) < today;
  const rangeLabel = (v,i) => { if (v==='month') return label(monthStart(i),{month:'long',year:'numeric'}); const a = pageStart(v,i), b = add(a,Number(v)-1); const same = a.slice(0,7)===b.slice(0,7); return `${label(a,{month:'short',day:'numeric'})} to ${same?label(b,{day:'numeric'}):label(b,{month:'short',day:'numeric'})}`; };
  function suggestionFor(x){
    if (x.suggestion) return x.suggestion;
    if (!x.time || !x.date) return null;
    const c = (data?.calendars||[]).find(k=>k.writable && k.kind==='primary') || {}, start = mins(x.time);
    return {title:x.title, date:x.date, start:x.time, end:hm(start + (x.ideaKind==='read' ? 45 : 60)), accountId:c.accountId||'', calendarId:c.calendarId||'primary', provider:c.provider||'gcal'};
  }
  const acceptBtn = (x, cls = 'db-accept') => { if (x.summary || x.type === 'reply') return ''; const sg = suggestionFor(x); if (!sg) return ''; return accepted.has(x.id) ? `<span class="db-accepted">${ic('check')}Accepted</span>` : `<button class="${cls}" data-action="accept:${e(x.id)}" aria-label="Accept: ${e(x.title)}, ${time(sg.start)} to ${time(sg.end)}">${ic('check')}Accept</button>`; };
  // ---- Motion: cascades, the agent cursor, working states and loading ----
  const FAST = !!bridge.fast;
  const pace = ms => FAST ? Math.min(25, ms * 0.04) : ms;
  const sleep = ms => new Promise(res => setTimeout(res, pace(ms)));
  let working = '', fresh = new Set(), loadStep = 0, loadTimer = 0;
  const agent = document.createElement('div'); agent.className = 'db-agent'; agent.setAttribute('aria-hidden', 'true');
  agent.innerHTML = '<i class="db-agent-halo"></i><svg viewBox="0 0 24 24"><path d="M5.2 3.6 18.6 11.4 12.4 13 9.6 19.2Z"/></svg><span>Bonsai</span>';
  function agentAt(el, fx = 0.5, fy = 0.5, instant = false){
    if (!el || !shell.contains(el)) return;
    if (agent.parentNode !== shell) shell.append(agent);
    const s = shell.getBoundingClientRect(), r = el.getBoundingClientRect(), x = r.left - s.left + fx * r.width, y = r.top - s.top + fy * r.height;
    if (instant) { agent.style.transition = 'none'; agent.style.transform = `translate3d(${x}px,${y}px,0)`; void agent.offsetWidth; agent.style.transition = ''; }
    else agent.style.transform = `translate3d(${x}px,${y}px,0)`;
    agent.classList.add('on');
  }
  function agentTap(){ agent.classList.remove('tap'); void agent.offsetWidth; agent.classList.add('tap'); }
  function agentOff(){ agent.classList.remove('on'); }
  function scanCol(day){ const col = visibleCol(day) || shell.querySelector(`.db-page[aria-hidden="false"] .db-col[data-day="${day}"]`); if (!col) return null; col.classList.remove('db-scan'); void col.offsetWidth; col.classList.add('db-scan'); return col; }
  function setWorking(text){ working = text; const f = shell.querySelector('form.db-context'); if (!f) return; f.classList.toggle('working', !!text); const i = f.querySelector('input'); if (i) { i.disabled = !!text; i.placeholder = text || 'Ask for something, like a museum Saturday afternoon…'; } }
  // Staggered settling: diagonal across columns, top to bottom in each.
  function cascade(scope){
    if (reduced() || !scope) return;
    const run = (el, ms) => { el.style.setProperty('--d', ms + 'ms'); el.classList.remove('db-rise'); void el.offsetWidth; el.classList.add('db-rise'); };
    scope.querySelectorAll('.db-left .db-te, .db-left .db-open, .db-left .db-note, .db-left .db-plinth').forEach((el, i) => run(el, 60 + i * 55));
    const pg = scope.querySelector('.db-page[aria-hidden="false"]');
    if (pg) {
      pg.querySelectorAll('.db-col:not([inert])').forEach((col, c) => { const head = col.querySelector('.db-col-head'); if (head) run(head, c * 70); col.querySelectorAll('.db-col-body > :not(.db-slotwrap)').forEach((el, i) => run(el, 90 + c * 70 + i * 60)); });
      pg.querySelectorAll('.db-cell').forEach((el, i) => run(el, (Math.floor(i / 7) + (i % 7)) * 22));
    }
  }
  function loadingView(){
    const steps = ['Reading your calendars', 'Checking each account', 'Looking for related mail', 'Preparing your notes'];
    const sk = (w, h, extra = '') => `<i class="db-sk" style="width:${w};height:${h}px;${extra}"></i>`;
    const col = n => `<div class="db-sk-col">${sk('42%', 26)}${Array.from({length: n}, (_, i) => sk('100%', 58 + (i % 2) * 24, 'border-radius:12px')).join('')}</div>`;
    return `<section class="db-left db-loading" aria-label="Today" aria-busy="true"><header class="db-head"><p class="db-eyebrow">${label(today,{weekday:'long'})} · ${label(today,{month:'long',day:'numeric',year:'numeric'})}</p><h1 class="db-title">Today</h1><p class="db-sub"><span class="db-step" aria-live="polite">${steps[loadStep % steps.length]}<em class="db-dots"><b></b><b></b><b></b></em></span></p></header><div class="db-sk-today">${sk('40%', 54, 'border-radius:12px')}${sk('40%', 90, 'border-radius:12px')}${sk('40%', 54, 'border-radius:12px')}<div class="db-sk-notes">${sk('80%', 14)}${sk('95%', 10)}${sk('70%', 10)}</div></div></section><section class="db-right db-loading" aria-label="Looking ahead" aria-busy="true"><header class="db-head"><p class="db-eyebrow">Plan gently</p><h2 class="db-title">Looking ahead</h2></header><div class="db-sk-cols">${col(3)}${col(2)}${col(3)}</div></section>`;
  }
  function startLoading(){ clearInterval(loadTimer); loadTimer = setInterval(() => { loadStep++; const el = shell.querySelector('.db-step'); if (!el) { clearInterval(loadTimer); return; } el.classList.remove('db-step-in'); void el.offsetWidth; el.classList.add('db-step-in'); el.firstChild.textContent = ['Reading your calendars', 'Checking each account', 'Looking for related mail', 'Preparing your notes'][loadStep % 4]; }, 1700); }
  const PLAN_KEY = 'daybook-plans'; let plans = [], pendingRange = null, planPoll = 0;
  const MOVE = /\b(work ?outs?|exercis\w*|stretch\w*|yoga|gym|run(ning)?|jog\w*|swim\w*|pilates|lift\w*|move more|walk more)\b/i;
  const MUSEUM = /\b(museums?|galler(y|ies)|exhibit\w*|art)\b/i, FOOD = /\b(restaurants?|dinner|lunch|brunch|breakfast|food|eat|coffee|caf[eé]|bar|drinks?)\b/i;
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const WORDS = ['No','One','Two','Three','Four','Five','Six'];
  const plainText = html => String(html||'').replace(/<h2>.*?<\/h2>/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
  const findNote = id => allNotes().find(n=>n.id===id) || plans.flatMap(p=>p.items||[]).find(n=>n.id===id);
  async function loadPlans(){ try { const v = bridge.loadPlans ? await bridge.loadPlans() : JSON.parse(localStorage.getItem(PLAN_KEY) || '[]'); if (Array.isArray(v)) plans = humanizePlans(v); } catch {} }
  async function savePlans(){ if (bridge.savePlans) await bridge.savePlans(plans); else localStorage.setItem(PLAN_KEY, JSON.stringify(plans)); }
  function schedulePoll(){
    clearInterval(planPoll);
    if (!bridge.loadPlans || !plans.some(p=>p.status==='researching')) return;
    planPoll = setInterval(async () => {
      const was = plans.map(p=>p.id+p.status).join();
      await loadPlans();
      if (plans.map(p=>p.id+p.status).join() === was) return;
      render(); const done = plans.find(p=>p.kind==='research' && p.status==='ready' && !p.seen);
      if (done) { done.seen = true; fresh.add(`plan-${done.id}`); fresh.add(`reply-${done.id}`); render(); fresh.delete(`plan-${done.id}`); fresh.delete(`reply-${done.id}`); if (!stacks.right.length) setTimeout(() => openDoc('right', {kind:'plan', id:done.id}), 900); showToast(`Options are ready · ${done.title}`); }
      if (!plans.some(p=>p.status==='researching')) clearInterval(planPoll);
    }, 45000);
  }
  function writableCal(){ return (data?.calendars||[]).find(k=>k.writable && k.kind==='primary') || {}; }
  function blockFor(title, date, start, len, pref){ const c = (pref && pref.writable) ? pref : writableCal(); return {title, date, start:hm(start), end:hm(start+len), accountId:c.accountId||'', calendarId:c.calendarId||'primary', provider:c.provider||'gcal'}; }
  function gapsIn(evs, from, to, min){
    const out = []; let cur = from;
    for (const v of evs.slice().sort((p,q)=>p.s-q.s)) { if (v.e <= cur) continue; if (v.s - cur >= min) out.push([cur, Math.min(v.s, to)]); cur = Math.max(cur, v.e); if (cur >= to) break; }
    if (to - cur >= min) out.push([cur, to]);
    return out.filter(([a,b]) => b - a >= min);
  }
  const busyOn = (d, pad = 0) => (data.events||[]).filter(x=>x.date===d && x.start && !imported(x)).map(x=>({s:mins(x.start)-pad, e:Math.max(mins(x.end)??mins(x.start)+60, mins(x.start)+20)+pad}));
  function planList(){
    const out = [];
    for (const p of plans) {
      out.push({id:`reply-${p.id}`, planId:p.id, type:'reply', working: p.status==='working'||p.status==='researching', date:p.day||today, time:p.at||'12:00', title:p.reply||p.title, body:p.replyBody||''});
      if (p.kind !== 'research') out.push(...(p.items||[]));
      else if (p.range) out.push({id:`plan-${p.id}`, planId:p.id, summary:true, working: p.status==='researching', type:'idea', ideaKind:'place', date:p.range.date, time:p.range.start, title: p.status==='ready' ? `${WORDS[(p.items||[]).length]||(p.items||[]).length} ${p.noun} to choose from` : p.status==='failed' ? 'The research did not finish' : `Looking into ${p.noun}`, body: p.status==='ready' ? `${p.anchorLabel?'Near '+p.anchorLabel+'. ':''}Pick one, or keep the time open.` : p.status==='failed' ? (p.error||'Try again later.') : 'A deeper look is underway. Options will appear here.'});
    }
    return out;
  }
  const durLabel = n => n >= 60 ? `${+(n / 60).toFixed(1)} hr` : `${n} min`;
  const countWord = n => (WORDS[n] || String(n)).toLowerCase();
  const dayWord = d => d === today ? 'today' : d === tomorrow ? 'tomorrow' : label(d, {weekday: 'long'});
  async function createTimePlan(text, cfg){
    const days = (cfg.days && cfg.days.length ? cfg.days : Array.from({length: 7}, (_, k) => add(today, k))).filter(d => d >= today && d <= rangeEnd());
    const few = days.length <= 2;
    let windows = cfg.windows || [[420, 570, 'morning'], [720, 840, 'midday'], [1050, 1230, 'evening']];
    if (few && windows.length === 1 && windows[0][1] - windows[0][0] > 240) { const [a0, b0, l0] = windows[0], st0 = (b0 - a0) / 3; windows = [0, 1, 2].map(k => [Math.round((a0 + k * st0) / 15) * 15, Math.round((a0 + (k + 1) * st0) / 15) * 15, l0]); }
    const cands = [];
    for (const d of days) {
      const from = d === today ? Math.ceil((mins(clock(new Date())) + 30) / 15) * 15 : 0;
      for (const [a, b, lab] of windows) {
        const len = cfg.len(cands.length);
        for (const g of gapsIn(busyOn(d, 15), Math.max(a, from), b, len)) {
          const st = Math.ceil(g[0] / 15) * 15; if (st + len > g[1] || cands.some(c => c.d === d && Math.abs(c.start - st) < len + 60)) continue;
          cands.push({d, start: st, label: lab});
          if (!few || cands.filter(c => c.d === d).length >= 4) break;
        }
        if (!few && cands.some(c => c.d === d)) break;
      }
    }
    if (!cands.length && cfg.fallback && cfg.fallback.length) return createTimePlan(text, {...cfg, len: () => cfg.fallback[0], fallback: cfg.fallback.slice(1), shorter: true, title: cfg.title.replace(/, [\d.]+ (hr|min)$/, `, ${durLabel(cfg.fallback[0])}`)});
    const want = Math.max(1, Math.min(cfg.count || 4, 6));
    const pick = cands.length <= want ? cands : Array.from({length: want}, (_, k) => cands[Math.floor(k * cands.length / want)]);
    const pid = 'p' + Date.now().toString(36);
    const items = pick.map((c, k) => { const len = cfg.len(k), name = cfg.name(k); return {id: `${pid}-${k}`, planId: pid, type: 'idea', ideaKind: 'do', date: c.d, time: hm(c.start), title: `${name} · ${durLabel(len)}`, body: cfg.body ? cfg.body(c, k) : `${c.label === 'morning' ? 'Before the day starts' : c.label === 'midday' ? 'A midday break' : c.label === 'evening' ? 'After the day winds down' : 'Open'}. Nothing else is on your calendars then.`, suggestion: blockFor(name, c.d, c.start, len, cfg.calendar)}; });
    const plan = {id: pid, kind: cfg.kind || 'move', text, day: today, at: clock(new Date()), status: 'working', title: cfg.title, reply: cfg.working || 'Looking across your calendars.', replyBody: 'Checking every calendar for open time.', items: []};
    plans.push(plan);
    setWorking(cfg.working ? cfg.working + '…' : 'Looking across your week…');
    agentAt(shell.querySelector('form.db-context'), 0.1, 0.5, true);
    const span = days.length ? diff(days[0], days[days.length - 1]) : 0;
    if (days.length && span <= 2 && !(days.length === 1 && days[0] === today)) { if (view !== '3' || !visibleCol(days[0])) setView('3', days[0]); }
    else if (span > 2 && (view !== '7' || page['7'] !== before('7'))) { view = '7'; page['7'] = before('7'); }
    if (stacks.right.length) stacks.right = [];
    fresh.add(`reply-${pid}`); render({cascade: true}); fresh.delete(`reply-${pid}`);
    await sleep(800);
    for (const it of items) {
      if (it.date === today) {
        const plot = shell.querySelector('.db-left .db-plot');
        if (plot) { agentAt(plot, 0.3, Math.min(0.95, Math.max(0.02, (mins(it.time) - Number(plot.dataset.rs)) / (Number(plot.dataset.re) - Number(plot.dataset.rs))))); await sleep(900); }
      } else {
        let col = visibleCol(it.date);
        if (!col) { go(dayIndex(it.date) - (view === '3' ? 1 : 3)); await sleep(800); col = visibleCol(it.date); }
        if (col) { agentAt(col.querySelector('.db-col-head') || col, 0.5, 0.7); await sleep(560); scanCol(it.date); await sleep(460); }
      }
      plan.items.push(it); fresh.add(it.id);
      render({only: it.date === today ? 'left' : 'right'}); fresh.delete(it.id);
      const el = shell.querySelector(`[data-action="note:${CSS.escape(it.id)}"]`);
      if (el) { agentAt(el, 0.86, 0.5); await sleep(420); agentTap(); }
      await sleep(240);
    }
    plan.status = 'ready';
    const nounFor = n => n === 1 ? cfg.noun.replace(/\btimes\b/, 'time') : cfg.noun;
    plan.reply = items.length ? `Found ${countWord(items.length)} ${nounFor(items.length)}${cfg.shorter ? `, ${durLabel(cfg.len(0))} each` : ''}.` : (cfg.empty || 'Nothing open fits.');
    plan.replyBody = items.length ? `${items.map(it => `${label(it.date, {weekday: 'short'})} ${time(it.time)}`).join(', ')}. ${cfg.after || 'Accept the ones that feel right.'}` : 'No open time fit on every calendar. Try another day.';
    await savePlans();
    await sleep(300); agentOff(); setWorking('');
    fresh.add(`reply-${pid}`); render({only: 'left'}); fresh.delete(`reply-${pid}`);
    showToast(items.length ? `Found ${countWord(items.length)} ${nounFor(items.length)}${cfg.shorter ? ` (${durLabel(cfg.len(0))}, the most that fits)` : ''}. ${cfg.after || 'Accept the ones that fit.'}` : (cfg.empty || 'Nothing open fits.'));
  }
  function moveCfg(text, w){
    const both = /stretch/i.test(text) && /work ?out|exercis|gym|run|lift|yoga|swim|pilates/i.test(text), stretchOnly = /stretch/i.test(text) && !both;
    const act = /\b(run|running|jog\w*)\b/i.test(text) ? 'Run' : /yoga/i.test(text) ? 'Yoga' : /swim/i.test(text) ? 'Swim' : /pilates/i.test(text) ? 'Pilates' : /walk/i.test(text) ? 'Walk' : 'Workout';
    const isStretch = k => stretchOnly || (both && k % 2 === 1);
    const where = w.days && w.days.length === 1 ? dayWord(w.days[0]) : w.days && w.days.length === 2 ? (/next weekend/i.test(text) ? 'next weekend' : 'this weekend') : /next week/i.test(text) ? 'next week' : 'this week';
    return {kind: 'move', days: w.days, windows: w.part ? [[w.part[0], w.part[1], w.partName]] : null, count: w.count || (w.days && w.days.length === 1 ? 3 : 4), len: k => isStretch(k) ? (w.duration && stretchOnly ? w.duration : 20) : (w.duration || 45), name: k => isStretch(k) ? 'Stretch' : act, title: `Time to move ${where}`, noun: `times to move ${where}`, working: `Looking across ${where === 'this week' ? 'your week' : where}`};
  }
  async function createMovePlan(text){ return createTimePlan(text, moveCfg(text, parseWhen(text))); }

  function anchorFor(r){
    const evs = (data.events||[]).filter(x=>x.date===r.date && x.start && x.location && !imported(x)); if (!evs.length) return null;
    const mid = (mins(r.start) + mins(r.end)) / 2, c = x => (mins(x.start) + (mins(x.end) ?? mins(x.start))) / 2;
    return evs.sort((a,b)=>Math.abs(c(a)-mid)-Math.abs(c(b)-mid))[0];
  }
  const anchorKey = loc => /salon 94|e(ast)? 89th/i.test(loc||'') ? 'ues' : /starr st|bushwick|11237/i.test(loc||'') ? 'bushwick' : '';
  // ---- Smart contacts: who you mean, from your calendars, your notes and a lookup; remembered once confirmed ----
  const PEOPLE_KEY = 'daybook-people';
  let people = [], whom = null, indexFor = null, indexCache = [];
  const RESP = /\s+(accepted|no reply|declined|tentative|needs action|needsaction|maybe)\s*$/i;
  const capName = t => String(t).trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const selfNames = () => new Set(['cam', 'cameron', 'me', 'myself', firstName().toLowerCase()].filter(Boolean));
  function peopleIndex(){
    if (indexFor === data) return indexCache;
    const map = new Map(), self = selfNames();
    const addP = (raw, x, email) => {
      const name = String(raw || '').replace(RESP, '').trim();
      if (name.length < 3 || /\d|@|\(|\bgroup\b|\broom\b/i.test(name)) return;
      const parts = name.split(/\s+/), first = parts[0].toLowerCase(); if (self.has(first)) return;
      const key = name.toLowerCase(), q = map.get(key) || {id: 'cal:' + key, key, name, first, last: parts.slice(1).join(' ').toLowerCase(), email: '', events: [], source: 'calendar'};
      if (email && !q.email) q.email = email;
      if (x && !q.events.some(v => v.id === x.id)) q.events.push({id: x.id, date: x.date, title: x.title, location: x.location || ''});
      map.set(key, q);
    };
    for (const x of (data?.events || [])) {
      const org = String(x.organizer || ''), local = /@/.test(org) && !/group\.calendar|resource\.calendar/.test(org) ? org.split('@')[0].toLowerCase() : '';
      for (const part of String(x.people || '').split(/,\s*/).filter(Boolean)) { const n = part.replace(RESP, '').trim(); addP(n, x, local && n.toLowerCase().split(/\s+/)[0] === local.split(/[._-]/)[0] ? org : ''); }
      for (const m of String(x.title || '').matchAll(/\b(?:with|w\/)\s+([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+)?)/g)) addP(m[1], x, local && m[1].toLowerCase().startsWith(local.slice(0, 3)) ? org : '');
    }
    indexFor = data; indexCache = [...map.values()];
    return indexCache;
  }
  async function loadPeople(){ try { const v = bridge.loadPeople ? await bridge.loadPeople() : JSON.parse(localStorage.getItem(PEOPLE_KEY) || '[]'); if (Array.isArray(v)) people = v; } catch {} }
  async function savePeople(){ people = people.slice(-300); if (bridge.savePeople) await bridge.savePeople(people); else localStorage.setItem(PEOPLE_KEY, JSON.stringify(people)); }
  function remember(q, alias){
    const id = q.id && !String(q.id).startsWith('cal:') ? q.id : 'p:' + String(q.name).toLowerCase();
    let c = people.find(x => x.id === id || x.name.toLowerCase() === String(q.name).toLowerCase());
    if (!c) { c = {id, name: q.name, email: q.email || '', detail: q.detail || '', source: q.source || 'calendar', aliases: [], at: new Date().toISOString()}; people.push(c); }
    if (alias && alias !== c.name.toLowerCase() && !c.aliases.includes(alias)) c.aliases.push(alias);
    if (q.email && !c.email) c.email = q.email;
    savePeople().catch(() => {});
    return c;
  }
  function knownEvents(q){ const k = String(q.name || '').toLowerCase(); return (peopleIndex().find(v => v.key === k)?.events || []).slice().sort((a, b) => b.date.localeCompare(a.date)); }
  function personDetail(q){
    const ev = knownEvents(q), next = ev.filter(v => v.date >= today).pop(), last = ev.find(v => v.date < today);
    const bits = [q.email || '', next ? `Next: ${next.title} · ${shortDate(next.date)}` : last ? `Last: ${last.title} · ${shortDate(last.date)}` : ''].filter(Boolean);
    return bits.join(' · ') || q.detail || (q.source === 'contacts' ? 'In your contacts' : q.source === 'memory' ? 'From what Bonsai knows' : 'New to Today');
  }
  const NOT_PEOPLE = new Set('me my myself someone somebody people friends friend team work everyone everybody them him her us you family kids the a an some coffee lunch dinner brunch breakfast drinks drink tea food time today tonight tomorrow week weekend morning afternoon evening night monday tuesday wednesday thursday friday saturday sunday mon tue tues wed thu thurs fri sat sun next this at on in for of our to about all email emails it that what yoga gym'.split(' '));
  const REL_WORDS = /^(mom|mum|dad|mother|father|sister|brother|grandma|grandpa|grandmother|grandfather|aunt|uncle|wife|husband|partner|girlfriend|boyfriend|roommate|cousin|son|daughter)$/i;
  function isKnownName(w){ const l = w.toLowerCase(); return people.some(q => q.name.toLowerCase().split(/\s+/)[0] === l || (q.aliases || []).includes(l)) || peopleIndex().some(q => q.first === l); }
  function findMentions(text){
    const out = [], seen = new Set(), push = m => { const k = m.toLowerCase(); if (!seen.has(k) && !selfNames().has(k.split(' ')[0])) { seen.add(k); out.push(m); } };
    for (const m of String(text).matchAll(/\b(?:with|w\/|and|meet(?:ing)?|see(?:ing)?|call(?:ing)?|text(?:ing)?|invite|visit(?:ing)?|ping|thank)\s+((?:[A-Za-z][A-Za-z'’.-]+)(?:\s+[A-Za-z][A-Za-z'’.-]+)?)/g)) {
      const words = m[1].split(/\s+/).map(w => w.replace(/[’']s$/, '')), keep = [];
      for (const w of words) { const l = w.toLowerCase(); if (NOT_PEOPLE.has(l) || /^\d/.test(l)) break; if (keep.length && !/^[A-Z]/.test(w) && !isKnownName(keep[0] + ' ' + w)) break; keep.push(w); }
      if (!keep.length || keep[0].length < 3) continue;
      const cand = keep.join(' ');
      if (REL_WORDS.test(keep[0]) || /^[A-Z]/.test(keep[0]) || isKnownName(keep[0])) push(cand);
    }
    for (const w of String(text).split(/[^A-Za-z'’]+/)) { if (w.length >= 3 && !NOT_PEOPLE.has(w.toLowerCase()) && isKnownName(w) && !out.some(m => m.toLowerCase().split(' ').includes(w.toLowerCase()))) push(w); }
    return out.slice(0, 3);
  }
  async function resolveOne(m){
    const ml = m.toLowerCase(), first = ml.split(' ')[0];
    const cached = people.filter(q => q.name.toLowerCase() === ml || (q.aliases || []).includes(ml));
    if (cached.length === 1) return cached[0];
    const fromIndex = peopleIndex().filter(q => q.key === ml || q.first === ml || (q.last && q.last === ml) || (!ml.includes(' ') && ml.length >= 3 && q.first.startsWith(ml)));
    const byName = new Map();
    for (const q of [...cached, ...people.filter(q => q.name.toLowerCase().split(/\s+/)[0] === first), ...fromIndex]) { const k = q.name.toLowerCase(); if (!byName.has(k)) byName.set(k, q); }
    const opts = [...byName.values()].map(q => ({id: q.id, name: q.name, email: q.email || '', source: q.source || 'calendar', detail: personDetail(q)}));
    if (opts.length === 1) return remember(opts[0], ml);
    if (opts.length > 1) return {ask: opts.slice(0, 5)};
    if (REL_WORDS.test(m)) return remember({name: capName(m), source: 'you'}, ml);
    if (bridge.whois) {
      setWorking(`Looking for ${capName(m)}…`);
      try { const found = (await bridge.whois({name: m, known: peopleIndex().slice(0, 60).map(q => ({name: q.name, email: q.email}))}))?.people || []; if (found.length) return {ask: found.slice(0, 5).map(f => ({id: 'p:' + String(f.name).toLowerCase(), name: f.name, email: f.email || '', source: f.source || 'lookup', detail: [f.email, f.detail].filter(Boolean).join(' · ') || 'Found in your mail'}))}; } catch {} finally { setWorking(''); }
      return {ask: [], unknown: true};
    }
    return {ask: [], unknown: true};
  }
  function askWhom(m, options, unknown){ return new Promise(res => { whom = {mention: m, options, unknown: !!unknown, res}; render({only: 'right'}); setTimeout(() => shell.querySelector('.db-whom button')?.focus({preventScroll: true}), 30); }); }
  function settleWhom(choice){
    const w0 = whom; if (!w0) return; whom = null; render({only: 'right'});
    if (choice === 'skip') return w0.res(false);
    if (choice === 'new') return w0.res(remember({name: capName(w0.mention), source: 'you'}, w0.mention.toLowerCase()));
    const q = w0.options[Number(choice)]; w0.res(q ? remember(q, w0.mention.toLowerCase()) : false);
  }
  async function resolvePeople(value){
    const out = [];
    for (const m of findMentions(value)) { let r = await resolveOne(m); if (r && r.ask) r = await askWhom(m, r.ask, r.unknown); if (r) out.push(r); }
    return out;
  }
  function whomView(){
    const w0 = whom, first = capName(w0.mention);
    return `<div class="db-whom" role="dialog" aria-label="Who do you mean?"><p class="db-eyebrow">${w0.options.length ? 'Who do you mean?' : 'New to Today'}</p><strong>${w0.options.length ? `Which ${e(first)}?` : `Who is ${e(first)}?`}</strong><div class="db-whom-list">${w0.options.map((o, i) => `<button data-action="whom:${i}"><b>${e(o.name)}</b><span>${e(o.detail || o.email || '')}</span></button>`).join('')}<button class="new" data-action="whom:new"><b>${w0.options.length ? 'Someone else' : `Remember ${e(first)}`}</b><span>${w0.options.length ? `Remember “${e(first)}” as someone new` : 'Today will know who you mean next time'}</span></button></div><button class="db-ob-link" data-action="whom:skip">Skip</button></div>`;
  }
  const withWho = who => who && who.length ? ` with ${who.map(q => q.name.split(/\s+/)[0]).join(' and ')}` : '';
  function stripPeople(text, who){
    let t = String(text);
    for (const q of who || []) for (const n of [q.name, ...(q.aliases || []), q.name.split(/\s+/)[0]]) { const r = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); t = t.replace(new RegExp(`\\b(?:with|w\\/|and)?\\s*${r}(?:[’']s)?\\b`, 'gi'), ' '); }
    return t.replace(/\s+/g, ' ').trim();
  }
  function personAnchor(who){ for (const q of who || []) { const ev = knownEvents(q).find(v => v.location); if (ev) return {title: ev.title, location: ev.location}; } return null; }
  function peopleLine(x){
    return String(x.people || '').split(/,\s*/).map(s0 => s0.replace(RESP, '').trim()).filter(Boolean).map(n => {
      const q = peopleIndex().find(v => v.key === n.toLowerCase()), c = people.find(v => v.name.toLowerCase() === n.toLowerCase()), other = (q?.events || []).filter(v => v.id !== x.id).sort((a, b) => b.date.localeCompare(a.date)), mail = c?.email || q?.email || '';
      return `<span class="db-person"><b>${e(n)}</b>${mail ? `<small>${e(mail)}</small>` : ''}${other.length ? `<small>Also ${other.slice(0, 2).map(v => shortDate(v.date)).join(', ')}${other.length > 2 ? ` and ${other.length - 2} more` : ''}</small>` : ''}</span>`;
    }).join('');
  }
  const DAYN = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  function parseWhen(text){
    const t = ' ' + text.toLowerCase().replace(/[’']/g, "'") + ' ', now = date(today).getUTCDay();
    const out = {days: null, part: null, partName: '', at: null, duration: null, count: null, anchor: null};
    if (/\b(today|tonight|this (morning|afternoon|evening))\b/.test(t)) out.days = [today];
    else if (/\btomorrow\b/.test(t)) out.days = [tomorrow];
    else if (/\bweekend\b/.test(t)) { let sat = add(today, (6 - now + 7) % 7); if (/\bnext weekend\b/.test(t)) sat = add(sat, 7); out.days = (now === 0 && !/\bnext\b/.test(t)) ? [today] : [sat, add(sat, 1)]; }
    else if (/\bnext week\b/.test(t)) { const mon = add(today, ((1 - now + 7) % 7) || 7); out.days = Array.from({length: 7}, (_, k) => add(mon, k)); }
    else if (/\bthis week\b/.test(t)) out.days = Array.from({length: 7}, (_, k) => add(today, k));
    else {
      const alias = {tuesday: '|tues', wednesday: '|weds', thursday: '|thurs?'};
      const hits = DAYN.map((n, i) => new RegExp(`\\b(${n}|${n.slice(0, 3)}${alias[n] || ''})s?\\b`).test(t) ? i : -1).filter(i => i >= 0);
      if (hits.length) out.days = [...new Set(hits.map(i => add(today, ((i - now) + 7) % 7 || (/\bnext\b/.test(t) ? 7 : 0))))].sort();
    }
    const parts = [[/\b(early morning|before work|first thing)\b/, [420, 540], 'morning'], [/\b(morning|breakfast)\b/, [450, 720], 'morning'], [/\bbrunch\b/, [600, 840], 'midday'], [/\b(lunch|midday|noon)\b/, [690, 870], 'midday'], [/\bafternoon\b/, [720, 1050], 'afternoon'], [/\bafter work\b/, [1050, 1260], 'evening'], [/\bdrinks?\b/, [1080, 1380], 'evening'], [/\b(evening|tonight|dinner|night)\b/, [1020, 1320], 'evening']];
    for (const [re, pr, n] of parts) if (re.test(t)) { out.part = pr; out.partName = n; break; }
    const tm = t.match(/\b(?:at|@|around|by)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?(?=\W)/) || t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
    if (tm) { let h = Number(tm[1]) % 12; const ap = (tm[3] || '').replace(/\./g, '') || (h >= 1 && h <= 7 ? 'pm' : 'am'); if (ap === 'pm') h += 12; const v = h * 60 + Number(tm[2] || 0); if (v >= 300 && v <= 1410) out.at = v; }
    const du = t.match(/\b(\d+(?:\.\d+)?|an?|one|two|three|four|half an?)\s*(hours?|hrs?|h|minutes?|mins?)\b/);
    if (du) { const n = {a: 1, an: 1, one: 1, two: 2, three: 3, four: 4}[du[1]] ?? (/^half/.test(du[1]) ? 0.5 : Number(du[1])); out.duration = Math.round((/^h/.test(du[2]) ? n * 60 : n) / 15) * 15 || null; }
    const cn = t.match(/\b(\d|one|two|three|four|five)\s*(times|x|sessions|days)\b/);
    if (cn) out.count = {one: 1, two: 2, three: 3, four: 4, five: 5}[cn[1]] || Number(cn[1]);
    const an = t.match(/\b(after|before|around)\s+(?:my |the )?([a-z0-9][a-z0-9 &'.-]*?)(?=\s+(?:on|this|next|tomorrow|today|tonight)\b|[?.!,]|\s*$)/);
    if (an && !/^work\b/.test(an[2])) {
      const ev = matchEvent(an[2]) || (out.at != null ? (data?.events || []).find(x => (out.days || [today]).includes(x.date) && mins(x.start) === out.at) : null);
      if (ev && ev.start) { const s0 = mins(ev.start), e0 = mins(ev.end) ?? s0 + 60; out.anchor = {ev, rel: an[1]}; out.days = [ev.date]; out.part = an[1] === 'after' ? [e0, Math.min(1410, e0 + 180)] : an[1] === 'before' ? [Math.max(360, s0 - 180), s0] : [Math.max(360, s0 - 120), Math.min(1410, e0 + 120)]; out.partName = ''; }
    }
    return out;
  }
  const EV_STOP = new Set('the and for with from that this next our your call calls meeting meetings event events invite sync time times today tonight tomorrow week weekend morning afternoon evening night monday tuesday wednesday thursday friday saturday sunday tues weds thurs move reschedule push shift cancel decline delete remove skip prep prepare brief ready get please can you could want need would like about let know'.split(' '));
  function matchEvent(text){
    const words = String(text).toLowerCase().replace(/[’']s\b/g, '').replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 2 && !EV_STOP.has(w));
    if (!words.length) return null;
    let best = null, score = 0;
    for (const x of (data?.events || [])) {
      if (x.date < today || x.date > add(today, 21) || cal(x.sourceId).kind === 'holidays' || marker(x)) continue;
      const title = String(x.title || '').toLowerCase().replace(/[’']s\b/g, '');
      const sc = words.reduce((n, w) => n + (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '')}`).test(title) ? 1 : 0), 0);
      if (sc > score || (sc && sc === score && x.date < best.date)) { best = x; score = sc; }
    }
    return score ? best : null;
  }
  function rangeFor(text, w){
    const t = text.toLowerCase(), meal = /\bbreakfast\b/.test(t) ? [480, 630] : /\bbrunch\b/.test(t) ? [600, 840] : /\blunch\b/.test(t) ? [690, 870] : /\b(dinner|supper)\b/.test(t) ? [1050, 1320] : /\b(drinks?|bar)\b/.test(t) ? [1080, 1380] : null;
    const days = w.days || [today], part = w.part || meal || [600, 1260];
    for (const d of days) {
      if (d < today || d > rangeEnd()) continue;
      const a = d === today ? Math.max(part[0], Math.ceil((mins(clock(new Date())) + 15) / 15) * 15) : part[0];
      const g = gapsIn(busyOn(d), a, part[1], 45).sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]))[0];
      if (g) return {date: d, start: hm(Math.ceil(g[0] / 15) * 15), end: hm(g[1])};
    }
    return null;
  }
  function blockTitle(text){
    let t = ' ' + text.toLowerCase().replace(/[’']/g, "'") + ' ';
    t = t.replace(/\b(please|can you|could you|i want to|i'd like to|i need to|help me|let's)\b/g, ' ')
      .replace(/\b(block( off| out)?|hold|reserve|find|make|set aside|carve out|schedule|add|put|book|plan)\b/g, ' ')
      .replace(/\b(\d+(\.\d+)?|an?|one|two|three|four|half an?)\s*(hours?|hrs?|h|minutes?|mins?)\b/g, ' ')
      .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)?\b/g, ' ')
      .replace(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|tues|wed|weds|thu|thur|thurs|fri|sat)s?\b/g, ' ')
      .replace(/\b(today|tonight|tomorrow|this|next|weekend|week|morning|afternoon|evening|night|on|at|from|to|until|for|some|time|in|my|the|a|an|me|every|each)\b/g, ' ')
      .replace(/[?.!,]/g, ' ').replace(/\s+/g, ' ').trim();
    return t ? cap(t) : (/focus/i.test(text) ? 'Focus' : 'Hold');
  }
  const BLOCK_LEAD = /^(please\s+)?(block|hold|reserve|schedule|add|put|book|set aside|carve out|find time|make time|plan time)\b/i;
  const BLOCK_CUE = /\b(focus|deep work|heads? ?down|time (to|for)|block of)\b/i;
  const CHANGE = /\b(move|reschedule|push|shift|cancel|decline|delete|remove|skip)\b/i;
  const PREP = /\b(prep|prepare|brief me|get ready for|briefing)\b/i;
  const ASK = /\?\s*$|^(what|when|how|am i|do i|is there|are there|show me|anything)\b|\b(am i (free|busy)|free time|how busy)\b/i;
  const PLACE = /\b(somewhere|places? to|(some|any)thing to do|things? to do|what to do|go out|nearby|explore)\b/i;
  const plain = text => { let t = String(text).trim(), prev; do { prev = t; t = t.replace(/^(hey|hi|ok|okay|so|please|can you|could you|would you|will you|i want to|i'd like to|i’d like to|i need to|help me|let's|let’s)\b[\s,]*/i, ''); } while (t !== prev); return t; };
  let seek = null;
  // Show the work: go to the day the request is about and hold a pending card at its time range.
  async function locate(value, w, ev, kind){
    const nowM = Math.ceil((mins(clock(new Date())) + 15) / 15) * 15;
    let d = null, a = 0, b = 0;
    if (ev && ev.start && (kind === 'prep' || kind === 'change')) { d = ev.date; a = mins(ev.start); b = mins(ev.end) ?? a + 60; }
    else if (kind === 'place') { const r = rangeFor(value, w); if (r) { d = r.date; a = mins(r.start); b = mins(r.end); } }
    else if (kind !== 'note' || w.days) {
      d = (w.days && w.days[0]) || (w.at != null ? (w.at > nowM ? today : tomorrow) : (kind === 'ask' && !/\b(today|tonight)\b/i.test(value) ? tomorrow : today));
      [a, b] = w.at != null ? [w.at, w.at + (w.duration || 60)] : (w.part || (kind === 'ask' || kind === 'note' ? [480, 1320] : [540, 1080]));
    }
    if (!d) return;
    if (d === today) { a = Math.max(a, nowM); if (b <= a) b = Math.min(1440, a + 60); }
    const many = (w.days || []).length > 1;
    seek = {date: d, start: hm(a), end: hm(Math.min(b, 1440)), kicker: kind === 'change' ? 'Finding new times' : kind === 'place' ? 'Looking nearby' : kind === 'ask' ? 'Reading the day' : kind === 'prep' ? 'Preparing' : 'Looking', label: `${many ? cap(dayWord(d)) + ' and on · ' : ''}${time(hm(a))} to ${time(hm(Math.min(b, 1440)))}`};
    if (stacks.right.length && d !== today) stacks.right = [];
    if (d !== today && (view !== '3' || !visibleCol(d))) setView('3', d); else render();
    await sleep(380);
    const target = d === today ? shell.querySelector('.db-left .db-seek') : shell.querySelector('.db-right .db-seekcard');
    if (target) { agentAt(target, 0.5, 0.5); if (d !== today) scanCol(d); await sleep(760); }
  }
  function endSeek(){ if (!seek) return; seek = null; render(); }
  async function routeRequest(raw){
    const value = plain(raw) || raw, w = parseWhen(value), ev = matchEvent(value);
    contextDraft = ''; contextHint = '';
    if (whom) settleWhom('skip');
    const wantsPlace = MUSEUM.test(value) || FOOD.test(value) || PLACE.test(value), isAsk = ASK.test(value) && !BLOCK_LEAD.test(value) && !MOVE.test(value) && !wantsPlace;
    const kind = PREP.test(value) && ev ? 'prep' : CHANGE.test(value) && ev && !/\bmove more\b/i.test(value) ? 'change' : BLOCK_LEAD.test(value) && !MOVE.test(value) ? 'block' : MOVE.test(value) ? 'move' : wantsPlace ? 'place' : isAsk ? 'ask' : (BLOCK_CUE.test(value) || w.duration || (w.at != null && w.days)) ? 'block' : 'note';
    setWorking({prep: 'Finding the event', change: 'Finding the event', block: 'Finding the time', move: 'Finding the time', place: 'Finding the day', ask: 'Reading the day', note: 'Keeping this'}[kind] + '…');
    try {
      await locate(value, w, ev, kind);
      if (kind === 'prep') return prepEvent(value, ev);
      if (kind === 'change') return await changeEvent(value, ev, w);
      const who = isAsk || !findMentions(value).length ? [] : await resolvePeople(value);
      if (kind === 'block') return await blockRequest(value, w, who);
      if (kind === 'move') { bridge.context?.(value).catch(() => {}); const cfg = moveCfg(stripPeople(value, who), w); if (who.length) { const nm = cfg.name; cfg.name = k => nm(k) + withWho(who); cfg.title += withWho(who); } return await createTimePlan(value, cfg); }
      if (kind === 'place') { bridge.context?.(value).catch(() => {}); const r = rangeFor(value, w); if (r) return await createResearch(value, r, who); render(); showToast(`No open time ${w.days ? dayWord(w.days[0]) : 'today'} for that. Try another day.`); return; }
      if (kind === 'ask') return answerDay(value, w);
      return await keepNote(value, who);
    } finally { agentOff(); if (working && !plans.some(p => p.status === 'working')) setWorking(''); endSeek(); }
  }

  async function keepNote(value, who = []){
    const about = who.length ? ` (about ${who.map(q => q.name + (q.email ? ' <' + q.email + '>' : '')).join(', ')})` : '';
    if (bridge.context) await bridge.context(value + about); else data.notes.push({id: 'local-' + Date.now(), date: today, time: clock(new Date()), type: 'context', title: who.length ? `For later${withWho(who).replace(' with ', ' · ')}` : 'For later', body: value});
    render(); showToast(`${bridge.context ? 'Kept for your agent' : 'Kept in this preview only'}${who.length ? ` · about ${who.map(q => q.name).join(' and ')}` : ''}.`);
  }
  function openNewEvent(d, a, b, name){
    if (stacks.right.length) stacks.right = [];
    openDoc('right', {kind: 'newevent', id: `${d}:${hm(a)}-${hm(Math.min(b, 1440))}!`});
    const fill = () => { const ti = shell.querySelector('.db-right .db-newev')?.closest('.db-docpage')?.querySelector('.db-doc-title') || shell.querySelector('.db-right .db-doc-title'); if (ti && !ti.textContent.trim()) { ti.textContent = name; ti.dispatchEvent(new Event('input', {bubbles: true})); } };
    fill(); setTimeout(fill, 60);
    showToast(`${name}, ${dayWord(d)} at ${time(hm(a))}. Check it, then Add to calendar.`);
  }
  async function blockRequest(value, w, who = []){
    const base = blockTitle(stripPeople(value, who)), name = who.length ? (base === 'Hold' ? `Time${withWho(who)}` : `${base}${withWho(who)}`) : base, len = w.duration || (/deep work|heads? ?down/i.test(value) ? 120 : /focus/i.test(value) ? 90 : /\bread/i.test(value) ? 45 : 60);
    if (w.at != null) { const d = (w.days && w.days[0]) || (w.at > mins(clock(new Date())) ? today : tomorrow); return openNewEvent(d, w.at, w.at + len, name); }
    const one = w.days && w.days.length === 1;
    return createTimePlan(value, {kind: 'block', days: w.days, windows: w.part ? [[w.part[0], w.part[1], w.partName]] : [[540, 1080, 'day']], count: one ? 3 : 4, len: () => len, fallback: w.duration ? null : [60, 45].filter(n => n < len), name: () => name, title: `${name}, ${durLabel(len)}`, noun: /^(read|write|call|run|walk|think|plan|study|practice|draw|paint|cook|journal|meditate)$/i.test(name) ? `open times to ${name.toLowerCase()}` : `open times for ${name.toLowerCase()}`, working: `Finding ${durLabel(len)} for ${name.toLowerCase()}`, body: () => `${durLabel(len)} open on every calendar. Accept adds a private block.`});
  }
  function answerDay(value, w){
    const d = (w.days && w.days[0]) || (/\b(today|tonight)\b/i.test(value) ? today : tomorrow);
    if (stacks.right.length) stacks.right = [];
    openDoc('right', {kind: 'day', id: d});
    const n = visible(d).filter(x => x.start && !marker(x)).length, g = largestGap(d);
    showToast(`${cap(dayWord(d))}: ${n === 0 ? 'nothing timed' : n === 1 ? 'one event' : `${n} events`}${g ? `. Most open ${time(hm(g[0]))} to ${time(hm(g[1]))}` : '. No long open stretch'}.`);
  }
  function prepEvent(value, ev){
    bridge.context?.(`Prepare a brief for "${ev.title}" on ${ev.date}. Request: ${value}`).catch(() => {});
    const side = ev.date === today ? 'left' : 'right';
    if (stacks[side].length) stacks[side] = [];
    openDoc(side, {kind: 'event', id: ev.id});
    showToast(bridge.context ? `Opened ${ev.title}. Your agent adds a brief on its next refresh.` : `Opened ${ev.title}. Installed, your agent adds a brief on its next refresh.`);
  }
  async function changeEvent(value, ev, w){
    const cancel = /\b(cancel|decline|delete|remove|skip)\b/i.test(value), own = deletable(ev), side = ev.date === today ? 'left' : 'right';
    if (cancel) {
      if (stacks[side].length) stacks[side] = [];
      openDoc(side, {kind: 'event', id: ev.id});
      showToast(own ? `Opened ${ev.title}. Delete is at the bottom when you are sure.` : `${ev.title} came from someone else's invite, so Today leaves it alone. Decline it in your calendar, or hide it here.`);
      return;
    }
    const len = Math.max(15, ((mins(ev.end) ?? (mins(ev.start) + 60)) - mins(ev.start)) || 60);
    const days = w.days && !(w.days.length === 1 && w.days[0] === ev.date) ? w.days : [1, 2, 3].map(k => add(ev.date, k));
    return createTimePlan(value, {kind: 'move-event', calendar: cal(ev.sourceId), days, windows: w.part ? [[w.part[0], w.part[1], w.partName]] : [[540, 1080, 'day']], count: 4, len: () => len, name: () => `Hold · ${ev.title}`, title: `New times for ${ev.title}`, noun: 'open times that fit', working: `Finding times for ${ev.title}`, after: own ? 'Accept holds one; then move the event in your calendar.' : 'Accept holds one privately so you can propose it. Today does not move meetings with other people.', body: () => own ? 'Open on every calendar.' : 'Open on every calendar. Today does not move meetings with other people.'});
  }
  async function createResearch(text, r, who = []){
    const category = MUSEUM.test(text) ? 'museum' : FOOD.test(text) ? 'restaurant' : 'place', noun = category === 'restaurant' && /\b(drinks?|bar)\b/i.test(text) ? 'places for a drink' : category === 'restaurant' && /\b(coffee|caf[eé])\b/i.test(text) ? 'coffee spots' : {museum:'museums', restaurant:'places to eat', place:'places'}[category];
    const anchor = anchorFor(r) || personAnchor(who), anchorLabel = anchor ? anchor.location.split(',')[0] : (interests.near || '');
    const pid = 'r' + Date.now().toString(36), when = `${shortDate(r.date)}, ${time(r.start)} to ${time(r.end)}`;
    const plan = {id:pid, kind:'research', text, day:today, at:clock(new Date()), range:r, category, noun, anchorLabel, anchor: anchor ? {title:anchor.title, location:anchor.location} : null, status:'researching', people: who.map(q => ({name: q.name, email: q.email || ''})), title:`${cap(noun)}${withWho(who)}${anchorLabel?' near '+anchorLabel:''}`, reply:'Looking into this.', replyBody:`${cap(noun)}${anchorLabel?' near '+anchorLabel:''} for ${when}. I will share options after a deeper look.`, items:[]};
    plans.push(plan); await savePlans();
    setWorking(`Looking into ${noun}…`);
    agentAt(shell.querySelector('form.db-context'), 0.1, 0.5, true);
    fresh.add(`reply-${pid}`); render({only:'left'}); fresh.delete(`reply-${pid}`); setWorking(working);
    await sleep(600);
    if (r.date === today) {
      const plot = shell.querySelector('.db-left .db-plot');
      if (plot) { agentAt(plot, 0.3, Math.min(0.95, Math.max(0.02, (mins(r.start) - Number(plot.dataset.rs)) / (Number(plot.dataset.re) - Number(plot.dataset.rs))))); await sleep(1000); }
    } else {
      if (stacks.right.length) stacks.right = [];
      if (view !== '3' || !visibleCol(r.date)) { setView('3', r.date); await sleep(800); }
      const col = visibleCol(r.date);
      if (col) { agentAt(col.querySelector('.db-col-head') || col, 0.5, 0.7); await sleep(650); scanCol(r.date); await sleep(800); }
    }
    fresh.add(`plan-${pid}`); render(); fresh.delete(`plan-${pid}`);
    const card = shell.querySelector(`[data-action="plan:${CSS.escape(pid)}"]`);
    if (card) { agentAt(card, 0.82, 0.4); await sleep(500); agentTap(); }
    await sleep(500); agentOff(); setWorking('');
    showToast('On it. Options will follow.');
    if (bridge.research) { try { await bridge.research(plan); } catch (err) { plan.status = 'failed'; plan.error = err.message || 'The research could not start.'; await savePlans(); render(); } schedulePoll(); return; }
    await sleep(5200);
    const preset = data.demoResearch?.[anchorKey(anchor?.location)]?.[category];
    if (!preset) { plan.status = 'ready'; plan.reply = 'Nothing ready yet.'; plan.replyBody += ' In this preview, researched examples exist only near Salon 94 and 234 Starr St.'; await savePlans(); render(); return; }
    plan.items = preset.options.map((o,i) => ({id:`${pid}-${i}`, planId:pid, type:'idea', ideaKind:'place', date:r.date, time:r.start, title:o.name, body:o.why, address:o.address, url:o.url, walk:o.walk, suggestion:blockFor(o.name, r.date, mins(r.start), mins(r.end)-mins(r.start))}));
    plan.note = preset.note || ''; plan.status = 'ready'; plan.reply = 'Options are ready.'; plan.replyBody = `${WORDS[plan.items.length]||plan.items.length} ${noun}${anchorLabel?' near '+anchorLabel:''} for ${when}.`;
    await savePlans();
    fresh.add(`plan-${pid}`); fresh.add(`reply-${pid}`); render(); fresh.delete(`plan-${pid}`); fresh.delete(`reply-${pid}`);
    await sleep(900);
    openDoc('right', {kind:'plan', id:pid});
    showToast(`Options are ready · ${plan.title}`);
  }
  function setRange(d, s, en){
    pendingRange = {date:d, start:s, end:en}; contextHint = '';
    if (stacks.right.length) stacks.right = [];
    if (d !== today) { flash = d; setTimeout(()=>{ flash = null; }, 1900); }
    render({focus:'.db-right [name="context"]'});
  }
  function rangeFromText(text){
    const t = text.toLowerCase(), names = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    let d = today;
    if (/\btomorrow\b/.test(t)) d = tomorrow;
    else { const i = names.findIndex(n => t.includes(n) || t.includes(n.slice(0, 3) + ' ')); if (i >= 0) { const now = date(today).getUTCDay(); d = add(today, ((i - now) + 7) % 7 || (t.includes('next') ? 7 : 0)); } }
    let [a, b] = [600, 1260];
    if (/\b(morning|breakfast)\b/.test(t)) [a, b] = [480, 720]; else if (/\bbrunch\b/.test(t)) [a, b] = [600, 840]; else if (/\blunch\b/.test(t)) [a, b] = [690, 870];
    else if (/\bafternoon\b/.test(t)) [a, b] = [720, 1050]; else if (/\b(evening|tonight|dinner|drinks?)\b/.test(t)) [a, b] = [1020, 1320];
    if (d === today) a = Math.max(a, Math.ceil((mins(clock(new Date())) + 15) / 15) * 15);
    const g = gapsIn(busyOn(d), a, b, 45).sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]))[0];
    return g ? {date: d, start: hm(Math.ceil(g[0] / 15) * 15), end: hm(g[1])} : null;
  }
  function largestGap(d){ const from = d === today ? Math.ceil((mins(clock(new Date())) + 15)/15)*15 : 600; return gapsIn(busyOn(d), Math.max(600, from), 1290, 45).sort((a,b)=>(b[1]-b[0])-(a[1]-a[0]))[0]; }
  function bindTimeline(){
    const plot = shell.querySelector('.db-left .db-plot'); if (!plot) return;
    const rs = Number(plot.dataset.rs), re = Number(plot.dataset.re), sel = plot.querySelector('.db-sel'); let st = null;
    const toMin = y => { const r = plot.getBoundingClientRect(); return Math.round((rs + Math.min(1, Math.max(0, (y - r.top) / r.height)) * (re - rs)) / 15) * 15; };
    const show = (a, b) => { const lo = Math.min(a,b), hi = Math.max(a,b); sel.hidden = false; sel.style.top = `${(lo-rs)/(re-rs)*100}%`; sel.style.height = `${Math.max(hi-lo,15)/(re-rs)*100}%`; sel.querySelector('span').textContent = `${time(hm(lo))} to ${time(hm(hi))}`; };
    plot.addEventListener('pointerdown', ev => { if (ev.button !== 0 || ev.target.closest('.db-te,.db-notes,.db-open-idea')) return; st = {y:ev.clientY, m:toMin(ev.clientY), id:ev.pointerId, drag:false}; });
    plot.addEventListener('pointermove', ev => { if (!st || ev.pointerId !== st.id) return; if (!st.drag) { if (Math.abs(ev.clientY - st.y) < 6) return; st.drag = true; try { plot.setPointerCapture(st.id); } catch {} plot.classList.add('selecting'); } show(st.m, toMin(ev.clientY)); });
    const up = ev => { if (!st || ev.pointerId !== st.id) return; if (st.drag) { const lo = Math.min(st.m, toMin(ev.clientY)), hi = Math.max(st.m, toMin(ev.clientY)); suppressClick = true; setTimeout(()=>{ suppressClick = false; }, 0); plot.classList.remove('selecting'); sel.hidden = true; if (hi - lo >= 15) openDoc('left', {kind:'newevent', id:`${today}:${hm(lo)}-${hm(hi)}!`}); } st = null; };
    plot.addEventListener('pointerup', up); plot.addEventListener('pointercancel', up);
    const hov = plot.querySelector('.db-tl-hover'), trk = plot.querySelector('.db-track');
    if (hov && trk) {
      const hide = () => hov.classList.remove('on');
      plot.addEventListener('pointermove', ev => {
        if (st?.drag || ev.pointerType === 'touch') return hide();
        const tr = trk.getBoundingClientRect(), nowM = mins(clock(new Date()));
        if (ev.target.closest('.db-te,.db-notes,.db-open-idea,.db-accept') || ev.clientX < tr.left - 14 || ev.clientX > tr.right + 14) return hide();
        const m = toMin(ev.clientY); if (m < nowM || m >= Math.min(re, 1425)) return hide();
        hov.style.top = `${(m - rs) / (re - rs) * 100}%`; hov.querySelector('b').textContent = time(hm(m));
        hov.dataset.action = `newevent:${today}:${hm(m)}-${hm(Math.min(1440, m + 60))}`; hov.classList.add('on');
      });
      plot.addEventListener('pointerleave', hide);
    }
  }
  const CREATED_KEY = 'daybook-created';
  if (!bridge.createEvent) { try { const saved = JSON.parse(localStorage.getItem(CREATED_KEY) || '[]'); if (data && saved.length) data.events = [...(data.events||[]), ...saved.filter(x=>!(data.events||[]).some(y=>y.id===x.id))]; } catch {} }
  async function createEvent(id, side){
    const wrap = shell.querySelector(`.db-docwrap[data-side="${side}"]`); if (!wrap) return;
    const d = id.split(':')[0], title = wrap.querySelector('.db-doc-title')?.textContent.trim() || 'Busy', where = wrap.querySelector('.db-doc-dek')?.textContent.trim() || '';
    const start = wrap.querySelector('[name="ne-start"]').value, end = wrap.querySelector('[name="ne-end"]').value, cal = (data.calendars||[]).find(c=>c.id===wrap.querySelector('[name="ne-cal"]').value);
    const note = wrap.querySelector('.db-doc-note'), btn = wrap.querySelector('[data-action^="create:"]');
    if (mins(end) <= mins(start)) { if (note) note.textContent = 'The end time needs to be after the start.'; return; }
    if (!cal) { if (note) note.textContent = 'Pick a calendar you can edit.'; return; }
    const clash = (data.events||[]).filter(x=>x.date===d && x.start && !imported(x) && mins(x.start) < mins(end) && (mins(x.end) ?? mins(x.start)+60) > mins(start));
    if (clash.length && !btn.dataset.confirm) { btn.dataset.confirm = '1'; btn.lastChild.textContent = 'Add anyway'; if (note) note.textContent = `This overlaps ${clash.map(x=>x.title).slice(0,2).join(' and ')}.`; return; }
    const description = plainText(wrap.querySelector('.db-doc-body')?.innerHTML);
    const ev = {title, date:d, start, end, location:where, description, accountId:cal.accountId||'', calendarId:cal.calendarId||cal.id, provider:cal.provider||'gcal'};
    btn.disabled = true; btn.classList.add('is-busy'); btn.lastChild.textContent = 'Adding…'; if (note) note.textContent = '';
    try {
      const res = bridge.createEvent ? await bridge.createEvent(ev) : null;
      const local = {id:`local-ev-${Date.now().toString(36)}`, sourceId:cal.id, accountId:ev.accountId, date:d, start, end, title, description: description || (bridge.createEvent ? '' : 'Added in this preview.'), location: where || undefined, uri: res?.eventUri || ''};
      data.events = [...(data.events||[]), local];
      if (!bridge.createEvent) { const saved = JSON.parse(localStorage.getItem(CREATED_KEY) || '[]'); saved.push(local); localStorage.setItem(CREATED_KEY, JSON.stringify(saved)); }
      delete docs[`newevent:${id}`]; dirty[side] = false;
      stacks[side].pop(); if (side === 'right' && !stacks.right.length) setView('3', d);
      render(); showToast(bridge.createEvent ? `On your calendar · ${shortDate(d)}, ${time(start)}` : 'Added in this preview. In the installed app it goes on your calendar.');
    } catch (err) { btn.disabled = false; btn.lastChild.textContent = 'Add to calendar'; if (note) note.textContent = err.message || 'The event was not added.'; }
  }
  const deletable = x => !!x && !String(x.id).startsWith('acc-') && (String(x.id).startsWith('local-ev-') || String(x.id).startsWith('created-') || (!x.people && !x.organizer && !imported(x) && cal(x.sourceId).kind !== 'holidays' && cal(x.sourceId).writable));
  function titleOf(id){ return (findNote(id) || {}).title || ''; }
  async function dismiss(id){
    const n = findNote(id), plan = plans.find(p => `plan-${p.id}` === id || `reply-${p.id}` === id);
    const entry = {id, title: n?.title || plan?.title || '', at: new Date().toISOString()};
    prefs.dismissed = [...prefs.dismissed.filter(d => d.id !== id), entry].slice(-200);
    if (plan && (`plan-${plan.id}` === id)) prefs.dismissed.push({id: `reply-${plan.id}`, title: '', at: entry.at});
    await savePrefs().catch(()=>{});
    const top = stacks.right[stacks.right.length-1] || stacks.left[stacks.left.length-1];
    if (top && (top.id === id || `plan-${top.id}` === id)) { for (const sd of ['left','right']) if (stacks[sd].length && (stacks[sd][stacks[sd].length-1].id === top.id)) stacks[sd].pop(); }
    render();
    showToast(entry.title ? `Dismissed · ${entry.title}` : 'Dismissed', async () => { prefs.dismissed = prefs.dismissed.filter(d => d.id !== id && !(plan && d.id === `reply-${plan.id}`)); await savePrefs().catch(()=>{}); render(); });
  }
  async function hideEvent(id){
    const ev = (data.events||[]).find(x => x.id === id); if (!ev) return;
    prefs.hiddenEvents = [...prefs.hiddenEvents.filter(d => d.id !== id), {id, title: ev.title, at: new Date().toISOString()}];
    await savePrefs().catch(()=>{});
    for (const sd of ['left','right']) if (stacks[sd].length && stacks[sd][stacks[sd].length-1].kind === 'event' && stacks[sd][stacks[sd].length-1].id === id) stacks[sd].pop();
    render();
    showToast(`Hidden · ${ev.title}`, async () => { prefs.hiddenEvents = prefs.hiddenEvents.filter(d => d.id !== id); await savePrefs().catch(()=>{}); render(); });
  }
  async function deleteEvent(id, btn, side){
    const ev = (data.events||[]).find(x => x.id === id); if (!ev || !deletable(ev)) return;
    if (!btn.dataset.confirm) { btn.dataset.confirm = '1'; btn.textContent = 'Delete it from your calendar?'; btn.classList.add('armed'); setTimeout(() => { if (btn.isConnected) { delete btn.dataset.confirm; btn.textContent = 'Delete from calendar'; btn.classList.remove('armed'); } }, 4000); return; }
    btn.disabled = true; btn.classList.add('is-busy'); btn.textContent = 'Deleting…';
    try {
      if (bridge.removeEvent) await bridge.removeEvent({id: ev.id, uri: ev.uri, title: ev.title, date: ev.date, start: ev.start, end: ev.end, accountId: ev.accountId, calendarId: cal(ev.sourceId).calendarId || '', provider: cal(ev.sourceId).provider || 'gcal'});
      data.events = data.events.filter(x => x.id !== id);
      if (!bridge.removeEvent) { try { const saved = JSON.parse(localStorage.getItem(CREATED_KEY) || '[]').filter(x => x.id !== id); localStorage.setItem(CREATED_KEY, JSON.stringify(saved)); } catch {} }
      if (stacks[side].length) stacks[side].pop();
      render(); showToast(bridge.removeEvent ? `Deleted · ${ev.title}` : `Deleted in this preview · ${ev.title}`);
    } catch (err) { btn.disabled = false; btn.classList.remove('is-busy'); btn.textContent = 'Delete from calendar'; delete btn.dataset.confirm; showToast(err.message || 'It was not deleted.'); }
  }
  async function acceptAll(pid){ const p = plans.find(x=>x.id===pid); for (const it of (p?.items||[])) if (!accepted.has(it.id)) await accept(it.id); }
  const ideaLabel = x => x.planId && x.ideaKind === 'do' ? 'Your plan' : x.ideaKind === 'read' ? 'A read' : x.ideaKind === 'place' ? (x.summary ? 'Your request' : 'Nearby') : 'An idea';
  function openGaps(events, from, to){
    const busyList = events.map(v=>[v.s,v.e]).sort((a,b)=>a[0]-b[0]); const out = []; let cur = from;
    for (const [s,en] of busyList) { if (s - cur >= 75) out.push([cur,s]); cur = Math.max(cur,en); }
    if (to - cur >= 75) out.push([cur,to]);
    return out;
  }
  function todayView(){
    const {markers, allDay, timed} = dayItems(today);
    const events = timed.filter(t=>t.kind==='event').map(t=>({x:t.x,s:mins(t.x.start),e:Math.max(mins(t.x.end)??mins(t.x.start)+60,mins(t.x.start)+20)}));
    const nowMin = mins(clock(new Date()));
    let rs = Math.min(480, ...events.map(v=>Math.floor(v.s/60)*60)), re = Math.max(1320, ...events.map(v=>Math.ceil(Math.min(v.e,1500)/60)*60));
    const total = re - rs, pct = m => ((Math.min(Math.max(m,rs),re)-rs)/total*100).toFixed(3);
    const step = total > 960 ? 240 : 180;
    let hours = ''; for (let m = Math.ceil(rs/step)*step; m <= re; m += step) { const h = (m/60)%24; hours += `<span class="db-hour" style="top:${pct(m)}%">${h%12||12} ${h>=12?'pm':'am'}</span><span class="db-rule" style="top:${pct(m)}%"></span>`; }
    events.sort((a,b)=>a.s-b.s); let group=[], end=-1; const placed=[];
    const flush=()=>{const cols=[];group.forEach(v=>{let i=cols.findIndex(c=>c<=v.s);if(i<0){i=cols.length;cols.push(0)}cols[i]=v.e;v.lane=i});group.forEach(v=>v.lanes=cols.length);placed.push(...group);group=[]};
    events.forEach(v=>{if(v.s>=end&&group.length)flush();group.push(v);end=Math.max(end,v.e)}); if(group.length)flush();
    const blocks = placed.map(v=>{const short=(v.e-v.s)<=60; const w=100/v.lanes; return `<button class="db-te ${short?'short':''} ${v.e<nowMin?'past':''} ${cls(v.x)} ${v.x.accepted?'accepted':''} ${morph.has(v.x.id)?'db-morph':''} ${saving.has(v.x.id)?'saving':''}" data-action="${v.x.accepted?'note:'+e(v.x.noteId):'event:'+e(v.x.id)}" style="--c:${color(v.x.sourceId)};top:${pct(v.s)}%;height:${(Math.min(v.e,re)-v.s)/total*100}%;left:calc(${w*v.lane}% + ${v.lane?4:0}px);width:calc(${w}% - ${v.lanes>1?4:0}px)">${aura(v.x.id)}<strong>${e(v.x.title)}</strong><small>${span(v.x)}</small></button>`;}).join('');
    const gaps = openGaps(events, Math.max(nowMin, rs), Math.min(re, 1320));
    const ideasToday = timed.filter(t=>t.kind==='idea');
    const open = gaps.map(([a,b])=>{ const idea = ideasToday.find(t=>t.at>=a && t.at<b); return `<div class="db-open" style="top:calc(${pct(a)}% + 4px);height:calc(${(b-a)/total*100}% - 8px)"><button class="db-open-main" data-action="open:${hm(a)}-${hm(b)}"><span>Open</span>${time(hm(a))} to ${time(hm(b))} · ${dur(b-a)}</button>${idea?`<div class="db-open-idea ${fresh.has(idea.x.id)?'db-fresh':''}"><button data-action="note:${e(idea.x.id)}">${e(idea.x.title)}</button>${acceptBtn(idea.x)}</div>`:''}</div>`; }).join('');
    const rest = timed.filter(t=>t.kind!=='event' && t.kind!=='idea' && t.kind!=='reply'), mine = rest.filter(t=>String(t.x.id).startsWith('local-')).reverse();
    const notes = [...timed.filter(t=>t.kind==='reply').slice(-1), ...mine, ...rest.filter(t=>!mine.includes(t))].slice(0, setupLeft().length ? 2 : 3).map(t=>`<div class="db-notewrap"><button class="db-note ${t.x.type==='reply'?'reply':''} ${t.x.working?'working':''} ${fresh.has(t.x.id)?'db-fresh':''}" data-action="${t.x.type==='reply'?'plan:'+e(t.x.planId):'note:'+e(t.x.id)}"><span class="db-eyebrow"><i style="background-position:${t.x.type==='artifact'?'38%':t.x.type==='reply'?'15%':'70%'} 50%"></i>${t.x.type==='artifact'?'Prepared':t.x.type==='rest'?'Suggestion':t.x.type==='reply'?'From your agent':'Note'}</span><strong>${e(t.x.title)}</strong><span class="db-clamp">${e(t.x.body)}</span>${t.x.artifact?`<span class="db-link">${ic('doc')}${e(t.x.label||'Open brief')}</span>`:''}${t.x.type==='reply'?`<span class="db-link">${(plans.find(p=>p.id===t.x.planId)?.kind||'research')!=='research'?'See the times':'See the plan'}</span>`:''}</button><button class="db-x" data-action="dismiss:${e(t.x.id)}" aria-label="Dismiss" title="Dismiss">×</button></div>`).join('');
    const upcoming = events.filter(v=>v.e>nowMin).length, biggest = gaps.slice().sort((a,b)=>(b[1]-b[0])-(a[1]-a[0]))[0];
    const allLine = [...markers.map(x=>x.title), ...allDay.map(x=>x.title)];
    return `<section class="db-left" aria-label="Today"><header class="db-head"><p class="db-eyebrow">${label(today,{weekday:'long'})} · ${label(today,{month:'long',day:'numeric',year:'numeric'})}</p><h1 class="db-title">Today</h1><p class="db-sub"><span><b>${upcoming}</b> still ahead</span>${biggest?`<span>Open from <b>${time(hm(biggest[0]))}</b> to <b>${time(hm(biggest[1]))}</b></span>`:''}</p>${allLine.length?`<p class="db-allday">All day · ${e(allLine.join(' · '))}</p>`:''}<div class="db-tools"><button class="db-icon" data-action="newevent:${today}:${hm(Math.min(1380, Math.max(540, Math.ceil((mins(clock(new Date())) + 15) / 15) * 15)))}-${hm(Math.min(1440, Math.max(540, Math.ceil((mins(clock(new Date())) + 15) / 15) * 15) + 60))}" aria-label="New event today" title="New event today">${ic('plus')}</button><button class="db-icon" data-action="theme-toggle" aria-pressed="${isDark()}" aria-label="${isDark()?'Light mode':'Dark mode'}" title="${isDark()?'Light mode':'Dark mode'}">${ic(isDark()?'sun':'moon')}</button><button class="db-icon" data-action="interests" aria-label="Interests and reading">${ic('leaf')}</button><button class="db-icon" data-action="menu" aria-label="Calendars and sources" aria-expanded="${menu}">${ic('more')}</button></div></header>${menu?menuView():''}<div class="db-today"><div class="db-plot" data-rs="${rs}" data-re="${re}">${hours}<div class="db-track"><button class="db-tl-hover" data-action="" aria-label="New event at this time" tabindex="-1"><b></b><i></i><span>${ic('plus')}</span></button>${open}${seek && seek.date===today ? `<div class="db-seek" style="top:${pct(mins(seek.start))}%;height:${Math.max(4, (mins(seek.end)-mins(seek.start))/total*100)}%"><span><b>${e(seek.kicker)}</b> ${e(seek.label)}</span><i class="db-seek-bar"></i></div>` : ''}<div class="db-sel" ${pendingRange&&pendingRange.date===today?`style="top:${pct(mins(pendingRange.start))}%;height:${(mins(pendingRange.end)-mins(pendingRange.start))/total*100}%"`:'hidden'}><span>${pendingRange&&pendingRange.date===today?`${time(pendingRange.start)} to ${time(pendingRange.end)}`:''}</span></div>${placed.length?blocks:`<p class="db-empty">Nothing timed in your visible calendars today.${hidden.size?' Some calendars are hidden.':''}</p>`}</div><div class="db-notes">${newer ? `<div class="db-setup-card db-update"><span class="db-eyebrow">${ic('spark')}Update · ${e(newer)}</span><strong>A new version of Today is ready</strong><span class="db-setup-go">In App Store, open Sources, then today, and press Check for updates.</span></div>` : ''}${setupLeft().length ? `<button class="db-setup-card" data-action="setup-resume"><span class="db-eyebrow">${ic('spark')}Setup · ${4 - setupLeft().length} of 4 done</span><strong>Finish setting up Today</strong><span class="db-setup-go">Continue<span class="db-ob-arr" aria-hidden="true">→</span></span></button>` : ''}${notes}<div class="db-plinth" aria-hidden="true">${scene('stones')}</div></div>${nowMin>=rs&&nowMin<=re?`<div class="db-now" style="top:${pct(nowMin)}%"><span>${time(clock(new Date()))}</span></div>`:''}</div></div></section>`;
  }
  function itemLarge(t, crowded){
    const x = t.x;
    if (t.kind==='event') { const learned = x.date < today && plainText(docs['event:'+x.id]?.body); return `<div class="db-evwrap"><button class="db-ev ${cls(x)} ${x.accepted?'accepted':''} ${morph.has(x.id)?'db-morph':''} ${saving.has(x.id)?'saving':''}" data-action="${x.accepted?'note:'+e(x.noteId):'event:'+e(x.id)}" style="--c:${color(x.sourceId)}">${aura(x.id)}${saving.has(x.id)?'<i class="db-saving" title="Adding to your calendar"></i>':''}<small>${span(x)}</small><strong>${e(x.title)}</strong>${x.date < today ? `<em class="db-learn ${learned?'done':''}">${learned ? e('Learned · ' + learned.slice(0,60)) : 'Note what you learned'}</em>` : imported(x)?'<em>Imported · attendance unknown</em>':hold(x)?'<em>Hold · not confirmed</em>':''}</button>${x.accepted?'':`<button class="db-x" data-action="hide:${e(x.id)}" aria-label="Hide this event" title="Hide this event">×</button>`}</div>`; }
    if (t.kind==='rest') return `<div class="db-tile"><button class="db-tile-main" data-action="note:${e(x.id)}"><span class="db-frame" style="--h:calc(${crowded?84:124}px*var(--s,1))">${scene(artFor(x))}</span><span class="db-cap"><span class="db-eyebrow">Suggestion${x.suggestion?' · '+time(x.suggestion.start):''}</span><strong>${e(x.title)}</strong>${crowded?'':`<p>${e(x.body)}</p>`}</span></button>${suggestionFor(x)?`<div class="db-accept-row">${acceptBtn(x)}</div>`:''}<button class="db-x" data-action="dismiss:${e(x.id)}" aria-label="Not for me" title="Not for me">×</button></div>`;
    if (t.kind==='artifact') return `<div class="db-evwrap"><button class="db-folio" data-action="note:${e(x.id)}"><span class="db-thumb" style="height:calc(${crowded?52:74}px*var(--s,1))">${scene('paper')}</span><span><span class="db-eyebrow">Prepared</span><strong>${e(x.title)}</strong><p>${e(x.body)}</p>${crowded?'':`<span class="db-link">${ic('doc')}${e(x.label||'Open brief')}${accepted.has(x.id)?' · time held':''}</span>`}</span></button><button class="db-x" data-action="dismiss:${e(x.id)}" aria-label="Dismiss this brief" title="Dismiss this brief">×</button></div>`;
    if (t.kind==='idea') return `<div class="db-idea ${x.working?'working':''} ${fresh.has(x.id)?'db-fresh':''}"><button class="db-idea-main" data-action="${x.summary?'plan:'+e(x.planId):'note:'+e(x.id)}"><span class="db-eyebrow">${ideaLabel(x)}${x.time?' · '+time(x.time):''}</span><strong>${e(x.title)}</strong>${crowded?'':`<span class="db-d">${e(x.body)}</span>`}</button>${x.summary?'':`<div class="db-accept-row">${acceptBtn(x)}</div>`}<button class="db-x" data-action="dismiss:${e(x.summary?'plan-'+x.planId:x.id)}" aria-label="Not for me" title="Not for me">×</button></div>`;
    return `<button class="db-aside" data-action="note:${e(x.id)}"><strong>${e(x.title)}</strong> ${e(x.body)}</button>`;
  }
  function itemChip(t){
    const x = t.x;
    if (t.kind==='event') return `<button class="db-chip ${cls(x)} ${x.accepted?'accepted':''} ${morph.has(x.id)?'db-morph':''}" data-action="${x.accepted?'note:'+e(x.noteId):'event:'+e(x.id)}" style="--c:${color(x.sourceId)}">${aura(x.id)}<span>${time(x.start)}</span><b>${e(x.title)}</b></button>`;
    return `<button class="db-chip ${t.kind==='rest'?'rest':t.kind==='idea'?'idea':'paper'} ${x.working?'working':''} ${fresh.has(x.id)?'db-fresh':''}" data-action="${x.summary?'plan:'+e(x.planId):'note:'+e(x.id)}"><b>${e(x.title)}</b></button>`;
  }
  function column(d, large){
    const isPast = d < today, items0 = dayItems(d), {markers, allDay} = items0, timed = isPast ? items0.timed.filter(t=>t.kind==='event') : items0.timed.filter(t=>t.kind!=='context' && t.kind!=='reply'), loaded = d <= rangeEnd();
    const head = large ? `<span class="db-num">${label(d,{day:'numeric'})}</span><span><span class="db-eyebrow">${rel(d)}</span><br><span class="db-mon">${label(d,{month:'long'})}</span></span>${markers.length?`<span class="db-mark">${e(markers.map(m=>m.title).join(', '))}</span>`:''}${!isPast?`<button class="db-plan" data-action="plantime:${d}" aria-label="New event on ${label(d,{weekday:'long'})}" title="New event">${ic('plus')}</button>`:''}` : `<span class="db-eyebrow">${label(d,{weekday:'short'})}</span><span class="db-num">${label(d,{day:'numeric'})}</span>`;
    const ad = allDay.map(x=>`<button class="db-ad" data-action="event:${e(x.id)}">${e(x.title)}</button>`).join('');
    const crowded = timed.reduce((w,t)=>w+(t.kind==='event'||t.kind==='idea'?1:t.kind==='context'?.5:2),0) >= 5;
    const limit = large ? 99 : 5;
    let items = timed.slice(0,limit).map(t=>({at:t.at, html: large?itemLarge(t,crowded):itemChip(t)}));
    if (large && !isPast && loaded) {
      const from = d === today ? Math.ceil((mins(clock(new Date())) + 15)/15)*15 : 480;
      const slots = gapsIn(busyOn(d), from, 1320, 30).map(([a,b2]) => { const st = Math.ceil(a/15)*15; return {at: st - .5, html:`<div class="db-slotwrap"><button class="db-slot" data-action="newevent:${d}:${hm(st)}-${hm(b2)}" aria-label="New event on ${label(d,{weekday:'long'})}, open ${time(hm(st))} to ${time(hm(b2))}" title="New event"><i class="db-slot-line"></i><span class="db-slot-plus">${ic('plus')}</span></button></div>`}; }).filter(x => x.html);
      items = [...items, ...slots].sort((p,q)=>p.at-q.at);
    }
    if (seek && seek.date === d) { items.push({at: mins(seek.start) - 0.3, html: large ? `<div class="db-seekcard" role="status"><span class="db-eyebrow">${e(seek.kicker)}<em class="db-dots"><b></b><b></b><b></b></em></span><strong>${e(seek.label)}</strong><i class="db-seek-bar"></i></div>` : `<span class="db-chip db-seekchip"><b>${e(seek.kicker)}…</b></span>`}); items.sort((p0, q0) => p0.at - q0.at); }
    items = items.map(x=>x.html).join('');
    const more = timed.length>limit ? `<button class="db-more" data-action="day:${d}">+${timed.length-limit} more</button>` : '';
    const empty = !loaded ? '<span class="db-quiet">Not loaded yet.</span>' : (!timed.length && !allDay.length ? (large ? `<button class="db-tile db-openday" data-action="day:${d}"><span class="db-frame">${scene('sand')}</span><span class="db-cap"><span class="db-eyebrow">Open day</span><strong>Nothing planned yet.</strong></span></button>` : '<span class="db-quiet">Open</span>') : '');
    return `<div class="db-col ${flash===d?'db-flash':''} ${isPast?'past':''}" data-day="${d}" aria-label="${label(d,{weekday:'long',month:'long',day:'numeric'})}"><div class="db-col-head">${head}</div><div class="db-col-body">${ad}${items}${more}${empty}</div></div>`;
  }
  function monthPage(i){
    const first = monthStart(i), offset = date(first).getUTCDay(), start = add(first,-offset), month = first.slice(0,7);
    const last = add(monthStart(i+1),-1), weeks = Math.ceil((offset + diff(first,last) + 1)/7);
    let cells = ['SUN','MON','TUE','WED','THU','FRI','SAT'].map(w=>`<span class="db-wd" aria-hidden="true">${w}</span>`).join('');
    for (let k=0;k<weeks*7;k++) {
      const d = add(start,k), {allDay, timed} = dayItems(d), list = [...allDay.map(x=>({kind:'event',x})), ...timed];
      const lines = list.slice(0,3).map(t=>`<i class="${t.kind==='event'?'':t.kind==='rest'?'rest':t.kind==='idea'?'idea':'paper'}" style="--c:${t.kind==='event'?color(t.x.sourceId):'transparent'}">${e(t.x.title)}</i>`).join('') + (list.length>3?`<i class="more">+${list.length-3} more</i>`:'');
      cells += `<button class="db-cell ${d.slice(0,7)!==month?'out':''} ${d<today?'past':''} ${d===today?'today':''}" data-action="cell:${d}" aria-label="${label(d,{weekday:'long',month:'long',day:'numeric'})}, ${list.length} item${list.length===1?'':'s'}"><b>${label(d,{day:'numeric'})}</b>${d<=rangeEnd()?lines:''}</button>`;
    }
    return `<div class="db-page dm" data-page="${i}" aria-label="${rangeLabel('month',i)}"><div class="db-mgrid" style="grid-template-rows:auto repeat(${weeks},minmax(0,1fr))">${cells}</div></div>`;
  }
  function pages(){
    const n = pageCount(view); let out = '';
    for (let i=0;i<n && view==='month';i++) {
      out += monthPage(i); continue;
    }
    if (strip(view)) { const len = Number(view), days = dayIndex(rangeEnd()) + 1; return `<div class="db-page d${len} db-strip" data-page="0">${Array.from({length: days}, (_, k) => column(add(stripStart, k), len === 3)).join('')}</div>`; }
    return out;
  }
  function aheadView(){
    const tabs = [['3','3 days'],['7','Week'],['month','Month']];
    return `<section class="db-right" aria-label="Looking ahead"><header class="db-head">${busy?'<i class="db-progress" aria-hidden="true"></i>':''}<p class="db-eyebrow">${isBack(view,page[view])?'What you learned':'Plan gently'}</p><div class="db-headrow"><h2 class="db-title" data-back="${isBack(view,page[view])}">${isBack(view,page[view])?'Looking back':'Looking ahead'}</h2><div class="db-views" role="tablist" aria-label="Looking ahead range" style="--tab:${tabs.findIndex(t=>t[0]===view)}">${tabs.map(([v,l])=>`<button role="tab" aria-selected="${v===view}" data-action="view:${v}" tabindex="${v===view?0:-1}">${l}</button>`).join('')}<i aria-hidden="true"></i></div><div class="db-tools"><button class="db-home" data-action="home" hidden>Tomorrow</button><span class="db-range" aria-live="polite"></span><button class="db-icon" data-action="previous" aria-label="Previous">${ic('left')}</button><button class="db-icon" data-action="next" aria-label="Next">${ic('right')}</button></div></div></header><div class="db-pager" tabindex="0" aria-roledescription="carousel" aria-label="Looking ahead. Swipe or use the arrow keys to move between pages."><div class="db-rail">${pages()}</div></div><div class="db-promptwrap">${whom ? whomView() : ''}<form class="db-context"><input name="context" value="${e(contextDraft)}" aria-label="Leave context for the agent" placeholder="${e(contextHint||'Ask for something, like a museum Saturday afternoon…')}" autocomplete="off" maxlength="1000"><button type="submit" aria-label="Save context">${ic('up')}</button></form></div><footer class="db-foot"><span>${busy?'Updating…':e(sourceLine())}</span><button data-action="status">${data.snapshot?'Snapshot':'Updated'} · ${new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'}).format(new Date(data.fetchedAt||Date.now()))}</button></footer></section>`;
  }
  function sourceLine(){
    const p = data.coverage?.providers || [];
    if (!p.length) return '';
    const calendars = new Set(p.filter(x=>x.kind==='calendar'&&x.status==='checked').map(x=>x.account)).size;
    const mail = p.filter(x=>x.kind==='mail'&&x.status==='checked').length;
    return `${calendars} calendar account${calendars===1?'':'s'} · ${mail?`mail context from ${mail} source${mail===1?'':'s'}`:'calendar context only'}`;
  }
  function menuView(){
    const groups = {}; (data.calendars||[]).forEach(c=>{(groups[c.accountLabel||'Calendars'] ||= []).push(c)});
    const tone = {checked:'#5f7d63',waiting:'#c79a4b',unavailable:'#a9532e',failed:'#a9532e'};
    const providers = (data.coverage?.providers||[]).map(p=>`<div class="db-src-row" style="--s:${tone[p.status]||'#999'}"><b>${e(p.name)}${p.account?' · '+e(p.account):''}</b>${e(p.note||p.status)}</div>`).join('');
    return `<div class="db-menu">${Object.entries(groups).map(([g,cs])=>`<h3>${e(g)}</h3>${cs.map(c=>`<label><span class="db-sw" style="background:${color(c.id)};box-shadow:0 0 0 3px color-mix(in srgb,${color(c.id)} 30%,transparent),0 0 10px ${color(c.id)}"></span>${e(c.name)}<input type="checkbox" data-calendar="${e(c.id)}" ${hidden.has(c.id)?'':'checked'} aria-label="Show ${e(c.name)}"></label>`).join('')}`).join('')}${providers?`<h3>Sources</h3>${providers}`:''}${services&&[...CAL,...MAIL].some(([id])=>svc(id)&&!svc(id).connected&&svc(id).available!==false)?`<h3>Add</h3>${[...CAL,...MAIL].filter(([id])=>svc(id)&&!svc(id).connected&&svc(id).available!==false).map(([id,name])=>`<button class="db-menu-connect" data-action="connect:${e(id)}">${ic('plus')}${e(name)}</button>`).join('')}`:''}${prefs.dismissed.length + prefs.hiddenEvents.length ? `<h3>Hidden</h3><p>${prefs.hiddenEvents.length} event${prefs.hiddenEvents.length===1?'':'s'}, ${prefs.dismissed.filter(d=>d.title).length} suggestion${prefs.dismissed.filter(d=>d.title).length===1?'':'s'}</p><button class="db-menu-connect" data-action="unhide-all">Show everything again</button>` : ''}<h3>Appearance</h3><div class="db-seg" role="group" aria-label="Appearance">${[['auto','Match Bonsai'],['light','Light'],['dark','Dark']].map(([v,l])=>`<button data-action="theme:${v}" aria-pressed="${(prefs.theme||'auto')===v}">${l}</button>`).join('')}</div><button class="db-menu-connect db-startover" data-action="start-over">Start over as a new user</button><button class="db-refresh" data-action="refresh">${busy?'Updating…':'Refresh now'}</button></div>`;
  }
  function sideHTML(side){ return side === 'left' ? (stacks.left.length ? docSection('left') : needsSetup() ? setupView() : todayView()) : (stacks.right.length ? docSection('right') : aheadView()); }
  function render(opts = {}){
    if (disposed) return;
    applyTheme();
    if (ob) { const toast = shell.querySelector('.db-toast'), still = ob.shown === ob.step; shell.innerHTML = onboardView(still); ob.shown = ob.step; if (toast) shell.append(toast); afterOnboardRender(); return; }
    const active = document.activeElement, selector = active && shell.contains(active) && active.dataset?.action ? `[data-action="${CSS.escape(active.dataset.action)}"]` : null;
    if (!data && needsSetup() && booted) { shell.innerHTML = setupView() + `<section class="db-right" aria-label="Looking ahead"><header class="db-head"><p class="db-eyebrow">Plan gently</p><h2 class="db-title">Looking ahead</h2></header><div class="db-docscroll"><p class="db-quiet" style="padding:20px 56px">Your next days appear here once a calendar is connected.</p></div></section>`; shell.append(bubble); return; }
    if (!data) { if (lastError) shell.innerHTML = `<div class="db-message"><p>${e(lastError)}</p><button data-action="refresh" style="margin-top:15px;text-decoration:underline">Try again</button></div>`; else { shell.innerHTML = loadingView(); shell.append(bubble); startLoading(); } return; }
    page[view] = Math.min(page[view], pageCount(view)-1);
    const sides = opts.only ? [opts.only] : ['left','right'];
    for (const s of sides) if (dirty[s]) save(s);
    seq = 0;
    const existing = opts.only && shell.querySelector(`:scope > .db-${opts.only}`);
    if (existing) { const tpl = document.createElement('template'); tpl.innerHTML = sideHTML(opts.only); existing.replaceWith(tpl.content); }
    else { const toast = shell.querySelector('.db-toast'); shell.innerHTML = sideHTML('left') + '' + sideHTML('right'); if (toast) shell.append(toast); shell.append(bubble); }
    const pager = shell.querySelector('.db-pager');
    if (pager && sides.includes('right')) { setX(-page[view] * stepW()); bindPager(pager); updateNav(); fitColumns(); }
    for (const s of sides) if (stacks[s].length) bindDoc(s);
    if (sides.includes('left') && !stacks.left.length) bindTimeline();
    if (working) setWorking(working);
    if (opts.cascade) for (const sd of sides) cascade(shell.querySelector(`:scope > .db-${sd}`));
    const target = opts.focus ? shell.querySelector(opts.focus) : selector ? shell.querySelector(selector) : null;
    target?.focus({preventScroll:true});
  }
  function updateNav(){
    const r = shell.querySelector('.db-range'); if (r) r.textContent = rangeLabel(view,page[view]);
    const p = shell.querySelector('[data-action="previous"]'), n = shell.querySelector('[data-action="next"]');
    if (p) p.disabled = page[view] <= 0; if (n) n.disabled = page[view] >= pageCount(view)-1;
    const back = isBack(view, page[view]), t = shell.querySelector('.db-right > .db-head .db-title'), eb = shell.querySelector('.db-right > .db-head > .db-eyebrow');
    if (t && t.dataset.back !== String(back)) { t.dataset.back = String(back); t.textContent = back ? 'Looking back' : 'Looking ahead'; if (eb) eb.textContent = back ? 'What you learned' : 'Plan gently'; t.classList.remove('db-swap'); void t.offsetWidth; t.classList.add('db-swap'); }
    if (strip(view)) { const a = page[view], b = a + Number(view); shell.querySelectorAll('.db-strip > .db-col').forEach((el, k) => { const off = k < a || k >= b; if (el.inert !== off) el.inert = off; }); shell.querySelector('.db-strip')?.setAttribute('aria-hidden', 'false'); shell.querySelector('.db-strip')?.setAttribute('aria-label', rangeLabel(view, page[view])); }
    else shell.querySelectorAll('.db-page').forEach((el,i)=>{ el.inert = i !== page[view]; el.setAttribute('aria-hidden', String(i !== page[view])); });
    const hb = shell.querySelector('.db-home'); if (hb) { const atHome = view === 'month' ? page.month === 0 : page[view] === before(view); if (hb.hidden !== atHome) hb.hidden = atHome; hb.textContent = view === 'month' ? 'This month' : 'Tomorrow'; }
    fitHeader();
  }
  let railX = 0, suppressClick = false;
  function setX(x){ railX = x; const r = shell.querySelector('.db-rail'); if (r) r.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; }
  function stopAnim(){ if (!animating) return; cancelAnimationFrame(anim); animating = false; }
  function animateTo(i, v0 = 0){
    const pager = shell.querySelector('.db-pager'); if (!pager) return;
    const target = -i * stepW();
    cancelAnimationFrame(anim);
    if (reduced() || document.hidden) { animating = false; setX(target); return; }
    animating = true;
    const guard = setTimeout(() => { if (animating) { cancelAnimationFrame(anim); animating = false; setX(target); } }, 1600);
    let x = railX, v = Math.max(-4000, Math.min(4000, v0)), last = performance.now(); const k = 230, c = 2 * Math.sqrt(k) * .88;
    const step = t => { const dt = Math.min(.032, (t - last) / 1000); last = t; v += (-k * (x - target) - c * v) * dt; x += v * dt; setX(x); if (Math.abs(v) < 5 && Math.abs(x - target) < .5) { clearTimeout(guard); setX(target); animating = false; return; } anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  function go(i, v0 = 0){ const n = Math.max(0, Math.min(pageCount(view) - 1, i)), moved = n !== page[view]; page[view] = n; updateNav(); animateTo(n, v0); if (moved && !strip(view)) cascade(shell.querySelector(':scope > .db-right')); }
  function bindPager(pager){
    const W = () => stepW() || 1;
    let g = null, quiet = 0, coolUntil = 0, pd = null;
    const begin = () => { stopAnim(); g = {start: -page[view] * W(), dx: 0, samples: []}; };
    const move = dx => {
      g.dx += dx;
      const min = -(pageCount(view) - 1) * W();
      let x = g.start + g.dx;
      if (x > 0) x *= .3; else if (x < min) x = min + (x - min) * .3;
      if (!strip(view)) x = Math.max(g.start - W() * 1.02, Math.min(g.start + W() * 1.02, x));
      setX(x);
      const t = performance.now(); g.samples.push([t, x]); g.samples = g.samples.filter(p => t - p[0] < 110);
    };
    const end = wheel => {
      if (!g) return;
      const sm = g.samples, v = sm.length > 1 ? (sm[sm.length - 1][1] - sm[0][1]) / Math.max(16, sm[sm.length - 1][0] - sm[0][0]) * 1000 : 0;
      const moved = railX - g.start; let i = page[view];
      if (strip(view)) { const projected = railX + (wheel ? 0 : v * 0.12), cap = Number(view); i = Math.max(page[view] - cap, Math.min(page[view] + cap, Math.round(-projected / W()))); if (i === page[view]) { if (moved < -W() * .16 || v < -380) i += 1; else if (moved > W() * .16 || v > 380) i -= 1; } }
      else if (moved < -W() * .16 || v < -380) i += 1; else if (moved > W() * .16 || v > 380) i -= 1;
      g = null; go(i, v);
    };
    pager.addEventListener('wheel', ev => {
      if (Math.abs(ev.deltaX) <= Math.abs(ev.deltaY) * 1.1) return;
      ev.preventDefault();
      const now = performance.now();
      if (now < coolUntil) { coolUntil = now + 170; return; }
      if (!g) begin();
      move(-ev.deltaX * (ev.deltaMode === 1 ? 18 : 1));
      clearTimeout(quiet);
      quiet = setTimeout(() => { end(true); coolUntil = performance.now() + 220; }, 80);
    }, {passive:false});
    pager.addEventListener('pointerdown', ev => { if (ev.button !== 0 || ev.pointerType === 'mouse' && ev.target.closest('a')) return; pd = {id: ev.pointerId, x: ev.clientX, y: ev.clientY, last: ev.clientX, drag: false}; });
    pager.addEventListener('pointermove', ev => {
      if (!pd || ev.pointerId !== pd.id) return;
      if (!pd.drag) { const dx = ev.clientX - pd.x, dy = ev.clientY - pd.y; if (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(dy) * 1.2) return; pd.drag = true; try { pager.setPointerCapture(pd.id); } catch {} pager.classList.add('dragging'); begin(); }
      move(ev.clientX - pd.last); pd.last = ev.clientX;
    });
    const up = ev => { if (!pd || ev.pointerId !== pd.id) return; if (pd.drag) { pager.classList.remove('dragging'); suppressClick = true; setTimeout(() => { suppressClick = false; }, 0); end(); } pd = null; };
    pager.addEventListener('pointerup', up); pager.addEventListener('pointercancel', up);
    pager.addEventListener('keydown', ev => { if (ev.target !== pager) return; if (ev.key === 'ArrowRight' || ev.key === 'PageDown') { ev.preventDefault(); go(page[view] + 1); } else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { ev.preventDefault(); go(page[view] - 1); } });
  }
  // The Looking ahead header keeps title, range toggle and arrows on one row: full size, then a size smaller, then wrapped.
  function fitHeader(){
    const hr = shell.querySelector('.db-headrow'); if (!hr || !hr.offsetWidth) return;
    const [t, v, tl] = hr.children;
    const ok = () => { const r = hr.getBoundingClientRect(), a = t.getBoundingClientRect(), b = v.getBoundingClientRect(), c = tl.getBoundingClientRect(); return b.left >= a.left + t.scrollWidth + 12 && b.right <= c.left - 12 && c.right <= r.right + 1 && b.top < a.bottom && c.top < a.bottom; };
    for (const mode of ['full', 'tight', 'compact', 'wrap']) { hr.dataset.fit = mode; if (mode === 'wrap' || ok()) break; }
  }
  function fitColumns(){
    shell.querySelectorAll('.db-right .db-col-body').forEach(body => {
      body.querySelector(':scope > .db-more.auto')?.remove();
      [...body.children].forEach(c => { c.hidden = false; });
      body.style.removeProperty('--s');
      if (body.scrollHeight <= body.clientHeight + 1) return;
      for (const f of [.93, .86, .8]) { body.style.setProperty('--s', String(Math.max(.9, Math.round(scale * f * 100) / 100))); if (body.scrollHeight <= body.clientHeight + 1) return; }
      const items = [...body.children].filter(c => !c.classList.contains('db-more')), day = body.closest('.db-col')?.dataset.day;
      const more = document.createElement('button'); more.className = 'db-more auto'; more.dataset.action = `day:${day}`; body.append(more);
      let hiddenCount = 0;
      for (let i = items.length - 1; i > 0 && body.scrollHeight > body.clientHeight + 1; i--) { items[i].hidden = true; hiddenCount++; more.textContent = `+ ${hiddenCount} more`; }
      if (!hiddenCount) more.remove();
    });
  }
  function setView(v, focusDate){
    if (v===view && !focusDate) return;
    const anchor = focusDate || pageStart(view,page[view]); view = v;
    if (v==='month') { const a = date(today), b = date(anchor); page.month = Math.max(0,(b.getUTCFullYear()-a.getUTCFullYear())*12 + b.getUTCMonth()-a.getUTCMonth()); }
    else { let pg = dayIndex(anchor) - (focusDate ? (v === '3' ? 1 : 3) : 0); if (anchor >= tomorrow) pg = Math.max(pg, before(v)); page[v] = Math.max(0, Math.min(pageCount(v)-1, pg)); }
    flash = focusDate || null; render({only:'right', cascade:true}); shell.querySelector(`[data-action="view:${v}"]`)?.focus({preventScroll:true}); setTimeout(()=>{ flash=null; },1900);
  }
  const longDate = d => label(d,{weekday:'long',month:'long',day:'numeric'});
  const shortDate = d => label(d,{weekday:'long',month:'short',day:'numeric'});
  const KEEP = new Set(['P','H2','H3','STRONG','B','EM','I','BLOCKQUOTE','UL','OL','LI','BR','A']);
  function clean(html){
    const t = document.createElement('template'); t.innerHTML = html;
    const walk = n => { for (const c of [...n.childNodes]) { if (c.nodeType === 3) continue; if (c.nodeType !== 1) { c.remove(); continue; } walk(c); if (c.tagName === 'DIV') { const p = document.createElement('p'); p.append(...c.childNodes); c.replaceWith(p); continue; } if (!KEEP.has(c.tagName)) { c.replaceWith(...c.childNodes); continue; } for (const at of [...c.attributes]) if (!(c.tagName === 'A' && at.name === 'href' && /^https?:\/\//i.test(at.value))) c.removeAttribute(at.name); if (c.tagName === 'A') { c.setAttribute('target','_blank'); c.setAttribute('rel','noreferrer'); } } };
    walk(t.content); return t.innerHTML.slice(0, 100000);
  }
  async function loadDocs(){ try { docs = bridge.loadDocs ? (await bridge.loadDocs()) || {} : JSON.parse(localStorage.getItem(DOCS_KEY) || '{}'); } catch { docs = {}; } }
  async function persist(key){ if (bridge.saveDoc) await bridge.saveDoc(key, docs[key] || null); else localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); }
  function docModel(item){
    const {kind, id} = item;
    if (kind === 'event') {
      const x = (data.events||[]).find(n=>n.id===id) || {id, title:'No longer on your calendar', date:today}; const c = cal(x.sourceId);
      const link = x.url && /^https?:\/\//.test(x.url) ? x.url : '';
      const facts = [['When', `${longDate(x.date)}<br>${span(x)}${x.start&&TZ_SHORT?' '+TZ_SHORT:''}`], x.location?['Where', e(x.location)]:null, x.organizer?['Host', e(x.organizer)]:null, x.people?['With', peopleLine(x)]:null, imported(x)?['Status','Imported feed. Attendance unknown.']:hold(x)?['Status','Hold. Not confirmed.']:null, link?['Link', `<a href="${e(link)}" target="_blank" rel="noreferrer">Join the meeting</a>`]:null].filter(Boolean);
      const found = (x.context||[]).map(cx=>`<p>${e(cx.text)}</p>`).join('');
      const mail = (data.coverage?.providers||[]).filter(p=>p.kind==='mail'), checked = mail.some(p=>p.status==='checked');
      const pastEv = x.date < today, norm = t => String(t||'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[\d:]+/g,'').replace(/\s+/g,' ').trim();
      const related = (data.events||[]).filter(o => o.id !== x.id && o.date < x.date && (norm(o.title) === norm(x.title) || (x.organizer && o.organizer === x.organizer)) && plainText(docs['event:'+o.id]?.body).length > 2).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,2);
      const last = related.map(o => `<div class="db-lasttime"><span class="db-eyebrow">From last time · ${shortDate(o.date)}</span><p>${e(plainText(docs['event:'+o.id].body).slice(0,320))}</p><button class="db-link" data-action="event:${e(o.id)}">Open that page</button></div>`).join('');
      const body = pastEv ? `<h2>What I learned</h2><p><br></p>${x.description?`<p>${e(x.description)}</p>`:''}` : `${x.description?`<p>${e(x.description)}</p>`:''}${found?`<h2>What I found</h2>${found}`:mail.length&&!checked?'<h2>What I found</h2><p><em>Related email has not been checked yet.</em></p>':''}<h2>Notes</h2><p><br></p>`;
      return {key:`event:${id}`, kind, kicker:`${pastEv?'Looking back · ':''}${c.name||'Calendar'} · ${shortDate(x.date)} · ${span(x)}`, color:color(x.sourceId), title:x.title, dek:x.location || x.people || '', byline:`From your ${c.name||''} calendar${c.kind==='primary'&&c.accountLabel?' · '+c.accountLabel:''}`, facts:`<dl class="db-facts">${facts.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>${last}`, body, placeholder: pastEv ? 'What did you learn? What should you remember next time?' : 'Write notes for this…', actions: `${link?`<a class="db-pill" href="${e(link)}" target="_blank" rel="noreferrer">Join</a>`:''}<button class="db-restore" data-action="hide:${e(x.id)}">Hide from Today</button>${deletable(x)?`<button class="db-restore db-danger" data-action="delete:${e(x.id)}">Delete from calendar</button>`:''}`, foot:`${x.uri?'Source · '+e(x.uri)+'<br>':''}Your edits stay in this app. ${deletable(x)?'Delete removes it from your calendar.':'Hiding keeps it on your calendar. To decline it, use the calendar it came from.'}`};
    }
    if (kind === 'note') {
      const x = findNote(id) || {id, title:'Note', body:'', type:'context', date:today};
      const doc = x.artifact && (data.artifacts||[]).find(a=>a.uri===x.artifact);
      const sg = suggestionFor(x);
      const notForMe = `<button class="db-restore" data-action="dismiss:${e(x.id)}">Not for me</button>`;
      const holdBtn = (sg ? (accepted.has(x.id) ? `<span class="db-doc-held">${ic('check')} Accepted · ${shortDate(sg.date)}, ${time(sg.start)} to ${time(sg.end)}</span>` : `<button class="db-pill" data-action="accept:${e(x.id)}">${ic('check')}Accept</button><span class="db-doc-hint">${shortDate(sg.date)} · ${time(sg.start)} to ${time(sg.end)}<br>Adds a private block to your calendar. No one is invited.</span>`) : '') + notForMe;
      const src = (x.sources||[]).map(s=>e(s.title||s.uri)).join(' · ');
      if (x.type === 'artifact') return {key:`note:${id}`, kind, kicker:`Prepared · ${shortDate(x.date)}`, title: doc?.title || x.title, dek: x.body, byline:'Prepared by your agent', hero:`<div class="db-hero">${scene('paper')}</div>`, body: doc ? md(doc.body) : `<p>${e(x.body)}</p><p><em>The full text was not included in this refresh.</em></p>`, placeholder:'Write…', actions: holdBtn, foot: x.artifact ? `Saved at ${e(x.artifact)}<br>Your edits stay in this app.` : ''};
      if (x.type === 'idea') return {key:`note:${id}`, kind, kicker:`${ideaLabel(x)} · ${shortDate(x.date)}${x.time?' · '+time(x.time):''}`, title:x.title, dek:x.body, byline: x.local ? 'From what you are reading' : 'An idea for your free time', body:'<p><br></p>', placeholder: x.ideaKind==='read' ? 'Where you are in it, or what you want to remember…' : 'Thoughts, or what you would like instead…', actions: holdBtn, foot: [src, x.ideaKind==='place' ? 'Check hours and details before you go.' : ''].filter(Boolean).join('<br>')};
      if (x.type === 'rest') return {key:`note:${id}`, kind, kicker:`Suggestion · ${shortDate(x.date)}${x.suggestion?' · '+time(x.suggestion.start):''}`, title:x.title, dek:x.body, byline:'A suggestion from your agent', hero:`<div class="db-hero">${scene(artFor(x))}</div>`, body:'<p><br></p>', placeholder:'How would you like to use this time? Your agent reads this when it plans.', actions: holdBtn, foot: src};
      return {key:`note:${id}`, kind, kicker:`Note · ${shortDate(x.date||today)}`, title:x.title, dek:'', byline:'A note from your agent', body:`<p>${e(x.body)}</p>`, placeholder:'Write…', actions: holdBtn, foot: src};
    }
    if (kind === 'day') {
      const {markers, allDay, timed} = dayItems(id), count = timed.filter(t=>t.kind==='event').length + allDay.length;
      const rows = [...markers, ...allDay].map(x=>`<button data-action="event:${e(x.id)}" style="--c:${color(x.sourceId)}"><span>All day</span><b>${e(x.title)}</b></button>`).join('') + timed.map(t=>`<button data-action="${t.kind==='event'?'event':'note'}:${e(t.x.id)}" style="--c:${t.kind==='event'?color(t.x.sourceId):'transparent'}"><span>${t.kind==='event'?span(t.x):t.kind==='rest'?'Suggestion':t.kind==='artifact'?'Prepared':'Note'}</span><b>${e(t.x.title)}</b></button>`).join('');
      const stretches = id >= today ? gapsIn(busyOn(id), id === today ? Math.ceil((mins(clock(new Date())) + 15)/15)*15 : 600, 1290, 45).map(([a,b2])=>`<div class="db-option"><div><span class="db-eyebrow">Open</span><strong>${time(hm(Math.ceil(a/15)*15))} to ${time(hm(b2))}</strong></div><span class="db-option-actions"><button class="db-accept" data-action="newevent:${id}:${hm(Math.ceil(a/15)*15)}-${hm(b2)}">${ic('plus')}Event</button></span></div>`).join('') : '';
      return {key:`day:${id}`, kind, kicker:rel(id), title:longDate(id), facts: stretches ? `<div class="db-options" style="margin-bottom:30px">${stretches}</div>` : '', dek: count ? `${count} on the calendar.` : 'Nothing on the calendar yet.', byline:'Your day', agenda: rows ? `<div class="db-agenda">${rows}</div>` : '<p class="db-doc-hint" style="margin-bottom:28px">Nothing in the visible calendars. That is not a claim that the whole day is free.</p>', body:'<p><br></p>', placeholder:'Notes for the day…', foot:''};
    }
    if (kind === 'newevent') {
      const [, d, gs, ge, exact] = id.match(/^(\d{4}-\d{2}-\d{2}):(\d{2}:\d{2})-(\d{2}:\d{2})(!?)$/) || [, today, '12:00', '13:00', ''], start = mins(gs), end = exact ? mins(ge) : Math.min(mins(ge), start + 60);
      const cals = (data?.calendars||[]).filter(c=>c.writable && c.kind==='primary');
      const opts = (sel, from, to) => { let o = ''; for (let t = from; t <= to; t += 15) o += `<option value="${hm(t)}" ${t===sel?'selected':''}>${time(hm(t))}</option>`; return o; };
      const form = `<div class="db-newev"><label><span>Starts</span><select name="ne-start">${opts(start, 360, 1425)}</select></label><label><span>Ends</span><select name="ne-end">${opts(end, 375, 1440)}</select></label><label class="db-ne-cal"><span>Calendar</span><select name="ne-cal">${cals.map(c=>`<option value="${e(c.id)}">${e(c.name)}${c.accountLabel&&c.accountLabel!==c.name?' · '+e(c.accountLabel):''}</option>`).join('')}</select></label></div><p class="db-doc-hint" style="margin:-18px 0 30px">Open ${time(gs)} to ${time(ge)}. Pick any time; you will see if it overlaps something.</p>`;
      return {key:`newevent:${id}`, kind, kicker:`New event · ${longDate(d)}`, title:'', dek:'', titlePlaceholder:'Name this event', dekPlaceholder:'Where, or a short note', byline:'Private to you. No one is invited.', facts:form, body:'<p><br></p>', placeholder:'Notes for the event, if you want any…', actions: cals.length ? `<button class="db-pill" data-action="create:${e(id)}">${ic('check')}Add to calendar</button>` : '<p class="db-doc-hint">Connect a calendar you can edit to add events.</p>', foot:'The event goes on the calendar you pick, with no guests. Your other calendars are checked first.'};
    }
    if (kind === 'open') {
      const [s,en] = id.split('-'), inside = notesOn(today).filter(n=>n.type==='idea' && mins(n.time)>=mins(s) && mins(n.time)<mins(en));
      return {key:`open:${today}:${id}`, kind, kicker:`Open time · ${rel(today)}`, title:`${time(s)} to ${time(en)}`, dek:`${dur(mins(en)-mins(s))} with nothing planned.`, byline:'Space to use, or to leave alone', actions:`<button class="db-pill" data-action="newevent:${today}:${id}">${ic('plus')}Add an event</button>`, hero:`<div class="db-hero">${scene('sand')}</div>`, agenda: inside.length ? `<div class="db-agenda">${inside.map(n=>`<button data-action="note:${e(n.id)}"><span>${ideaLabel(n)}</span><b>${e(n.title)}<small>${e(n.body)}</small></b></button>`).join('')}</div>` : '', body:'<p><br></p>', placeholder:'What would you like to do with this time? Your agent reads this when it plans.', foot:''};
    }
    if (kind === 'plan') {
      const pl = plans.find(q=>q.id===id);
      if (!pl) return {key:`plan:${id}`, kind, editable:false, kicker:'Plan', title:'This plan is no longer here', dek:'', byline:'', foot:''};
      if (pl.kind !== 'research') {
        const rows = (pl.items||[]).map(it=>`<div class="db-option"><div><span class="db-eyebrow">${shortDate(it.date)} · ${time(it.suggestion.start)} to ${time(it.suggestion.end)}</span><strong>${e(it.title)}</strong><p>${e(it.body)}</p></div>${acceptBtn(it)}</div>`).join('');
        const open = (pl.items||[]).filter(it=>!accepted.has(it.id)).length;
        return {key:`plan:${id}`, kind, editable:false, kicker:'Plan · this week', title:pl.title, dek:`You said: “${pl.text}”`, byline:'Found across all your calendars', agenda: rows ? `<div class="db-options">${rows}</div>` : '<p class="db-doc-hint">No open time fit this week.</p>', actions: open > 1 ? `<button class="db-pill" data-action="acceptall:${e(id)}">${ic('check')}Accept all ${open}</button><span class="db-doc-hint">Private blocks, no guests.<br>Remove any of them later from your calendar.</span>` : '', foot:'Times avoid every connected calendar and leave a little room around other plans. Imported events you may not attend are ignored.'};
      }
      const r = pl.range, when = `${shortDate(r.date)} · ${time(r.start)} to ${time(r.end)}`, ready = pl.status === 'ready';
      const rows = (pl.items||[]).map(it=>`<div class="db-option"><div>${it.walk?`<span class="db-eyebrow">${e(it.walk)}</span>`:''}<strong>${e(it.title)}</strong><p>${e(it.body)}</p><p class="db-doc-hint">${e(it.address||'')}${it.url?` · <a href="${e(it.url)}" target="_blank" rel="noreferrer">Website</a>`:''}</p></div>${acceptBtn(it)}</div>`).join('');
      return {key:`plan:${id}`, kind, editable:false, kicker:`Research · ${when}`, title:pl.title, dek:`You asked: “${pl.text}”`, byline: ready ? `Researched by your agent${pl.anchor?' · near '+pl.anchor.title:''}` : 'Your agent is looking into this', hero: ready ? '' : `<div class="db-hero">${scene('sand')}</div>`, agenda: ready ? `<div class="db-options">${rows}</div>${pl.note?`<p class="db-doc-hint" style="margin-bottom:28px">${e(pl.note)}</p>`:''}` : `<p class="db-doc-hint" style="font-size:15px;margin-bottom:28px">${e(pl.status==='failed' ? (pl.error||'The research did not finish.') : 'I am taking a deeper look and will share options here when they are ready. You can leave this page.')}</p>`, foot: ready ? 'Check hours and details before you go. Accept holds the time on your calendar. It does not book anything.' : ''};
    }
    if (kind === 'interests') {
      const tags = list => (interests[list]||[]).map((v,i)=>`<span class="db-tag">${e(v)}<button data-action="untag:${list}:${i}" aria-label="Remove ${e(v)}">×</button></span>`).join('');
      const html = `<div class="db-interests"><section><h2>Reading now</h2><p class="db-doc-hint">Books you are in the middle of. Your agent finds quiet time for them.</p><div class="db-tags">${tags('reading')}</div><form class="db-add" data-list="reading"><input name="v" maxlength="160" placeholder="Add a book, like Piranesi by Susanna Clarke" aria-label="Add a book you are reading"><button type="submit">Add</button></form></section><section><h2>Interests</h2><p class="db-doc-hint">Topics and things you enjoy. Used for book and place ideas.</p><div class="db-tags">${tags('topics')}</div><form class="db-add" data-list="topics"><input name="v" maxlength="80" placeholder="Add an interest, like architecture or live jazz" aria-label="Add an interest"><button type="submit">Add</button></form></section><section><h2>People</h2><p class="db-doc-hint">Who Today knows you mean, from your calendars and what you confirmed. Remove anyone it got wrong.</p><div class="db-tags">${people.map((q,i)=>`<span class="db-tag" title="${e(personDetail(q))}">${e(q.name)}${(q.aliases||[]).length?` <small>${e(q.aliases.join(', '))}</small>`:''}<button data-action="forget:${i}" aria-label="Forget ${e(q.name)}">×</button></span>`).join('') || '<span class="db-doc-hint">No one yet. Mention someone in a request, like coffee with Dan.</span>'}</div></section><section><h2>Usually around</h2><p class="db-doc-hint">A neighborhood, so ideas stay close when your calendar has no location.</p><form class="db-add" data-list="near"><input name="v" maxlength="120" value="${e(interests.near||'')}" placeholder="Like Fort Greene, Brooklyn" aria-label="Neighborhood you are usually in"><button type="submit">Save</button></form></section></div>`;
      return {key:'interests', kind, editable:false, kicker:'Interests', title:'What you are into', dek:'Your agent uses this to suggest books, reading time, and places near where you will be during a break.', byline:'Private to you', agenda:html, foot:'Ideas stay quiet and never go on your calendar unless you hold them.'};
    }
    const tone = {checked:'#5f7d63',waiting:'#c79a4b',unavailable:'#a9532e',failed:'#a9532e'};
    const rows = (data.coverage?.providers||[]).map(p=>`<div style="--c:${tone[p.status]||'#999'}"><span>${e(p.status)}</span><b>${e(p.name)}${p.account?' · '+e(p.account):''}<small>${e(p.note||'')}</small></b></div>`).join('');
    return {key:'sources', kind:'sources', editable:false, kicker:'Sources', title:'Where this comes from', dek:data.coverage?.note||'', byline:`${data.snapshot?'Snapshot':'Updated'} at ${new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'}).format(new Date(data.fetchedAt||Date.now()))}`, agenda:`<div class="db-agenda">${rows}</div>`, actions:'<button class="db-pill" data-action="refresh">Refresh now</button>', foot:''};
  }
  function docSection(side){
    const item = stacks[side][stacks[side].length-1], m = docModel(item), saved = m.editable === false ? null : docs[m.key], editable = m.editable !== false;
    const backLabel = stacks[side].length > 1 ? 'Back' : side === 'left' ? 'Today' : 'Looking ahead';
    const title = saved?.title || m.title, dek = saved ? saved.dek : m.dek, body = saved?.body ?? m.body;
    const edited = saved?.updatedAt ? ` · Edited ${new Intl.DateTimeFormat('en-US',{timeZone:TZ,month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(saved.updatedAt))}` : '';
    return `<section class="db-${side} db-docmode" aria-label="${side==='left'?'Today':'Looking ahead'} · ${e(m.title)}"><div class="db-docwrap" data-side="${side}"><div class="db-docbar"><button class="db-back" data-action="back:${side}" aria-label="Back to ${backLabel}">${ic('left')}<span>${backLabel}</span></button><span class="db-save" aria-live="polite">${e(saveText[side]||'')}</span>${saved?`<button class="db-restore" data-action="restore:${side}">Restore original</button>`:''}</div><div class="db-docscroll"><article class="db-docpage" data-key="${e(m.key)}" data-kind="${m.kind}"><p class="db-kicker" style="--c:${m.color||'transparent'}">${m.color?'<i></i>':''}${e(m.kicker)}</p><h1 class="db-doc-title" ${editable?'contenteditable="plaintext-only" spellcheck="true"':''} data-placeholder="${e(m.titlePlaceholder||'Title')}">${e(title)}</h1>${dek||editable?`<p class="db-doc-dek" ${editable?'contenteditable="plaintext-only"':''} data-placeholder="${e(m.dekPlaceholder||'Add a short line')}">${e(dek)}</p>`:''}<p class="db-byline"><i class="db-avatar" aria-hidden="true"></i><span>${e(m.byline)}${edited}</span></p>${m.hero||''}${m.facts||''}${m.agenda||''}${editable?`<div class="db-doc-body" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true" aria-label="Page text" data-placeholder="${e(m.placeholder||'Write something…')}">${body}</div>`:''}${m.actions?`<div class="db-doc-actions">${m.actions}</div><p class="db-doc-note" aria-live="polite"></p>`:''}${m.foot?`<p class="db-doc-foot">${m.foot}</p>`:''}</article></div></div></section>`;
  }
  function setSave(side, text){ saveText[side] = text; const el = shell.querySelector(`.db-docwrap[data-side="${side}"] .db-save`); if (el) el.textContent = text; }
  async function save(side){
    clearTimeout(saveTimers[side]);
    const pg = shell.querySelector(`.db-docwrap[data-side="${side}"] .db-docpage`); if (!pg || !dirty[side]) return;
    const key = pg.dataset.key, body = pg.querySelector('.db-doc-body');
    docs[key] = {title: pg.querySelector('.db-doc-title')?.textContent.trim() || '', dek: pg.querySelector('.db-doc-dek')?.textContent.trim() || '', body: body ? clean(body.innerHTML) : '', kind: pg.dataset.kind, updatedAt: new Date().toISOString()};
    dirty[side] = false; setSave(side, 'Saving…');
    try { await persist(key); setSave(side, `Saved · ${time(clock(new Date()))}`); } catch (err) { dirty[side] = true; setSave(side, 'Not saved yet. ' + (err.message || '')); }
  }
  function markdownShortcut(ev, body){
    const sel = getSelection(); if (!sel.rangeCount || !sel.isCollapsed) return;
    const node = sel.anchorNode, el = node && (node.nodeType === 3 ? node.parentElement : node), block = el?.closest('p,h2,h3,li,blockquote,div');
    if (!block || block === body || !body.contains(block)) return;
    const txt = block.textContent, map = {'#':'h2','##':'h3','>':'blockquote'};
    if (!(txt in map) && !['-','*','1.'].includes(txt)) return;
    ev.preventDefault(); block.innerHTML = '<br>'; const r = document.createRange(); r.setStart(block, 0); r.collapse(true); sel.removeAllRanges(); sel.addRange(r);
    if (map[txt]) document.execCommand('formatBlock', false, map[txt]); else document.execCommand(txt === '1.' ? 'insertOrderedList' : 'insertUnorderedList');
    body.dispatchEvent(new Event('input', {bubbles:true}));
  }
  function bindDoc(side){
    const wrap = shell.querySelector(`.db-docwrap[data-side="${side}"]`); if (!wrap) return;
    const body = wrap.querySelector('.db-doc-body');
    const sync = () => body?.classList.toggle('is-empty', !body.textContent.trim() && !body.querySelector('li'));
    sync();
    wrap.addEventListener('input', ev => { if (!ev.target.closest?.('[contenteditable]')) return; sync(); dirty[side] = true; setSave(side, 'Editing…'); clearTimeout(saveTimers[side]); saveTimers[side] = setTimeout(() => save(side), 700); });
    wrap.addEventListener('paste', ev => { if (!ev.target.closest?.('[contenteditable]')) return; ev.preventDefault(); document.execCommand('insertText', false, (ev.clipboardData || window.clipboardData).getData('text/plain')); });
    wrap.addEventListener('keydown', ev => {
      const ed = ev.target.closest?.('[contenteditable]');
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); dirty[side] = true; save(side); return; }
      if (ev.key === 'Escape') { ev.preventDefault(); if (ed) { ed.blur(); wrap.querySelector('.db-back')?.focus(); } else back(side); return; }
      if (!ed) return;
      if (ev.key === 'Enter' && ed !== body) { ev.preventDefault(); (ed.classList.contains('db-doc-title') ? (wrap.querySelector('.db-doc-dek[contenteditable]') || body) : body)?.focus(); return; }
      if (ev.key === ' ' && ed === body) markdownShortcut(ev, body);
    });
    wrap.querySelector('.db-docscroll')?.addEventListener('scroll', hideBubble, {passive:true});
  }
  function hideBubble(){ bubble.hidden = true; }
  function placeBubble(){
    const sel = getSelection(); if (!sel || !sel.rangeCount || sel.isCollapsed) return hideBubble();
    const a = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode), body = a?.closest?.('.db-doc-body');
    if (!body || !shell.contains(body)) return hideBubble();
    const r = sel.getRangeAt(0).getBoundingClientRect(), s = shell.getBoundingClientRect();
    bubble.style.left = `${Math.max(90, r.left + r.width/2 - s.left)}px`; bubble.style.top = `${r.top - s.top - 10}px`; bubble.hidden = false;
  }
  bubble.addEventListener('mousedown', ev => ev.preventDefault());
  bubble.addEventListener('click', ev => {
    const b = ev.target.closest('[data-format]'); if (!b) return; const f = b.dataset.format, sel = getSelection();
    const a = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode), block = a?.closest?.('h2,blockquote'), body = a?.closest?.('.db-doc-body');
    if (f === 'bold' || f === 'italic') document.execCommand(f); else if (f === 'h2') document.execCommand('formatBlock', false, block?.tagName === 'H2' ? 'p' : 'h2'); else if (f === 'quote') document.execCommand('formatBlock', false, block?.tagName === 'BLOCKQUOTE' ? 'p' : 'blockquote'); else document.execCommand('insertUnorderedList');
    body?.dispatchEvent(new Event('input', {bubbles:true})); placeBubble();
  });
  document.addEventListener('selectionchange', placeBubble);
  function openDoc(side, item, from){
    hideBubble(); if (dirty[side]) save(side);
    if (!stacks[side].length) returnFocus[side] = from?.dataset?.action || null;
    stacks[side].push(item); saveText[side] = '';
    render({only: side, focus: `.db-docwrap[data-side="${side}"] .db-back`});
  }
  async function back(side){
    hideBubble(); const top = stacks[side][stacks[side].length-1]; if (top?.kind === 'newevent') { dirty[side] = false; delete docs[`newevent:${top.id}`]; } else if (dirty[side]) await save(side);
    stacks[side].pop(); saveText[side] = '';
    const focus = stacks[side].length ? `.db-docwrap[data-side="${side}"] .db-back` : returnFocus[side] ? `.db-${side} [data-action="${CSS.escape(returnFocus[side])}"]` : null;
    render({only: side, cascade: !stacks[side].length, focus});
  }
  async function refresh(){ if (busy) return; busy = true; lastError = ''; menu = false; render(); try { if (!bridge.load) throw Error('Live refresh works once the app is installed in Bonsai. This preview shows a timestamped calendar snapshot.'); const next = await bridge.load({refresh:true}); if (disposed) return; data = humanizeData(next); showToast('Calendars updated.'); } catch (err) { lastError = err.message || 'Calendar refresh failed.'; showToast(lastError); } finally { busy = false; clearInterval(loadTimer); render({cascade: true}); } }
  const ACCEPT_KEY = 'daybook-accepted';
  try { if (!bridge.reserve) JSON.parse(localStorage.getItem(ACCEPT_KEY) || '[]').forEach(id => accepted.add(id)); } catch {}
  async function accept(id){
    const x = findNote(id), sg = x && suggestionFor(x); if (!sg || accepted.has(id)) return;
    const key = 'acc-' + id;
    accepted.add(id); saving.add(key); morph.add(key); render(); setTimeout(() => morph.delete(key), 1400);
    try {
      if (bridge.reserve) await bridge.reserve(sg, id);
      if (!bridge.reserve) localStorage.setItem(ACCEPT_KEY, JSON.stringify([...accepted]));
      prefs.accepted = [...accepted].slice(-300); savePrefs().catch(() => {});
      saving.delete(key); render();
      showToast(bridge.reserve ? `On your calendar · ${shortDate(sg.date)}, ${time(sg.start)}` : 'Accepted. In the installed app this goes on your calendar.');
    } catch (err) {
      accepted.delete(id); saving.delete(key); render();
      showToast(`${err.message || 'It was not added to your calendar.'} The suggestion is back.`);
    }
  }

  shell.addEventListener('click', ev => {
    if (suppressClick) return;
    const b = ev.target.closest('[data-action]'); if (!b || b.disabled || !shell.contains(b)) return; const a = b.dataset.action, side = b.closest('.db-left') ? 'left' : 'right';
    if (a==='menu') { menu = !menu; render({only:'left'}); }
    else if (a==='previous' || a==='next') go(page[view] + (a==='next'?1:-1));
    else if (a.startsWith('view:')) setView(a.slice(5));
    else if (a==='status') openDoc('right', {kind:'sources', id:'sources'}, b);
    else if (a==='refresh') refresh();
    else if (a.startsWith('back:')) back(a.slice(5));
    else if (a.startsWith('restore:')) { const s = a.slice(8), key = shell.querySelector(`.db-docwrap[data-side="${s}"] .db-docpage`)?.dataset.key; if (key) { delete docs[key]; dirty[s] = false; persist(key).catch(()=>{}); saveText[s] = 'Original restored'; render({only:s}); } }
    else if (a.startsWith('accept:')) accept(a.slice(7));
    else if (a.startsWith('dismiss:')) dismiss(a.slice(8));
    else if (a.startsWith('hide:')) hideEvent(a.slice(5));
    else if (a.startsWith('delete:')) deleteEvent(a.slice(7), b, side);
    else if (a === 'undo') { const f = undoFn; undoFn = null; shell.querySelector('.db-toast')?.remove(); f?.(); }
    else if (a === 'unhide-all') { prefs = {dismissed: [], hiddenEvents: []}; savePrefs().catch(()=>{}); menu = false; render(); showToast('Everything hidden is back.'); }
    else if (a.startsWith('connect:')) connect(a.slice(8));
    else if (a === 'ob-next') obNext();
    else if (a === 'ob-skip') obNext(true);
    else if (a === 'ob-back') obBack();
    else if (a === 'ob-finish') obFinish();
    else if (a === 'setup-resume') resumeSetup();
    else if (a === 'home') go(view === 'month' ? 0 : before(view));
    else if (a.startsWith('whom:')) settleWhom(a.slice(5));
    else if (a.startsWith('forget:')) { const q = people[Number(a.slice(7))]; if (q) { people = people.filter(v => v !== q); savePeople().catch(() => {}); render({only: 'left'}); showToast(`Forgot ${q.name}.`); } }
    else if (a.startsWith('ob-chip:')) { const t = a.slice(8); if (ob.picks.has(t)) ob.picks.delete(t); else ob.picks.add(t); b.setAttribute('aria-pressed', String(ob.picks.has(t))); }
    else if (a.startsWith('ob-look:')) setTheme(a.slice(8));
    else if (a === 'theme-toggle') setTheme(isDark() ? 'light' : 'dark');
    else if (a.startsWith('theme:')) setTheme(a.slice(6));
    else if (a === 'start-over') startOverClick(b);
    else if (a === 'setup-done' || a === 'setup-skip') { setupDismissed = true; if (!data) refresh(); else render(); }
    else if (a.startsWith('event:')) openDoc(side, {kind:'event', id:a.slice(6)}, b);
    else if (a.startsWith('note:')) openDoc(side, {kind:'note', id:a.slice(5)}, b);
    else if (a.startsWith('day:')) openDoc(side, {kind:'day', id:a.slice(4)}, b);
    else if (a.startsWith('open:')) openDoc('left', {kind:'open', id:a.slice(5)}, b);
    else if (a==='interests') openDoc('left', {kind:'interests', id:'interests'}, b);
    else if (a.startsWith('untag:')) { const [, list, i] = a.split(':'); interests[list].splice(Number(i), 1); saveInterests().catch(()=>{}); render({only:'left'}); if (!stacks.right.length) render({only:'right'}); }
    else if (a.startsWith('cell:')) { const d = a.slice(5); if (d === today || d < add(today,-8) || d > rangeEnd()) openDoc('right', {kind:'day', id:d}, b); else setView('3', d); }
    else if (a.startsWith('plan:')) openDoc(side, {kind:'plan', id:a.slice(5)}, b);
    else if (a.startsWith('newevent:')) openDoc(side, {kind:'newevent', id:a.slice(9)}, b);
    else if (a.startsWith('create:')) createEvent(a.slice(7), side);
    else if (a.startsWith('acceptall:')) acceptAll(a.slice(10));
    else if (a === 'clearrange') { pendingRange = null; render({focus:'.db-right [name="context"]'}); }
    else if (a.startsWith('plantime:')) { const pm = a.slice(9).match(/^(\d{4}-\d{2}-\d{2})/); if (!pm) return; const g = largestGap(pm[1]); if (!g) { showToast('That day is full.'); return; } openDoc(side, {kind:'newevent', id:`${pm[1]}:${hm(Math.ceil(g[0]/15)*15)}-${hm(g[1])}`}, b); }
  });
  shell.addEventListener('keydown', ev => { const tab = ev.target.closest?.('[role="tab"]'); if (!tab || !['ArrowLeft','ArrowRight'].includes(ev.key)) return; const order = ['3','7','month'], i = order.indexOf(view); setView(order[(i + (ev.key==='ArrowRight'?1:2)) % 3]); });
  shell.addEventListener('change', ev => { const id = ev.target.dataset?.calendar; if (!id) return; ev.target.checked ? hidden.delete(id) : hidden.add(id); render(); shell.querySelector(`[data-calendar="${CSS.escape(id)}"]`)?.focus(); });
  shell.addEventListener('keydown', ev => { if (ev.key === 'Escape' && whom) { ev.preventDefault(); settleWhom('skip'); } });
  shell.addEventListener('input', ev => { if (ev.target.name==='context') contextDraft = ev.target.value; if (ev.target.name==='ob-book' && ob) ob.book = ev.target.value; });
  shell.addEventListener('submit', async ev => { ev.preventDefault();
    const add = ev.target.closest?.('.db-add');
    if (add) { const list = add.dataset.list, v = add.querySelector('input').value.trim(); if (list === 'near') interests.near = v; else if (v && !interests[list].some(x=>x.toLowerCase()===v.toLowerCase())) interests[list] = [...interests[list], v].slice(-20); try { await saveInterests(); } catch (err) { showToast(err.message || 'Could not save.'); } render({only:'left', focus:`.db-add[data-list="${list}"] input`}); if (!stacks.right.length) render({only:'right'}); showToast(list === 'reading' && v ? 'Added. Your agent will find time to read.' : 'Saved.'); return; } const input = shell.querySelector('[name="context"]'), value = input.value.trim(); if (!value) return;
    try { await routeRequest(value); } catch (err) { showToast(err.message || 'Could not plan that.'); } });
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { applyScale(); fitHeader(); clearTimeout(mossTimer); mossTimer = setTimeout(() => { if (!disposed) paintMoss(isDark()); }, 220); const p = shell.querySelector('.db-pager'); if (p && !animating) { setX(-page[view] * stepW()); fitColumns(); } }) : null; ro?.observe(shell);
  const scheme = typeof MutationObserver === 'function' ? new MutationObserver(() => shell.classList.toggle('dark', isDark())) : null; scheme?.observe(document.documentElement, {attributes:true, attributeFilter:['data-color-scheme','class','style']});
  const tick = setInterval(() => {
    if (dateKey(new Date()) !== today) { if (!stacks.left.length && !stacks.right.length) render(); return; }
    const plot = shell.querySelector('.db-plot'), line = shell.querySelector('.db-now');
    if (!plot || !line) return;
    const rs = Number(plot.dataset.rs), re = Number(plot.dataset.re), n = mins(clock(new Date()));
    if (n > re) { line.remove(); return; }
    line.style.top = `${((Math.max(n,rs)-rs)/(re-rs)*100).toFixed(3)}%`; line.querySelector('span').textContent = time(clock(new Date()));
  }, 30000);
  render({cascade: true});
  document.fonts?.ready?.then(() => { if (!disposed) fitHeader(); });
  Promise.all([loadDocs(), loadInterests(), loadPlans(), loadPrefs(), loadPeople()]).then(async () => {
    const who = person?.id || '';
    if (who && prefs.owner && prefs.owner !== who) {
      // A different Bonsai account opened this app: nothing of the last person's carries over.
      try { await bridge.resetApp?.(); } catch {}
      prefs = {dismissed: [], hiddenEvents: [], theme: 'auto', onboarded: false, owner: who}; interests = {reading: [], topics: [], near: ''}; docs = {}; plans = []; people = []; data = null;
      savePrefs().catch(() => {});
    } else if (who && !prefs.owner && (prefs.hasSnapshot || data)) { prefs.owner = who; if (prefs.onboarded === undefined) prefs.onboarded = true; savePrefs().catch(() => {}); }
    const fresh = !!bridge.onboard || prefs.onboarded === false || (prefs.onboarded === undefined && !prefs.hasSnapshot && !data) || (!!services && !CAL.some(([id]) => svc(id)?.connected));
    booted = true;
    if (fresh) { if (!bridge.load) { demoData = data || demoData; data = null; services = services || PREVIEW_SERVICES(); } beginOnboarding(); }
    else if (!data) refresh();
    render(); schedulePoll(); checkLatest();
  });
  return { setServices(list){ const had = anyCalendar(); services = list; if (!had && anyCalendar() && !data && booted) refresh(); else render(); }, setPerson(){ }, update(next){ data = humanizeData(next); render(); }, dispose(){ disposed = true; mossLayer.remove(); clearInterval(skyTimer); clearInterval(obTickTimer); clearTimeout(obTimer); clearTimeout(toastTimer); clearInterval(tick); cancelAnimationFrame(anim); ro?.disconnect(); scheme?.disconnect(); document.removeEventListener('selectionchange', placeBubble); root.replaceChildren(); } };
}
