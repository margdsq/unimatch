'use client';

import { FormEvent, useMemo, useState } from 'react';

type Mode = 'discover' | 'professor';
type Scope = 'within' | 'outside';
type Opportunity = { id:number; category:string; eyebrow:string; title:string; copy:string; tags:string[]; color:string; art:string; label:string; people:string[] };

const within: Opportunity[] = [
  { id:1, category:'Social', eyebrow:'SOCIAL · THIS SATURDAY', title:'IKEA run + meatballs', copy:'Splitting a Zipcar from campus. Two seats left and an unreasonable number of storage boxes to buy.', tags:['🚗 2 seats','🎓 Sciences Po'], color:'coral', art:'lamp', label:'CAMPUS RUN', people:['JL','SK','+4'] },
  { id:2, category:'Startup', eyebrow:'STARTUP · LOOKING FOR 2', title:'Build the anti-doomscroll app', copy:'Tiny team, big idea. Looking for a product designer and a React dev for a 6-week sprint.', tags:['⚙ React','✦ Product design'], color:'blue', art:'phone', label:'BUILD WEEK', people:['NO','AK','+2'] },
  { id:3, category:'Sports', eyebrow:'SPORT · EVERY WEDNESDAY', title:'Five-a-side, zero pressure', copy:'Friendly mixed-level football near Cité U. Come for the game, stay for the questionable tactics.', tags:['⚽ 3 spots','◷ 19:00'], color:'green', art:'ball', label:'PLAY CLUB', people:['TM','RB','+7'] },
  { id:4, category:'Event', eyebrow:'EVENT · SEPTEMBER 4', title:'Open-air cinema collective', copy:'Help turn the campus courtyard into a one-night cinema, from curation to projection.', tags:['🎬 Film','🎓 Campus'], color:'yellow', art:'cinema', label:'NIGHT SCREEN', people:['LE','FC','+5'] },
  { id:5, category:'Society', eyebrow:'SOCIETY · NEW MEMBERS', title:'Design for good society', copy:'Use research and design to help local nonprofits solve practical problems.', tags:['✎ Design','♥ Impact'], color:'pink', art:'design', label:'GOOD WORK', people:['MY','SA','+8'] },
  { id:6, category:'Competition', eyebrow:'CASE COMP · 3 WEEKS', title:'L’Oréal Brandstorm team', copy:'Looking for a storyteller and a spreadsheet wizard to round out our case team.', tags:['🏆 Competition','📊 Strategy'], color:'violet', art:'case', label:'CASE SPRINT', people:['IB','NR','+1'] },
];

const outside: Opportunity[] = [
  { id:11, category:'Co-founder', eyebrow:'CO-FOUNDER · EUROPE', title:'Make renting less painful', copy:'Imperial engineer seeking a business co-founder for a renter-first home platform.', tags:['🇬🇧 Imperial','💡 PropTech'], color:'violet', art:'case', label:'FOUNDING TEAM', people:['EC','LW','+2'] },
  { id:12, category:'Skills', eyebrow:'PROJECT · REMOTE', title:'Climate data, made visual', copy:'A cross-university team needs a data storyteller to make urban heat data useful.', tags:['🌍 Climate','✦ Data viz'], color:'green', art:'ball', label:'OPEN DATA', people:['YN','AS','+3'] },
  { id:13, category:'Niche', eyebrow:'COMMUNITY · MONTHLY', title:'People who make tiny games', copy:'A cozy group of student game makers sharing feedback, odd mechanics and demos.', tags:['🎮 Games','🎓 6 universities'], color:'coral', art:'phone', label:'TINY WORLDS', people:['JM','OK','+9'] },
  { id:14, category:'Project', eyebrow:'RESEARCH · 8 WEEKS', title:'Map food waste in Europe', copy:'Join students in Paris, Milan and Rotterdam to build an open food-waste atlas.', tags:['🗺 Research','🤝 Cross-campus'], color:'blue', art:'cinema', label:'EUROPE MAP', people:['AL','GB','+6'] },
];

const categorySets: Record<Scope,string[]> = {
  within:['All','Social','Sports','Event','Society','Competition','Startup'],
  outside:['All','Co-founder','Skills','Project','Niche'],
};

function Logo() { return <div className="brand" aria-label="CREW home"><img className="brand-logo" src="/crew-logo.png" alt="CREW" /></div>; }

function AccountGateway({onSelect}:{onSelect:(role:Mode)=>void}) {
  return <main className="account-gateway"><header><Logo/><span>University collaboration, with the right access.</span></header><section className="account-gateway-copy"><p className="kicker">WELCOME TO CREW</p><h1>Choose your<br/><em>account type.</em></h1><p>Student and professor workspaces are separate, so every account only sees the people, projects and controls it needs.</p></section><section className="account-choice-grid"><article className="account-choice student"><span className="account-choice-icon">◎</span><p className="eyebrow">STUDENT ACCOUNT</p><h2>Discover your next crew.</h2><p>Meet people, join opportunities, message matches and collaborate with your teams.</p><ul><li>Discover opportunities</li><li>Matches and messages</li><li>Student team workspaces</li></ul><button onClick={()=>onSelect('discover')}>Continue as student <span>→</span></button><small>For verified university students</small></article><article className="account-choice professor"><span className="account-choice-icon">▧</span><p className="eyebrow">PROFESSOR ACCOUNT</p><h2>Build stronger teams.</h2><p>Create course projects, manage student cohorts and use AI-assisted team allocation.</p><ul><li>Project and cohort management</li><li>AI-created teams</li><li>Academic progress overview</li></ul><button onClick={()=>onSelect('professor')}>Continue as professor <span>→</span></button><small>For verified faculty and university staff</small></article></section><footer><span>CREW verifies university affiliation before account access.</span><span>Contact your university administrator if your account type is incorrect.</span></footer></main>;
}

