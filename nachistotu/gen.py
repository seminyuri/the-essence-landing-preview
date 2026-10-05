# -*- coding: utf-8 -*-
"""Из bank.py: страница показа (nachistotu-voprosy-v4.html), раздел карточки этапа 1 (q4.md) и questions.json."""
import html, json, sys, pathlib, math
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import bank as B

D = pathlib.Path(__file__).parent
E = html.escape
ROLE_BY_KEY = {r["key"]: r for r in B.ROLES}

def num(qid):
    d = "".join(ch for ch in qid if ch.isdigit())
    return d.zfill(2) if qid.startswith("В") else qid

def gives(tags):
    return " · ".join(B.TAGS[c] for c in tags)

def q_li(q, role=None, i=0):
    qid, main, text, how, tags = q[:5]
    t = E(text).replace("{{руководитель}}", '<span class="ph">{руководитель}</span>')
    meta = (f'<span class="badge main">главный</span>' if main else "") + (f'<span class="badge role">{E(role["title"])}</span>' if role else "")
    return (f'<li class="q reveal" style="--i:{i}" data-role="{role["key"] if role else "core"}" data-main="{1 if main else 0}">'
            f'<div class="num{" is-main" if main else ""}{" is-role" if role else ""}">{E(num(qid))}</div>'
            f'<div class="qb"><div class="meta"><span class="qid">{E(qid)}</span>{meta}</div>'
            f'<p class="qt">{t}</p>'
            + (f'<p class="how"><span>Как ответить</span>{E(how)}</p>' if how else "")
            + f'<p class="gives">{E(gives(tags))}</p></div></li>')

# вставки ролей — по блокам
ins = {b["n"]: [] for b in B.CORE}
for r in B.ROLES:
    for q in r["q"]:
        ins[q[5]].append((q, r))

blocks_html, rail_html, dots_html = [], [], []
for b in B.CORE:
    items = [q_li(q, None, i) for i, q in enumerate(b["q"])]
    items += [q_li(q, r, len(b["q"]) + j) for j, (q, r) in enumerate(ins[b["n"]])]
    ex = f'<figure class="example reveal"><figcaption>Пример, насколько подробно</figcaption><blockquote>{E(b["example"])}</blockquote></figure>' if b.get("example") else ""
    blocks_html.append(f'''<section class="block" id="b{b["n"]}" data-n="{b["n"]}">
<div class="bhead reveal"><div class="eyebrow">Блок {b["n"]:02d} · ≈ {E(b["minutes"])} мин</div><h2>{E(b["title"])}</h2><p class="learn">{E(b["learn"])}</p></div>{ex}
<ol class="qs">{"".join(items)}</ol></section>''')
    rail_html.append(f'<li><a href="#b{b["n"]}" data-n="{b["n"]}"><span class="rn">{b["n"]:02d}</span><span class="rt">{E(b["title"])}</span></a></li>')
    dots_html.append(f'<a href="#b{b["n"]}" data-n="{b["n"]}">{b["n"]}</a>')

pills = ['<button class="pill" data-role="core" aria-pressed="true">Общая часть</button>']
short = {"kitchen": "Повар", "prep": "Цех", "front": "Зал и заказы", "courier": "Курьер", "cleaning": "Фея чистоты", "manager": "Управляющий", "office": "УК", "lead": "Руководство"}
for k, label in short.items():
    pills.append(f'<button class="pill" data-role="{k}" aria-pressed="false">{E(label)}</button>')

total = sum(len(b["q"]) for b in B.CORE); stars = sum(1 for b in B.CORE for q in b["q"] if q[1])
cover = "".join(f'<article class="cov reveal" style="--i:{i}"><h3>{E(a)}</h3><p>{E(b)}</p><span>{E(c)}</span></article>' for i, (a, b, c) in enumerate(B.NEEDS))
method = "".join(f'<article class="m reveal" style="--i:{i}"><span class="mn">{i+1:02d}</span><h3>{E(a)}</h3><p>{E(b)}</p></article>' for i, (a, b) in enumerate(B.METHODS))

