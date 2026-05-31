export const metadata = {
  title      : 'Mentions légales | Skanema',
  description: 'Mentions légales de Skanema, une solution TERYAT SUARL.',
}

const Row = ({ label, value }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', background:'var(--color-background-primary)', gap:'24px' }}>
    <span style={{ fontSize:'13px', color:'var(--color-text-secondary)', flexShrink:0 }}>{label}</span>
    <span style={{ fontSize:'13px', color:'var(--color-text-primary)', fontWeight:500, textAlign:'right' }}>{value}</span>
  </div>
)

export default function MentionsLegales() {
  return (
    <div style={{ maxWidth:'720px', margin:'0 auto', padding:'48px 24px', fontFamily:'system-ui,sans-serif' }}>

      <a href="/" style={{ fontSize:'13px', color:'#888', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px', marginBottom:'40px' }}>
        ← Retour
      </a>

      <div style={{ borderBottom:'0.5px solid #e5e5e5', paddingBottom:'32px', marginBottom:'48px' }}>
        <p style={{ fontSize:'12px', fontWeight:500, color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>Légal</p>
        <h1 style={{ fontSize:'32px', fontWeight:500, color:'#111', margin:'0 0 8px', lineHeight:1.2 }}>Mentions légales</h1>
        <p style={{ fontSize:'14px', color:'#888', margin:0 }}>Dernière mise à jour : juin 2026</p>
      </div>

      <div style={{ display:'grid', gap:'48px' }}>

        <section>
          <h2 style={{ fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#888', margin:'0 0 20px' }}>Éditeur</h2>
          <div style={{ display:'grid', gap:'1px', background:'#e5e5e5', border:'0.5px solid #e5e5e5', borderRadius:'12px', overflow:'hidden' }}>
            {[
              ['Raison sociale',       'TERYAT SUARL'],
              ['Forme juridique',      'Société Unipersonnelle à Responsabilité Limitée (SUARL)'],
              ['NINEA',                '012949957'],
              ['Registre de commerce', 'SN DKR 2026 B 12120'],
              ['Siège social',         'Nord Foire Diamalaye III, Villa N°238, Dakar, Sénégal'],
              ['Représentant légal',   'Le Gérant'],
              ['Email',                'contact@skanema.com'],
            ].map(([label, value]) => (
              <Row key={label} label={label} value={value} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#888', margin:'0 0 20px' }}>Propriété intellectuelle</h2>
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>
            L'ensemble des contenus présents sur skanema.com — textes, images, logos et code source — sont la propriété exclusive de TERYAT SUARL et protégés par les lois applicables en matière de propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'#888', margin:'0 0 20px' }}>Responsabilité</h2>
          <p style={{ fontSize:'15px', color:'#333', lineHeight:1.75, margin:0 }}>
            TERYAT SUARL s'efforce d'assurer l'exactitude des informations publiées sur ce site. L'utilisation de ces contenus se fait sous l'entière responsabilité de l'utilisateur. TERYAT SUARL ne saurait être tenue responsable de tout dommage direct ou indirect résultant de l'accès au site.
          </p>
        </section>

        <section style={{ borderTop:'0.5px solid #e5e5e5', paddingTop:'32px' }}>
          <p style={{ fontSize:'13px', color:'#888', margin:0 }}>
            Pour toute question :{' '}
            <a href="mailto:contact@skanema.com" style={{ color:'#111', fontWeight:500, textDecoration:'none' }}>
              contact@skanema.com
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}