export default function Home() {
  const [mode,setMode] = useState<Mode|null>(null);
  const [activeNav,setActiveNav] = useState('Explore');
  const [scope,setScope] = useState<Scope>('within');
  const [category,setCategory] = useState('All');
  const [filterOpen,setFilterOpen] = useState(false);
  const [filterTiming,setFilterTiming] = useState('Any time');
  const [filterFormat,setFilterFormat] = useState('Any format');
  const [draftTiming,setDraftTiming] = useState('Any time');
  const [draftFormat,setDraftFormat] = useState('Any format');
  const [query,setQuery] = useState('');
  const [saved,setSaved] = useState<number[]>([]);
  const [connected,setConnected] = useState<string[]>([]);
  const [modal,setModal] = useState<'search'|'post'|'project'|null>(null);
  const [selected,setSelected] = useState<Opportunity|null>(null);
  const [toast,setToast] = useState('');
  const [teamReady,setTeamReady] = useState(false);
  const [hubTab,setHubTab] = useState('Chat');
  const [profileMenu,setProfileMenu] = useState<'top'|'bottom'|null>(null);
  const [profilePanel,setProfilePanel] = useState(false);
  const [activeConversation,setActiveConversation] = useState('Amara Kim');
  const opportunities = scope === 'within' ? within : outside;
  const activeFilterCount = Number(filterTiming!=='Any time')+Number(filterFormat!=='Any format');
  const filtered = useMemo(() => opportunities.filter((item) => {
    const haystack = `${item.eyebrow} ${item.title} ${item.copy} ${item.tags.join(' ')}`;
    const categoryMatch = category==='All'||item.category===category;
    const queryMatch = haystack.toLowerCase().includes(query.toLowerCase());
    const recurring = /EVERY|MONTHLY/.test(item.eyebrow);
    const soon = /THIS|WEDNESDAY|LOOKING|3 WEEKS/.test(item.eyebrow);
    const remote = /REMOTE|cross-university|other universities/i.test(haystack);
    const timingMatch = filterTiming==='Any time'||(filterTiming==='This week'&&soon)||(filterTiming==='Recurring'&&recurring);
    const formatMatch = filterFormat==='Any format'||(filterFormat==='Remote'&&remote)||(filterFormat==='In person'&&!remote);
    return categoryMatch&&queryMatch&&timingMatch&&formatMatch;
  }),[opportunities,category,query,filterTiming,filterFormat]);

  function notify(message:string) { setToast(message); window.setTimeout(() => setToast(''),2600); }
  function enterAccount(next:Mode) { setMode(next); setActiveNav(next==='discover'?'Explore':'Overview'); setProfileMenu(null); setProfilePanel(false); }
  function signOut() { setMode(null); setActiveNav('Explore'); setProfileMenu(null); setProfilePanel(false); }
  function toggleSaved(id:number) { const wasSaved=saved.includes(id); setSaved((current) => wasSaved ? current.filter((x) => x!==id) : [...current,id]); notify(wasSaved?'Removed from saved':'Saved for later'); }
  function submitAndClose(event:FormEvent<HTMLFormElement>,message:string) { event.preventDefault(); setModal(null); notify(message); }

  if (!mode) return <AccountGateway onSelect={enterAccount}/>;

  return <main className={`app-shell ${mode==='professor'?'professor-account':'student-account'}`}>
    <header className="topbar"><Logo /><div className={`account-context ${mode}`}><span className="account-context-icon">{mode==='discover'?'◎':'▧'}</span><span><strong>{mode==='discover'?'Student account':'Professor account'}</strong><small>{mode==='discover'?'Discover & collaborate':'Courses & team allocation'}</small></span></div><div className="top-actions"><button className="avatar" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={profileMenu==='top'} onClick={() => setProfileMenu(profileMenu==='top'?null:'top')}>MP</button></div></header>
    <div className="layout">
      <aside className="sidebar"><nav className="primary-nav" aria-label="Main navigation">{(mode==='discover'?[{key:'explore',label:'Explore'},{key:'matches',label:'Matches'},{key:'messages',label:'Messages'},{key:'teams',label:'My teams'}]:[{key:'overview',label:'Overview'},{key:'projects',label:'Projects'},{key:'students',label:'Students'},{key:'teams',label:'Teams'}]).map(({key,label})=><button key={label} onClick={()=>setActiveNav(label)} className={`nav-item ${activeNav===label?'active':''}`}><span className={`nav-icon icon-${key}`} aria-hidden="true"/>{label}</button>)}</nav><div className="sidebar-spacer"/><button className="create-button" onClick={()=>setModal(mode==='discover'?'post':'project')}><span>+</span> {mode==='discover'?'Post opportunity':'Create project'}</button><button className="profile-card" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={profileMenu==='bottom'} onClick={()=>setProfileMenu(profileMenu==='bottom'?null:'bottom')}><span className="mini-avatar">MP</span><span><strong>{mode==='discover'?'Maya Patel':'Prof. Maya Patel'}</strong><small>{mode==='discover'?'Sciences Po · Paris':'School of Management'}</small></span><span className="more">···</span></button></aside>
      {mode==='discover' && activeNav==='Explore' ? <section className="content">
        <div className="welcome-row"><div><p className="kicker">THURSDAY, AUGUST 27</p><h1>Find your people,<br/><em>make something happen.</em></h1></div><button className="search-button" onClick={()=>setModal('search')}><span>⌕</span>{query||'Search skills, ideas, people…'}<kbd>⌘ K</kbd></button></div>
        <div className="scope-bar"><div className="scope-tabs" role="tablist"><button onClick={()=>{setScope('within');setCategory('All')}} className={`scope-tab ${scope==='within'?'active':''}`}><span className="scope-icon">⌂</span><span><strong>Within university</strong><small>Your campus community</small></span></button><button onClick={()=>{setScope('outside');setCategory('All')}} className={`scope-tab ${scope==='outside'?'active':''}`}><span className="scope-icon">⊕</span><span><strong>Outside university</strong><small>Students everywhere</small></span></button></div><button className={`filter-button ${filterOpen?'active':''}`} aria-expanded={filterOpen} onClick={()=>{setDraftTiming(filterTiming);setDraftFormat(filterFormat);setFilterOpen((open)=>!open)}}>≡ &nbsp; Filters {activeFilterCount>0&&<span>{activeFilterCount}</span>}</button></div>
        {filterOpen&&<section className="discover-filter-panel"><div className="filter-panel-head"><div><strong>Refine your feed</strong><small>Choose the opportunities that fit your week.</small></div><button onClick={()=>setFilterOpen(false)}>×</button></div><div className="filter-groups"><div><small>WHEN</small><div>{['Any time','This week','Recurring'].map((option)=><button key={option} className={draftTiming===option?'active':''} onClick={()=>setDraftTiming(option)}>{option}</button>)}</div></div><div><small>FORMAT</small><div>{['Any format','In person','Remote'].map((option)=><button key={option} className={draftFormat===option?'active':''} onClick={()=>setDraftFormat(option)}>{option}</button>)}</div></div></div><footer><button onClick={()=>{setDraftTiming('Any time');setDraftFormat('Any format');setFilterTiming('Any time');setFilterFormat('Any format');setFilterOpen(false);notify('Filters cleared')}}>Clear all</button><button onClick={()=>{setFilterTiming(draftTiming);setFilterFormat(draftFormat);setFilterOpen(false);notify('Discovery filters applied')}}>Apply filters →</button></footer></section>}
        <div className="category-row">{categorySets[scope].map((item)=><button key={item} onClick={()=>setCategory(item)} className={category===item?'active':''}>{item}</button>)}</div>
        <div className="section-heading"><div><h2>{scope==='within'?'Made for your week':'Go beyond your campus'}</h2><p>{scope==='within'?'Ideas and people picked around your interests.':'Cross-university projects, co-founders and niche communities.'}</p></div><button onClick={()=>{setCategory('All');setQuery('')}}>See everything ↗</button></div>
        <div className="opportunity-grid">{filtered.map((item)=><article className="opportunity-card" key={item.id}><button className="card-open" aria-label={`Open ${item.title}`} onClick={()=>setSelected(item)}><div className={`card-art ${item.color} ${item.art}`}><span className="art-label">{item.label}</span><span className="art-shape"/></div></button><div className="card-body"><p className="eyebrow">{item.eyebrow}</p><h3>{item.title}</h3><p className="card-copy">{item.copy}</p><div className="tag-row">{item.tags.map((tag)=><span key={tag}>{tag}</span>)}</div><div className="card-footer"><div className="avatar-stack">{item.people.map((person)=><span key={person}>{person}</span>)}</div><div className="card-actions"><button onClick={()=>setSelected(item)} className="interested">Interested</button><button className={saved.includes(item.id)?'saved':''} onClick={()=>toggleSaved(item.id)} aria-label={`Save ${item.title}`}>{saved.includes(item.id)?'♥':'♡'}</button></div></div></div></article>)}{filtered.length===0&&<div className="empty-state"><span>⌕</span><h3>No exact matches yet</h3><p>Try another skill or browse all opportunities.</p><button onClick={()=>{setQuery('');setCategory('All')}}>Clear search</button></div>}</div>
        <section className="people-strip"><div className="people-copy"><span className="spark">✳</span><div><p>PEOPLE TO MEET</p><h2>Different strengths.<br/>Same wavelength.</h2></div></div>{[['AK','Amara Kim','Creative coder · Film lover','peach'],['TM','Théo Martin','Finance · Climate tech','lilac']].map(([initials,name,bio,color])=><div className="person" key={name}><span className={`person-avatar ${color}`}>{initials}</span><div><strong>{name}</strong><small>{bio}</small></div><button className={connected.includes(name)?'connected':''} onClick={()=>{setConnected((c)=>c.includes(name)?c:[...c,name]);notify(`Connection request sent to ${name}`)}}>{connected.includes(name)?'✓ Sent':'Connect'}</button></div>)}</section>
      </section> : mode==='professor' && activeNav==='Overview' ? <ProfessorView teamReady={teamReady} setTeamReady={setTeamReady} hubTab={hubTab} setHubTab={setHubTab} notify={notify} openProject={()=>setModal('project')}/> : <SecondaryView view={activeNav} notify={notify} onNavigate={setActiveNav} conversation={activeConversation} setConversation={setActiveConversation}/>} 
    </div>

    {profileMenu&&<><button className="profile-dismiss" aria-label="Close profile menu" onClick={()=>setProfileMenu(null)}/><section className={`profile-menu ${profileMenu}`} role="menu"><div className="profile-menu-head"><span className="profile-menu-avatar">MP<i>✓</i></span><div><strong>{mode==='discover'?'Maya Patel':'Prof. Maya Patel'}</strong><small>{mode==='discover'?'maya.patel@student.sciencespo.fr':'m.patel@sciencespo.fr'}</small><em>{mode==='discover'?'Verified student':'Verified faculty'}</em></div></div><div className="account-role-note"><span>{mode==='discover'?'◎':'▧'}</span><div><strong>{mode==='discover'?'Student workspace':'Professor workspace'}</strong><small>This account only has access to {mode==='discover'?'student collaboration':'course management'} tools.</small></div></div><nav><button role="menuitem" onClick={()=>{setProfilePanel(true);setProfileMenu(null)}}><span>◎</span><div><strong>{mode==='discover'?'View profile':'View faculty profile'}</strong><small>{mode==='discover'?'Skills, interests and availability':'Department, courses and office hours'}</small></div><b>→</b></button><button role="menuitem" onClick={()=>{setProfilePanel(true);setProfileMenu(null);notify('Profile is ready to edit')}}><span>✎</span><div><strong>Edit profile</strong><small>Update your account information</small></div><b>→</b></button><button role="menuitem" onClick={()=>{setProfileMenu(null);notify(mode==='discover'?'Matching preferences opened':'Course settings opened')}}><span>☷</span><div><strong>{mode==='discover'?'Matching preferences':'Course settings'}</strong><small>{mode==='discover'?'Campus, roles and availability':'Cohorts, deadlines and access'}</small></div><b>→</b></button><button role="menuitem" onClick={()=>{setProfileMenu(null);notify('University verification is active')}}><span>⌂</span><div><strong>University verification</strong><small>Sciences Po · Verified {mode==='discover'?'student':'faculty'}</small></div><b className="verified-dot">✓</b></button></nav><footer><button onClick={()=>{setProfileMenu(null);notify('Help centre opened')}}>Help & support</button><button onClick={signOut}>Sign out</button></footer></section></>}

    {profilePanel&&<div className="modal-backdrop" onMouseDown={()=>setProfilePanel(false)}><section className="profile-panel" onMouseDown={(event)=>event.stopPropagation()}><button className="modal-close" onClick={()=>setProfilePanel(false)}>×</button><div className="profile-panel-cover"><span>MP</span><i>✓ VERIFIED {mode==='discover'?'STUDENT':'FACULTY'}</i></div><div className="profile-panel-copy"><p className="kicker">{mode==='discover'?'STUDENT PROFILE':'FACULTY PROFILE'}</p><h2>{mode==='discover'?'Maya Patel':'Prof. Maya Patel'}</h2><p>{mode==='discover'?'Public policy student connecting design, climate and entrepreneurship.':'Professor of sustainable innovation leading project-based courses and cross-disciplinary teams.'}</p><div className="profile-facts"><span><small>UNIVERSITY</small><strong>Sciences Po</strong></span><span><small>{mode==='discover'?'LOCATION':'DEPARTMENT'}</small><strong>{mode==='discover'?'Paris, France':'School of Management'}</strong></span><span><small>{mode==='discover'?'AVAILABILITY':'ACTIVE COURSES'}</small><strong>{mode==='discover'?'6 hrs / week':'3 courses'}</strong></span></div><div className="profile-skills"><small>{mode==='discover'?'TOP SKILLS & INTERESTS':'TEACHING & RESEARCH'}</small>{(mode==='discover'?['Strategy','User research','Climate tech','Storytelling','Startups']:['Sustainable innovation','Team dynamics','Urban policy','Entrepreneurship']).map((skill)=><span key={skill}>{skill}</span>)}</div><div className="profile-panel-actions"><button onClick={()=>notify(mode==='discover'?'Public profile copied':'Faculty profile copied')}>Copy profile</button><button onClick={()=>notify('Editing enabled — choose a field')}>Edit profile →</button></div></div></section></div>}

    {selected&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}><section className="detail-modal" onMouseDown={(e)=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}>×</button><div className={`detail-art card-art ${selected.color} ${selected.art}`}><span className="art-label">{selected.label}</span><span className="art-shape"/></div><p className="eyebrow">{selected.eyebrow}</p><h2>{selected.title}</h2><p>{selected.copy}</p><div className="tag-row">{selected.tags.map((tag)=><span key={tag}>{tag}</span>)}</div><div className="detail-need"><strong>Who they need</strong><span>Curious collaborators with clear communication and 3–5 hours a week.</span></div><div className="swipe-actions"><button onClick={()=>{setSelected(null);notify('Passed — recommendations updated')}} className="pass">× <span>Pass</span></button><button onClick={()=>{setSelected(null);notify('It’s a match! A new chat is ready.')}} className="like">♥ <span>I’m interested</span></button></div></section></div>}
    {modal==='search'&&<div className="modal-backdrop"><section className="search-modal"><button className="modal-close" onClick={()=>setModal(null)}>×</button><span>⌕</span><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Try ‘React’, ‘football’ or ‘climate’"/><button onClick={()=>setModal(null)}>Search</button><div className="quick-search"><small>POPULAR NOW</small>{['Co-founder','Design','Competition','IKEA'].map((item)=><button key={item} onClick={()=>{setQuery(item);setCategory('All');setModal(null)}}>{item}</button>)}</div></section></div>}
    {(modal==='post'||modal==='project')&&<div className="modal-backdrop"><form className="form-modal" onSubmit={(event)=>submitAndClose(event,modal==='post'?'Opportunity published to your university':'Project created — add students when ready')}><button type="button" className="modal-close" onClick={()=>setModal(null)}>×</button><p className="kicker">{modal==='post'?'SHARE AN IDEA':'PROFESSOR MODE'}</p><h2>{modal==='post'?'Post an opportunity':'Create a group project'}</h2><label>Title<input required placeholder={modal==='post'?'e.g. Sunday IKEA trip':'e.g. Sustainable Cities Challenge'}/></label><div className="form-grid"><label>{modal==='post'?'Category':'Team size'}<select>{modal==='post'?<><option>Social</option><option>Startup</option><option>Sports</option><option>Project</option></>:<><option>4 students</option><option>5 students</option><option>6 students</option></>}</select></label><label>{modal==='post'?'Location':'Deadline'}<input type={modal==='post'?'text':'date'} placeholder="Paris"/></label></div><label>Description<textarea required placeholder="What are you hoping to do, and who would be a great fit?"/></label><label>{modal==='post'?'Skills or roles needed':'Requirements'}<input placeholder="Research, React, design, storytelling…"/></label><button className="submit-button" type="submit">{modal==='post'?'Publish opportunity':'Create project'} →</button></form></div>}
    {toast&&<div className="toast"><span>✓</span>{toast}</div>}
  </main>;
}

