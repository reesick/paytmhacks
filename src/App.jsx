import React, { useEffect, useMemo, useState } from 'react'
import { CASES, KPIS, MIX, INTENTS, VISITS } from './data.js'
import { TOUR } from './tour.js'

const inr = (n) => '₹' + n.toLocaleString('en-IN')
const STATE = {
  approval: ['Needs approval', 'warn', '⚠'],
  running: ['AI working', 'info', '↻'],
  resolved: ['Resolved by AI', 'ok', '✓'],
  human: ['Human handling', 'human', '👤'],
}
const STEP = { done: ['Done', 'ok', '✓'], running: ['Running', 'info', '↻'], approval: ['Needs approval', 'warn', '⚠'], queued: ['Queued', 'muted', '…'], human: ['Human', 'human', '👤'], failed: ['Failed', 'bad', '✕'] }

function Chip({ kind, icon, children }) {
  return <span className={`chip ${kind}`}><span aria-hidden>{icon}</span>{children}</span>
}
function Conf({ v }) {
  const lvl = v >= 0.8 ? 'High' : v >= 0.6 ? 'Medium' : 'Low'
  const n = Math.round(v * 5)
  return (
    <span className="conf" title={`confidence ${v}`}>
      <span className={`bars ${lvl.toLowerCase()}`}>{[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < n ? 'on' : ''} />)}</span>
      {lvl} {v.toFixed(2)}
    </span>
  )
}

