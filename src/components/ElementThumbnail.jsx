// Colour palette helpers
const C = {
  indigo: '#6366f1', indigoDark: '#4338ca', indigoLight: '#e0e7ff',
  purple: '#8b5cf6', pink: '#ec4899', rose: '#f43f5e',
  blue: '#3b82f6', sky: '#0ea5e9', cyan: '#06b6d4',
  green: '#16a34a', teal: '#14b8a6',
  amber: '#f59e0b', orange: '#f97316', red: '#dc2626',
  slate: '#334155', gray: '#6b7280', light: '#f1f5f9',
  dark: '#111827', darkBlue: '#1e1b4b', navy: '#1e293b',
  white: '#ffffff', offWhite: '#f9fafb', cream: '#fefce8',
};

// Unsplash photo tiles (tiny, cheap to render as bg-image in CSS)
const PHOTOS = {
  sofa:    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=160&fit=crop&auto=format&q=40',
  table:   'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=160&fit=crop&auto=format&q=40',
  desk:    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&h=160&fit=crop&auto=format&q=40',
  shelf:   'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=160&fit=crop&auto=format&q=40',
  chair:   'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=160&fit=crop&auto=format&q=40',
};

// ─── Reusable mini primitives ───────────────────────────────────────────────
const Bar  = ({ w='100%', h=5, bg='#9ca3af', br=2, ...rest }) => <div style={{ width: w, height: h, background: bg, borderRadius: br, ...rest }} />;
const Pill = ({ w=60, h=22, bg=C.indigo, children }) => <div style={{ width: w, height: h, background: bg, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>;
const Btn  = ({ w=60, h=20, bg=C.indigo, br=5, label=true }) => <div style={{ width: w, height: h, background: bg, borderRadius: br, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label && <Bar w='60%' h={5} bg='rgba(255,255,255,0.9)' />}</div>;
const Photo = ({ url, w='100%', h=44, br=4 }) => <div style={{ width: w, height: h, borderRadius: br, backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />;
const TextLines = ({ title='#111827', lines=2 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Bar w='70%' h={7} bg={title} />
    {Array.from({ length: lines }).map((_, i) => <Bar key={i} w={i === lines - 1 ? '60%' : '100%'} h={4} bg='#9ca3af' />)}
  </div>
);

// ─── Per-thumbnail renderers (bg + inner JSX) ───────────────────────────────
const THUMBS = {
  // HEADER
  'header-1': [C.white, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={54} h={11} bg={C.indigo} br={3} />
      <Bar w={80} h={1} bg='#e5e7eb' />
    </div>
  )],
  'header-2': [C.darkBlue, () => (
    <div style={{ display:'flex', alignItems:'center', width:'85%', justifyContent:'space-between' }}>
      <Bar w={36} h={9} bg='#c7d2fe' br={3} />
      <div style={{ display:'flex', gap:5 }}>{[0,1,2].map(i=><Bar key={i} w={18} h={5} bg='#a5b4fc' />)}</div>
    </div>
  )],
  'header-3': [C.indigo, () => (
    <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={70} h={10} bg='rgba(255,255,255,0.9)' br={3} />
      <Bar w={40} h={5} bg='rgba(255,255,255,0.55)' />
    </div>
  )],
  'header-4': [C.offWhite, () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:3 }}>
      <Bar w={60} h={9} bg={C.indigo} br={2} />
      <Bar w='100%' h={2} bg={C.indigo} />
    </div>
  )],
  'header-5': [C.dark, () => (
    <div style={{ display:'flex', alignItems:'center', width:'85%', justifyContent:'space-between' }}>
      <Bar w={40} h={10} bg='#fff' br={3} />
      <Bar w={48} h={5} bg='#4b5563' />
    </div>
  )],
  'header-6': [C.white, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={50} h={10} bg={C.indigo} br={3} />
      <Bar w={60} h={5} bg='#d1d5db' />
    </div>
  )],
  'header-7': ['linear-gradient(135deg,#6366f1,#8b5cf6)', () => (
    <div style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={70} h={11} bg='rgba(255,255,255,0.9)' br={3} />
      <Bar w={46} h={6} bg='rgba(255,255,255,0.55)' />
    </div>
  )],
  'header-8': ['#fef3c7', () => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'90%' }}>
      <Bar w='60%' h={6} bg='#92400e' />
      <Bar w={36} h={5} bg={C.amber} br={3} />
    </div>
  )],

  // HERO
  'hero-1': [C.light, () => <Photo url={PHOTOS.sofa} h={78} />],
  'hero-2': [C.navy, () => (
    <div style={{ position:'relative', width:'100%', height:78 }}>
      <Photo url={PHOTOS.sofa} h={78} br={0} />
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
        <Bar w='55%' h={8} bg='rgba(255,255,255,0.9)' />
        <Bar w='38%' h={5} bg='rgba(255,255,255,0.6)' />
      </div>
    </div>
  )],
  'hero-3': ['#f5f3ff', () => (
    <div style={{ display:'flex', gap:6, width:'88%', alignItems:'center' }}>
      <TextLines />
      <Photo url={PHOTOS.table} w={54} h={60} br={6} />
    </div>
  )],
  'hero-4': ['#fafaf9', () => (
    <div style={{ display:'flex', gap:6, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.desk} w={54} h={60} br={6} />
      <TextLines />
    </div>
  )],
  'hero-5': [C.dark, () => (
    <div style={{ position:'relative', width:'100%', height:78 }}>
      <Photo url={PHOTOS.sofa} h={78} br={0} />
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,50,50,0.85)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontSize:12 }}>▶</span>
        </div>
      </div>
    </div>
  )],
  'hero-6': ['#f0f9ff', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:'85%' }}>
      <Bar w='65%' h={10} bg='#0c4a6e' br={3} />
      <Bar w='85%' h={5} bg='#7dd3fc' />
      <Btn w={52} h={18} bg={C.sky} />
    </div>
  )],

  // CONTENT
  'content-1': [C.white, () => <TextLines lines={3} />],
  'content-2': [C.offWhite, () => (
    <div style={{ display:'flex', width:'85%', gap:8 }}>
      {[0,1].map(i=><div key={i} style={{ flex:1 }}><TextLines lines={2} /></div>)}
    </div>
  )],
  'content-3': ['#eff6ff', () => (
    <div style={{ width:'85%', display:'flex', gap:5, alignItems:'center' }}>
      <Bar w={3} h={44} bg={C.blue} br={2} />
      <div style={{ flex:1 }}><TextLines lines={2} /></div>
    </div>
  )],
  'content-4': [C.white, () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:5 }}>
      {[1,2,3].map(i=>(
        <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:14, height:14, background:C.indigo, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#fff', fontSize:7, fontWeight:700 }}>{i}</span>
          </div>
          <Bar w='80%' h={5} bg='#9ca3af' />
        </div>
      ))}
    </div>
  )],
  'content-5': [C.white, () => (
    <div style={{ width:'88%', display:'flex', flexDirection:'column', gap:4 }}>
      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        <Bar w={22} h={10} bg={C.indigo} br={4} />
        <Bar w='55%' h={8} bg={C.dark} br={2} />
      </div>
      <Photo url={PHOTOS.sofa} h={38} br={4} />
      <Bar w={36} h={6} bg={C.indigo} />
    </div>
  )],
  'content-6': [C.white, () => (
    <div style={{ display:'flex', gap:4, width:'88%' }}>
      {[PHOTOS.sofa, PHOTOS.table].map((p,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
          <Photo url={p} h={40} br={4} />
          <Bar w='80%' h={6} bg={C.dark} />
          <Bar w='60%' h={4} bg='#9ca3af' />
          <Bar w={28} h={5} bg={C.indigo} />
        </div>
      ))}
    </div>
  )],
  'content-7': [C.offWhite, () => (
    <div style={{ display:'flex', gap:6, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.desk} w={50} h={55} br={6} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <Bar w='80%' h={7} bg={C.dark} />
        {['✓','✓','✓'].map((c,i)=>(
          <div key={i} style={{ display:'flex', gap:3, alignItems:'center' }}>
            <span style={{ fontSize:8, color:C.green }}>{c}</span>
            <Bar w='75%' h={4} bg='#9ca3af' />
          </div>
        ))}
      </div>
    </div>
  )],
  'content-8': [C.white, () => <Bar w='85%' h={1} bg='#e5e7eb' />],
  'content-9': [C.white, () => <Bar w='85%' h={28} bg='#f9fafb' br={4} />],
  'content-10': [C.offWhite, () => (
    <div style={{ display:'flex', gap:5, width:'85%' }}>
      {[0,1,2].map(i=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
          <Bar w='80%' h={7} bg={C.dark} />
          <Bar w='100%' h={4} bg='#9ca3af' />
          <Bar w='80%' h={4} bg='#9ca3af' />
        </div>
      ))}
    </div>
  )],
  'content-11': [C.white, () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:4 }}>
      <Bar w={36} h={9} bg={C.indigo} br={9} />
      <Bar w='70%' h={8} bg={C.dark} />
      <Bar w='90%' h={4} bg='#9ca3af' />
      <Bar w='75%' h={4} bg='#9ca3af' />
    </div>
  )],

  // IMAGES
  'img-1': [C.light, () => <Photo url={PHOTOS.shelf} h={78} />],
  'img-2': [C.light, () => (
    <div style={{ display:'flex', gap:3, width:'90%' }}>
      <Photo url={PHOTOS.sofa} w='50%' h={68} br={4} />
      <Photo url={PHOTOS.table} w='50%' h={68} br={4} />
    </div>
  )],
  'img-3': [C.light, () => (
    <div style={{ display:'flex', gap:3, width:'90%' }}>
      {[PHOTOS.desk, PHOTOS.sofa, PHOTOS.shelf].map((p,i)=><Photo key={i} url={p} w='33%' h={68} br={4} />)}
    </div>
  )],
  'img-4': [C.light, () => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3, width:'88%' }}>
      {[PHOTOS.sofa, PHOTOS.table, PHOTOS.desk, PHOTOS.shelf].map((p,i)=><Photo key={i} url={p} h={34} br={3} />)}
    </div>
  )],
  'img-5': [C.light, () => (
    <div style={{ display:'flex', flexDirection:'column', gap:3, width:'88%' }}>
      <div style={{ display:'flex', gap:3 }}>
        {[PHOTOS.sofa, PHOTOS.table].map((p,i)=><Photo key={i} url={p} w='50%' h={32} br={3} />)}
      </div>
      <div style={{ display:'flex', gap:3 }}>
        {[PHOTOS.desk, PHOTOS.shelf].map((p,i)=><Photo key={i} url={p} w='50%' h={32} br={3} />)}
      </div>
    </div>
  )],
  'img-6': [C.white, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'88%' }}>
      <Photo url={PHOTOS.sofa} h={54} br={4} />
      <Bar w='60%' h={5} bg='#9ca3af' />
    </div>
  )],
  'img-7': [C.white, () => (
    <div style={{ display:'flex', gap:6, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.desk} w={52} h={58} br={5} />
      <div style={{ flex:1 }}>
        <Bar w={30} h={6} bg={C.indigo} br={9} />
        <div style={{ marginTop:5 }}><TextLines lines={2} /></div>
        <div style={{ marginTop:5 }}><Bar w={30} h={6} bg={C.indigo} /></div>
      </div>
    </div>
  )],
  'img-8': [C.white, () => (
    <div style={{ display:'flex', gap:6, width:'88%', alignItems:'center' }}>
      <div style={{ flex:1 }}>
        <Bar w={30} h={6} bg={C.indigo} br={9} />
        <div style={{ marginTop:5 }}><TextLines lines={2} /></div>
      </div>
      <Photo url={PHOTOS.shelf} w={52} h={58} br={5} />
    </div>
  )],
  'img-9': [C.white, () => (
    <div style={{ display:'flex', flexDirection:'column', width:'88%', gap:4 }}>
      <Bar w={36} h={8} bg={C.indigo} br={9} />
      <Photo url={PHOTOS.sofa} h={40} br={4} />
      <Bar w='65%' h={7} bg={C.dark} />
      <Btn w={50} h={16} bg={C.indigo} />
    </div>
  )],
  'img-10': [C.white, () => (
    <div style={{ display:'flex', gap:4, width:'88%' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:3, flex:1.2 }}>
        <Bar w={32} h={7} bg={C.indigo} br={9} />
        <Photo url={PHOTOS.desk} h={50} br={4} />
        <Bar w='70%' h={6} bg={C.dark} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        {[PHOTOS.sofa, PHOTOS.chair].map((p,i)=>(
          <div key={i} style={{ display:'flex', flexDirection:'column', gap:2 }}>
            <Photo url={p} h={28} br={3} />
            <Bar w='80%' h={5} bg={C.dark} />
            <Bar w={24} h={5} bg={C.indigo} />
          </div>
        ))}
      </div>
    </div>
  )],
  'img-11': [C.white, () => (
    <div style={{ position:'relative', width:'100%', height:78 }}>
      <Photo url={PHOTOS.sofa} h={78} br={0} />
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.38)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(255,50,50,0.85)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontSize:10 }}>▶</span>
        </div>
      </div>
    </div>
  )],
  'img-12': [C.light, () => <Photo url={PHOTOS.shelf} h={68} />],

  // CTA
  'cta-1': [C.indigo, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:'85%' }}>
      <Bar w='65%' h={9} bg='rgba(255,255,255,0.92)' br={3} />
      <Bar w='48%' h={5} bg='rgba(255,255,255,0.55)' />
      <Btn w={54} h={20} bg={C.white} />
    </div>
  )],
  'cta-2': ['#fef3c7', () => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'88%' }}>
      <Bar w='55%' h={7} bg='#92400e' />
      <Btn w={46} h={18} bg={C.amber} />
    </div>
  )],
  'cta-3': [C.navy, () => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'88%' }}>
      <div><Bar w='90%' h={8} bg='#f1f5f9' /><Bar w='70%' h={5} bg='#94a3b8' style={{ marginTop:4 }} /></div>
      <Btn w={44} h={18} bg={C.indigo} />
    </div>
  )],
  'cta-4': [C.navy, () => (
    <div style={{ position:'relative', width:'100%', height:78 }}>
      <Photo url={PHOTOS.sofa} h={78} br={0} />
      <div style={{ position:'absolute', inset:0, background:'rgba(79,70,229,0.72)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5 }}>
        <Bar w='60%' h={9} bg='rgba(255,255,255,0.92)' br={3} />
        <Btn w={52} h={18} bg={C.white} />
      </div>
    </div>
  )],
  'cta-5': ['#fdf2f8', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='60%' h={8} bg='#9d174d' br={3} />
      <Bar w='45%' h={5} bg='#f9a8d4' />
      <Bar w={44} h={7} bg='#db2777' br={9} />
      <Btn w={52} h={18} bg='#db2777' />
    </div>
  )],
  'cta-6': ['#f0fdf4', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:'85%' }}>
      <Bar w='55%' h={9} bg='#166534' br={3} />
      <Bar w='75%' h={5} bg='#86efac' />
      <Btn w={52} h={18} bg={C.green} />
    </div>
  )],
  'cta-7': ['#0f172a', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:'85%' }}>
      <Bar w='55%' h={9} bg='rgba(255,255,255,0.9)' br={3} />
      <div style={{ display:'flex', gap:6 }}>
        <Btn w={42} h={16} bg='#1d1d1f' />
        <Btn w={42} h={16} bg='#1d1d1f' />
      </div>
    </div>
  )],
  'cta-8': ['#f5f3ff', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='55%' h={9} bg='#4338ca' br={3} />
      <div style={{ display:'flex', width:'100%', gap:3 }}>
        <Bar w='70%' h={18} bg='#fff' br={4} />
        <Btn w='28%' h={18} bg={C.indigo} />
      </div>
    </div>
  )],
  'cta-9': ['#1e1b4b', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w={36} h={8} bg='#818cf8' br={9} />
      <Bar w='70%' h={9} bg='rgba(255,255,255,0.92)' br={3} />
      <Bar w='55%' h={5} bg='rgba(255,255,255,0.5)' />
      <Btn w={52} h={18} bg='#818cf8' />
    </div>
  )],

  // ECOMMERCE
  'ecom-1': [C.white, () => (
    <div style={{ display:'flex', gap:5, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.sofa} w={52} h={58} br={5} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <Bar w='80%' h={7} bg={C.dark} />
        <div style={{ display:'flex', gap:4 }}>
          <Bar w={30} h={7} bg={C.indigo} />
          <Bar w={24} h={7} bg='#d1d5db' br={2} style={{ textDecoration:'line-through' }} />
        </div>
        <Bar w='90%' h={4} bg='#9ca3af' />
        <Btn w={52} h={16} bg={C.indigo} />
      </div>
    </div>
  )],
  'ecom-2': [C.white, () => (
    <div style={{ display:'flex', gap:5, width:'88%' }}>
      {[PHOTOS.sofa, PHOTOS.table].map((p,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
          <Photo url={p} h={44} br={4} />
          <Bar w='70%' h={6} bg={C.dark} />
          <Bar w={28} h={6} bg={C.indigo} />
          <Btn w='80%' h={14} bg={C.indigo} />
        </div>
      ))}
    </div>
  )],
  'ecom-3': [C.offWhite, () => (
    <div style={{ display:'flex', gap:3, width:'88%' }}>
      {[PHOTOS.desk, PHOTOS.sofa, PHOTOS.shelf].map((p,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          <Photo url={p} h={36} br={3} />
          <Bar w='70%' h={5} bg={C.dark} />
          <Bar w={24} h={5} bg={C.indigo} />
        </div>
      ))}
    </div>
  )],
  'ecom-4': [C.red, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w={40} h={9} bg='rgba(255,255,255,0.9)' br={9} />
      <Bar w='65%' h={11} bg='rgba(255,255,255,0.95)' br={3} />
      <Photo url={PHOTOS.sofa} h={30} br={4} />
      <Btn w={60} h={18} bg='rgba(255,255,255,0.2)' />
    </div>
  )],
  'ecom-5': ['#fafaf9', () => (
    <div style={{ display:'flex', gap:5, width:'88%', alignItems:'center' }}>
      <div style={{ flex:1 }}>
        <Bar w={28} h={7} bg={C.indigo} br={9} />
        <div style={{ marginTop:4 }}><Bar w='80%' h={8} bg={C.dark} /></div>
        <div style={{ marginTop:4 }}><Bar w='100%' h={4} bg='#9ca3af' /></div>
        <div style={{ marginTop:6 }}><Btn w={56} h={18} bg={C.indigo} /></div>
      </div>
      <Photo url={PHOTOS.desk} w={52} h={60} br={6} />
    </div>
  )],
  'ecom-6': ['#f0fdf4', () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:4 }}>
      <Bar w='70%' h={9} bg='#166534' br={3} />
      <Bar w='50%' h={5} bg='#86efac' />
      {[0,1].map(i=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
          <Bar w='60%' h={5} bg='#6b7280' />
          <Bar w={24} h={5} bg='#374151' />
        </div>
      ))}
      <Btn w={60} h={16} bg={C.green} />
    </div>
  )],
  'ecom-7': ['#fffbeb', () => (
    <div style={{ display:'flex', gap:5, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.sofa} w={46} h={50} br={5} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <Bar w='85%' h={7} bg='#92400e' />
        <Bar w='65%' h={4} bg='#d97706' />
        <Btn w={56} h={16} bg={C.amber} />
      </div>
    </div>
  )],
  'ecom-8': ['#f5f3ff', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='60%' h={8} bg='#4338ca' br={3} />
      <div style={{ border:'2px dashed #6366f1', borderRadius:8, padding:'6px 16px' }}>
        <Bar w={50} h={10} bg={C.indigo} />
      </div>
      <Btn w={56} h={16} bg={C.indigo} />
    </div>
  )],
  'ecom-9': [C.white, () => (
    <div style={{ display:'flex', flexDirection:'column', gap:4, width:'88%' }}>
      <Bar w='40%' h={8} bg={C.dark} />
      <div style={{ display:'flex', gap:3 }}>
        {[PHOTOS.sofa, PHOTOS.table, PHOTOS.shelf].map((p,i)=>(
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
            <Photo url={p} h={30} br={3} />
            <Bar w={20} h={5} bg={C.green} br={9} />
            <Bar w='70%' h={4} bg={C.dark} />
          </div>
        ))}
      </div>
    </div>
  )],
  'ecom-10': ['#fffbeb', () => (
    <div style={{ display:'flex', gap:5, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.sofa} w={46} h={52} br={5} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
        <span style={{ fontSize:12 }}>⭐⭐⭐⭐⭐</span>
        <Bar w='85%' h={5} bg='#6b7280' />
        <Bar w='70%' h={4} bg='#9ca3af' />
        <Btn w={52} h={14} bg={C.amber} />
      </div>
    </div>
  )],
  'ecom-11': ['#fdf2f8', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='60%' h={8} bg='#9d174d' br={3} />
      <Photo url={PHOTOS.shelf} h={36} br={4} />
      <Btn w={52} h={16} bg='#db2777' />
    </div>
  )],
  'ecom-12': ['#fef3c7', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='60%' h={8} bg='#92400e' br={3} />
      <div style={{ border:'2px solid #d97706', borderRadius:8, padding:'5px 14px', display:'flex', alignItems:'center', gap:5 }}>
        <Bar w={30} h={12} bg={C.amber} br={4} />
        <Bar w={24} h={8} bg='#92400e' />
      </div>
      <Btn w={52} h={16} bg={C.amber} />
    </div>
  )],
  'ecom-13': ['#f0f9ff', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='60%' h={8} bg='#0c4a6e' br={3} />
      <div style={{ display:'flex', gap:4 }}>
        {[PHOTOS.sofa, PHOTOS.table].map((p,i)=><Photo key={i} url={p} w={52} h={42} br={4} />)}
      </div>
      <div style={{ display:'flex', gap:5, alignItems:'center' }}>
        <Bar w={30} h={9} bg={C.sky} br={4} />
        <Bar w={24} h={6} bg='#94a3b8' style={{ textDecoration:'line-through' }} />
      </div>
      <Btn w={60} h={18} bg={C.sky} />
    </div>
  )],

  // CARDS
  'card-1': [C.white, () => (
    <div style={{ width:'72%', border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
      <Photo url={PHOTOS.sofa} h={36} br={0} />
      <div style={{ padding:5, display:'flex', flexDirection:'column', gap:3 }}>
        <Bar w='75%' h={6} bg={C.dark} />
        <Bar w={28} h={7} bg={C.indigo} />
        <Btn w='100%' h={14} bg={C.indigo} />
      </div>
    </div>
  )],
  'card-2': [C.offWhite, () => (
    <div style={{ display:'flex', gap:4, width:'88%' }}>
      {['⚡','🔒','📱'].map((ic,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:4, background:'#fff', borderRadius:6 }}>
          <span style={{ fontSize:14 }}>{ic}</span>
          <Bar w='70%' h={5} bg={C.dark} />
          <Bar w='90%' h={3} bg='#9ca3af' />
        </div>
      ))}
    </div>
  )],
  'card-3': [C.white, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'75%' }}>
      <div style={{ width:30, height:30, background:C.indigo, borderRadius:'50%' }} />
      <Bar w='60%' h={7} bg={C.dark} />
      <Bar w='45%' h={5} bg={C.indigo} />
      <Bar w='85%' h={4} bg='#9ca3af' />
    </div>
  )],
  'card-4': [C.white, () => (
    <div style={{ width:'72%', border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
      <Photo url={PHOTOS.table} h={36} br={0} />
      <div style={{ padding:5, display:'flex', flexDirection:'column', gap:3 }}>
        <Bar w={30} h={6} bg={C.indigo} br={9} />
        <Bar w='80%' h={6} bg={C.dark} />
        <Bar w={24} h={5} bg={C.indigo} />
      </div>
    </div>
  )],
  'card-5': ['#f5f3ff', () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:4 }}>
      <span style={{ fontSize:11 }}>⭐⭐⭐⭐⭐</span>
      <Bar w='90%' h={6} bg='#4338ca' />
      <Bar w='75%' h={4} bg='#9ca3af' />
      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        <div style={{ width:18, height:18, background:C.indigo, borderRadius:'50%' }} />
        <div>
          <Bar w={36} h={5} bg='#4338ca' />
          <Bar w={24} h={4} bg='#9ca3af' style={{ marginTop:2 }} />
        </div>
      </div>
    </div>
  )],
  'card-6': ['#eff6ff', () => (
    <div style={{ display:'flex', gap:5, width:'88%', alignItems:'center' }}>
      <div style={{ width:36, height:40, background:C.blue, borderRadius:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
        <Bar w='60%' h={7} bg='rgba(255,255,255,0.9)' br={2} />
        <Bar w='40%' h={5} bg='rgba(255,255,255,0.6)' />
      </div>
      <div style={{ flex:1 }}>
        <Bar w='80%' h={7} bg='#1e40af' />
        <Bar w='65%' h={4} bg='#93c5fd' style={{ marginTop:4 }} />
        <Btn w={40} h={14} bg={C.blue} style={{ marginTop:6 }} />
      </div>
    </div>
  )],
  'card-7': [C.darkBlue, () => (
    <div style={{ display:'flex', gap:4, width:'85%' }}>
      {['98%','50K+','4.9★'].map((v,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, background:'rgba(255,255,255,0.08)', borderRadius:6, padding:'4px 2px' }}>
          <Bar w='60%' h={8} bg='#c7d2fe' br={2} />
          <Bar w='80%' h={4} bg='#818cf8' />
        </div>
      ))}
    </div>
  )],
  'card-8': [C.white, () => (
    <div style={{ display:'flex', gap:5, width:'88%', alignItems:'center' }}>
      <Photo url={PHOTOS.desk} w={46} h={52} br={5} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
        <Bar w='90%' h={7} bg={C.dark} />
        {['✓','✓','✓'].map((c,i)=>(
          <div key={i} style={{ display:'flex', gap:3, alignItems:'center' }}>
            <span style={{ fontSize:8, color:C.indigo }}>{c}</span>
            <Bar w='75%' h={4} bg='#9ca3af' />
          </div>
        ))}
        <Btn w={44} h={14} bg={C.indigo} />
      </div>
    </div>
  )],

  // BUTTONS
  'btn-1': [C.white, () => <Btn w={70} h={24} bg={C.indigo} br={6} />],
  'btn-2': [C.white, () => (
    <div style={{ width:70, height:24, border:`2px solid ${C.indigo}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Bar w={40} h={6} bg={C.indigo} />
    </div>
  )],
  'btn-3': [C.white, () => (
    <div style={{ display:'flex', gap:8 }}>
      <Btn w={46} h={20} bg={C.green} br={5} />
      <Btn w={46} h={20} bg={C.red} br={5} />
    </div>
  )],
  'btn-4': [C.white, () => <Pill w={70} bg={C.pink}><Bar w={40} h={6} bg='rgba(255,255,255,0.9)' br={999} /></Pill>],
  'btn-5': [C.white, () => <Btn w={76} h={24} bg={C.dark} br={8} />],
  'btn-6': [C.white, () => <Btn w='85%' h={24} bg={C.indigo} br={4} />],

  // SURVEYS
  'survey-1': ['#fffbeb', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:'85%' }}>
      <Bar w='70%' h={7} bg='#92400e' br={3} />
      <span style={{ fontSize:16 }}>⭐⭐⭐⭐⭐</span>
      <Btn w={52} h={16} bg={C.amber} />
    </div>
  )],
  'survey-2': ['#f0fdf4', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='70%' h={7} bg='#166534' br={3} />
      <div style={{ display:'flex', gap:2 }}>
        {Array.from({length:7}).map((_,i)=>(
          <div key={i} style={{ width:12, height:12, border:'1px solid #d1d5db', borderRadius:3, background:'#fff' }} />
        ))}
      </div>
      <Btn w={52} h={16} bg={C.green} />
    </div>
  )],
  'survey-3': ['#eff6ff', () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:3 }}>
      <Bar w='70%' h={7} bg='#1e40af' br={3} />
      {[0,1,2].map(i=><div key={i} style={{ width:'100%', height:12, border:'1px solid #bfdbfe', borderRadius:4, background:'#fff' }} />)}
      <Btn w={52} h={16} bg={C.blue} />
    </div>
  )],
  'survey-4': ['#fdf4ff', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
      <Bar w='70%' h={7} bg='#7e22ce' br={3} />
      <div style={{ display:'flex', gap:8 }}>
        <Btn w={40} h={18} bg={C.green} br={5} />
        <Btn w={40} h={18} bg={C.red} br={5} />
      </div>
    </div>
  )],
  'survey-5': ['#f0f9ff', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'85%' }}>
      <Bar w='70%' h={7} bg='#0c4a6e' br={3} />
      <div style={{ display:'flex', gap:8 }}>
        {['😞','😐','😊','😍'].map((e,i)=><span key={i} style={{ fontSize:16 }}>{e}</span>)}
      </div>
    </div>
  )],
  'survey-6': ['#f8fafc', () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', gap:3 }}>
      <Bar w='70%' h={7} bg={C.slate} br={3} />
      {[0,1,2,3].map(i=><div key={i} style={{ width:'100%', height:10, border:'1px solid #e5e7eb', borderRadius:4, background:'#fff' }} />)}
    </div>
  )],

  // CAROUSEL
  'carousel-1': [C.indigo, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, width:'88%' }}>
      <Photo url={PHOTOS.sofa} h={50} br={4} />
      <div style={{ display:'flex', gap:4 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:'50%', background: i===0 ? '#fff' : 'rgba(255,255,255,0.38)' }} />)}
      </div>
    </div>
  )],
  'carousel-2': [C.offWhite, () => (
    <div style={{ display:'flex', gap:3, width:'88%' }}>
      {[PHOTOS.desk, PHOTOS.sofa, PHOTOS.shelf].map((p,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          <Photo url={p} h={30} br={3} />
          <Bar w='70%' h={5} bg={C.dark} />
          <Bar w={24} h={5} bg={C.indigo} />
        </div>
      ))}
    </div>
  )],
  'carousel-3': ['#f5f3ff', () => (
    <div style={{ width:'85%', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={3} h={32} bg={C.indigo} style={{ alignSelf:'flex-start' }} />
      <Bar w='85%' h={6} bg='#4338ca' />
      <Bar w='65%' h={4} bg='#9ca3af' />
      <div style={{ display:'flex', gap:3 }}>
        {[0,1].map(i=><div key={i} style={{ width:7, height:7, borderRadius:'50%', background: i===0 ? C.indigo : '#c4b5fd' }} />)}
      </div>
    </div>
  )],

  // FOOTER
  'footer-1': [C.offWhite, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <Bar w={60} h={6} bg='#374151' />
      <Bar w={80} h={4} bg='#9ca3af' />
      <Bar w={40} h={4} bg='#d1d5db' />
    </div>
  )],
  'footer-2': [C.darkBlue, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={60} h={6} bg='#c7d2fe' />
      <div style={{ display:'flex', gap:5 }}>
        {['🐦','💼','📸'].map((ic,i)=><span key={i} style={{ fontSize:12 }}>{ic}</span>)}
      </div>
      <Bar w={50} h={4} bg='#818cf8' />
    </div>
  )],
  'footer-3': [C.dark, () => (
    <div style={{ display:'flex', gap:6, width:'85%', alignItems:'flex-start' }}>
      <div style={{ flex:2, display:'flex', flexDirection:'column', gap:3 }}>
        <Bar w='80%' h={6} bg='#9ca3af' />
        <Bar w='60%' h={4} bg='#6b7280' />
      </div>
      {[0,1].map(i=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
          <Bar w='70%' h={5} bg='#9ca3af' />
          {[0,1].map(j=><Bar key={j} w='90%' h={4} bg='#6b7280' />)}
        </div>
      ))}
    </div>
  )],
  'footer-4': ['#0f172a', () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <Bar w={60} h={6} bg='#334155' />
      <div style={{ display:'flex', gap:8 }}>
        <Bar w={32} h={4} bg='#475569' />
        <Bar w={28} h={4} bg='#475569' />
      </div>
    </div>
  )],
  'footer-5': [C.offWhite, () => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <Bar w={40} h={10} bg={C.indigo} br={3} />
      <div style={{ display:'flex', gap:6 }}>
        {[0,1,2].map(i=><Bar key={i} w={28} h={4} bg='#9ca3af' />)}
      </div>
      <Bar w={70} h={4} bg='#d1d5db' />
    </div>
  )],
};

// ─── Main component ─────────────────────────────────────────────────────────
function ThumbnailPreview({ thumbnail }) {
  const entry = THUMBS[thumbnail];
  if (!entry) return (
    <div style={{ width:'100%', height:100, background:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Bar w={50} h={7} bg='#9ca3af' />
    </div>
  );

  const [bg, Inner] = entry;

  return (
    <div
      style={{
        width: '100%',
        height: 100,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Inner />
    </div>
  );
}

export default ThumbnailPreview;
