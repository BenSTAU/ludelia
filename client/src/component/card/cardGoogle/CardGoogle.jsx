import googleLogo from '../../../assets/image/google.svg'
import'../card.scss'

export default function CardGoogle() {
  return (
    <article className='cardGoogle card'>
        <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
          Connexion avec
          <img
            src={googleLogo}
            alt="Logo Google"
          />
        </h2>     
    </article>
  )
}
