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
.db-views{display:inline-flex;margin-top:24px;position:relative;padding:3px;border-radius:999px;background:color-mix(in srgb,var(--db-ink) 6%,transparent);box-shadow:inset 0 0 0 1px var(--db-hair)}.db-views button{position:relative;z-index:1;width:76px;height:28px;text-align:center;font-size:12px;font-weight:500;color:var(--db-muted);border-radius:999px}.db-views button[aria-selected="true"]{color:var(--db-ink)}.db-views button:hover{color:var(--db-ink)}.db-views i{position:absolute;top:3px;left:3px;width:76px;height:28px;border-radius:999px;background:var(--db-card);box-shadow:0 1px 2px rgba(32,44,39,.1),0 4px 10px -4px rgba(32,44,39,.18);transform:translateX(calc(var(--tab,0) * 76px));transition:transform .7s var(--db-spring)}
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
  const paths = {plus:'<path d="M12 5.5v13M5.5 12h13"/>',check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',leaf:'<path d="M5.5 18.5C5.5 10 10.5 5 19 5c0 8.5-5 13.5-13.5 13.5Z"/><path d="M5.5 18.5 13 11"/>',more:'<circle cx="5" cy="12" r="1.1"/><circle cx="12" cy="12" r="1.1"/><circle cx="19" cy="12" r="1.1"/>',left:'<path d="m14.5 6-6 6 6 6"/>',right:'<path d="m9.5 6 6 6-6 6"/>',doc:'<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Zm0 0v5h5M8.5 13h7m-7 3.5h5"/>',arrow:'<path d="M5 12h14m-5.5-6 6 6-6 6"/>',up:'<path d="M12 19V5m-6 6 6-6 6 6"/>'};
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
  const isDark = () => { const a = document.documentElement.dataset?.colorScheme; if (a) return a === 'dark'; const bg = getComputedStyle(document.documentElement).getPropertyValue('--kay-color-bg-base').trim(); if (/^#([0-9a-f]{6})/i.test(bg)) { const n = parseInt(bg.slice(1,7),16); return ((n>>16)*.3 + ((n>>8)&255)*.59 + (n&255)*.11) < 110; } return !!window.matchMedia?.('(prefers-color-scheme: dark)').matches; };
  const today = dateKey(new Date()), tomorrow = add(today,1);
  let data = bridge.initialData || null, view = '3', page = {'3':0,'7':0,month:0}, hidden = new Set(), menu = false, accepted = new Set(), busy = false, origin = null, toastTimer, disposed = false, lastError = '', contextDraft = '', contextHint = '', flash = null, anim = 0, animating = false, wheelAcc = 0, wheelLock = false, wheelQuiet = 0, scrollRaf = 0;
  const style = document.createElement('style'); style.textContent = css; root.append(style);
  const shell = document.createElement('div'); shell.className = 'db'; root.append(shell);
  // ---- Sky: Collide's birds, kite and the seldom hot air balloon, redrawn in Daybook's palette ----
  const sky = document.createElement('div'); sky.className = 'db-sky'; sky.setAttribute('aria-hidden', 'true');
  if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
  root.append(sky);
  let scale = 1;
  function applyScale(){
    const r = shell.getBoundingClientRect(), w = r.width || innerWidth, h = r.height || innerHeight, raw = Math.min(w / 1240, h / 800);
    const next = Math.round(Math.max(1, Math.min(1.5, 1 + (raw - 1) * .85)) * 100) / 100;
    if (next === scale && shell.style.getPropertyValue('--s')) return false;
    scale = next; shell.style.setProperty('--s', String(next)); sky.style.setProperty('--s', String(next)); return true;
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
  const color = id => { const c = cal(id); if (c.color) return c.color; const i = (data?.calendars||[]).findIndex(x=>x.id===id); return palette[Math.max(0,i)%palette.length]; };
  const imported = x => cal(x.sourceId).kind === 'imported' || x.sourceId === 'partiful';
  const hold = x => /hold|tentative/i.test(x.status||'') || /^hold\b/i.test(x.title||'');
  const marker = x => x.kind === 'workingLocation' || (!x.start && /^(home|office|remote)$/i.test(x.title||''));
  const PREFS_KEY = 'daybook-prefs'; let prefs = {dismissed: [], hiddenEvents: []}, undoFn = null;
  const isDismissed = id => prefs.dismissed.some(d => d.id === id);
  const isHiddenEv = id => prefs.hiddenEvents.some(d => d.id === id);
  async function loadPrefs(){ try { const v = bridge.loadPrefs ? await bridge.loadPrefs() : JSON.parse(localStorage.getItem(PREFS_KEY) || 'null'); if (v) prefs = {dismissed: v.dismissed || [], hiddenEvents: v.hiddenEvents || []}; } catch {} }
  async function savePrefs(){ if (bridge.savePrefs) await bridge.savePrefs(prefs); else localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); }
  const visible = d => (data?.events||[]).filter(x=>x.date===d && !hidden.has(x.sourceId) && !isHiddenEv(x.id));
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
  async function connect(id){
    if (!bridge.connect) { showToast('Connecting works in the installed app.'); return; }
    connecting = id; render({only:'left'});
    const res = await bridge.connect(id);
    connecting = '';
    if (res?.ok) { showToast(`${res.displayName || 'Connected'}${res.accountLabel ? ' · ' + res.accountLabel : ''}`); if (!data || needsSetup()) refresh(); }
    else if (res && !res.cancelled) showToast(res.reason || 'The sign-in did not finish.');
    render();
  }
  const allNotes = () => [...(data?.notes||[]), ...localIdeas(), ...planList()].filter(n => !isDismissed(n.id));
  const notesOn = d => allNotes().filter(x=>x.date===d && !(x.sourceId && hidden.has(x.sourceId)));
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
  const showToast = (text, undo) => { shell.querySelector('.db-toast')?.remove(); undoFn = undo || null; const t = document.createElement('div'); t.className='db-toast'; t.setAttribute('role','status'); t.textContent=text; if (undo) { const b = document.createElement('button'); b.className = 'db-undo'; b.dataset.action = 'undo'; b.textContent = 'Undo'; t.append(b); } shell.append(t); clearTimeout(toastTimer); toastTimer=setTimeout(()=>{ t.remove(); undoFn = null; }, undo ? 6500 : 4200); };
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
  async function loadPlans(){ try { const v = bridge.loadPlans ? await bridge.loadPlans() : JSON.parse(localStorage.getItem(PLAN_KEY) || '[]'); if (Array.isArray(v)) plans = v; } catch {} }
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
  function blockFor(title, date, start, len){ const c = writableCal(); return {title, date, start:hm(start), end:hm(start+len), accountId:c.accountId||'', calendarId:c.calendarId||'primary', provider:c.provider||'gcal'}; }
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
      if (p.kind === 'move') out.push(...(p.items||[]));
      else if (p.range) out.push({id:`plan-${p.id}`, planId:p.id, summary:true, working: p.status==='researching', type:'idea', ideaKind:'place', date:p.range.date, time:p.range.start, title: p.status==='ready' ? `${WORDS[(p.items||[]).length]||(p.items||[]).length} ${p.noun} to choose from` : p.status==='failed' ? 'The research did not finish' : `Looking into ${p.noun}`, body: p.status==='ready' ? `${p.anchorLabel?'Near '+p.anchorLabel+'. ':''}Pick one, or keep the time open.` : p.status==='failed' ? (p.error||'Try again later.') : 'A deeper look is underway. Options will appear here.'});
    }
    return out;
  }
  async function createMovePlan(text){
    const both = /stretch/i.test(text) && /work ?out|exercis|gym|run|lift|yoga|swim|pilates/i.test(text), stretchOnly = /stretch/i.test(text) && !both;
    const windows = [[420,570,'morning'],[720,840,'midday'],[1050,1230,'evening']], cands = [];
    for (let k = 0; k < 7; k++) {
      const d = add(today, k), from = k === 0 ? Math.ceil((mins(clock(new Date())) + 30)/15)*15 : 0;
      for (const [a,b,label] of windows) { const len = stretchOnly ? 20 : 45, g = gapsIn(busyOn(d, 15), Math.max(a, from), b, len)[0]; if (g) { cands.push({d, start:Math.ceil(g[0]/15)*15, label}); break; } }
    }
    const pick = cands.length <= 4 ? cands : [0,1,2,3].map(i => cands[Math.floor(i * cands.length / 4)]);
    const pid = 'p' + Date.now().toString(36);
    const items = pick.map((c, i) => { const stretch = stretchOnly || (both && i % 2 === 1), len = stretch ? 20 : 45, title = stretch ? 'Stretch · 20 min' : 'Workout · 45 min'; return {id:`${pid}-${i}`, planId:pid, type:'idea', ideaKind:'do', date:c.d, time:hm(c.start), title, body:`${c.label === 'morning' ? 'Before the day starts' : c.label === 'midday' ? 'A midday break' : 'After the day winds down'}. Nothing else is on your calendars then.`, suggestion:blockFor(stretch ? 'Stretch' : 'Workout', c.d, c.start, len)}; });
    const plan = {id:pid, kind:'move', text, day:today, at:clock(new Date()), status:'working', title:'Time to move this week', reply:'Looking across your week.', replyBody:'Checking every calendar for open time.', items:[]};
    plans.push(plan);
    setWorking('Looking across your week…');
    agentAt(shell.querySelector('form.db-context'), 0.1, 0.5, true);
    if (view !== '7' || page['7'] !== before('7')) { view = '7'; page['7'] = before('7'); }
    if (stacks.right.length) stacks.right = [];
    fresh.add(`reply-${pid}`); render({cascade:true}); fresh.delete(`reply-${pid}`);
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
    plan.reply = items.length ? `Found ${WORDS[items.length].toLowerCase()} times to move this week.` : 'This week is full.';
    plan.replyBody = items.length ? `${items.map(it=>label(it.date,{weekday:'short'})).join(', ')}. Accept the ones that feel right.` : 'No open time fit. I will keep looking as the week changes.';
    await savePlans();
    await sleep(300); agentOff(); setWorking('');
    fresh.add(`reply-${pid}`); render({only:'left'}); fresh.delete(`reply-${pid}`);
    showToast(items.length ? `Found ${WORDS[items.length].toLowerCase()} times. Accept the ones that fit.` : 'No open time fit this week.');
  }
  function anchorFor(r){
    const evs = (data.events||[]).filter(x=>x.date===r.date && x.start && x.location && !imported(x)); if (!evs.length) return null;
    const mid = (mins(r.start) + mins(r.end)) / 2, c = x => (mins(x.start) + (mins(x.end) ?? mins(x.start))) / 2;
    return evs.sort((a,b)=>Math.abs(c(a)-mid)-Math.abs(c(b)-mid))[0];
  }
  const anchorKey = loc => /salon 94|e(ast)? 89th/i.test(loc||'') ? 'ues' : /starr st|bushwick|11237/i.test(loc||'') ? 'bushwick' : '';
  async function createResearch(text, r){
    const category = MUSEUM.test(text) ? 'museum' : FOOD.test(text) ? 'restaurant' : 'place', noun = {museum:'museums', restaurant:'places to eat', place:'places'}[category];
    const anchor = anchorFor(r), anchorLabel = anchor ? anchor.location.split(',')[0] : (interests.near || '');
    const pid = 'r' + Date.now().toString(36), when = `${shortDate(r.date)}, ${time(r.start)} to ${time(r.end)}`;
    const plan = {id:pid, kind:'research', text, day:today, at:clock(new Date()), range:r, category, noun, anchorLabel, anchor: anchor ? {title:anchor.title, location:anchor.location} : null, status:'researching', title:`${cap(noun)}${anchorLabel?' near '+anchorLabel:''}`, reply:'Looking into this.', replyBody:`${cap(noun)}${anchorLabel?' near '+anchorLabel:''} for ${when}. I will share options after a deeper look.`, items:[]};
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
  const deletable = x => !!x && (String(x.id).startsWith('local-ev-') || String(x.id).startsWith('created-') || (!x.people && !x.organizer && !imported(x) && cal(x.sourceId).kind !== 'holidays' && cal(x.sourceId).writable));
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
    const blocks = placed.map(v=>{const short=(v.e-v.s)<=60; const w=100/v.lanes; return `<button class="db-te ${short?'short':''} ${v.e<nowMin?'past':''} ${cls(v.x)}" data-action="event:${e(v.x.id)}" style="--c:${color(v.x.sourceId)};top:${pct(v.s)}%;height:${(Math.min(v.e,re)-v.s)/total*100}%;left:calc(${w*v.lane}% + ${v.lane?4:0}px);width:calc(${w}% - ${v.lanes>1?4:0}px)">${aura(v.x.id)}<strong>${e(v.x.title)}</strong><small>${span(v.x)}</small></button>`;}).join('');
    const gaps = openGaps(events, Math.max(nowMin, rs), Math.min(re, 1320));
    const ideasToday = timed.filter(t=>t.kind==='idea');
    const open = gaps.map(([a,b])=>{ const idea = ideasToday.find(t=>t.at>=a && t.at<b); return `<div class="db-open" style="top:calc(${pct(a)}% + 4px);height:calc(${(b-a)/total*100}% - 8px)"><button class="db-open-main" data-action="open:${hm(a)}-${hm(b)}"><span>Open</span>${time(hm(a))} to ${time(hm(b))} · ${dur(b-a)}</button>${idea?`<div class="db-open-idea ${fresh.has(idea.x.id)?'db-fresh':''}"><button data-action="note:${e(idea.x.id)}">${e(idea.x.title)}</button>${acceptBtn(idea.x)}</div>`:''}</div>`; }).join('');
    const rest = timed.filter(t=>t.kind!=='event' && t.kind!=='idea' && t.kind!=='reply'), mine = rest.filter(t=>String(t.x.id).startsWith('local-')).reverse();
    const notes = [...timed.filter(t=>t.kind==='reply').slice(-1), ...mine, ...rest.filter(t=>!mine.includes(t))].slice(0,3).map(t=>`<div class="db-notewrap"><button class="db-note ${t.x.type==='reply'?'reply':''} ${t.x.working?'working':''} ${fresh.has(t.x.id)?'db-fresh':''}" data-action="${t.x.type==='reply'?'plan:'+e(t.x.planId):'note:'+e(t.x.id)}"><span class="db-eyebrow"><i style="background-position:${t.x.type==='artifact'?'38%':t.x.type==='reply'?'15%':'70%'} 50%"></i>${t.x.type==='artifact'?'Prepared':t.x.type==='rest'?'Suggestion':t.x.type==='reply'?'From your agent':'Note'}</span><strong>${e(t.x.title)}</strong><span class="db-clamp">${e(t.x.body)}</span>${t.x.artifact?`<span class="db-link">${ic('doc')}${e(t.x.label||'Open brief')}</span>`:''}${t.x.type==='reply'?`<span class="db-link">${plans.find(p=>p.id===t.x.planId)?.kind==='move'?'See the times':'See the plan'}</span>`:''}</button><button class="db-x" data-action="dismiss:${e(t.x.id)}" aria-label="Dismiss" title="Dismiss">×</button></div>`).join('');
    const upcoming = events.filter(v=>v.e>nowMin).length, biggest = gaps.slice().sort((a,b)=>(b[1]-b[0])-(a[1]-a[0]))[0];
    const allLine = [...markers.map(x=>x.title), ...allDay.map(x=>x.title)];
    return `<section class="db-left" aria-label="Today"><header class="db-head"><p class="db-eyebrow">${label(today,{weekday:'long'})} · ${label(today,{month:'long',day:'numeric',year:'numeric'})}</p><h1 class="db-title">Today</h1><p class="db-sub"><span><b>${upcoming}</b> still ahead</span>${biggest?`<span>Open from <b>${time(hm(biggest[0]))}</b> to <b>${time(hm(biggest[1]))}</b></span>`:''}</p>${allLine.length?`<p class="db-allday">All day · ${e(allLine.join(' · '))}</p>`:''}<div class="db-tools"><button class="db-icon" data-action="interests" aria-label="Interests and reading">${ic('leaf')}</button><button class="db-icon" data-action="menu" aria-label="Calendars and sources" aria-expanded="${menu}">${ic('more')}</button></div></header>${menu?menuView():''}<div class="db-today"><div class="db-plot" data-rs="${rs}" data-re="${re}">${hours}<div class="db-track">${open}<div class="db-sel" ${pendingRange&&pendingRange.date===today?`style="top:${pct(mins(pendingRange.start))}%;height:${(mins(pendingRange.end)-mins(pendingRange.start))/total*100}%"`:'hidden'}><span>${pendingRange&&pendingRange.date===today?`${time(pendingRange.start)} to ${time(pendingRange.end)}`:''}</span></div>${placed.length?blocks:`<p class="db-empty">Nothing timed in your visible calendars today.${hidden.size?' Some calendars are hidden.':''}</p>`}</div><div class="db-notes">${notes}<div class="db-plinth" aria-hidden="true">${scene('stones')}</div></div>${nowMin>=rs&&nowMin<=re?`<div class="db-now" style="top:${pct(nowMin)}%"><span>${time(clock(new Date()))}</span></div>`:''}</div></div></section>`;
  }
  function itemLarge(t, crowded){
    const x = t.x;
    if (t.kind==='event') { const learned = x.date < today && plainText(docs['event:'+x.id]?.body); return `<div class="db-evwrap"><button class="db-ev ${cls(x)}" data-action="event:${e(x.id)}" style="--c:${color(x.sourceId)}">${aura(x.id)}<small>${span(x)}</small><strong>${e(x.title)}</strong>${x.date < today ? `<em class="db-learn ${learned?'done':''}">${learned ? e('Learned · ' + learned.slice(0,60)) : 'Note what you learned'}</em>` : imported(x)?'<em>Imported · attendance unknown</em>':hold(x)?'<em>Hold · not confirmed</em>':''}</button><button class="db-x" data-action="hide:${e(x.id)}" aria-label="Hide this event" title="Hide this event">×</button></div>`; }
    if (t.kind==='rest') return `<div class="db-tile"><button class="db-tile-main" data-action="note:${e(x.id)}"><span class="db-frame" style="--h:calc(${crowded?84:124}px*var(--s,1))">${scene(artFor(x))}</span><span class="db-cap"><span class="db-eyebrow">Suggestion${x.suggestion?' · '+time(x.suggestion.start):''}</span><strong>${e(x.title)}</strong>${crowded?'':`<p>${e(x.body)}</p>`}</span></button>${suggestionFor(x)?`<div class="db-accept-row">${acceptBtn(x)}</div>`:''}<button class="db-x" data-action="dismiss:${e(x.id)}" aria-label="Not for me" title="Not for me">×</button></div>`;
    if (t.kind==='artifact') return `<div class="db-evwrap"><button class="db-folio" data-action="note:${e(x.id)}"><span class="db-thumb" style="height:calc(${crowded?52:74}px*var(--s,1))">${scene('paper')}</span><span><span class="db-eyebrow">Prepared</span><strong>${e(x.title)}</strong><p>${e(x.body)}</p>${crowded?'':`<span class="db-link">${ic('doc')}${e(x.label||'Open brief')}${accepted.has(x.id)?' · time held':''}</span>`}</span></button><button class="db-x" data-action="dismiss:${e(x.id)}" aria-label="Dismiss this brief" title="Dismiss this brief">×</button></div>`;
    if (t.kind==='idea') return `<div class="db-idea ${x.working?'working':''} ${fresh.has(x.id)?'db-fresh':''}"><button class="db-idea-main" data-action="${x.summary?'plan:'+e(x.planId):'note:'+e(x.id)}"><span class="db-eyebrow">${ideaLabel(x)}${x.time?' · '+time(x.time):''}</span><strong>${e(x.title)}</strong>${crowded?'':`<span class="db-d">${e(x.body)}</span>`}</button>${x.summary?'':`<div class="db-accept-row">${acceptBtn(x)}</div>`}<button class="db-x" data-action="dismiss:${e(x.summary?'plan-'+x.planId:x.id)}" aria-label="Not for me" title="Not for me">×</button></div>`;
    return `<button class="db-aside" data-action="note:${e(x.id)}"><strong>${e(x.title)}</strong> ${e(x.body)}</button>`;
  }
  function itemChip(t){
    const x = t.x;
    if (t.kind==='event') return `<button class="db-chip ${cls(x)}" data-action="event:${e(x.id)}" style="--c:${color(x.sourceId)}">${aura(x.id)}<span>${time(x.start)}</span><b>${e(x.title)}</b></button>`;
    return `<button class="db-chip ${t.kind==='rest'?'rest':t.kind==='idea'?'idea':'paper'} ${x.working?'working':''} ${fresh.has(x.id)?'db-fresh':''}" data-action="${x.summary?'plan:'+e(x.planId):'note:'+e(x.id)}"><b>${e(x.title)}</b></button>`;
  }
  function column(d, large){
    const isPast = d < today, items0 = dayItems(d), {markers, allDay} = items0, timed = isPast ? items0.timed.filter(t=>t.kind==='event') : items0.timed.filter(t=>t.kind!=='context'), loaded = d <= rangeEnd();
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
    return `<section class="db-right" aria-label="Looking ahead"><header class="db-head">${busy?'<i class="db-progress" aria-hidden="true"></i>':''}<p class="db-eyebrow">${isBack(view,page[view])?'What you learned':'Plan gently'}</p><h2 class="db-title" data-back="${isBack(view,page[view])}">${isBack(view,page[view])?'Looking back':'Looking ahead'}</h2><div class="db-views" role="tablist" aria-label="Looking ahead range" style="--tab:${tabs.findIndex(t=>t[0]===view)}">${tabs.map(([v,l])=>`<button role="tab" aria-selected="${v===view}" data-action="view:${v}" tabindex="${v===view?0:-1}">${l}</button>`).join('')}<i aria-hidden="true"></i></div><div class="db-tools"><span class="db-range" aria-live="polite"></span><button class="db-icon" data-action="previous" aria-label="Previous">${ic('left')}</button><button class="db-icon" data-action="next" aria-label="Next">${ic('right')}</button></div></header><div class="db-pager" tabindex="0" aria-roledescription="carousel" aria-label="Looking ahead. Swipe or use the arrow keys to move between pages."><div class="db-rail">${pages()}</div></div><div class="db-promptwrap"><form class="db-context"><input name="context" value="${e(contextDraft)}" aria-label="Leave context for the agent" placeholder="${e(contextHint||'Ask for something, like a museum Saturday afternoon…')}" autocomplete="off" maxlength="1000"><button type="submit" aria-label="Save context">${ic('up')}</button></form></div><footer class="db-foot"><span>${busy?'Updating…':e(sourceLine())}</span><button data-action="status">${data.snapshot?'Snapshot':'Updated'} · ${new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'numeric',minute:'2-digit'}).format(new Date(data.fetchedAt||Date.now()))}</button></footer></section>`;
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
    return `<div class="db-menu">${Object.entries(groups).map(([g,cs])=>`<h3>${e(g)}</h3>${cs.map(c=>`<label><span class="db-sw" style="background:${color(c.id)};box-shadow:0 0 0 3px color-mix(in srgb,${color(c.id)} 30%,transparent),0 0 10px ${color(c.id)}"></span>${e(c.name)}<input type="checkbox" data-calendar="${e(c.id)}" ${hidden.has(c.id)?'':'checked'} aria-label="Show ${e(c.name)}"></label>`).join('')}`).join('')}${providers?`<h3>Sources</h3>${providers}`:''}${services&&[...CAL,...MAIL].some(([id])=>svc(id)&&!svc(id).connected&&svc(id).available!==false)?`<h3>Add</h3>${[...CAL,...MAIL].filter(([id])=>svc(id)&&!svc(id).connected&&svc(id).available!==false).map(([id,name])=>`<button class="db-menu-connect" data-action="connect:${e(id)}">${ic('plus')}${e(name)}</button>`).join('')}`:''}${prefs.dismissed.length + prefs.hiddenEvents.length ? `<h3>Hidden</h3><p>${prefs.hiddenEvents.length} event${prefs.hiddenEvents.length===1?'':'s'}, ${prefs.dismissed.filter(d=>d.title).length} suggestion${prefs.dismissed.filter(d=>d.title).length===1?'':'s'}</p><button class="db-menu-connect" data-action="unhide-all">Show everything again</button>` : ''}<button class="db-refresh" data-action="refresh">${busy?'Updating…':'Refresh now'}</button></div>`;
  }
  function sideHTML(side){ return side === 'left' ? (stacks.left.length ? docSection('left') : needsSetup() ? setupView() : todayView()) : (stacks.right.length ? docSection('right') : aheadView()); }
  function render(opts = {}){
    if (disposed) return;
    shell.classList.toggle('dark', isDark()); sky.classList.toggle('dark', isDark());
    if (bridge.textures) { const tx = isDark() ? bridge.textures.dark : bridge.textures.light; shell.style.setProperty('--db-band', `url("${tx.band}")`); shell.style.setProperty('--db-band-soft', `url("${tx.soft}")`); }
    const active = document.activeElement, selector = active && shell.contains(active) && active.dataset?.action ? `[data-action="${CSS.escape(active.dataset.action)}"]` : null;
    if (!data && needsSetup()) { shell.innerHTML = setupView() + `<section class="db-right" aria-label="Looking ahead"><header class="db-head"><p class="db-eyebrow">Plan gently</p><h2 class="db-title">Looking ahead</h2></header><div class="db-docscroll"><p class="db-quiet" style="padding:20px 56px">Your next days appear here once a calendar is connected.</p></div></section>`; shell.append(bubble); return; }
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
    else page[v] = Math.max(0, Math.min(pageCount(v)-1, dayIndex(anchor) - (focusDate ? (v === '3' ? 1 : 3) : 0)));
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
      const facts = [['When', `${longDate(x.date)}<br>${span(x)}${x.start&&TZ_SHORT?' '+TZ_SHORT:''}`], x.location?['Where', e(x.location)]:null, x.organizer?['Host', e(x.organizer)]:null, x.people?['With', e(x.people)]:null, imported(x)?['Status','Imported feed. Attendance unknown.']:hold(x)?['Status','Hold. Not confirmed.']:null, link?['Link', `<a href="${e(link)}" target="_blank" rel="noreferrer">Join the meeting</a>`]:null].filter(Boolean);
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
      if (pl.kind === 'move') {
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
      const html = `<div class="db-interests"><section><h2>Reading now</h2><p class="db-doc-hint">Books you are in the middle of. Your agent finds quiet time for them.</p><div class="db-tags">${tags('reading')}</div><form class="db-add" data-list="reading"><input name="v" maxlength="160" placeholder="Add a book, like Piranesi by Susanna Clarke" aria-label="Add a book you are reading"><button type="submit">Add</button></form></section><section><h2>Interests</h2><p class="db-doc-hint">Topics and things you enjoy. Used for book and place ideas.</p><div class="db-tags">${tags('topics')}</div><form class="db-add" data-list="topics"><input name="v" maxlength="80" placeholder="Add an interest, like architecture or live jazz" aria-label="Add an interest"><button type="submit">Add</button></form></section><section><h2>Usually around</h2><p class="db-doc-hint">A neighborhood, so ideas stay close when your calendar has no location.</p><form class="db-add" data-list="near"><input name="v" maxlength="120" value="${e(interests.near||'')}" placeholder="Like Fort Greene, Brooklyn" aria-label="Neighborhood you are usually in"><button type="submit">Save</button></form></section></div>`;
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
  async function refresh(){ if (busy) return; busy = true; lastError = ''; menu = false; render(); try { if (!bridge.load) throw Error('Live refresh works once the app is installed in Bonsai. This preview shows a timestamped calendar snapshot.'); const next = await bridge.load({refresh:true}); if (disposed) return; data = next; showToast('Calendars updated.'); } catch (err) { lastError = err.message || 'Calendar refresh failed.'; showToast(lastError); } finally { busy = false; clearInterval(loadTimer); render({cascade: true}); } }
  const ACCEPT_KEY = 'daybook-accepted';
  try { if (!bridge.reserve) JSON.parse(localStorage.getItem(ACCEPT_KEY) || '[]').forEach(id => accepted.add(id)); } catch {}
  async function accept(id){
    const x = findNote(id), sg = x && suggestionFor(x); if (!sg || accepted.has(id)) return;
    const btns = shell.querySelectorAll(`[data-action="accept:${CSS.escape(id)}"]`); btns.forEach(b=>{ b.disabled = true; b.classList.add('is-busy'); b.lastChild.textContent = 'Adding…'; });
    try {
      if (bridge.reserve) await bridge.reserve(sg, id);
      accepted.add(id);
      if (!bridge.reserve) localStorage.setItem(ACCEPT_KEY, JSON.stringify([...accepted]));
      render();
      showToast(bridge.reserve ? `On your calendar · ${shortDate(sg.date)}, ${time(sg.start)}` : 'Accepted. In the installed app this goes on your calendar.');
    } catch (err) { btns.forEach(b=>{ b.disabled = false; b.classList.remove('is-busy'); b.lastChild.textContent = 'Accept'; }); showToast(err.message || 'Could not add it to your calendar.'); }
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
  shell.addEventListener('input', ev => { if (ev.target.name==='context') contextDraft = ev.target.value; });
  shell.addEventListener('submit', async ev => { ev.preventDefault();
    const add = ev.target.closest?.('.db-add');
    if (add) { const list = add.dataset.list, v = add.querySelector('input').value.trim(); if (list === 'near') interests.near = v; else if (v && !interests[list].some(x=>x.toLowerCase()===v.toLowerCase())) interests[list] = [...interests[list], v].slice(-20); try { await saveInterests(); } catch (err) { showToast(err.message || 'Could not save.'); } render({only:'left', focus:`.db-add[data-list="${list}"] input`}); if (!stacks.right.length) render({only:'right'}); showToast(list === 'reading' && v ? 'Added. Your agent will find time to read.' : 'Saved.'); return; } const input = shell.querySelector('[name="context"]'), value = input.value.trim(); if (!value) return;
    const wantsPlace = MUSEUM.test(value) || FOOD.test(value) || /\b(somewhere|places? to|things? to do|go out|nearby)\b/i.test(value);
    if (MOVE.test(value) || wantsPlace) { contextDraft = ''; bridge.context?.(value).catch(()=>{}); try { if (MOVE.test(value)) await createMovePlan(value); else { const r = rangeFromText(value); if (r) await createResearch(value, r); else { render(); showToast('No open time on that day. Try another day.'); } } } catch (err) { showToast(err.message || 'Could not plan that.'); } return; }
    try { if (bridge.context) await bridge.context(value); else data.notes.push({id:'local-'+Date.now(),date:today,time:clock(new Date()),type:'context',title:'For later',body:value}); contextDraft = ''; contextHint = ''; render(); showToast(bridge.context?'Kept for your agent.':'Kept in this preview only.'); } catch (err) { showToast(err.message||'Could not keep this note.'); } });
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { applyScale(); const p = shell.querySelector('.db-pager'); if (p && !animating) { setX(-page[view] * stepW()); fitColumns(); } }) : null; ro?.observe(shell);
  const scheme = typeof MutationObserver === 'function' ? new MutationObserver(() => shell.classList.toggle('dark', isDark())) : null; scheme?.observe(document.documentElement, {attributes:true, attributeFilter:['data-color-scheme','class','style']});
  const tick = setInterval(() => {
    if (dateKey(new Date()) !== today) { if (!stacks.left.length && !stacks.right.length) render(); return; }
    const plot = shell.querySelector('.db-plot'), line = shell.querySelector('.db-now');
    if (!plot || !line) return;
    const rs = Number(plot.dataset.rs), re = Number(plot.dataset.re), n = mins(clock(new Date()));
    if (n > re) { line.remove(); return; }
    line.style.top = `${((Math.max(n,rs)-rs)/(re-rs)*100).toFixed(3)}%`; line.querySelector('span').textContent = time(clock(new Date()));
  }, 30000);
  render({cascade: true}); if (!data && !needsSetup()) refresh();
  Promise.all([loadDocs(), loadInterests(), loadPlans(), loadPrefs()]).then(() => { render(); schedulePoll(); });
  return { setServices(list){ const had = anyCalendar(); services = list; if (!had && anyCalendar() && !data) refresh(); else render(); }, update(next){ data = next; render(); }, dispose(){ disposed = true; clearInterval(skyTimer); clearTimeout(toastTimer); clearInterval(tick); cancelAnimationFrame(anim); ro?.disconnect(); scheme?.disconnect(); document.removeEventListener('selectionchange', placeBubble); root.replaceChildren(); } };
}