page = f'''<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex">
<title>Начистоту — вопросы</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root{{--paper:#FBF8F3;--paper2:#F3EDE4;--ink:#17140F;--ink2:#3B352D;--mut:#857D71;--line:#E8E1D6;--acc:#FF6900;--accink:#C44A00;--accsoft:#FFEEDF;--card:#FFFFFF;
--disp:"Unbounded",system-ui,sans-serif;--text:"Onest",system-ui,-apple-system,"Segoe UI",sans-serif;--r:22px;--ease:cubic-bezier(.2,.7,.2,1)}}
@media (prefers-color-scheme:dark){{:root{{--paper:#121110;--paper2:#1A1816;--ink:#F3EEE7;--ink2:#D9D2C8;--mut:#9A9287;--line:#2B2723;--acc:#FF7A1A;--accink:#FF9B52;--accsoft:#2B1A0D;--card:#171513}}}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth;-webkit-text-size-adjust:100%}}
body{{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.55 var(--text);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}}
a{{color:inherit}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 20px}}
/* шапка */
.top{{display:flex;align-items:center;justify-content:space-between;padding:20px 0 40px}}
.brand{{display:flex;align-items:center;gap:10px;font:600 15px/1 var(--disp);letter-spacing:.01em}}
.dot{{width:22px;height:22px;border-radius:50%;background:var(--acc);box-shadow:inset 0 0 0 5px color-mix(in srgb,var(--acc) 70%,#fff)}}
.ver{{font-size:13px;color:var(--mut)}}
/* первый экран */
.hero{{position:relative;padding:0 0 40px;overflow:hidden;isolation:isolate}}
.hero:before{{content:"";position:absolute;z-index:-1;right:-14vw;top:-22vw;width:min(70vw,820px);aspect-ratio:1;border-radius:50%;
background:radial-gradient(circle at 40% 40%,color-mix(in srgb,var(--acc) 26%,transparent) 0%,color-mix(in srgb,var(--acc) 8%,transparent) 42%,transparent 70%);pointer-events:none}}
.eyebrow{{font:600 12.5px/1 var(--text);letter-spacing:.14em;text-transform:uppercase;color:var(--accink)}}
.hero h1{{font:700 clamp(40px,8.4vw,92px)/.98 var(--disp);letter-spacing:-.03em;margin:16px 0 18px;max-width:11ch}}
.hero h1 em{{font-style:normal;color:var(--acc)}}
.lead{{font-size:clamp(18px,2.2vw,22px);line-height:1.5;color:var(--ink2);max-width:40ch;margin:0}}
.stats{{display:flex;flex-wrap:wrap;gap:10px 34px;margin:30px 0 0;padding:0;list-style:none}}
.stats li{{display:flex;flex-direction:column}}.stats b{{font:600 30px/1.1 var(--disp);letter-spacing:-.02em}}.stats span{{color:var(--mut);font-size:14px}}
/* линза */
.lens{{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--paper) 86%,transparent);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);border-bottom:1px solid var(--line)}}
.lens .wrap{{padding-top:12px;padding-bottom:12px}}
.lrow{{display:flex;align-items:center;gap:12px}}
.llabel{{font-size:13px;color:var(--mut);white-space:nowrap}}
.pills{{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px}}.pills::-webkit-scrollbar{{display:none}}
.pill{{appearance:none;border:1px solid var(--line);background:var(--card);color:var(--ink);font:500 15px/1 var(--text);padding:10px 14px;border-radius:999px;white-space:nowrap;cursor:pointer;transition:background .2s var(--ease),border-color .2s,color .2s,transform .15s}}
.pill:hover{{border-color:color-mix(in srgb,var(--ink) 30%,var(--line))}}.pill:active{{transform:scale(.97)}}
.pill[aria-pressed="true"]{{background:var(--ink);border-color:var(--ink);color:var(--paper)}}
.pill:focus-visible,.tg:focus-within,a:focus-visible{{outline:3px solid color-mix(in srgb,var(--acc) 55%,transparent);outline-offset:2px}}
.lmeta{{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin-top:10px;font-size:14px;color:var(--mut)}}
.lmeta b{{color:var(--ink);font-weight:600}}
.tg{{display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none;color:var(--ink2)}}
.tg input{{appearance:none;width:34px;height:20px;border-radius:999px;background:var(--line);position:relative;margin:0;cursor:pointer;transition:background .2s}}
.tg input:before{{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .2s var(--ease)}}
.tg input:checked{{background:var(--acc)}}.tg input:checked:before{{transform:translateX(14px)}}
.dots{{display:none;gap:6px;margin-top:10px;overflow-x:auto;scrollbar-width:none}}.dots::-webkit-scrollbar{{display:none}}
.dots a{{flex:0 0 auto;width:32px;height:32px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font:600 13px/1 var(--disp);text-decoration:none;color:var(--mut);transition:all .2s}}
.dots a.on{{background:var(--acc);border-color:var(--acc);color:#fff}}
/* раскладка */
.layout{{display:grid;grid-template-columns:240px minmax(0,1fr);gap:56px;padding:28px 0 20px}}
.rail{{position:sticky;top:132px;align-self:start}}
.rail ol{{list-style:none;margin:0;padding:0;border-left:1px solid var(--line)}}
.rail a{{display:flex;gap:12px;align-items:baseline;padding:9px 0 9px 18px;margin-left:-1px;border-left:2px solid transparent;text-decoration:none;color:var(--mut);transition:color .2s,border-color .2s}}
.rail a:hover{{color:var(--ink)}}.rail a.on{{color:var(--ink);border-left-color:var(--acc)}}
.rn{{font:600 13px/1 var(--disp);min-width:22px}}.rt{{font-size:15.5px}}
main{{min-width:0;max-width:760px}}
/* блок */
.block{{padding:18px 0 46px;scroll-margin-top:calc(var(--lensH,140px) + 16px)}}
.bhead h2{{font:700 clamp(28px,4.6vw,44px)/1.08 var(--disp);letter-spacing:-.025em;margin:12px 0 12px}}
.learn{{margin:0;color:var(--ink2);font-size:18px;max-width:58ch}}
.example{{margin:22px 0 4px;padding:18px 20px;background:var(--accsoft);border-radius:var(--r)}}
.example figcaption{{font:600 12.5px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--accink);margin-bottom:8px}}
.example blockquote{{margin:0;font-size:17px;line-height:1.55;color:var(--ink)}}
.qs{{list-style:none;margin:18px 0 0;padding:0}}
.q{{display:grid;grid-template-columns:76px minmax(0,1fr);gap:0 8px;padding:22px 0;border-top:1px solid var(--line)}}
.q[data-role]:not([data-role="core"]){{display:none}}
body[data-role="kitchen"] .q[data-role="kitchen"],body[data-role="prep"] .q[data-role="prep"],body[data-role="front"] .q[data-role="front"],
body[data-role="courier"] .q[data-role="courier"],body[data-role="cleaning"] .q[data-role="cleaning"],body[data-role="manager"] .q[data-role="manager"],
body[data-role="office"] .q[data-role="office"],body[data-role="lead"] .q[data-role="lead"],body.handover .q[data-role="handover"]{{display:grid}}
body.only-main .q[data-main="0"]{{display:none!important}}
.num{{font:600 34px/1 var(--disp);letter-spacing:-.03em;color:color-mix(in srgb,var(--ink) 18%,transparent);padding-top:2px}}
.num.is-main{{color:var(--acc)}}.num.is-role{{font-size:24px;padding-top:6px}}
.q[data-role]:not([data-role="core"]){{background:color-mix(in srgb,var(--accsoft) 70%,transparent);border-top:0;border-radius:18px;padding:20px 18px 20px 0;margin:10px 0}}
.q[data-role]:not([data-role="core"]) .num{{padding-left:16px}}
.meta{{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-bottom:6px}}
.qid{{font-size:13px;color:var(--mut);font-weight:500}}
.badge{{font:600 11.5px/1 var(--text);letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:999px}}
.badge.main{{background:var(--accsoft);color:var(--accink)}}.badge.role{{background:var(--ink);color:var(--paper)}}
.qt{{margin:0;font:500 clamp(19px,2.1vw,21px)/1.45 var(--text);letter-spacing:-.005em;color:var(--ink)}}
.q:has(.is-main) .qt{{font-weight:600}}
.ph{{background:var(--accsoft);color:var(--accink);border-radius:8px;padding:0 6px;white-space:nowrap}}
.how{{margin:10px 0 0;font-size:15.5px;line-height:1.5;color:var(--ink2)}}
.how span{{display:inline-block;margin-right:8px;font:600 11.5px/1 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}}
.gives{{margin:10px 0 0;font-size:13px;color:var(--mut);letter-spacing:.01em}}
.gives:before{{content:"Даёт: ";font-weight:600}}
/* разделы */
.sec{{padding:56px 0 10px;border-top:1px solid var(--line)}}
.sec h2{{font:700 clamp(28px,4.4vw,44px)/1.08 var(--disp);letter-spacing:-.025em;margin:12px 0 26px;max-width:18ch}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}}
.cov,.m{{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px 20px 18px}}
.cov h3,.m h3{{font:600 18px/1.3 var(--text);margin:0 0 8px}}.cov p,.m p{{margin:0;color:var(--ink2);font-size:15.5px}}
.cov span{{display:block;margin-top:12px;font:600 13px/1.4 var(--disp);color:var(--accink)}}
.mn{{font:600 13px/1 var(--disp);color:var(--acc)}}.m h3{{margin-top:12px}}
.foot{{padding:40px 0 70px;color:var(--mut);font-size:14px}}
.note{{margin:6px 0 8px;padding:16px 18px;border:1px dashed var(--line);border-radius:16px;color:var(--ink2);font-size:16px}}
.note span{{display:block;font:600 11.5px/1 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--mut);margin-bottom:8px}}
.rolenote{{margin:12px 0 0;padding:12px 16px;border-radius:14px;background:var(--accsoft);color:var(--accink);font-size:15px;font-weight:500}}
/* появление */
.reveal{{opacity:0;transform:translateY(10px);transition:opacity .55s var(--ease),transform .55s var(--ease);transition-delay:calc(min(var(--i,0),8)*40ms)}}
.reveal.in{{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}.reveal{{opacity:1;transform:none;transition:none}}}}
/* телефон */
@media (max-width:1023px){{.layout{{grid-template-columns:1fr;gap:0;padding-top:10px}}.rail{{display:none}}.dots{{display:flex}}}}
@media (max-width:600px){{.wrap{{padding:0 16px}}.hero{{padding:26px 0 26px}}.hero:before{{right:-240px;top:-200px}}
.q{{grid-template-columns:52px minmax(0,1fr)}}.num{{font-size:26px}}.num.is-role{{font-size:18px}}
.llabel{{display:none}}.ver{{display:none}}.top{{padding:16px 0 26px}}.pill{{font-size:14px;padding:8px 12px}}.lmeta{{font-size:13px;gap:6px 14px;margin-top:8px}}.dots{{margin-top:8px}}.dots a{{width:28px;height:28px;font-size:12px}}.lens .wrap{{padding-top:10px;padding-bottom:10px}}.stats{{gap:8px 24px}}.stats b{{font-size:24px}}}}
</style></head>
<body data-role="core">
<section class="hero"><div class="wrap"><header class="top"><div class="brand"><span class="dot"></span>Начистоту</div><div class="ver">Суши Мама · вопросник {E(B.VERSION)} · на утверждение</div></header>
<div class="eyebrow">Опрос всех сотрудников Суши Мамы</div>
<h1>Поговорим <em>начистоту</em></h1>
<p class="lead">Простые вопросы, на которые каждый ответит голосом за 20–30 минут. Из ответов складываются должностные, карта процессов и честная картина того, как Суши Мама работает на самом деле.</p>
<ul class="stats"><li><b>{len(B.CORE)}</b><span>блоков</span></li><li><b>{total}</b><span>вопросов для всех</span></li><li><b>{stars}</b><span>главных — короткий путь</span></li><li><b>+{min(len(r["q"]) for r in B.ROLES)}–{max(len(r["q"]) for r in B.ROLES)}</b><span>вопросов своей роли</span></li></ul>
</div></section>

<nav class="lens" aria-label="Чьими глазами смотреть"><div class="wrap">
<div class="lrow"><span class="llabel">Смотреть глазами</span><div class="pills" role="group">{"".join(pills)}</div></div>
<div class="lmeta"><span id="sum"></span>
<label class="tg"><input type="checkbox" id="onlyMain"> только главные</label>
<label class="tg"><input type="checkbox" id="handover"> + передача дел</label></div>
<div class="dots">{"".join(dots_html)}</div>
</div></nav>

<div class="wrap"><div class="layout">
<aside class="rail"><ol>{"".join(rail_html)}</ol></aside>
<main>
<aside class="note reveal"><span>Над вопросами человек видит</span>«{E(B.INTRO)}»</aside><p class="rolenote" id="rolenote" hidden></p>
{"".join(blocks_html)}
</main></div>

<section class="sec"><div class="eyebrow">Что мы узнаем</div><h2>Каждый ответ идёт в дело</h2><div class="grid">{cover}</div></section>
<section class="sec"><div class="eyebrow">На чём построены вопросы</div><h2>Проверенные методы — простыми словами</h2><div class="grid">{method}</div></section>
<footer class="foot">«Начистоту» · Суши Мама · {E(B.VERSION)}. Имя руководителя в вопросе В26 подставится настоящее. Все ответы слушает и изучает только Юрий.</footer>
</div>

<script>
(function(){{
 var body=document.body, pills=[].slice.call(document.querySelectorAll('.pill')), om=document.getElementById('onlyMain'), ho=document.getElementById('handover'), sum=document.getElementById('sum');
 var names={json.dumps({**{"core": "Общая часть"}, **short}, ensure_ascii=False)};
 function count(){{
   var qs=[].slice.call(document.querySelectorAll('.q')).filter(function(q){{return getComputedStyle(q).display!=='none'}});
   var all=[].slice.call(document.querySelectorAll('.q')).filter(function(q){{var r=q.dataset.role;return r==='core'||r===body.dataset.role||(r==='handover'&&body.classList.contains('handover'))}});
   var m=all.filter(function(q){{return q.dataset.main==='1'}}).length;
   var full=Math.round(all.length*0.65), short=Math.round(m*0.8);
   sum.innerHTML=(body.dataset.role==='core'?'Общая часть':'<b>'+names[body.dataset.role]+'</b> увидит')+': <b>'+all.length+'\u00a0вопросов</b> · ≈\u00a0'+full+'\u00a0мин · главных\u00a0'+m+' → ≈\u00a0'+short+'\u00a0мин';
 }}
 var rn=document.getElementById('rolenote'), lens=document.querySelector('.lens');
 function lh(){{document.documentElement.style.setProperty('--lensH',lens.offsetHeight+'px')}} lh(); window.addEventListener('resize',lh); if('ResizeObserver' in window)new ResizeObserver(lh).observe(lens); if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lh);
 function set(role,push){{body.dataset.role=role; if(role==='core'){{rn.hidden=true}}else{{rn.hidden=false;rn.textContent='Так увидит '+names[role].toLowerCase()+': общая часть и вопросы своей роли — они на оранжевом фоне внутри блоков.'}}pills.forEach(function(p){{p.setAttribute('aria-pressed',p.dataset.role===role)}});count();
   if(push){{try{{history.replaceState(null,'','#'+role+(body.classList.contains('handover')?'+handover':''))}}catch(e){{}}}}
   reveal();}}
 pills.forEach(function(p){{p.addEventListener('click',function(){{set(p.dataset.role,true)}})}});
 om.addEventListener('change',function(){{body.classList.toggle('only-main',om.checked);count()}});
 ho.addEventListener('change',function(){{body.classList.toggle('handover',ho.checked);set(body.dataset.role,true)}});
 var h=(location.hash||'').slice(1).split('+'); if(names[h[0]]){{if(h[1]==='handover'){{ho.checked=true;body.classList.add('handover')}} set(h[0],false)}} else count();
 var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{e.target.classList.add('in');io.unobserve(e.target)}}}})}},{{rootMargin:'0px 0px -6% 0px'}}):null;
 function reveal(){{document.querySelectorAll('.reveal:not(.in)').forEach(function(el){{if(io)io.observe(el);else el.classList.add('in')}})}}
 reveal();
 var links=[].slice.call(document.querySelectorAll('.rail a,.dots a'));
 var so=('IntersectionObserver' in window)?new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{var n=e.target.dataset.n;links.forEach(function(a){{a.classList.toggle('on',a.dataset.n===n)}})}}}})}},{{rootMargin:'-45% 0px -50% 0px'}}):null;
 if(so)document.querySelectorAll('.block').forEach(function(b){{so.observe(b)}});
}})();
</script></body></html>'''
(D / "nachistotu-voprosy-v4.html").write_text(page)

