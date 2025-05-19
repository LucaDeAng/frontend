import Container from '@/components/layout/Container';
import { Helmet } from 'react-helmet';

export default function About() {
  return (
    <>
      <Helmet>
        <title>Chi Siamo | AI Hub</title>
        <meta name="description" content="Scopri di più sul team di AI Hub, la nostra missione e la nostra visione per il futuro dell'intelligenza artificiale." />
        <meta property="og:title" content="Chi Siamo | AI Hub" />
        <meta property="og:description" content="Scopri di più sul team di AI Hub, la nostra missione e la nostra visione per il futuro dell'intelligenza artificiale." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Chi Siamo</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                AI Hub è nato con l'obiettivo di rendere l'intelligenza artificiale accessibile a tutti, fornendo risorse, articoli e strumenti pratici in italiano.
              </p>
              
              <h2>La Nostra Missione</h2>
              <p>
                La nostra missione è democratizzare l'accesso alla conoscenza sull'intelligenza artificiale, abbattendo le barriere linguistiche e tecniche che spesso impediscono alle persone di avvicinarsi a questo mondo affascinante.
              </p>
              
              <p>
                Crediamo che l'AI avrà un impatto significativo su ogni aspetto della nostra vita e che sia fondamentale che più persone possibili comprendano queste tecnologie, le loro potenzialità e le sfide che comportano.
              </p>
              
              <h2>Il Nostro Team</h2>
              <p>
                Il team di AI Hub è composto da esperti nel campo dell'intelligenza artificiale, sviluppatori, ricercatori e appassionati di tecnologia che condividono la stessa visione: rendere l'AI comprensibile e accessibile a tutti.
              </p>
              
              <h2>I Nostri Valori</h2>
              <ul>
                <li><strong>Accessibilità</strong>: Rendiamo l'AI comprensibile a tutti, indipendentemente dal background tecnico.</li>
                <li><strong>Qualità</strong>: Produciamo contenuti accurati, aggiornati e di alta qualità.</li>
                <li><strong>Etica</strong>: Promuoviamo un approccio responsabile e etico all'intelligenza artificiale.</li>
                <li><strong>Comunità</strong>: Favoriamo lo scambio di idee e la collaborazione tra appassionati e professionisti.</li>
              </ul>
              
              <h2>Unisciti a Noi</h2>
              <p>
                Se condividi la nostra passione per l'intelligenza artificiale e vuoi contribuire alla nostra missione, ci sono molti modi per farlo:
              </p>
              
              <ul>
                <li>Iscriviti alla nostra newsletter per rimanere aggiornato</li>
                <li>Partecipa alle discussioni nel nostro forum</li>
                <li>Condividi i nostri articoli sui social media</li>
                <li>Contribuisci con i tuoi contenuti o feedback</li>
              </ul>
              
              <p>
                Insieme possiamo costruire un futuro in cui l'intelligenza artificiale sia uno strumento accessibile e benefico per tutti.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