function ProfessorView({teamReady,setTeamReady,hubTab,setHubTab,notify,openProject}:{teamReady:boolean;setTeamReady:(v:boolean)=>void;hubTab:string;setHubTab:(v:string)=>void;notify:(m:string)=>void;openProject:()=>void}) {
  const students=[['EL','Elena Li','Data analysis · Research'],['OM','Omar Mansour','Strategy · Presenting'],['JR','Jules Roche','UX research · Design'],['SN','Sofia Novak','Finance · Operations']];
  return <section className="content professor-content"><div className="professor-hero"><div><p className="kicker">PROFESSOR WORKSPACE</p><h1>Great projects need<br/><em>the right chemistry.</em></h1><p>Set the brief. CREW analyzes the cohort and builds complementary teams.</p></div><button onClick={openProject}>+ &nbsp; Create project</button></div><div className="metric-grid"><article><span className="metric-icon purple">▧</span><div><small>ACTIVE PROJECTS</small><strong>03</strong><p>1 matching now</p></div></article><article><span className="metric-icon coral">◎</span><div><small>STUDENTS</small><strong>84</strong><p>92% profiles complete</p></div></article><article><span className="metric-icon green">✳</span><div><small>TEAM SATISFACTION</small><strong>94%</strong><p>↑ 8% this semester</p></div></article></div><div className="professor-grid"><section className="project-panel"><div className="panel-top"><div><p className="eyebrow">IN PROGRESS · ECON 204</p><h2>Sustainable Cities Challenge</h2><p>Build an evidence-backed intervention for a real urban sustainability problem.</p></div><button onClick={()=>notify('Project settings opened')}>···</button></div><div className="project-meta"><span><small>STUDENTS</small><strong>32 enrolled</strong></span><span><small>TEAM SIZE</small><strong>4 students</strong></span><span><small>DUE DATE</small><strong>Oct 16</strong></span></div><div className="requirements"><small>MATCHING SIGNALS</small>{['Skills & expertise','Interests & goals','Availability','Work style','Complementary strengths'].map((item)=><span key={item}>✓ {item}</span>)}</div>{!teamReady?<button className="ai-button" onClick={()=>{setTeamReady(true);notify('8 balanced teams created in 2.4 seconds')}}><span>✳</span><span><strong>Create optimal teams</strong><small>AI will analyze 32 student profiles</small></span><b>→</b></button>:<div className="match-complete"><span>✓</span><div><strong>8 optimal teams created</strong><small>Balanced across skills, interests, availability and work style.</small></div><button onClick={()=>notify('Team assignments shared with students')}>Share teams</button></div>}</section><aside className="cohort-panel"><div className="panel-top"><div><p className="eyebrow">COHORT SNAPSHOT</p><h2>Student strengths</h2></div><button onClick={()=>notify('All 32 students opened')}>View all</button></div>{students.map(([initials,name,skills],i)=><div className="student-row" key={name}><span className={`student-avatar tone-${i}`}>{initials}</span><div><strong>{name}</strong><small>{skills}</small></div><span className="availability">{i===1?'Evenings':'Flexible'}</span></div>)}</aside></div><section className="hub"><div className="hub-heading"><div><p className="eyebrow">TEAM COLLABORATION HUB</p><h2>Everything teams need, in one place.</h2></div><div className="live-pill"><i/> 8 teams active</div></div><div className="hub-tabs">{[['Chat','◇'],['Tasks','☑'],['Meetings','◷'],['Files','▤'],['Progress','↗']].map(([tab,icon])=><button key={tab} onClick={()=>setHubTab(tab)} className={hubTab===tab?'active':''}><span>{icon}</span>{tab}</button>)}</div><div className="hub-preview"><div className="hub-avatars"><span>EL</span><span>OM</span><span>JR</span><span>SN</span></div><div><strong>Team 04 · Urban Heat</strong><small>{hubTab==='Chat'?'Omar: I added the interview notes to our board.':hubTab==='Tasks'?'7 of 11 tasks complete':hubTab==='Meetings'?'Next meeting: Tuesday at 17:30':hubTab==='Files'?'12 shared files · 2 updated today':'Milestone 2 is 78% complete'}</small></div><button onClick={()=>notify(`${hubTab} workspace opened`)}>Open {hubTab.toLowerCase()} →</button></div></section></section>;
}

