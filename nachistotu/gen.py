# -*- coding: utf-8 -*-
"""Из bank.py (v5): страница показа nachistotu-voprosy-v5.html, раздел карточки этапа 1 (q5.md), questions.json.
Дизайн — из v4 (Юрий: «дизайн стал лучше»), CSS берётся из css_v4.txt."""
import html, json, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import bank as B

D = pathlib.Path(__file__).parent
E = html.escape
CSS = (D / "css_v4.txt").read_text().replace("{{", "{").replace("}}", "}")
CSS += """
.q{grid-template-columns:76px minmax(0,1fr)}
.flow{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:56px;align-items:center;padding:56px 0 20px;border-top:1px solid var(--line)}
.flow h2{font:700 clamp(28px,4.4vw,44px)/1.08 var(--disp);letter-spacing:-.025em;margin:12px 0 18px}
.steps{list-style:none;margin:0;padding:0;counter-reset:s}
.steps li{position:relative;padding:14px 0 14px 52px;border-top:1px solid var(--line);font-size:17px;color:var(--ink2)}
.steps li b{color:var(--ink);font-weight:600}
.steps li:before{counter-increment:s;content:counter(s);position:absolute;left:0;top:12px;width:34px;height:34px;border-radius:50%;background:var(--accsoft);color:var(--accink);display:grid;place-items:center;font:600 14px/1 var(--disp)}
.phone{position:relative;width:320px;height:640px;margin:0 auto;border-radius:46px;background:#0E0D0C;padding:12px;box-shadow:0 40px 80px -30px rgba(40,20,0,.35),0 0 0 1px rgba(0,0,0,.08)}
.screen{position:relative;height:100%;border-radius:36px;overflow:hidden;background:var(--paper);display:flex;flex-direction:column;padding:46px 22px 22px}
.notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:96px;height:26px;border-radius:20px;background:#0E0D0C}
.sp{font:600 11.5px/1 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
.bar{height:4px;border-radius:4px;background:var(--line);margin:10px 0 22px;overflow:hidden}.bar i{display:block;height:100%;width:22%;background:var(--acc);border-radius:4px}
.sq{font:600 22px/1.3 var(--text);letter-spacing:-.01em;margin:0 0 12px}
.sh{font-size:15px;line-height:1.5;color:var(--ink2);margin:0}
.rec{margin-top:auto;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;background:var(--card);border:1px solid var(--line)}
.rd{width:10px;height:10px;border-radius:50%;background:#E5322D;box-shadow:0 0 0 0 rgba(229,50,45,.5);animation:pulse 1.6s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 10px rgba(229,50,45,0)}100%{box-shadow:0 0 0 0 rgba(229,50,45,0)}}
.wv{display:flex;gap:3px;align-items:center;height:22px;flex:1}.wv i{flex:1;max-width:4px;border-radius:3px;background:var(--acc);height:30%;animation:eq 1.1s ease-in-out infinite}
.wv i:nth-child(2n){animation-delay:.15s}.wv i:nth-child(3n){animation-delay:.3s}.wv i:nth-child(5n){animation-delay:.45s}
@keyframes eq{50%{height:100%}}
@media (prefers-reduced-motion:reduce){.rd,.wv i{animation:none}}
.tm{font:600 14px/1 var(--disp);color:var(--ink)}
.btns{display:flex;gap:10px;margin-top:12px}
.b2{flex:0 0 auto;padding:15px 18px;border-radius:16px;border:1px solid var(--line);background:var(--card);font:600 16px/1 var(--text);color:var(--ink)}
.b1{flex:1;padding:15px 18px;border-radius:16px;background:var(--acc);color:#fff;font:600 16px/1 var(--text);text-align:center}
.only{margin-top:12px;text-align:center;font-size:12.5px;color:var(--mut)}
.promise{margin:0;padding:26px 26px 24px;border-radius:var(--r);background:var(--ink);color:var(--paper)}
.promise p{margin:0;font:500 clamp(20px,2.4vw,26px)/1.4 var(--text);letter-spacing:-.01em}
.promise span{display:block;margin-top:14px;font-size:14px;opacity:.7}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mode{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px}
.mode h3{font:600 20px/1.25 var(--text);margin:10px 0 8px}.mode p{margin:0;color:var(--ink2);font-size:16px}
.mode .tag{font:600 11.5px/1 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--accink)}
@media (prefers-color-scheme:dark){.phone{box-shadow:0 0 0 1px #3a342e,0 40px 80px -30px rgba(0,0,0,.6)}}
@media (max-width:1023px){.flow{grid-template-columns:1fr;gap:34px}}
@media (max-width:600px){.phone{transform:scale(.92);transform-origin:top center;margin-bottom:-50px}.two{grid-template-columns:1fr}.q{grid-template-columns:52px minmax(0,1fr)}}
"""