export default function App() {
  const [tab, setTab] = useState('console')
  const [cases, setCases] = useState(CASES)
  const [sel, setSel] = useState('PT-8821')
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState('')
  const c = cases.find((x) => x.id === sel)
  const [intro, setIntro] = useState(true)
  const [step, setStep] = useState(-1)
  const cur = step >= 0 ? TOUR[step] : null

  useEffect(() => {
    document.querySelectorAll('.tour-hl').forEach((e) => e.classList.remove('tour-hl'))
    if (!cur) return
    setTab(cur.tab)
    if (cur.case) { setSel(cur.case); setFilter('all') }
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-tour="${cur.target}"]`)
      if (el) { el.classList.add('tour-hl'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
    }, 120)
    return () => clearTimeout(t)
  }, [step])
  const startTour = () => { setIntro(false); setCases(CASES); setStep(0) }

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t) } }, [toast])

  // animate the running case
  useEffect(() => {
    const t = setInterval(() => {
      setCases((cs) => cs.map((x) => {
        if (x.state !== 'running') return x
        const i = x.steps.findIndex((s) => s[0] === 'running')
        if (i < 0) return x
        const steps = x.steps.map((s) => [...s])
        steps[i][0] = 'done'
        if (steps[i + 1]) steps[i + 1][0] = 'running'
        return { ...x, steps, state: steps[i + 1] ? 'running' : 'resolved' }
      }))
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const decide = (ok) => {
    setCases((cs) => cs.map((x) => {
      if (x.id !== sel) return x
      const steps = x.steps.map((s) => [...s])
      const i = steps.findIndex((s) => s[0] === 'approval')
      steps[i] = ok ? ['done', `Approved by Priya (L1) · ${x.approval.cta}`, 'Human', x.approval.effect] : ['human', 'Rejected: reason "Need more info"', 'Human', 'AI drafting polite reply']
      if (ok && steps[i + 1]) steps[i + 1][0] = 'running'
      return { ...x, steps, state: ok ? 'running' : 'human' }
    }))
    setToast(ok ? 'Approved. AI teammate resumed the case.' : 'Rejected. Case moved to you.')
  }
  const takeOver = () => {
    setCases((cs) => cs.map((x) => x.id === sel ? { ...x, state: 'human' } : x))
    setToast('You are handling this case. AI paused, handoff note pinned.')
  }

  const list = useMemo(() => cases.filter((x) => filter === 'all' || x.state === filter), [cases, filter])
  const counts = (s) => cases.filter((x) => x.state === s).length

  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><span className="logo">pay<b>tm</b></span><span className="sub">Sahayak Ops</span></div>
        {[['console', 'Case queue'], ['chat', 'Merchant chat'], ['insights', 'Insights'], ['field', 'Field app']].map(([k, l]) => (
          <button key={k} className={`nav ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}{k === 'console' && counts('approval') > 0 && <span className="badge">{counts('approval')}</span>}</button>
        ))}
        <button className="tourbtn" onClick={startTour}>▶ Guided tour</button>
        <div className="sidefoot">Powered by Jev + gpt-oss</div>
      </aside>

      <main className="main">
        <header className="top">
          <input className="search" placeholder="Search case, MID, UTR, RRN…" />
          <div className="me"><span className="notlive">Data not live</span><span className="ai">AI teammate active</span> Priya · Ops L1</div>
        </header>

        {tab === 'console' && (
          <div className="console">
            <section className="queue" data-tour="queue">
              <div className="views">
                {[['all', 'All'], ['running', 'AI working'], ['approval', 'Needs approval'], ['human', 'Human'], ['resolved', 'Resolved']].map(([k, l]) => (
                  <button key={k} className={`view ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l} <b>{k === 'all' ? cases.length : counts(k)}</b></button>
                ))}
              </div>
              {list.map((x) => {
                const [label, kind, icon] = STATE[x.state]
                return (
                  <button key={x.id} className={`row ${sel === x.id ? 'sel' : ''}`} onClick={() => setSel(x.id)}>
                    <div className="r1"><b>{x.who}</b><span className="muted">{x.id}</span></div>
                    <div className="r2">{x.issue}</div>
                    <div className="r3"><Chip kind={kind} icon={icon}>{label}</Chip><Conf v={x.conf} /><span className="tat">⏱ {x.tat}</span>{x.amount > 0 && <span className="amt">{inr(x.amount)}</span>}</div>
                  </button>
                )
              })}
            </section>

            <section className="detail">
              <div className="dhead">
                <div>
                  <div className="muted">{c.id} · {c.meta}</div>
                  <h2>{c.issue} · {c.who}</h2>
                </div>
                <div className="acts" data-tour="takeover">
                  <Chip kind={STATE[c.state][1]} icon={STATE[c.state][2]}>{STATE[c.state][0]}</Chip>
                  <button className="btn ghost" onClick={() => setToast('AI paused.')}>Pause AI</button>
                  <button className="btn dark" onClick={takeOver}>Take over</button>
                </div>
              </div>

              <div className="cols">
                <div className="convo" data-tour="convo">
                  <h4>Conversation</h4>
                  <div className="bubble user">{c.lang === 'hi' && <span className="voice">▶ voice 0:07</span>}{c.msg}</div>
                  <div className="bubble ai"><span className="aitag">AI</span>{c.lang === 'hi' ? 'Samajh gaya. Main abhi check kar raha hoon.' : 'Got it. Checking this for you right now.'}</div>
                  {c.state === 'approval' && <div className="bubble ai"><span className="aitag">AI</span>{c.lang === 'hi' ? 'Main apni team se confirm kar raha hoon. 10 min mein update.' : 'Confirming with my team, update in 10 min.'}</div>}
                  {c.state === 'resolved' && <div className="receipt">✓ Action receipt · {c.id} · verified</div>}
                  <div className="banner">Paytm kabhi PIN/OTP nahi maangta</div>
                </div>

                <div className="timeline" data-tour="timeline">
                  <h4>Agent timeline</h4>
                  {c.steps.map((s, i) => {
                    const [label, kind, icon] = STEP[s[0]]
                    return (
                      <div key={i} className={`step ${s[0]}`}>
                        <span className={`node ${kind}`}>{icon}</span>
                        <div className="sbody">
                          <div className="stitle">{s[1]}</div>
                          <div className="smeta"><span className="sys">{s[2]}</span><Chip kind={kind} icon="">{label}</Chip></div>
                          {s[3] && <details><summary>Why?</summary>{s[3]}</details>}
                        </div>
                      </div>
                    )
                  })}
                  {c.state === 'approval' && c.approval && (
                    <div className="approval" data-tour="approval">
                      <div className="atitle">{c.approval.title}</div>
                      <ul>{c.approval.why.map((w) => <li key={w}>{w}</li>)}</ul>
                      <div className="muted small">Effect: {c.approval.effect} · <Conf v={c.conf} /></div>
                      <div className="abtns">
                        <button className="btn primary" onClick={() => decide(true)}>{c.approval.cta}</button>
                        <button className="btn ghost" onClick={() => decide(false)}>Reject</button>
                        <button className="btn ghost" onClick={takeOver}>Take over</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="c360" data-tour="c360">
                  <h4>Customer 360</h4>
                  <dl>
                    <dt>On Paytm since</dt><dd>{c.c360.since}</dd>
                    <dt>KYC</dt><dd>{c.c360.kyc}</dd>
                    <dt>Device / handle</dt><dd>{c.c360.device}</dd>
                    <dt>Avg GMV</dt><dd>{c.c360.gmv}</dd>
                    <dt>Past disputes</dt><dd>{c.c360.disputes}</dd>
                    <dt>Sentiment</dt><dd>{c.sentiment}</dd>
                  </dl>
                  <h4>Suggested next</h4>
                  <button className="btn ghost full" onClick={() => setToast('Field visit scheduled. Undo within 30 s.')}>Schedule FSE visit</button>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === 'chat' && (
          <div className="phonewrap">
            <div className="phone" data-tour="chat">
              <div className="phead"><b>Paytm Sahayak</b> <span className="aitag">AI</span><div className="muted small">Gupta Medical · MID ••2290</div></div>
              <div className="pbody">
                <div className="banner">🛡 Paytm kabhi PIN/OTP nahi maangta</div>
                <div className="bubble user"><span className="voice">▶ voice 0:09</span>Dabba bol nahi raha, peeli light. Aur rent bhi kat raha hai!</div>
                <div className="bubble ai"><span className="aitag">AI</span>Samajh gaya. Do cheezein check kar raha hoon.</div>
                <div className="mini">
                  <div>✓ Soundbox check kiya</div><div>✓ Billing dekha</div><div>↻ Refund process ho raha hai</div>
                </div>
                <div className="bubble ai"><span className="aitag">AI</span>SIM nikaal ke wapas lagaiye, phir 3 second power button dabaiye. Maine remote se restart bhi bheja hai.</div>
                <div className="receipt big">✓ ₹375 wapas aa rahe hain<br /><small>Agle settlement ke saath · Ref RF-20931</small></div>
                <div className="quick"><button>Ho gaya</button><button>Nahi hua</button><button>Insaan se baat</button></div>
              </div>
              <div className="pinput"><span>Type karein…</span><span className="mic">🎤</span></div>
            </div>
          </div>
        )}

        {tab === 'insights' && (
          <div className="insights">
            <div className="kpis" data-tour="kpis">{KPIS.map(([l, v, d]) => <div key={l} className="kpi"><div className="kl">{l}</div><div className="kv">{v}</div><div className="kd">{d}</div></div>)}</div>
            <div className="grid2">
              <div className="panel"><h4>Resolution mix</h4>{MIX.map(([l, v]) => <div key={l} className="bar"><span>{l}</span><div><i style={{ width: v + '%' }} /></div><b>{v}%</b></div>)}</div>
              <div className="panel"><h4>Top intents</h4>{INTENTS.map(([l, v]) => <div key={l} className="bar"><span>{l}</span><div><i style={{ width: v * 3 + '%' }} /></div><b>{v}%</b></div>)}</div>
              <div className="panel"><h4>Cost per resolved case</h4><div className="bar"><span>Jev + gpt-oss</span><div><i style={{ width: '6%' }} /></div><b>₹0.40</b></div><div className="bar"><span>Frontier only</span><div><i className="grey" style={{ width: '100%' }} /></div><b>₹6.50</b></div><p className="muted small">~16x cheaper · 6 to 7 s model time vs ~40 s</p></div>
              <div className="panel"><h4>Sales funnel (AI-created leads)</h4>{[['Leads', 120], ['Qualified', 64], ['Visit booked', 38], ['Converted', 22]].map(([l, v]) => <div key={l} className="bar"><span>{l}</span><div><i style={{ width: (v / 1.2) + '%' }} /></div><b>{v}</b></div>)}</div>
            </div>
          </div>
        )}

        {tab === 'field' && (
          <div className="phonewrap">
            <div className="phone" data-tour="field">
              <div className="phead"><b>Aaj ke visits (3)</b><div className="muted small">Rahul · FSE Pune West · Route optimised by AI</div></div>
              <div className="pbody">
                {VISITS.map(([t, n, d, tag]) => (
                  <div key={n} className="visit">
                    <div className="r1"><b>{t} · {n}</b><span className={`chip ${tag === 'Hot' ? 'warn' : 'info'}`}>{tag}</span></div>
                    <div className="muted small">AI brief: {d}</div>
                    <div className="vbtns"><button>Navigate</button><button>Call</button><button>Open</button></div>
                  </div>
                ))}
              </div>
              <div className="pinput"><span>Outcome bol kar batayein…</span><span className="mic">🎤</span></div>
            </div>
          </div>
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
      {intro && (
        <div className="overlay">
          <div className="intro">
            <div className="logo big">pay<b>tm</b> <span>Sahayak Ops</span></div>
            <h1>An AI teammate that closes ops cases, not just tickets.</h1>
            <p>Sahayak picks up customer service and sales cases, decides what to do with a confidence score, takes actions across settlement, device, billing and field systems, and brings in a human only when money, risk or trust needs one.</p>
            <div className="notice">ⓘ The data on this page is not live. It is sample data to show how the experience works.</div>
            <div className="stops">
              <div><b>1</b>Case queue</div><div><b>2</b>Agent timeline</div><div><b>3</b>Human approval</div><div><b>4</b>Handoff</div><div><b>5</b>Merchant chat</div><div><b>6</b>Field app</div><div><b>7</b>Insights</div>
            </div>
            <div className="ibtns">
              <button className="btn primary" onClick={startTour}>Start guided tour (2 min)</button>
              <button className="btn ghost" onClick={() => setIntro(false)}>Explore on my own</button>
            </div>
            <div className="muted small">Team Kala Dhua · Paytm AI Hackathon · Autonomous AI Teammates</div>
          </div>
        </div>
      )}
      {cur && (
        <div className={`coach ${["queue", "chat", "field", "kpis"].includes(cur.target) ? "" : "left"}`} role="dialog" aria-live="polite">
          <div className="cstep">Step {step + 1} of {TOUR.length}</div>
          <div className="ctitle">{cur.title}</div>
          <p>{cur.text}</p>
          {cur.try && <div className="ctry">👉 {cur.try}</div>}
          <div className="cbtns">
            <button className="btn ghost" onClick={() => setStep(-1)}>Exit</button>
            <span>
              {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>Back</button>}
              <button className="btn primary" onClick={() => setStep(step + 1 < TOUR.length ? step + 1 : -1)}>{step + 1 < TOUR.length ? 'Next' : 'Finish'}</button>
            </span>
          </div>
          <div className="cprog"><i style={{ width: ((step + 1) / TOUR.length) * 100 + '%' }} /></div>
        </div>
      )}
    </div>
  )
}