function SecondaryView({view,notify,onNavigate,conversation,setConversation}:{view:string;notify:(message:string)=>void;onNavigate:(view:string)=>void;conversation:string;setConversation:(name:string)=>void}) {
  const [manageOpen,setManageOpen] = useState(false);
  const [message,setMessage] = useState('');
  const [sentMessages,setSentMessages] = useState<Record<string,string[]>>({});
  const [studentQuery,setStudentQuery] = useState('');
  const [selectedMatch,setSelectedMatch] = useState<{score:string;initials:string;name:string;bio:string;reason:string;shared:string;university:string;availability:string;skills:string[]}|null>(null);
  const [workspaceTeam,setWorkspaceTeam] = useState<{name:string;project:string;progress:string;next:string;members:string[]}|null>(null);
  const [workspaceTab,setWorkspaceTab] = useState('Overview');
  const [projectFilter,setProjectFilter] = useState<'Active'|'Drafts'|'Completed'>('Active');
  const [projectItems,setProjectItems] = useState([
    {code:'ECON 204',name:'Sustainable Cities Challenge',students:'32 students',teams:'8 teams',due:'Oct 16',status:'Matching complete',color:'green',phase:'Active'},
    {code:'MKTG 310',name:'Brand Strategy Sprint',students:'28 students',teams:'7 teams',due:'Nov 02',status:'Collecting profiles',color:'purple',phase:'Active'},
    {code:'INNO 101',name:'One-week Venture Lab',students:'45 students',teams:'9 teams',due:'Sep 18',status:'Draft',color:'grey',phase:'Drafts'},
    {code:'POLI 220',name:'Public Space Futures',students:'24 students',teams:'6 teams',due:'May 12',status:'Completed',color:'green',phase:'Completed'},
    {code:'DATA 115',name:'Mobility Data Lab',students:'36 students',teams:'9 teams',due:'Apr 28',status:'Completed',color:'green',phase:'Completed'},
  ]);
  const [selectedProject,setSelectedProject] = useState<(typeof projectItems)[number]|null>(null);
  const [createProjectOpen,setCreateProjectOpen] = useState(false);
  const [studentFilterOpen,setStudentFilterOpen] = useState<'skills'|'availability'|null>(null);
  const [studentSkill,setStudentSkill] = useState('All skills');
  const [studentAvailability,setStudentAvailability] = useState('Any availability');
  const [addedStudents,setAddedStudents] = useState<string[]>([]);
  const [selectedAllocation,setSelectedAllocation] = useState<{number:string;name:string;score:string;members:string[];skills:string[]}|null>(null);
  const matches = [
    {score:'94%',initials:'AK',name:'Amara Kim',bio:'Creative coder · Film lover',reason:'You both care about climate, design and building in public.',shared:'3 shared interests',university:'Sciences Po',availability:'Weekends · 5 hrs/week',skills:['Creative coding','Storytelling','Climate','Film']},
    {score:'91%',initials:'TM',name:'Théo Martin',bio:'Finance · Climate tech',reason:'Your strategy skills complement Théo’s financial modeling.',shared:'2 shared projects',university:'HEC Paris',availability:'Tue & Thu evenings',skills:['Finance','Modeling','Climate tech','Strategy']},
    {score:'89%',initials:'EC',name:'Eva Chen',bio:'Engineering · PropTech',reason:'You are both exploring student housing and early-stage startups.',shared:'4 mutual connections',university:'Imperial College London',availability:'Remote · 4 hrs/week',skills:['Engineering','PropTech','React','Startups']},
  ];
  const teams = [
    {name:'Urban Heat',project:'Sustainable Cities Challenge',progress:'78',next:'Next meeting · Tue 17:30',members:['EL','OM','JR','MP']},
    {name:'Scroll Less',project:'Anti-doomscroll app',progress:'42',next:'Design critique · Fri 12:00',members:['AK','NO','MP']},
    {name:'Night Screen',project:'Open-air cinema collective',progress:'91',next:'Event night · Sep 4',members:['LE','FC','MP','+5']},
  ];
  const allStudents = [
    ['EL','Elena Li','Data analysis, qualitative research','Flexible','98%'],
    ['OM','Omar Mansour','Strategy, public speaking','Evenings','96%'],
    ['JR','Jules Roche','UX research, visual design','Mornings','94%'],
    ['SN','Sofia Novak','Finance, operations','Flexible','92%'],
    ['AK','Amara Kim','Creative coding, storytelling','Weekends','90%'],
  ];
  const students = allStudents.filter((row)=>`${row[1]} ${row[2]}`.toLowerCase().includes(studentQuery.toLowerCase())&&(studentSkill==='All skills'||row[2].toLowerCase().includes(studentSkill.toLowerCase()))&&(studentAvailability==='Any availability'||row[3]===studentAvailability));
  const allocationTeams = [
    {number:'01',name:'Circular Food',score:'96',members:['EL','AK','NP','LV'],skills:['Research','Data','Design','Pitching']},
    {number:'02',name:'Cool Streets',score:'94',members:['OM','SN','JR','MD'],skills:['Finance','Strategy','UX','Operations']},
    {number:'03',name:'Green Commute',score:'93',members:['TM','EY','RB','FC'],skills:['Policy','Tech','Story','Research']},
    {number:'04',name:'Urban Heat',score:'92',members:['LE','NO','SA','MP'],skills:['Data','Coding','Design','Strategy']},
  ];
  const conversationHistory:Record<string,Array<{side:'mine'|'theirs';text:string}>> = {
    'Amara Kim':[
      {side:'theirs',text:'Hey Maya! Your climate data project looks really interesting.'},
      {side:'mine',text:'Thank you! I think your design background would be a great fit.'},
      {side:'theirs',text:'Can we meet after class to sketch the first ideas?'},
    ],
    'IKEA run + meatballs':[
      {side:'theirs',text:'I can drive from campus if everyone is okay leaving at 10:30.'},
      {side:'mine',text:'Perfect. I can book the larger Zipcar and split the cost.'},
      {side:'theirs',text:'Great — I’ll make a shared shopping list.'},
    ],
    'Team 04 · Urban Heat':[
      {side:'theirs',text:'Jules added the interview notes to the shared folder.'},
      {side:'mine',text:'I’ll turn the strongest quotes into themes tonight.'},
      {side:'theirs',text:'Nice. Our next milestone is the opportunity map.'},
    ],
    'Théo Martin':[
      {side:'mine',text:'Would Tuesday at 17:00 work for a quick coffee?'},
      {side:'theirs',text:'That works for me! Let’s meet by the library entrance.'},
    ],
    'Eva Chen':[
      {side:'theirs',text:'Hi Maya — I saw we are both exploring better student housing.'},
      {side:'mine',text:'Yes! I would love to compare what we have learned so far.'},
    ],
  };
  const conversationRows = [['Amara Kim','Can we meet after class?','2m','AK'],['IKEA run + meatballs','I can drive from campus.','1h','IK'],['Team 04 · Urban Heat','Jules added a file.','3h','T4'],['Théo Martin','That works for me!','Tue','TM'],['Eva Chen','Let’s compare our research.','New','EC']];
  if (!conversationRows.some(([name])=>name===conversation)) conversationRows.unshift([conversation,'Start a new conversation','Now',conversation.slice(0,2).toUpperCase()]);
  function downloadText(filename:string,content:string) {
    const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a'); link.href=url; link.download=filename; link.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),500);
  }
  function exportStudents() {
    downloadText('crew-student-cohort.csv',['Name,Strengths,Availability,Profile',...students.map(([,name,skills,availability,profile])=>`"${name}","${skills}","${availability}","${profile}"`)].join('\n'));
    notify(`${students.length} students exported`);
  }
  function exportTeams() {
    downloadText('crew-ai-teams.csv',['Team,Fit,Members,Complementary strengths',...allocationTeams.map((team)=>`"${team.number} · ${team.name}","${team.score}%","${team.members.join(', ')}","${team.skills.join(', ')}"`)].join('\n'));
    notify('AI team report exported');
  }

  const titleMap:Record<string,[string,string]> = {
    Matches:['Your matches','The people and opportunities where interest goes both ways.'],
    Messages:['Messages','Turn a good match into a plan.'],
    'My teams':['My teams','Everything you are building, all in one place.'],
    Projects:['Projects','Create briefs, invite cohorts, and track every team.'],
    Students:['Student cohort','Understand the strengths available across your class.'],
    Teams:['AI-created teams','Balanced groups ready to collaborate.'],
  };
  const [title,subtitle] = titleMap[view] ?? [view,'Your CREW workspace.'];

  return <section className="content secondary-content">
    <div className="secondary-header"><div><p className="kicker">{view==='Matches'?'3 NEW THIS WEEK':'CREW WORKSPACE'}</p><h1>{title}</h1><p>{subtitle}</p></div><button className={manageOpen?'active':''} aria-expanded={view==='Students'?undefined:manageOpen} onClick={()=>view==='Students'?exportStudents():setManageOpen((open)=>!open)}>{view==='Students'?'Export list':manageOpen?'Done':'Manage'} {view==='Students'?'↓':manageOpen?'✓':'↗'}</button></div>
    {manageOpen&&<ManagementPanel view={view} close={()=>setManageOpen(false)} notify={notify}/>} 

    {view==='Matches' && <div className="match-page-grid">{matches.map((match,i)=><article className="match-card" key={match.name}><div className={`match-portrait portrait-${i}`}><span>{match.initials}</span><b>{match.score}<small> match</small></b></div><div className="match-card-body"><p className="eyebrow">{match.shared}</p><h2>{match.name}</h2><small>{match.bio}</small><p>{match.reason}</p><div><button onClick={()=>{setConversation(match.name);setMessage('');onNavigate('Messages');notify(`Chat with ${match.name} opened`)}}>Message</button><button onClick={()=>setSelectedMatch(match)}>View profile ↗</button></div></div></article>)}</div>}

    {view==='Messages' && <div className="message-workspace"><aside className="inbox"><div className="inbox-search">⌕ <input placeholder="Search conversations"/></div>{conversationRows.map(([name,preview,time,initials],i)=><button key={name} className={conversation===name?'active':''} onClick={()=>{setConversation(name);setMessage('')}}><span className={`inbox-avatar tone-${i%4}`}>{initials}</span><span><strong>{name}</strong><small>{sentMessages[name]?.at(-1)??preview}</small></span><time>{time}</time></button>)}</aside><section className="conversation"><header><span className="student-avatar tone-0">{conversation.slice(0,2).toUpperCase()}</span><div><strong>{conversation}</strong><small><i/> Online now</small></div><button onClick={()=>notify(`Meeting with ${conversation} scheduled for tomorrow at 17:00`)}>Schedule ◷</button></header><div className="chat-body"><div className="day-label">TODAY</div>{(conversationHistory[conversation]??[]).map((item,i)=><div className={`bubble ${item.side}`} key={`${conversation}-history-${i}`}>{item.text}</div>)}{(sentMessages[conversation]??[]).map((text,i)=><div className="bubble mine" key={`${conversation}-${text}-${i}`}>{text}</div>)}</div><form className="message-box" onSubmit={(event)=>{event.preventDefault();const text=message.trim();if(text){setSentMessages((current)=>({...current,[conversation]:[...(current[conversation]??[]),text]}));setMessage('');notify(`Message sent to ${conversation}`)}}}><button type="button" onClick={()=>notify(`Attachment picker opened for ${conversation}`)}>+</button><input value={message} onChange={(event)=>setMessage(event.target.value)} placeholder={`Message ${conversation}…`}/><button type="submit">↑</button></form></section></div>}

    {view==='My teams' && <div className="team-page-grid">{teams.map((team,i)=><article className="team-page-card" key={team.name}><div className={`team-cover cover-${i}`}><span>{team.name.slice(0,1)}</span><div className="hub-avatars">{team.members.map((member)=><span key={member}>{member}</span>)}</div></div><div className="team-card-copy"><p className="eyebrow">{team.project}</p><h2>{team.name}</h2><p>{team.next}</p><div className="progress-row"><span><i style={{width:`${team.progress}%`}}/></span><b>{team.progress}%</b></div><button onClick={()=>{setWorkspaceTeam(team);setWorkspaceTab('Overview')}}>Open workspace →</button></div></article>)}</div>}

    {view==='Projects' && <div className="project-list-page"><div className="list-toolbar"><div>{(['Active','Drafts','Completed'] as const).map((filter)=><button key={filter} className={projectFilter===filter?'active':''} onClick={()=>setProjectFilter(filter)}>{filter} <span>{projectItems.filter((project)=>project.phase===filter).length}</span></button>)}</div><button onClick={()=>setCreateProjectOpen(true)}>+ Create project</button></div>{projectItems.filter((project)=>project.phase===projectFilter).map((project)=><article className="project-list-row" key={project.name}><span className={`project-glyph ${project.color}`}>▧</span><div><small>{project.code}</small><strong>{project.name}</strong></div><span><small>COHORT</small><b>{project.students}</b></span><span><small>TEAMS</small><b>{project.teams}</b></span><span><small>DUE</small><b>{project.due}</b></span><em className={project.color}>{project.status}</em><button aria-label={`Open ${project.name}`} onClick={()=>setSelectedProject(project)}>→</button></article>)}</div>}

    {view==='Students' && <div className="student-page"><div className="student-toolbar"><label>⌕ <input value={studentQuery} onChange={(event)=>setStudentQuery(event.target.value)} placeholder="Search by name or skill…"/></label><div className="student-filter-actions"><button className={studentSkill!=='All skills'?'active':''} onClick={()=>setStudentFilterOpen(studentFilterOpen==='skills'?null:'skills')}>{studentSkill==='All skills'?'Skills':studentSkill} ⌄</button><button className={studentAvailability!=='Any availability'?'active':''} onClick={()=>setStudentFilterOpen(studentFilterOpen==='availability'?null:'availability')}>{studentAvailability==='Any availability'?'Availability':studentAvailability} ⌄</button></div>{studentFilterOpen&&<div className="student-filter-popover">{(studentFilterOpen==='skills'?['All skills','Data','Strategy','UX','Finance','Creative coding']:['Any availability','Flexible','Evenings','Mornings','Weekends']).map((option)=><button key={option} className={(studentFilterOpen==='skills'?studentSkill:studentAvailability)===option?'active':''} onClick={()=>{studentFilterOpen==='skills'?setStudentSkill(option):setStudentAvailability(option);setStudentFilterOpen(null)}}>{option}</button>)}</div>}</div><div className="student-table"><div className="student-table-head"><span>STUDENT</span><span>TOP STRENGTHS</span><span>AVAILABILITY</span><span>PROFILE</span><span/></div>{students.map(([initials,name,skills,availability,profile],i)=><div className="student-table-row" key={name}><span><i className={`student-avatar tone-${i%4}`}>{initials}</i><strong>{name}</strong></span><span>{skills}</span><span><em>{availability}</em></span><span><b>{profile}</b><i className="profile-meter"><u style={{width:profile}}/></i></span><button className={addedStudents.includes(name)?'added':''} onClick={()=>{setAddedStudents((current)=>current.includes(name)?current.filter((student)=>student!==name):[...current,name]);notify(addedStudents.includes(name)?`${name} removed from the project`:`${name} added to the project`)}}>{addedStudents.includes(name)?'✓ Added':'+ Add'}</button></div>)}{students.length===0&&<div className="student-empty"><strong>No students match these filters</strong><button onClick={()=>{setStudentQuery('');setStudentSkill('All skills');setStudentAvailability('Any availability')}}>Clear filters</button></div>}</div></div>}

    {view==='Teams' && <div className="allocation-page"><div className="allocation-banner"><span>✳</span><div><strong>All 8 teams are well balanced</strong><p>CREW considered skills, interests, availability, preferences and complementary strengths.</p></div><button onClick={exportTeams}>Export report</button></div><div className="allocation-grid">{allocationTeams.map((team)=><article className="allocation-card" key={team.name}><header><span>TEAM {team.number}</span><b>{team.score}% fit</b></header><h2>{team.name}</h2><div className="allocation-members">{team.members.map((member,i)=><span className={`tone-${i}`} key={member}>{member}</span>)}</div><div className="allocation-skills">{team.skills.map((skill)=><span key={skill}>✓ {skill}</span>)}</div><button onClick={()=>setSelectedAllocation(team)}>View team →</button></article>)}</div></div>}

    {createProjectOpen&&<div className="modal-backdrop" onMouseDown={()=>setCreateProjectOpen(false)}><form className="form-modal" onMouseDown={(event)=>event.stopPropagation()} onSubmit={(event)=>{event.preventDefault();const data=new FormData(event.currentTarget);const name=String(data.get('name'));const code=String(data.get('code'));const due=String(data.get('due'));setProjectItems((current)=>[{code,name,students:'0 students',teams:'Not formed',due,status:'Ready for students',color:'purple',phase:'Active'},...current]);setProjectFilter('Active');setCreateProjectOpen(false);notify(`${name} created`);}}><button type="button" className="modal-close" onClick={()=>setCreateProjectOpen(false)}>×</button><p className="kicker">PROFESSOR MODE</p><h2>Create a project</h2><label>Project title<input name="name" required placeholder="e.g. Circular Economy Sprint"/></label><div className="form-grid"><label>Course code<input name="code" required placeholder="e.g. ECON 305"/></label><label>Deadline<input name="due" type="date" required/></label></div><label>Project requirements<textarea required placeholder="Describe the brief, expected outcomes and the strengths each team needs."/></label><div className="form-grid"><label>Team size<select><option>4 students</option><option>5 students</option><option>6 students</option></select></label><label>Matching priority<select><option>Complementary skills</option><option>Availability</option><option>Shared interests</option></select></label></div><button className="submit-button" type="submit">Create project →</button></form></div>}

    {selectedProject&&<div className="modal-backdrop" onMouseDown={()=>setSelectedProject(null)}><section className="project-detail-panel" onMouseDown={(event)=>event.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedProject(null)}>×</button><p className="kicker">{selectedProject.code} · {selectedProject.phase.toUpperCase()}</p><h2>{selectedProject.name}</h2><p>Project setup, cohort and team formation are ready to manage from one place.</p><div className="project-detail-stats"><span><small>COHORT</small><strong>{selectedProject.students}</strong></span><span><small>TEAMS</small><strong>{selectedProject.teams}</strong></span><span><small>DUE</small><strong>{selectedProject.due}</strong></span></div><div className="project-detail-status"><span>✳</span><div><strong>{selectedProject.status}</strong><small>Matching uses skills, interests, availability and complementary strengths.</small></div></div><div className="profile-panel-actions"><button onClick={()=>{setSelectedProject(null);onNavigate('Students')}}>Manage students</button><button onClick={()=>{setSelectedProject(null);onNavigate('Teams')}}>View teams →</button></div></section></div>}

    {selectedAllocation&&<div className="modal-backdrop" onMouseDown={()=>setSelectedAllocation(null)}><section className="allocation-detail-panel" onMouseDown={(event)=>event.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedAllocation(null)}>×</button><p className="kicker">TEAM {selectedAllocation.number} · AI MATCH RATIONALE</p><div className="allocation-detail-head"><div><h2>{selectedAllocation.name}</h2><p>Balanced for execution, communication and complementary problem-solving.</p></div><b>{selectedAllocation.score}%<small> team fit</small></b></div><div className="allocation-detail-members">{selectedAllocation.members.map((member,i)=><article key={member}><span className={`tone-${i}`}>{member}</span><div><strong>{['Research lead','Strategy lead','Design lead','Delivery lead'][i]}</strong><small>{selectedAllocation.skills[i]} · Flexible availability</small></div></article>)}</div><div className="profile-skills"><small>COMPLEMENTARY STRENGTHS</small>{selectedAllocation.skills.map((skill)=><span key={skill}>✓ {skill}</span>)}</div><div className="profile-panel-actions"><button onClick={()=>notify(`Team ${selectedAllocation.number} rationale copied`)}>Copy rationale</button><button onClick={()=>{notify(`Team ${selectedAllocation.number} shared with students`);setSelectedAllocation(null)}}>Share assignment →</button></div></section></div>}

    {selectedMatch&&<div className="modal-backdrop" onMouseDown={()=>setSelectedMatch(null)}><section className="profile-panel match-profile-panel" onMouseDown={(event)=>event.stopPropagation()}><button className="modal-close" onClick={()=>setSelectedMatch(null)}>×</button><div className="profile-panel-cover"><span>{selectedMatch.initials}</span><i>{selectedMatch.score} MATCH</i></div><div className="profile-panel-copy"><p className="kicker">MATCH PROFILE</p><h2>{selectedMatch.name}</h2><p>{selectedMatch.bio}. {selectedMatch.reason}</p><div className="profile-facts"><span><small>UNIVERSITY</small><strong>{selectedMatch.university}</strong></span><span><small>AVAILABILITY</small><strong>{selectedMatch.availability}</strong></span><span><small>CONNECTION</small><strong>{selectedMatch.shared}</strong></span></div><div className="profile-skills"><small>SKILLS & INTERESTS</small>{selectedMatch.skills.map((skill)=><span key={skill}>{skill}</span>)}</div><div className="profile-panel-actions"><button onClick={()=>{notify(`${selectedMatch.name}’s profile saved`);setSelectedMatch(null)}}>Save profile</button><button onClick={()=>{setConversation(selectedMatch.name);setMessage('');setSelectedMatch(null);onNavigate('Messages')}}>Message {selectedMatch.name.split(' ')[0]} →</button></div></div></section></div>}

    {workspaceTeam&&<div className="modal-backdrop" onMouseDown={()=>setWorkspaceTeam(null)}><section className="team-workspace-panel" onMouseDown={(event)=>event.stopPropagation()}><button className="modal-close" onClick={()=>setWorkspaceTeam(null)}>×</button><header><p className="kicker">TEAM WORKSPACE</p><h2>{workspaceTeam.name}</h2><p>{workspaceTeam.project}</p><div className="workspace-members">{workspaceTeam.members.map((member,i)=><span className={`tone-${i%4}`} key={member}>{member}</span>)}</div></header><nav>{['Overview','Tasks','Meetings','Files'].map((tab)=><button key={tab} className={workspaceTab===tab?'active':''} onClick={()=>setWorkspaceTab(tab)}>{tab}</button>)}</nav><div className="workspace-body">{workspaceTab==='Overview'&&<><div className="workspace-progress"><span><small>PROJECT PROGRESS</small><strong>{workspaceTeam.progress}%</strong></span><i><u style={{width:`${workspaceTeam.progress}%`}}/></i></div><article><strong>Next up</strong><p>{workspaceTeam.next}</p><button onClick={()=>{setConversation(`Team · ${workspaceTeam.name}`);setWorkspaceTeam(null);onNavigate('Messages')}}>Open team chat →</button></article></>}{workspaceTab==='Tasks'&&<div className="workspace-list">{['Finish research synthesis','Review prototype','Prepare next milestone'].map((task,i)=><label key={task}><input type="checkbox" defaultChecked={i===0}/><span><strong>{task}</strong><small>{i===0?'Completed by Maya':i===1?'Due tomorrow':'Due Friday'}</small></span></label>)}</div>}{workspaceTab==='Meetings'&&<div className="workspace-list"><article><strong>{workspaceTeam.next}</strong><small>Team room · 45 minutes</small><button onClick={()=>notify(`${workspaceTeam.name} meeting added to your calendar`)}>Add to calendar</button></article></div>}{workspaceTab==='Files'&&<div className="workspace-list">{['Research notes.pdf','Project board.fig','Milestone brief.docx'].map((file)=><article key={file}><strong>{file}</strong><small>Updated this week</small><button onClick={()=>notify(`${file} opened`)}>Open</button></article>)}</div>}</div></section></div>}
  </section>;
}