def num(qid):
    d = "".join(ch for ch in qid if ch.isdigit())
    return d.zfill(2) if qid.startswith("В") else qid

def q_li(q, role=None, i=0):
    qid, text, hint, tags = q
    meta = f'<span class="badge role">{E(role["short"])}</span>' if role else ""
    return (f'<li class="q reveal" style="--i:{i}" data-role="{role["key"] if role else "core"}" data-main="1">'
            f'<div class="num{" is-role" if role else ""}">{E(num(qid))}</div>'
            f'<div class="qb"><div class="meta"><span class="qid">{E(qid)}</span>{meta}</div>'
            f'<p class="qt">{E(text)}</p>' + (f'<p class="how"><span>Подсказка</span>{E(hint)}</p>' if hint else "")
            + f'<p class="gives">{E(" · ".join(B.TAGS[c] for c in tags))}</p></div></li>')

core_n = sum(len(p["q"]) for p in B.PARTS)
parts_html, rail, dots = [], [], []
for p in B.PARTS:
    items = [q_li(q, None, i) for i, q in enumerate(p["q"])]
    for r in B.ROLES:
        if r["part"] == p["n"]:
            items += [q_li(q, r, len(items) + j) for j, q in enumerate(r["q"])]
    parts_html.append(f'''<section class="block" id="b{p["n"]}" data-n="{p["n"]}"><div class="bhead reveal"><div class="eyebrow">Часть {p["n"]} из {len(B.PARTS)}</div><h2>{E(p["title"])}</h2><p class="learn">{E(p["lead"])}</p></div><ol class="qs">{"".join(items)}</ol></section>''')
    rail.append(f'<li><a href="#b{p["n"]}" data-n="{p["n"]}"><span class="rn">{p["n"]:02d}</span><span class="rt">{E(p["title"])}</span></a></li>')
    dots.append(f'<a href="#b{p["n"]}" data-n="{p["n"]}">{p["n"]}</a>')

pills = ['<button class="pill" data-role="core" aria-pressed="true">Вопросы для всех</button>'] + \
        [f'<button class="pill" data-role="{r["key"]}" aria-pressed="false">{E(r["short"])}</button>' for r in B.ROLES if r["key"] != "handover"]
names = {"core": "Вопросы для всех", **{r["key"]: r["short"] for r in B.ROLES}}
cover = "".join(f'<article class="cov reveal" style="--i:{i}"><h3>{E(a)}</h3><p>{E(b)}</p><span>{E(c)}</span></article>' for i, (a, b, c) in enumerate(B.NEEDS))
rmin, rmax = min(len(r["q"]) for r in B.ROLES if r["key"] != "handover"), max(len(r["q"]) for r in B.ROLES if r["key"] != "handover")