# --- Markdown для карточки этапа 1 ---
md = [f"## Вопросник {B.VERSION.split(' ·')[0]} — показан Юрию живой страницей, ждёт утверждения", "",
      f"**Устройство.** Общая часть для всех — {len(B.CORE)} блоков, {total} вопросов (номера В1–В{total}, постоянные). Вставки по роли встают внутрь блоков — номер блока указан у каждого вопроса: **К** — кухня, **Ц** — заготовочный цех, **З** — зал и заказы, **Д** — доставка, **Ч** — чистота, **У** — управляющие, **С** — управляющая компания, **Р** — руководство сети, **П** — передача дел. В В26 подставляется имя настоящего руководителя.", "",
      f"**На чём построено:** " + " ".join(f"*{a}* — {b}" for a, b in B.METHODS), "",
      f"У каждого вопроса — «Как ответить» с примером, где это помогает. ★ — главные: короткий путь ({stars} вопросов) ≈ 15 минут, полный ≈ 25–30 минут. Две сквозные цифры каждой волны — **В31** (ясность ожиданий, 1–10) и **В36** (готовность рекомендовать работу, 0–10).", "",
      "**Метки** (что даёт ответ): " + " · ".join(f"**{k}** — {v}" for k, v in B.TAGS.items()) + ".", "",
      f"Строка над вопросами: *«{B.INTRO}»*", "", "### Общая часть — для всех", ""]
