# -*- coding: utf-8 -*-
"""Из bank.py: страница показа (HTML), раздел для карточки этапа 1 (Markdown) и questions.json."""
import html, json, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import bank as B

D = pathlib.Path(__file__).parent
E = html.escape
stars = sum(1 for b in B.CORE for q in b["q"] if q[1])
total = sum(len(b["q"]) for b in B.CORE)

def chips(t):
    return "".join(f'<span class="chip c-{c}" title="{E(B.TAGS[c])}">{E(B.TAGS[c])}</span>' for c in t)

def qhtml(q):
    num, main, text, hint, tags = q
    return (f'<li class="q{" main" if main else ""}"><div class="qn">{num}{" ★" if main else ""}</div>'
            f'<div class="qb"><p class="qt">{E(text).replace("{{руководитель}}", "<mark>{руководитель}</mark>")}</p>'
            + (f'<p class="hint">Подсказка: {E(hint)}</p>' if hint else "") +
            f'<div class="chips">{chips(tags)}</div></div></li>')

blocks = []
for b in B.CORE:
    ex = f'<div class="example"><b>Пример, насколько подробно:</b> {E(b["example"])}</div>' if b.get("example") else ""
    blocks.append(f'''<section class="block" id="b{b["n"]}">
<header><span class="bn">Блок {b["n"]}</span><h3>{E(b["title"])}</h3><span class="min">~{b["minutes"]} мин</span></header>
<p class="why">{E(b["why"])}</p>{ex}
<ol class="qs">{"".join(qhtml(q) for q in b["q"])}</ol></section>''')

roles = []
for r in B.ROLES:
    roles.append(f'''<details class="role"><summary><span class="rc">{E(r["code"])}</span><span class="rt">{E(r["title"])}</span><span class="rw">{E(r["who"])} · {len(r["q"])} вопр. · в {E(r["into"])}</span></summary>
<ol class="qs">{"".join(qhtml(q) for q in r["q"])}</ol></details>''')

who = "".join(f"<tr><td>{E(a)}</td><td><b>{E(b)}</b></td></tr>" for a, b in B.WHO)
needs = "".join(f"<tr><td>{E(a)}</td><td>{E(b)}</td></tr>" for a, b in B.NEEDS)
legend = " ".join(f'<span class="chip c-{c}">{E(v)}</span>' for c, v in B.TAGS.items())