page = """<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex">
<title>Начистоту — вопросы</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" rel="stylesheet">
<style>""" + CSS + """</style></head><body data-role="core">
<section class="hero"><div class="wrap"><header class="top"><div class="brand"><span class="dot"></span>Начистоту</div><div class="ver">Суши Мама · вопросник """ + E(B.VERSION) + """</div></header>
<div class="eyebrow">Опрос всех сотрудников Суши Мамы</div>
<h1>Поговорим <em>начистоту</em></h1>
<p class="lead">Короткие простые вопросы, на которые каждый ответит голосом примерно за 20 минут. Из ответов складываются должностные, карта процессов и честная картина того, как Суши Мама работает на самом деле.</p>
<ul class="stats"><li><b>""" + str(len(B.PARTS)) + """</b><span>части</span></li><li><b>""" + str(core_n) + """</b><span>вопросов для всех</span></li><li><b>+""" + f"{rmin}–{rmax}" + """</b><span>вопроса своей роли</span></li><li><b>≈ 20</b><span>минут голосом</span></li></ul>
</div></section>

<div class="wrap">
<section class="flow"><div><div class="eyebrow">Как это у человека</div><h2>Одна запись — и «Далее»</h2>
<ol class="steps"><li><b>Находит себя по фамилии</b> — или выбирает «сказать анонимно».</li>
<li><b>Один раз нажимает «Записать».</b> Запись идёт до конца, без остановок.</li>
<li><b>Читает вопрос, отвечает, жмёт «Далее»</b> — появляется следующий. Каждое «Далее» ставит в записи метку, по ней расшифровка делится на ответы по вопросам.</li>
<li><b>«Спасибо»</b> — и видно, сколько минут он рассказал. Можно вернуться и дополнить.</li></ol></div>
<div class="phone" aria-hidden="true"><div class="notch"></div><div class="screen">
<div class="sp">Часть 1 из 4 · вопрос 2 из 19</div><div class="bar"><i></i></div>
<p class="sq">Расскажите вашу последнюю смену, как будто снимаете про неё кино.</p>
<p class="sh">Что делаете первым делом, что в самый завал, чем заняты в затишье, что перед уходом.</p>
<div class="rec"><span class="rd"></span><span class="wv">""" + "<i></i>" * 22 + """</span><span class="tm">03:42</span></div>
<div class="btns"><span class="b2">Назад</span><span class="b1">Далее</span></div>
<div class="only">Ответы слушает и изучает только Юрий</div></div></div>
</section>

<section class="sec" style="border-top:0;padding-top:30px"><div class="eyebrow">Обещание людям</div><h2>Честно — значит безопасно</h2>
<figure class="promise reveal"><p>«""" + E(B.PROMISE) + """»</p><span>— Юрий Сёмин, собственник. Эти слова стоят на первом экране, в сообщении Риммы и на каждом экране с вопросом.</span></figure>
<div class="two" style="margin-top:14px">
<article class="mode reveal"><span class="tag">Основной путь</span><h3>С фамилией и именем</h3><p>Человек находит себя в списке и отвечает на вопросы своей роли. Руководители на табло видят только «ответил» и сколько знаков — содержание никогда.</p></article>
<article class="mode reveal"><span class="tag">Дополнительно</span><h3>Анонимно — напрямую Юрию</h3><p>Без имени, текстом или надиктовать — голос сразу превращается в текст, сам звук не сохраняется. Для того, что под своим именем не скажут. Не заменяет ответы с именем.</p></article>
</div></section>

<p class="learn" style="margin:56px 0 0">Перед первым вопросом человек видит: «""" + E(B.START) + """»</p>
</div>

<nav class="lens" aria-label="Чьими глазами смотреть"><div class="wrap">
<div class="lrow"><span class="llabel">Смотреть глазами</span><div class="pills" role="group">""" + "".join(pills) + """</div></div>
<div class="lmeta"><span id="sum"></span><label class="tg"><input type="checkbox" id="handover"> + передача дел</label></div>
<div class="dots">""" + "".join(dots) + """</div></div></nav>

<div class="wrap"><div class="layout"><aside class="rail"><ol>""" + "".join(rail) + """</ol></aside>
<main><p class="rolenote" id="rolenote" hidden></p>""" + "".join(parts_html) + """</main></div>
<section class="sec"><div class="eyebrow">Что мы узнаем</div><h2>Каждый ответ идёт в дело</h2><div class="grid">""" + cover + """</div></section>
<footer class="foot">«Начистоту» · Суши Мама · """ + E(B.VERSION) + """. Вопросы утверждены Юрием. Ответы слушает и изучает только Юрий; руководителям — общие выводы без имён.</footer></div>
<script>
(function(){
 var body=document.body, pills=[].slice.call(document.querySelectorAll('.pill')), ho=document.getElementById('handover'), sum=document.getElementById('sum'), rn=document.getElementById('rolenote'), lens=document.querySelector('.lens');
 var names=""" + json.dumps(names, ensure_ascii=False) + """;
 function lh(){document.documentElement.style.setProperty('--lensH',lens.offsetHeight+'px')} lh(); window.addEventListener('resize',lh); if('ResizeObserver' in window)new ResizeObserver(lh).observe(lens); if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lh);
 function count(){var all=[].slice.call(document.querySelectorAll('.q')).filter(function(q){var r=q.dataset.role;return r==='core'||r===body.dataset.role||(r==='handover'&&body.classList.contains('handover'))});
   sum.innerHTML=(body.dataset.role==='core'?'Вопросы для всех':'<b>'+names[body.dataset.role]+'</b> увидит')+': <b>'+all.length+'\\u00a0вопросов</b> · ≈\\u00a0'+Math.round(all.length*1.1)+'\\u00a0мин голосом';}
 function set(role,push){body.dataset.role=role; if(role==='core'){rn.hidden=true}else{rn.hidden=false;rn.textContent='Так увидит '+names[role].toLowerCase()+': вопросы для всех и вопросы своей роли — они на оранжевом фоне внутри частей.'}
   pills.forEach(function(p){p.setAttribute('aria-pressed',p.dataset.role===role)}); count();
   if(push){try{history.replaceState(null,'','#'+role+(body.classList.contains('handover')?'+handover':''))}catch(e){}} reveal();}
 pills.forEach(function(p){p.addEventListener('click',function(){set(p.dataset.role,true)})});
 ho.addEventListener('change',function(){body.classList.toggle('handover',ho.checked);set(body.dataset.role,true)});
 var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'}):null;
 function reveal(){document.querySelectorAll('.reveal:not(.in)').forEach(function(el){if(io)io.observe(el);else el.classList.add('in')})}
 var h=(location.hash||'').slice(1).split('+'); if(names[h[0]]){if(h[1]==='handover'){ho.checked=true;body.classList.add('handover')} set(h[0],false)} else {count(); reveal();}
 var links=[].slice.call(document.querySelectorAll('.rail a,.dots a'));
 var so=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var n=e.target.dataset.n;links.forEach(function(a){a.classList.toggle('on',a.dataset.n===n)})}})},{rootMargin:'-45% 0px -50% 0px'}):null;
 if(so)document.querySelectorAll('.block').forEach(function(b){so.observe(b)});
})();
</script></body></html>"""
(D / "nachistotu-voprosy-v5.html").write_text(page)

