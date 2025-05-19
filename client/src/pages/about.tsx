import { Helmet } from "react-helmet";
import Container from "@/components/layout/Container";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, FileText, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>Chi sono | Luca De Angelis</title>
        <meta name="description" content="Luca De Angelis - AI Consultant e esperto di Generative AI. Scopri il mio approccio e i servizi che offro nell'ambito dell'intelligenza artificiale." />
        <meta property="og:title" content="Chi sono | Luca De Angelis" />
        <meta property="og:description" content="Luca De Angelis - AI Consultant e esperto di Generative AI. Scopri il mio approccio e i servizi che offro nell'ambito dell'intelligenza artificiale." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <section className="py-24">
        <Container className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-16 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-6">
                  <FileText className="h-4 w-4 mr-2" />
                  Chi sono
                </div>
                <h1 className="mb-6">Luca De Angelis</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  AI Consultant specializzato in soluzioni di Generative AI per aziende e professionisti
                </p>
                
                <div className="flex justify-center space-x-4 mb-6">
                  <motion.a 
                    href="https://linkedin.com/in/lucadeangelis" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="h-5 w-5 text-foreground" />
                  </motion.a>
                  <motion.a 
                    href="https://github.com/lucadeangelis" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="h-5 w-5 text-foreground" />
                  </motion.a>
                  <motion.a 
                    href="https://twitter.com/lucadeangelis" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter className="h-5 w-5 text-foreground" />
                  </motion.a>
                  <motion.a 
                    href="mailto:luca@deangelis.ai" 
                    className="p-2 rounded-full bg-background border border-border hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="h-5 w-5 text-foreground" />
                  </motion.a>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-16">
                <h2 className="text-2xl font-semibold mb-6">La mia missione</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg">
                    Aiuto aziende e professionisti ad integrare soluzioni di intelligenza artificiale generativa nei loro processi, 
                    consentendo loro di aumentare produttività, creatività e valore. Il mio approccio combina competenze tecniche 
                    all'avanguardia con una profonda comprensione delle esigenze di business.
                  </p>
                  <p>
                    Credo fermamente che l'AI generativa rappresenti un punto di svolta per ogni tipo di organizzazione, 
                    ma solo se implementata con una chiara strategia e con attenzione agli aspetti etici e di governance. 
                    Il mio obiettivo è rendere questa tecnologia accessibile, comprensibile e applicabile in contesti reali.
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-16">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10 mr-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Esperienza professionale</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">AI Consultant &amp; Strategist</h3>
                      <span className="text-sm text-muted-foreground">2022 - Presente</span>
                    </div>
                    <p className="mb-2">Consulenza indipendente per aziende nei settori finance, media e manifatturiero</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Implementazione di soluzioni basate su modelli LLM per automazione di processi</li>
                      <li>Formazione executive su opportunità e sfide della Generative AI</li>
                      <li>Sviluppo di roadmap strategiche per l'adozione dell'AI</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Senior AI Engineer</h3>
                      <span className="text-sm text-muted-foreground">2019 - 2022</span>
                    </div>
                    <p className="mb-2">TechInnovate Srl, Milano</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Sviluppo di soluzioni NLP per analisi documentale in ambito legale</li>
                      <li>Progettazione di pipeline di machine learning per classificazione automatica</li>
                      <li>Gestione di team interdisciplinari su progetti di innovazione tecnologica</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-16">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-primary/10 mr-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Formazione</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Master in Artificial Intelligence</h3>
                      <span className="text-sm text-muted-foreground">2017 - 2019</span>
                    </div>
                    <p>Politecnico di Milano</p>
                  </div>
                  
                  <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-primary/5 transition-colors">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Laurea in Ingegneria Informatica</h3>
                      <span className="text-sm text-muted-foreground">2013 - 2017</span>
                    </div>
                    <p>Università degli Studi di Roma "La Sapienza"</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <h2 className="text-2xl font-semibold mb-6">Contattami</h2>
                <p className="mb-8">
                  Sei interessato ad implementare soluzioni di AI generativa nella tua azienda o nel tuo lavoro?<br />
                  Contattami per una consulenza o per discutere di possibili collaborazioni.
                </p>
                
                <Button
                  className="px-8 py-6 rounded-full text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
                  asChild
                >
                  <a href="mailto:luca@deangelis.ai">
                    <Mail className="mr-2 h-5 w-5" />
                    luca@deangelis.ai
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