function ManagementPanel({view,close,notify}:{view:string;close:()=>void;notify:(message:string)=>void}) {
  const settings:Record<string,Array<[string,string,boolean]>> = {
    Matches:[
      ['Cross-university discovery','Include compatible students from other universities.',true],
      ['New match alerts','Notify me when someone also shows interest.',true],
      ['Profile visibility','Let verified students discover my profile.',true],
    ],
    Messages:[
      ['Message notifications','Show an alert when a new message arrives.',true],
      ['Read receipts','Let people know when I have read a message.',true],
      ['Weekly digest','Email a summary of conversations every Monday.',false],
    ],
    'My teams':[
      ['Team notifications','Alert me about tasks, files and mentions.',true],
      ['Calendar sync','Add team meetings to my student calendar.',false],
      ['Archive completed teams','Move finished projects out of the active list.',true],
    ],
    Projects:[
      ['Deadline reminders','Remind students seven days before each deadline.',true],
      ['Allow profile updates','Use students’ latest skills when rematching.',true],
      ['Weekly professor report','Send a concise project progress summary.',false],
    ],
    Teams:[
      ['Allow team swaps','Let students request one reviewed team change.',false],
      ['Flag availability conflicts','Surface scheduling risks automatically.',true],
      ['Share matching rationale','Show students why their strengths complement.',true],
    ],
  };
  const initial = Object.fromEntries((settings[view]??[]).map(([name,,enabled])=>[name,enabled]));
  const [options,setOptions] = useState<Record<string,boolean>>(initial);
  const rows = settings[view]??[];

  return <section className="management-panel" aria-label={`${view} management settings`}><div className="management-title"><div><span>☷</span><div><strong>Manage {view.toLowerCase()}</strong><small>Changes apply to your CREW account.</small></div></div><button onClick={close} aria-label="Close management settings">×</button></div><div className="management-settings">{rows.map(([name,description])=><div className="management-row" key={name}><div><strong>{name}</strong><small>{description}</small></div><button className={`switch ${options[name]?'on':''}`} role="switch" aria-checked={options[name]} onClick={()=>setOptions((current)=>({...current,[name]:!current[name]}))}><i/></button></div>)}</div>{view==='Matches'&&<label className="management-select"><span><strong>Preferred discovery radius</strong><small>Prioritize opportunities close to you.</small></span><select defaultValue="Paris + 25 km"><option>My university only</option><option>Paris + 25 km</option><option>France</option><option>Anywhere</option></select></label>}<footer><button onClick={close}>Cancel</button><button onClick={()=>{notify(`${view} preferences saved`);close()}}>Save changes</button></footer></section>;
}