# --- раздел для карточки этапа 1 ---
md = [f"## Вопросник {B.VERSION}", "",
      "**Утверждён Юрием 05.10.2026** («Да, отлично. Всё, супер»). Показ — https://seminyuri.github.io/the-essence-landing-preview/nachistotu-voprosy-v5.html; источник — `nachistotu/bank.py` + `gen.py` в репозитории `seminyuri/the-essence-landing-preview` (страница, этот раздел и `nachistotu/questions.json` собираются одной командой).", "",
      f"**Устройство у человека:** одна непрерывная запись; на экране один вопрос крупно и подсказка; «Далее» ставит в записи метку времени и показывает следующий вопрос. {len(B.PARTS)} части, {core_n} вопросов для всех + {rmin}–{rmax} вопроса своей роли (встают в конце нужной части), ≈ 20 минут голосом. Номера постоянные: В1–В{core_n}, К, Ц, З, Д, Ч, У, С, Р, П.", "",
      f"**Перед первым вопросом:** «{B.START}»", "",
      f"**Обещание (решение Юрия 05.10):** «{B.PROMISE}»", "",
      "**Метки** (что даёт ответ, для собственника): " + " · ".join(f"**{k}** — {v}" for k, v in B.TAGS.items()) + ".", "", "### Для всех", ""]
for p in B.PARTS:
    md += [f"**Часть {p['n']} из {len(B.PARTS)}. {p['title']}** — {p['lead']}", ""]
    for qid, text, hint, tags in p["q"]:
        md.append(f"- **{qid}.** {text}" + (f" *Подсказка: {hint}*" if hint else "") + f" `[{tags}]`")
    md.append("")
md += ["### Вопросы своей роли", ""]
for r in B.ROLES:
    md += [f"**{r['code']} — {r['title']}** (встают в конце части {r['part']})", ""]
    for qid, text, hint, tags in r["q"]:
        md.append(f"- **{qid}.** {text}" + (f" *Подсказка: {hint}*" if hint else "") + f" `[{tags}]`")
    md.append("")
md += ["**Кому какие вопросы:** " + "; ".join(f"{a} → «{dict((x['key'], x['title']) for x in B.ROLES)[b]}»" for a, b in B.WHO) + ". Две роли (повар и курьер; повар и касса) — обе вставки.", "",
       "**Что мы узнаем:**", ""] + [f"- **{a}** — {b}: {c}" for a, b, c in B.NEEDS]
(D / "q5.md").write_text("\n".join(md).strip() + "\n")

data = {"version": B.VERSION, "start": B.START, "promise": B.PROMISE, "tags": B.TAGS, "flow": "one_recording_next_marks",
        "parts": [{"part": p["n"], "title": p["title"], "lead": p["lead"], "questions": [dict({"id": q[0], "text": q[1], "hint": q[2], "tags": list(q[3])}, **B.SITE.get(q[0], {})) for q in p["q"]]} for p in B.PARTS],
        "roles": [{"code": r["code"], "key": r["key"], "title": r["title"], "short": r["short"], "after_part": r["part"],
                   "questions": [dict({"id": q[0], "text": q[1], "hint": q[2], "tags": list(q[3])}, **B.SITE.get(q[0], {})) for q in r["q"]]} for r in B.ROLES],
        "who": [{"role": a, "set": b} for a, b in B.WHO]}
(D / "questions.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
print("частей:", len(B.PARTS), "| для всех:", core_n, "| ролей:", len(B.ROLES), "| вопросов ролей:", sum(len(r["q"]) for r in B.ROLES))