page = f'''<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Начистоту — вопросы</title>
<style>
:root{{--o:#FF6900;--od:#D74100;--ol:#FFE1CC;--ink:#1B242C;--mut:#555F6D;--line:#E4E9EF;--bg:#F5F7F9;--card:#fff;--mark:#FFF6E5}}
@media (prefers-color-scheme:dark){{:root{{--ink:#EEF2F6;--mut:#AEB8C4;--line:#2E3740;--bg:#12181E;--card:#1B242C;--ol:#3A2414;--mark:#3A2E14}}}}
*{{box-sizing:border-box}}body{{margin:0;font:17px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--ink);background:var(--bg)}}
.wrap{{max-width:860px;margin:0 auto;padding:16px}}
.hero{{background:var(--o);color:#fff;border-radius:22px;padding:28px 22px;margin:8px 0 18px}}
.hero h1{{margin:0;font-size:40px;letter-spacing:-.5px}}.hero p{{margin:8px 0 0;font-size:18px;opacity:.95}}
.ver{{display:inline-block;margin-top:12px;background:rgba(255,255,255,.2);padding:4px 10px;border-radius:999px;font-size:14px}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px 18px;margin:14px 0}}
.card h2{{margin:0 0 8px;font-size:22px}}
.stats{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:10px}}
.stat{{background:var(--ol);border-radius:14px;padding:12px}}.stat b{{display:block;font-size:24px;color:var(--od)}}
@media (prefers-color-scheme:dark){{.stat b{{color:#FF8A3D}}}}
.intro{{font-style:italic;color:var(--mut)}}
.block{{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;margin:14px 0}}
.block header{{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}}
.bn{{background:var(--o);color:#fff;border-radius:999px;padding:2px 10px;font-size:14px;font-weight:600}}
.block h3{{margin:0;font-size:21px}}.min{{color:var(--mut);font-size:14px;margin-left:auto}}
.why{{color:var(--mut);margin:8px 0}}
.example{{background:var(--mark);border-left:4px solid var(--o);border-radius:10px;padding:10px 12px;margin:8px 0;font-size:15px}}
.qs{{list-style:none;margin:8px 0 0;padding:0}}
.q{{display:flex;gap:12px;padding:12px 0;border-top:1px solid var(--line)}}
.qn{{flex:0 0 52px;font-weight:700;color:var(--mut);font-size:15px;padding-top:2px}}
.q.main .qn{{color:var(--od)}}@media (prefers-color-scheme:dark){{.q.main .qn{{color:#FF8A3D}}}}
.qt{{margin:0}}.q.main .qt{{font-weight:600}}
.hint{{margin:4px 0 0;color:var(--mut);font-size:15px}}
mark{{background:var(--ol);color:inherit;border-radius:6px;padding:0 4px}}
.chips{{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px}}
.chip{{font-size:12px;border-radius:999px;padding:2px 8px;border:1px solid var(--line);color:var(--mut);white-space:nowrap}}
.c-Д{{border-color:#4A7BD0}}.c-Р{{border-color:#D07A4A}}.c-К{{border-color:#8A5BD0}}.c-П{{border-color:#D0A84A}}.c-Л{{border-color:#4AB08A}}.c-В{{border-color:#888}}
details.role{{background:var(--card);border:1px solid var(--line);border-radius:16px;margin:10px 0;padding:6px 14px}}
details.role summary{{cursor:pointer;list-style:none;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;padding:8px 0}}
details.role summary::-webkit-details-marker{{display:none}}
.rc{{background:var(--ink);color:var(--card);border-radius:8px;padding:0 8px;font-weight:700}}
.rt{{font-weight:700;font-size:18px}}.rw{{color:var(--mut);font-size:14px;flex-basis:100%}}
table{{width:100%;border-collapse:collapse;font-size:15px}}td{{border-top:1px solid var(--line);padding:8px 6px;vertical-align:top}}
.foot{{color:var(--mut);font-size:14px;margin:24px 0 40px}}
@media (max-width:420px){{.hero h1{{font-size:34px}}.qn{{flex-basis:44px}}}}
</style></head><body><div class="wrap">
<div class="hero"><h1>Начистоту</h1><p>Вопросы для каждого сотрудника Суши Мамы — простые, но такие, чтобы из ответов сложилась вся картина</p><span class="ver">{E(B.VERSION)} · на утверждение Юрию</span></div>

<div class="card"><h2>Как это устроено</h2>
<p>Человек находит себя → видит вопросы своей роли по блокам → на каждый блок записывает голосом один ответ (или пишет текстом). Вопросы перед глазами во время записи. У каждого вопроса — короткая подсказка, о чём подумать, а у самого важного блока — пример, насколько подробно отвечать.</p>
<div class="stats">
<div class="stat"><b>{len(B.CORE)} блоков</b>общая часть для всех</div>
<div class="stat"><b>{total} вопросов</b>в общей части</div>
<div class="stat"><b>{stars} ★</b>главные — короткий путь ≈ 12–15 мин</div>
<div class="stat"><b>4–12</b>вопросов вставки по роли</div>
<div class="stat"><b>25–30 мин</b>полный путь, можно в 2–3 захода</div>
</div>
<p class="intro" style="margin-top:12px">Строка над блоками: «{E(B.INTRO)}»</p></div>

<div class="card"><h2>Кому какие вопросы</h2><p>Общая часть — всем. Плюс вставка по роли (вопросы встают внутрь блоков 2–6):</p><table>{who}</table>
<p style="color:var(--mut);font-size:15px">Две роли (повар и курьер, повар и касса) — обе вставки. Имя руководителя в В25 подставляется само.</p></div>

<div class="card"><h2>Что даёт каждый ответ</h2><p>Метки под вопросами показывают, на что он работает:</p><p>{legend}</p></div>

<h2 style="margin:26px 4px 4px">Общая часть — для всех</h2>
{"".join(blocks)}

<h2 style="margin:26px 4px 4px">Вставки по ролям</h2><p style="margin:0 4px;color:var(--mut)">Нажмите на роль, чтобы раскрыть вопросы.</p>
{"".join(roles)}

<div class="card"><h2>Покрытие: что нам нужно → какие вопросы это дают</h2><table>{needs}</table></div>

<p class="foot">Как задавались вопросы: о случаях, а не об оценках (вспомнить конкретный раз — так говорят правду, а не «как надо»); день по шагам и ритм — основа обязанностей; кто что передаёт — стыки и потери; что решаешь сам — права в должностной; по кругу — о руководителе, соседях, о себе; что сказать новичку — неписаные правила. Две цифры — В31 и В36 — повторяются в каждой волне, по ним видно, стало ли лучше.<br><br>«Начистоту» · Суши Мама · {E(B.VERSION)}</p>
</div></body></html>'''
(D / "nachistotu-voprosy.html").write_text(page)