for b in B.CORE:
    md.append(f"**Блок {b['n']}. {b['title']} (~{b['minutes']} мин)** — что узнаём: {b['learn']}")
    if b.get("example"): md.append(f"Пример, насколько подробно: {b['example']}")
    md.append("")
    for q in b["q"]:
        qid, main, text, how, tags = q
        line = f"- **{qid}.** {'★ ' if main else ''}{text.replace('{{руководитель}}', '**{{непосредственный руководитель}}**')}"
        if how: line += f" *Как ответить: {how}.*"
        md.append(line + f" `[{tags}]`")
    md.append("")
md += ["### Вставки по ролям", ""]
for r in B.ROLES:
    md.append(f"**{r['code']} — {r['title']}** ({r['who']})"); md.append("")
    for q in r["q"]:
        qid, main, text, how, tags, blk = q
        line = f"- **{qid}.** {'★ ' if main else ''}{text}"
        if how: line += f" *Как ответить: {how}.*"
        md.append(line + f" `[{tags}] → блок {blk}`")
    md.append("")
md += ["**Что мы узнаем — какие вопросы это дают:**", ""] + [f"- **{a}** — {b}: {c}" for a, b, c in B.NEEDS]
(D / "q4.md").write_text("\n".join(md).strip() + "\n")

data = {"version": B.VERSION, "intro": B.INTRO, "tags": B.TAGS,
        "core": [{"block": b["n"], "title": b["title"], "minutes": b["minutes"], "learn": b["learn"], "example": b.get("example"),
                  "questions": [{"id": q[0], "main": q[1], "text": q[2], "how": q[3], "tags": list(q[4])} for q in b["q"]]} for b in B.CORE],
        "roles": [{"code": r["code"], "key": r["key"], "title": r["title"], "who": r["who"],
                   "questions": [{"id": q[0], "main": q[1], "text": q[2], "how": q[3], "tags": list(q[4]), "block": q[5]} for q in r["q"]]} for r in B.ROLES],
        "who": [{"role": a, "set": b} for a, b in B.WHO]}
(D / "questions.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
print("общая часть:", total, "| главных:", stars, "| вставок:", sum(len(r["q"]) for r in B.ROLES))
