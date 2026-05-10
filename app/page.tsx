'use client';
import Link from 'next/link';

const CLIP = {
  hero:    'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',
  eyebrow: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',
  navpill: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',
  step:    'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)',
  badge:   'polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)',
  tag:     'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)',
  cat:     'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)',
  proof:   'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)',
  lg:      'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)',
  xl:      'polygon(20px 0,100% 0,100% calc(100% - 20px),calc(100% - 20px) 100%,0 100%,0 20px)',
  icon:    'polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px)',
};

export default function Landing() {

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Rajdhani:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#050810;color:#E5DCC8;font-family:'Rajdhani',sans-serif;overflow-x:hidden}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(1px 1px at 15% 20%,rgba(200,169,110,.6) 0%,transparent 100%),radial-gradient(1px 1px at 45% 8%,rgba(255,255,255,.4) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 72% 15%,rgba(200,169,110,.5) 0%,transparent 100%),radial-gradient(1px 1px at 88% 35%,rgba(255,255,255,.3) 0%,transparent 100%),radial-gradient(1px 1px at 30% 55%,rgba(255,255,255,.25) 0%,transparent 100%),radial-gradient(ellipse 80% 60% at 85% 5%,rgba(123,79,166,.09) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 5% 90%,rgba(78,205,196,.06) 0%,transparent 55%);pointer-events:none;z-index:0}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .blink{animation:blink 2s ease-in-out infinite}
        .fc{font-family:'Cinzel',serif}
        .fr{font-family:'Rajdhani',sans-serif}
        .fm{font-family:'Space Mono',monospace}
        .tg{background:linear-gradient(90deg,#7A5A24 0%,#EDD28A 45%,#C8A96E 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .stat-line::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,#C8A96E,transparent);opacity:.4}
        .cta-borders::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,.5),transparent)}
        .cta-borders::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(200,169,110,.5),transparent)}

        /* Feature grid hover */
        .feat-group{transition:background .3s}
        .feat-group:hover{background:#0d1628 !important}
        .feat-line{opacity:0;transition:opacity .3s}
        .feat-group:hover .feat-line{opacity:1}

        /* Category cards */
        .cat-card{transition:transform .25s,border-color .25s,background .25s}
        .cat-card:hover{transform:translateY(-5px);border-color:rgba(200,169,110,.28) !important;background:#101928 !important}

        /* Nav links */
        .nav-link{
          position:relative;
          color:#8A8070;text-decoration:none;font-size:.78rem;font-weight:700;
          letter-spacing:.12em;text-transform:uppercase;transition:color .2s;
          padding-bottom:2px;
        }
        .nav-link::after{
          content:'';position:absolute;bottom:0;left:0;right:0;
          height:1px;background:#C8A96E;transform:scaleX(0);
          transform-origin:left;transition:transform .25s ease;
        }
        .nav-link:hover{color:#E5DCC8}
        .nav-link:hover::after{transform:scaleX(1)}

        /* Active nav link */
        .nav-link.active{color:#C8A96E}
        .nav-link.active::after{transform:scaleX(1)}

        .cta-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:400px;height:200px;background:radial-gradient(ellipse,rgba(200,169,110,.07) 0%,transparent 70%);pointer-events:none}

        /* Buttons */
        .btn-primary{
          transition:opacity .2s, transform .15s, box-shadow .2s;
          cursor:pointer;
        }
        .btn-primary:hover{opacity:.88;transform:translateY(-1px)}
        .btn-primary:active{opacity:1;transform:translateY(0) scale(.97)}

        .btn-outline{
          transition:background .2s, border-color .2s, color .2s, transform .15s;
          cursor:pointer;
        }
        .btn-outline:hover{background:rgba(200,169,110,.08) !important;border-color:rgba(200,169,110,.6) !important}
        .btn-outline:active{transform:scale(.97)}

        /* Nav buttons */
        .nav-btn-signin{
          transition:background .2s, border-color .2s, color .2s, transform .15s;
          cursor:pointer;
        }
        .nav-btn-signin:hover{background:rgba(200,169,110,.16) !important;border-color:rgba(200,169,110,.35) !important;color:#EDD28A !important}
        .nav-btn-signin:active{transform:scale(.96)}

        .nav-btn-signup{
          transition:opacity .2s, transform .15s;
          cursor:pointer;
        }
        .nav-btn-signup:hover{opacity:.85}
        .nav-btn-signup:active{transform:scale(.96)}

        /* Stat cards */
        .stat-cell{transition:background .2s}
        .stat-cell:hover{background:#0e1825 !important}

        /* Step cards */
        .step-card{transition:background .2s, border-color .2s, transform .2s}
        .step-card:hover{background:#101928 !important;border-color:rgba(200,169,110,.28) !important;transform:translateX(4px)}

        /* Proof / testimonial cards */
        .proof-card{transition:background .2s, border-color .2s, transform .2s}
        .proof-card:hover{background:#0e1825 !important;border-color:rgba(200,169,110,.22) !important;transform:translateY(-4px)}

        /* Footer links */
        .footer-link{color:#4A4540;text-decoration:none;font-size:.7rem;font-weight:600;letter-spacing:.08em;transition:color .2s}
        .footer-link:hover{color:#C8A96E}

        /* Logo */
        .nav-logo{transition:opacity .2s}
        .nav-logo:hover{opacity:.8}

        /* Responsive grids */
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr)}
        .cats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
        .proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem}
        .split-layout{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
        .stats-bar{display:flex}
        .nav-links{display:flex;gap:2rem}

        @media(max-width:960px){
          .feat-grid{grid-template-columns:repeat(2,1fr)}
          .proof-grid{grid-template-columns:1fr}
          .split-layout{grid-template-columns:1fr;gap:2.5rem}
          .nav-links{display:none}
        }
        @media(max-width:700px){
          .feat-grid{grid-template-columns:1fr}
          .cats-grid{grid-template-columns:repeat(2,1fr)}
          .stats-bar{flex-direction:column}
        }
      `}</style>

      <div style={{position:'relative',zIndex:1}}>

        {/* NAV */}
        <nav style={{position:'sticky',top:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.9rem 2.5rem',background:'rgba(5,8,16,.92)',backdropFilter:'blur(20px)',borderBottom:'.5px solid rgba(200,169,110,.13)'}}>
          <a href="/" className="nav-logo" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
            <svg width="26" height="26" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.2" fill="rgba(200,169,110,0.25)" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="14" y1="8" x2="14" y2="10.8" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="14" y1="17.2" x2="14" y2="20" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="8" y1="14" x2="10.8" y2="14" stroke="#C8A96E" strokeWidth=".8"/>
              <line x1="17.2" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth=".8"/>
            </svg>
            <span className="fc" style={{fontSize:'.95rem',fontWeight:700,color:'#C8A96E'}}>Hoyoverse Hub</span>
          </a>
          <div className="nav-links">
            {[['#hero','Home'],['#features','Platform Features'],['#how-it-works','How It Works'],['#categories','Content Categories'],['#community-voices','Community Voices']].map(([h,l])=>(
              <a key={h} href={h} className="nav-link" onClick={(e) => handleNavClick(e, h)}>{l}</a>
            ))}
          </div>
          <div style={{display:'flex',gap:'.6rem'}}>
            <Link href="/Sign-in">
              <button className="fr nav-btn-signin" style={{clipPath:CLIP.navpill,padding:'.45rem 1.1rem',background:'rgba(200,169,110,.08)',border:'.5px solid rgba(200,169,110,.13)',color:'#C8A96E',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase'}}>Sign In</button>
            </Link>
            <Link href="/Sign-up">
              <button className="fr nav-btn-signup" style={{clipPath:CLIP.navpill,padding:'.45rem 1.3rem',background:'linear-gradient(135deg,#7A5A24,#C8A96E)',border:'none',color:'#060911',fontSize:'.75rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase'}}>Sign Up</button>
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section id="hero" style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'7rem 2rem 5rem',position:'relative'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 65% 55% at 50% 40%,rgba(200,169,110,.05) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{clipPath:CLIP.eyebrow,display:'inline-flex',alignItems:'center',gap:10,padding:'.4rem 1.2rem',border:'.5px solid rgba(78,205,196,.3)',background:'rgba(78,205,196,.06)',color:'#4ECDC4',fontSize:'.65rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',marginBottom:'2.5rem'}}>
            <span className="blink" style={{width:5,height:5,background:'#4ECDC4',borderRadius:'50%',display:'inline-block'}}/>
            Version New — Live Now
          </div>
          <h1 className="fc" style={{fontSize:'clamp(2.6rem,5.5vw,4.8rem)',fontWeight:900,lineHeight:1.04,letterSpacing:'.03em',marginBottom:'1.5rem'}}>
            <span style={{display:'block',color:'#E5DCC8'}}>The Passenger</span>
            <span className="tg" style={{display:'block'}}>Chronicle Hub</span>
          </h1>
          <p style={{maxWidth:520,fontSize:'1rem',lineHeight:1.75,color:'#8A8070',marginBottom:'2.5rem'}}>
           The One-Stop Community for the HoYoverse.
           Find the most comprehensive guides on everything from exploring Teyvat, traveling interstellar on the Astral Express, fighting in New Eridu, to the epic tales of the Valkyries. Mission reports, event guides, and puzzle solutions—curated by experts to ensure your journey is unstoppable.
          </p>
          <div style={{display:'flex',gap:'.85rem',justifyContent:'center',flexWrap:'wrap',marginBottom:'4.5rem'}}>
            <button
              className="fr btn-primary"
              style={{clipPath:CLIP.hero,padding:'.8rem 2.2rem',background:'linear-gradient(135deg,#7A5A24,#C8A96E)',border:'none',color:'#060911',fontSize:'.88rem',fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase'}}
              onClick={() => document.getElementById('categories')?.scrollIntoView({behavior:'smooth'})}
            >
              Explore Reports
            </button>
            <button
              className="fr btn-outline"
              style={{clipPath:CLIP.hero,padding:'.8rem 2.2rem',background:'transparent',border:'.5px solid rgba(200,169,110,.35)',color:'#C8A96E',fontSize:'.88rem',fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase'}}
            >
              Write a Report
            </button>
          </div>
          <div className="stats-bar" style={{clipPath:CLIP.lg,border:'.5px solid rgba(200,169,110,.13)',background:'#0B1121',overflow:'hidden'}}>
            {[['12,480','Total Reports'],['31.6K','Active Trailblazers'],['4,230','Puzzles Solved'],['3','Events Active']].map(([v,l],i,a)=>(
              <div key={l} className="stat-line stat-cell" style={{position:'relative',flex:1,padding:'1.5rem 1.75rem',borderRight:i<a.length-1?'.5px solid rgba(200,169,110,.13)':'none',cursor:'default'}}>
                <div className="fm" style={{fontSize:'1.7rem',fontWeight:700,color:'#C8A96E',lineHeight:1}}>{v}</div>
                <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'#4A4540',marginTop:'.35rem'}}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{position:'relative',zIndex:1,padding:'4rem 2.5rem'}}>
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <span style={{display:'block',fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8A96E',marginBottom:'.75rem'}}>Platform Features</span>
            <h2 className="fc" style={{fontSize:'clamp(1.5rem,2.8vw,2.2rem)',fontWeight:700,lineHeight:1.2,color:'#E5DCC8'}}>Everything You Need In Hoyoworld</h2>
          </div>
          <div className="feat-grid" style={{maxWidth:1060,margin:'0 auto',border:'.5px solid rgba(200,169,110,.13)',overflow:'hidden',clipPath:CLIP.lg}}>
            {([
              {ac:'#C8A96E',ib:'rgba(200,169,110,.12)',t:'Mission Reports',d:'Deep-dive analyses of every main and companion quest — spoiler-tagged, lore-rich, and version-tracked.',icon:<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#C8A96E" strokeWidth="1.4"><polygon points="10,1 18,5 18,15 10,19 2,15 2,5"/><circle cx="10" cy="10" r="2.5"/></svg>},
              {ac:'#4ECDC4',ib:'rgba(78,205,196,.1)',t:'Event Coverage',d:'Complete seasonal event walkthroughs — every mechanic explained, all rewards documented from start to finish.',icon:<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#4ECDC4" strokeWidth="1.4"><rect x="1" y="3" width="18" height="14" rx="1.5"/><line x1="1" y1="8" x2="19" y2="8"/><line x1="7" y1="12.5" x2="13" y2="12.5"/></svg>},
              {ac:'#A855F7',ib:'rgba(168,85,247,.1)',t:'Puzzle Solutions',d:'Step-by-step walkthroughs for every environmental puzzle and hidden achievement across all worlds.',icon:<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#A855F7" strokeWidth="1.4"><polygon points="10,1 18,6 18,14 10,19 2,14 2,6"/><line x1="10" y1="7" x2="13" y2="10"/><line x1="13" y1="10" x2="10" y2="13"/><line x1="10" y1="13" x2="7" y2="10"/><line x1="7" y1="10" x2="10" y2="7"/></svg>},
              {ac:'#C8A96E',ib:'rgba(200,169,110,.12)',t:'Community Rating',d:'Peer-reviewed and star-rated by thousands of Trailblazers. Always surface the most trusted content first.',icon:<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#C8A96E" strokeWidth="1.4"><polygon points="10,1 12.5,7 19,7 14,11 16,17.5 10,13.5 4,17.5 6,11 1,7 7.5,7"/></svg>},
              {ac:'#4ECDC4',ib:'rgba(78,205,196,.1)',t:'Active Community',d:'Over 31,000 Trailblazers contributing daily. Join discussions, share discoveries, and climb the leaderboard.',icon:<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#4ECDC4" strokeWidth="1.4"><circle cx="7" cy="7" r="3.5"/><circle cx="14" cy="11" r="3"/><path d="M1 18C1 14.5 4 13 7 13" strokeLinecap="round"/><path d="M10.5 17C10.5 14.5 12 14 14 14" strokeLinecap="round"/></svg>},
              {ac:'#A855F7',ib:'rgba(168,85,247,.1)',t:'Version Tracking',d:'Every report is tagged by game version. Instantly know whether a guide is current or from a past patch.',icon:<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#A855F7" strokeWidth="1.4"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10.5" strokeLinecap="round"/><circle cx="10" cy="13.5" r=".8" fill="#A855F7"/></svg>},
            ] as const).map((f,i)=>(
              <div key={i} className="feat-group" style={{position:'relative',background:'#0B1121',padding:'2.25rem 2rem',overflow:'hidden',cursor:'default',borderRight:[0,1,3,4].includes(i)?'.5px solid rgba(200,169,110,.13)':'none',borderBottom:i<3?'.5px solid rgba(200,169,110,.13)':'none'}}>
                <div className="feat-line" style={{position:'absolute',top:0,left:0,right:0,height:1.5,background:f.ac}}/>
                <div style={{width:38,height:38,marginBottom:'1.2rem',display:'flex',alignItems:'center',justifyContent:'center',background:f.ib,clipPath:CLIP.icon}}>{f.icon}</div>
                <div className="fc" style={{fontSize:'.88rem',fontWeight:600,color:'#E5DCC8',marginBottom:'.5rem'}}>{f.t}</div>
                <div style={{fontSize:'.82rem',lineHeight:1.7,color:'#8A8070'}}>{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{position:'relative',zIndex:1}}>
          <div style={{maxWidth:1060,margin:'0 auto',padding:'4rem 2.5rem'}}>
            <div className="split-layout">
              <div>
                <span style={{display:'block',fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8A96E',marginBottom:'.75rem'}}>How It Works</span>
                <h2 className="fc" style={{fontSize:'clamp(1.5rem,2.8vw,2.2rem)',fontWeight:700,lineHeight:1.2,color:'#E5DCC8',marginBottom:'1rem'}}>From Discovery<br/>to Mastery</h2>
                <p style={{fontSize:'.92rem',lineHeight:1.75,color:'#8A8070',marginBottom:'1.5rem'}}>Getting started takes seconds. Browse by category, filter by version, and find exactly the guide you need — then contribute your own discoveries to earn XP and reputation.</p>
                <div style={{display:'flex',flexDirection:'column',gap:'.85rem'}}>
                  {[['01','Explore Reports','Browse thousands of guides filtered by type, version, and community rating.'],['02','Rate & Discuss','Vote, leave feedback, and engage in discussions to help the community thrive.'],['03','Contribute','Write reports, earn XP, and rise through the Trailblazer leaderboard ranks.']].map(([n,t,d])=>(
                    <div key={n} className="step-card" style={{clipPath:CLIP.step,display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1.1rem 1.25rem',background:'#0B1121',border:'.5px solid rgba(200,169,110,.13)',cursor:'default'}}>
                      <span className="fm" style={{fontSize:'.78rem',fontWeight:700,color:'#C8A96E',minWidth:24,marginTop:1}}>{n}</span>
                      <div>
                        <div className="fc" style={{fontSize:'.82rem',fontWeight:600,color:'#E5DCC8',marginBottom:'.2rem'}}>{t}</div>
                        <div style={{fontSize:'.78rem',lineHeight:1.6,color:'#8A8070'}}>{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Mock */}
              <div style={{background:'#0B1121',border:'.5px solid rgba(200,169,110,.13)',clipPath:CLIP.lg,overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'.75rem 1rem',borderBottom:'.5px solid rgba(200,169,110,.13)',background:'rgba(200,169,110,.04)'}}>
                  {['#E85050','#C8A96E','#4ECDC4'].map(c=><div key={c} style={{width:8,height:8,borderRadius:'50%',background:c}}/>)}
                  <span className="fm" style={{fontSize:'.6rem',color:'#4A4540',marginLeft:'auto'}}>trailblazerhub.app · Dashboard</span>
                </div>
                <div style={{padding:'.6rem .75rem .25rem',fontSize:'.6rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#4A4540',borderBottom:'.5px solid rgba(200,169,110,.06)'}}>Latest Reports</div>
                {[
                  {av:'AN',avBg:'rgba(200,169,110,.1)',avBd:'#7A5A24',avC:'#C8A96E',title:'Where the Stairway Leads — Analysis',badge:'Mission',bBg:'rgba(200,169,110,.12)',bC:'#C8A96E',bBd:'rgba(200,169,110,.3)',stars:'★★★★★',sC:'#C8A96E',votes:'↑248'},
                  {av:'VH',avBg:'rgba(78,205,196,.08)',avBd:'#2A7A74',avC:'#4ECDC4',title:'Clouded Sanctuary Event — All Stages',badge:'Event',bBg:'rgba(78,205,196,.1)',bC:'#4ECDC4',bBd:'rgba(78,205,196,.3)',stars:'★★★★☆',sC:'#4ECDC4',votes:'↑186'},
                  {av:'QG',avBg:'rgba(168,85,247,.08)',avBd:'rgba(168,85,247,.3)',avC:'#A855F7',title:'Simulated Universe World 10 — Full Guide',badge:'Puzzle',bBg:'rgba(168,85,247,.1)',bC:'#A855F7',bBd:'rgba(168,85,247,.3)',stars:'★★★★★',sC:'#A855F7',votes:'↑412'},
                  {av:'MS',avBg:'rgba(200,169,110,.1)',avBd:'#7A5A24',avC:'#C8A96E',title:'Penacony Side Quests: Full Lore Timeline',badge:'Mission',bBg:'rgba(200,169,110,.12)',bC:'#C8A96E',bBd:'rgba(200,169,110,.3)',stars:'★★★★★',sC:'#C8A96E',votes:'↑334'},
                  {av:'CA',avBg:'rgba(200,169,110,.1)',avBd:'#7A5A24',avC:'#C8A96E',title:'Robin Companion Quest: Character Study',badge:'Mission',bBg:'rgba(200,169,110,.12)',bC:'#C8A96E',bBd:'rgba(200,169,110,.3)',stars:'★★★★★',sC:'#C8A96E',votes:'↑521'},
                ].map((r,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.7rem 1rem',borderBottom:'.5px solid rgba(200,169,110,.05)',fontSize:'.75rem',transition:'background .18s',cursor:'pointer'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(200,169,110,.04)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                  >
                    <div className="fc" style={{width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.55rem',fontWeight:700,flexShrink:0,background:r.avBg,border:`.5px solid ${r.avBd}`,color:r.avC}}>{r.av}</div>
                    <span style={{flex:1,fontWeight:600,color:'#E5DCC8',fontSize:'.75rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</span>
                    <span style={{clipPath:CLIP.badge,padding:'2px 7px',fontSize:'.58rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',background:r.bBg,color:r.bC,border:`.5px solid ${r.bBd}`}}>{r.badge}</span>
                    <span style={{fontSize:'.65rem',letterSpacing:1,color:r.sC}}>{r.stars}</span>
                    <span className="fm" style={{fontSize:'.62rem',color:'#4ECDC4'}}>{r.votes}</span>
                  </div>
                ))}
                <div style={{padding:'.75rem 1rem',borderTop:'.5px solid rgba(200,169,110,.06)',display:'flex',justifyContent:'flex-end'}}>
                  <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.1em',color:'#C8A96E',textTransform:'uppercase',cursor:'pointer',transition:'color .2s',textDecoration:'none'}}
                    onMouseEnter={e=>(e.currentTarget.style.color='#EDD28A')}
                    onMouseLeave={e=>(e.currentTarget.style.color='#C8A96E')}
                  >View all reports →</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories" style={{position:'relative',zIndex:1,padding:'4rem 2.5rem 5rem'}}>
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <span style={{display:'block',fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8A96E',marginBottom:'.75rem'}}>Content Categories</span>
            <h2 className="fc" style={{fontSize:'clamp(1.5rem,2.8vw,2.2rem)',fontWeight:700,lineHeight:1.2,color:'#E5DCC8'}}>Explore by Universe</h2>
            <p style={{maxWidth:460,margin:'.5rem auto 0',fontSize:'.92rem',lineHeight:1.7,color:'#8A8070',textAlign:'center'}}>Every corner of Honkai: Star Rail — organized and ready to explore.</p>
          </div>
          <div className="cats-grid" style={{maxWidth:900,margin:'0 auto'}}>
            {[
              {sym:'⬡',name:'Mission & Quest',count:'482 reports',sc:'#C8A96E',cc:'#4A4540'},
              {sym:'▣',name:'Seasonal Events',count:'NEW',sc:'#4ECDC4',cc:'#4ECDC4'},
              {sym:'◈',name:'Puzzle & Riddles',count:'324 reports',sc:'#A855F7',cc:'#4A4540'},
              {sym:'◆',name:'Lore Archive',count:'198 reports',sc:'#E85050',cc:'#4A4540'},
            ].map((c,i)=>(
              <div key={i} className="cat-card" style={{clipPath:CLIP.cat,position:'relative',background:'#0B1121',border:'.5px solid rgba(200,169,110,.13)',padding:'2rem 1.25rem',textAlign:'center',cursor:'pointer',overflow:'hidden'}}>
                <span style={{display:'block',fontSize:'1.8rem',lineHeight:1,marginBottom:'.9rem',color:c.sc}}>{c.sym}</span>
                <div className="fc" style={{fontSize:'.82rem',fontWeight:600,color:'#E5DCC8',marginBottom:'.35rem'}}>{c.name}</div>
                <div className="fm" style={{fontSize:'.62rem',color:c.cc,fontWeight:700,letterSpacing:'.1em'}}>{c.count}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="community-voices" style={{position:'relative',zIndex:1,padding:'0 2.5rem 5.5rem'}}>
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <span style={{display:'block',fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8A96E',marginBottom:'.75rem'}}>Community Voices</span>
            <h2 className="fc" style={{fontSize:'clamp(1.5rem,2.8vw,2.2rem)',fontWeight:700,lineHeight:1.2,color:'#E5DCC8'}}>Trusted Across the Galaxy</h2>
            <p style={{maxWidth:460,margin:'.5rem auto 0',fontSize:'.92rem',lineHeight:1.7,color:'#8A8070',textAlign:'center'}}>Relied upon by thousands of players every single day.</p>
          </div>
          <div className="proof-grid" style={{maxWidth:1000,margin:'0 auto'}}>
            {[
              {q:"The Robin companion quest analysis here saved me hours of re-reading lore. The best HSR storytelling reference I've ever found.",av:'CA',name:'Cocolia_Arc',lvl:'LV.70 · 34 reports'},
              {q:"Solved Simulated Universe World 10 thanks to QuantumGale's guide. No fluff — just clean, accurate solutions that actually work.",av:'VH',name:'VoidHunter_X',lvl:'LV.65 · 21 reports'},
              {q:"Writing reports here is genuinely rewarding. The engaged readership and upvote system make every contribution feel meaningful.",av:'AN',name:'AstreaN_7',lvl:'LV.60 · 48 reports'},
            ].map((p,i)=>(
              <div key={i} className="proof-card" style={{clipPath:CLIP.proof,position:'relative',background:'#0B1121',border:'.5px solid rgba(200,169,110,.13)',padding:'1.75rem',cursor:'default'}}>
                <div className="fc" style={{position:'absolute',top:'.75rem',right:'1.2rem',fontSize:'3.5rem',color:'rgba(200,169,110,.07)',lineHeight:1,pointerEvents:'none'}}>"</div>
                <div style={{fontSize:'.7rem',color:'#C8A96E',letterSpacing:2,marginBottom:'.85rem'}}>★★★★★</div>
                <p style={{fontSize:'.82rem',lineHeight:1.72,color:'#8A8070',marginBottom:'1.25rem',fontStyle:'italic'}}>{p.q}</p>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div className="fc" style={{width:30,height:30,borderRadius:'50%',border:'1px solid #7A5A24',background:'rgba(200,169,110,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.58rem',color:'#C8A96E',fontWeight:700}}>{p.av}</div>
                  <div>
                    <div style={{fontSize:'.8rem',fontWeight:600,color:'#E5DCC8'}}>{p.name}</div>
                    <div className="fm" style={{fontSize:'.65rem',color:'#4A4540',marginTop:1}}>{p.lvl}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{position:'relative',zIndex:1,padding:'0 2.5rem 6rem'}}>
          <div className="cta-borders" style={{clipPath:CLIP.xl,position:'relative',maxWidth:760,margin:'0 auto',background:'#0B1121',border:'.5px solid rgba(200,169,110,.2)',padding:'4.5rem 4rem',textAlign:'center',overflow:'hidden'}}>
            <div className="cta-glow"/>
            <span style={{display:'block',fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'#C8A96E',marginBottom:'1rem'}}>Ready to Begin?</span>
            <h2 className="fc" style={{fontSize:'clamp(1.5rem,2.8vw,2.2rem)',fontWeight:700,lineHeight:1.2,color:'#E5DCC8',marginBottom:'.85rem'}}>Across the Sea of Quanta</h2>
            <p style={{fontSize:'.95rem',lineHeight:1.72,color:'#8A8070',maxWidth:460,margin:'0 auto 2.25rem'}}>Join over 31,000 Player sharing knowledge across the imaginary. Your next great discovery is one report away.</p>
            <div style={{display:'flex',gap:'.85rem',justifyContent:'center',flexWrap:'wrap'}}>
              <button className="fr btn-primary" style={{clipPath:CLIP.hero,padding:'.8rem 2.2rem',background:'linear-gradient(135deg,#7A5A24,#C8A96E)',border:'none',color:'#060911',fontSize:'.88rem',fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase'}}>Get Started Free</button>
              <button className="fr btn-outline" style={{clipPath:CLIP.hero,padding:'.8rem 2.2rem',background:'transparent',border:'.5px solid rgba(200,169,110,.35)',color:'#C8A96E',fontSize:'.88rem',fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase'}}>Browse Reports</button>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',justifyContent:'center',marginTop:'1.75rem'}}>
              {['No Login Required','Version 3.2','Updated Daily','Community Driven','Free Forever'].map(t=>(
                <span key={t} style={{clipPath:CLIP.tag,padding:'.25rem .85rem',background:'rgba(200,169,110,.06)',border:'.5px solid rgba(200,169,110,.15)',color:'#4A4540',fontSize:'.62rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase'}}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{position:'relative',zIndex:1,borderTop:'.5px solid rgba(200,169,110,.13)',padding:'2rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
          <div className="fc" style={{fontSize:'.85rem',fontWeight:700,color:'#7A5A24'}}>Hoyoverse Hub</div>
          <div style={{display:'flex',gap:'1.5rem'}}>
            {['About','Guidelines','Discord','Privacy'].map(l=>(
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div className="fm" style={{fontSize:'.62rem',color:'#4A4540'}}>© 2025 Hoyoverse Hub · The Our Journey</div>
        </footer>

      </div>
    </>
  );
}