# --- Markdown для карточки этапа 1 ---
md = [f"## Вопросник {B.VERSION.split(' ·')[0]} — показан Юрию живой страницей, ждёт утверждения",
      "",
      f"**Устройство.** Общая часть для всех — {len(B.CORE)} блоков, {total} вопросов (номера В1–В{total}, постоянные: на них ссылаются сайт, `questions.json` и анализ). Вставки по роли встают внутрь блоков 2–6: **К** — кухня, **Ц** — заготовочный цех, **З** — зал и заказы, **Д** — доставка, **Ч** — чистота, **У** — управляющие, **С** — управляющая компания, **Р** — руководство сети, **П** — передача дел. Блок 6 подставляет имя настоящего руководителя человека.",
      "",
      f"**Как задавались.** О случаях, а не об оценках («вспомните последний раз…» — так говорят правду, а не «как надо»); день по шагам и ритм — основа обязанностей; кто что передаёт — стыки и потери; что решаешь сам — права; по кругу — о руководителе, соседях, о себе; что сказать новичку — неписаные правила. У вопросов — подсказка «о чём подумать», у блока 2 — пример, насколько подробно. ★ — главные: короткий путь ({stars} вопросов) ≈ 12–15 минут, полный ≈ 25–30 минут, можно в 2–3 захода. Две цифры — **В31** (ясность ожиданий, 1–10) и **В36** (готовность рекомендовать работу у нас, 0–10) — повторяются в каждой волне.",
      "",
      f"**Метки** (что даёт ответ): " + " · ".join(f"**{k}** — {v}" for k, v in B.TAGS.items()) + ".",
      "",
      f"Строка над блоками: *«{B.INTRO}»*",
      "", "### Общая часть — для всех", ""]
for b in B.CORE:
    md.append(f"**Блок {b['n']}. {b['title']} (~{b['minutes']} мин)** — {b['why']}")
    if b.get("example"): md.append(f"Пример, насколько подробно: {b['example']}")
    md.append("")
    for num, main, text, hint, tags in b["q"]:
        line = f"- **{num}.** {'★ ' if main else ''}{text.replace('{{руководитель}}', '**{{непосредственный руководитель}}**')}"
        if hint: line += f" *Подсказка: {hint}.*"
        line += f" `[{tags}]`"
        md.append(line)
    md.append("")
md += ["### Вставки по ролям", ""]
for r in B.ROLES:
    md.append(f"**{r['code']} — {r['title']}** ({r['who']}; в {r['into']})")
    md.append("")
    for num, main, text, hint, tags in r["q"]:
        line = f"- **{num}.** {'★ ' if main else ''}{text}"
        if hint: line += f" *Подсказка: {hint}.*"
        line += f" `[{tags}]`"
        md.append(line)
    md.append("")
md += ["**Кому какие вопросы:** " + "; ".join(f"{a} → «{b}»" for a, b in B.WHO) + ". Две роли — обе вставки.", "",
       "**Покрытие — что нам нужно → какие вопросы это дают:**", ""]
md += [f"- {a} — {b}" for a, b in B.NEEDS]
(D / "q3.md").write_text("\n".join(md).strip() + "\n")

# --- questions.json ---
data = {"version": B.VERSION, "intro": B.INTRO, "tags": B.TAGS,
        "core": [{"block": b["n"], "title": b["title"], "minutes": b["minutes"], "why": b["why"], "example": b.get("example"),
                  "questions": [{"id": q[0], "main": q[1], "text": q[2], "hint": q[3], "tags": list(q[4])} for q in b["q"]]} for b in B.CORE],
        "roles": [{"code": r["code"], "title": r["title"], "who": r["who"], "into": r["into"],
                   "questions": [{"id": q[0], "main": q[1], "text": q[2], "hint": q[3], "tags": list(q[4])} for q in r["q"]]} for r in B.ROLES]}
(D / "questions.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
print("вопросов в общей части:", total, "| главных:", stars, "| во вставках:", sum(len(r["q"]) for r in B.ROLES))
