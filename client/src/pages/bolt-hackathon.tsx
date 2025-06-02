import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { 
  Bolt, Calendar, GitBranch, Target, Trophy, Zap, Clock, 
  Users, Star, ChevronRight, ExternalLink, Mail, Play,
  CheckCircle2, Circle, Edit3, Save, X, Plus
} from 'lucide-react';
import { Link } from 'wouter';

interface HackathonDay {
  day: number;
  date: string;
  title: string;
  description: string;
  achievements: string[];
  challenges: string[];
  techStack: string[];
  status: 'completed' | 'in-progress' | 'planned';
  timeSpent: number;
  githubCommits?: number;
  isEditing?: boolean;
}

export default function BoltHackathon() {
  const [emailSubscription, setEmailSubscription] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [days, setDays] = useState<HackathonDay[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load hackathon days from API
  useEffect(() => {
    const loadHackathonDays = async () => {
      try {
        setLoading(true);
        console.log('🔄 Caricamento giorni hackathon...');
        
        const response = await fetch('/api/hackathon/days');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const hackathonDays = await response.json();
        console.log('✅ Giorni hackathon caricati:', hackathonDays.length);
        
        setDays(hackathonDays);
        calculateProgress(hackathonDays);
        setError(null);
      } catch (err) {
        console.error('❌ Errore nel caricamento dei giorni hackathon:', err);
        setError('Impossibile caricare i dati dell\'hackathon');
        
        // Fallback ai dati locali in caso di errore
        initializeFallbackDays();
      } finally {
        setLoading(false);
      }
    };

    loadHackathonDays();
  }, []);

  // Fallback initialization in case API fails
  const initializeFallbackDays = () => {
    const startDate = new Date('2025-01-01');
    const hackathonDays: HackathonDay[] = [];
    
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      hackathonDays.push({
        day: i + 1,
        date: currentDate.toLocaleDateString('it-IT'),
        title: i === 0 ? 'Kickoff - Setup del progetto' : `Giorno ${i + 1}`,
        description: i === 0 ? 'Configurazione ambiente, planning e obiettivi iniziali' : 'Da pianificare...',
        achievements: i === 0 ? ['Setup repository', 'Configurazione CI/CD', 'Planning roadmap'] : [],
        challenges: i === 0 ? ['Definire scope preciso', 'Bilanciare features vs tempo'] : [],
        techStack: i === 0 ? ['React', 'TypeScript', 'Vite'] : [],
        status: i === 0 ? 'completed' : 'planned',
        timeSpent: i === 0 ? 8 : 0,
        githubCommits: i === 0 ? 12 : 0
      });
    }
    
    setDays(hackathonDays);
    calculateProgress(hackathonDays);
  };

  const calculateProgress = (hackathonDays: HackathonDay[]) => {
    const completedDays = hackathonDays.filter(day => day.status === 'completed').length;
    const progress = Math.round((completedDays / 30) * 100);
    setTotalProgress(progress);
  };

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubscription) return;

    try {
      console.log('📧 Invio iscrizione newsletter hackathon:', emailSubscription);
      
      const response = await fetch('/api/hackathon/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailSubscription }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmailSubscription('');
        console.log('✅ Iscrizione newsletter hackathon completata');
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          alert('Email già iscritta alla newsletter!');
        } else {
          alert('Errore durante l\'iscrizione: ' + (errorData.error || 'Errore sconosciuto'));
        }
      }
    } catch (error) {
      console.error('❌ Errore iscrizione newsletter:', error);
      alert('Errore durante l\'iscrizione. Riprova più tardi.');
    }
  };

  const handleEditDay = (dayIndex: number) => {
    setEditingDay(dayIndex);
  };

  const handleSaveDay = async (dayIndex: number, updatedDay: HackathonDay) => {
    try {
      console.log(`🔄 Salvataggio giorno ${updatedDay.day}:`, updatedDay);
      
      // Remove local editing flag before sending to API
      const { isEditing, ...dayToSave } = updatedDay;
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Devi essere loggato come admin per modificare i giorni');
        return;
      }

      const response = await fetch(`/api/hackathon/days/${updatedDay.day}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dayToSave),
      });

      if (response.ok) {
        const savedDay = await response.json();
        const updatedDays = [...days];
        updatedDays[dayIndex] = savedDay;
        setDays(updatedDays);
        setEditingDay(null);
        calculateProgress(updatedDays);
        console.log(`✅ Giorno ${updatedDay.day} salvato con successo`);
      } else {
        const errorData = await response.json();
        alert('Errore durante il salvataggio: ' + (errorData.error || 'Errore sconosciuto'));
      }
    } catch (error) {
      console.error(`❌ Errore salvataggio giorno ${updatedDay.day}:`, error);
      alert('Errore durante il salvataggio. Riprova più tardi.');
    }
  };

  const getCurrentDay = () => {
    const today = new Date();
    const startDate = new Date('2025-01-01');
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 30);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'planned':
        return <Circle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const currentDay = getCurrentDay();
  const completedDays = days.filter(day => day.status === 'completed').length;
  const totalTimeSpent = days.reduce((sum, day) => sum + day.timeSpent, 0);
  const totalCommits = days.reduce((sum, day) => sum + (day.githubCommits || 0), 0);

  if (loading) {
    return (
      <div className="py-20 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <Bolt className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-300 text-lg">Caricamento dati hackathon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Errore nel caricamento</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-black min-h-screen">
      <Container>
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Bolt className="w-16 h-16 text-white" />
            <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2">
              <Trophy className="w-4 h-4 text-black" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Bolt Hackathon Journey
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            30 giorni di sviluppo intensivo per trasformare AI Hub in una piattaforma completa. 
            Segui ogni passo del processo, dalle sfide quotidiane ai breakthrough.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://hackathon.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Bolt Official
            </a>
            
            <Link href="/build-in-public">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 border border-zinc-600">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Torna a Build in Public
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 mb-12 border border-zinc-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            Progress Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                <span className="text-purple-300 font-semibold">Giorno Corrente</span>
              </div>
              <p className="text-3xl font-bold text-white">{currentDay}</p>
              <p className="text-gray-400">di 30 giorni</p>
            </div>

            <div className="bg-black/30 p-6 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className="text-green-300 font-semibold">Completati</span>
              </div>
              <p className="text-3xl font-bold text-white">{completedDays}</p>
              <p className="text-gray-400">giorni finiti</p>
            </div>

            <div className="bg-black/30 p-6 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-blue-400" />
                <span className="text-blue-300 font-semibold">Ore Totali</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalTimeSpent}</p>
              <p className="text-gray-400">ore di lavoro</p>
            </div>

            <div className="bg-black/30 p-6 rounded-xl border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Commits</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalCommits}</p>
              <p className="text-gray-400">su GitHub</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Progress Hackathon</span>
              <span className="text-purple-400 font-semibold">{totalProgress}%</span>
            </div>
            <div className="h-4 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div 
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 mb-12 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Aggiornamenti Quotidiani</h3>
            <p className="text-gray-300">Ricevi un riassunto giornaliero dei progressi direttamente nella tua inbox</p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                placeholder="La tua email..."
                className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Iscriviti
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 max-w-md mx-auto">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-green-300 font-semibold">Iscrizione completata!</p>
                <p className="text-gray-300 text-sm">Riceverai gli aggiornamenti quotidiani</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Daily Progress Timeline */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-400" />
            Diario di Sviluppo
          </h2>

          <div className="space-y-6">
            {days.map((day, index) => (
              <DayCard 
                key={day.day}
                day={day}
                index={index}
                isEditing={editingDay === index}
                onEdit={() => handleEditDay(index)}
                onSave={(updatedDay) => handleSaveDay(index, updatedDay)}
                onCancel={() => setEditingDay(null)}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

// Day Card Component
interface DayCardProps {
  day: HackathonDay;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (day: HackathonDay) => void;
  onCancel: () => void;
  getStatusIcon: (status: string) => JSX.Element | null;
}

function DayCard({ day, index, isEditing, onEdit, onSave, onCancel, getStatusIcon }: DayCardProps) {
  const [editedDay, setEditedDay] = useState<HackathonDay>(day);

  useEffect(() => {
    setEditedDay(day);
  }, [day]);

  const handleSave = () => {
    onSave(editedDay);
  };

  const addAchievement = () => {
    const achievement = prompt('Nuovo achievement:');
    if (achievement) {
      setEditedDay({
        ...editedDay,
        achievements: [...editedDay.achievements, achievement]
      });
    }
  };

  const addChallenge = () => {
    const challenge = prompt('Nuova sfida:');
    if (challenge) {
      setEditedDay({
        ...editedDay,
        challenges: [...editedDay.challenges, challenge]
      });
    }
  };

  return (
    <motion.div
      className="relative pl-8 border-l-2 border-blue-500/20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
      <div className="bg-zinc-900/50 p-6 rounded-lg hover:bg-zinc-900/70 transition-colors border border-zinc-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(day.status)}
            <div>
              <h3 className="text-xl font-semibold text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDay.title}
                    onChange={(e) => setEditedDay({ ...editedDay, title: e.target.value })}
                    className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white"
                  />
                ) : (
                  day.title
                )}
              </h3>
              <p className="text-gray-400">Giorno {day.day} - {day.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {day.timeSpent > 0 && (
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                {day.timeSpent}h
              </span>
            )}
            {day.githubCommits && day.githubCommits > 0 && (
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                {day.githubCommits} commits
              </span>
            )}
            {!isEditing ? (
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-white p-1"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="text-green-400 hover:text-green-300 p-1"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={onCancel}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          {isEditing ? (
            <textarea
              value={editedDay.description}
              onChange={(e) => setEditedDay({ ...editedDay, description: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-gray-300 min-h-[80px]"
            />
          ) : (
            <p className="text-gray-300">{day.description}</p>
          )}
        </div>

        {(day.achievements.length > 0 || isEditing) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-medium">Achievements</span>
              {isEditing && (
                <button
                  onClick={addAchievement}
                  className="text-green-400 hover:text-green-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <ul className="space-y-1">
              {(isEditing ? editedDay.achievements : day.achievements).map((achievement, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(day.challenges.length > 0 || isEditing) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-300 font-medium">Sfide</span>
              {isEditing && (
                <button
                  onClick={addChallenge}
                  className="text-green-400 hover:text-green-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <ul className="space-y-1">
              {(isEditing ? editedDay.challenges : day.challenges).map((challenge, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                  <Circle className="w-3 h-3 text-red-400" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        {day.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {day.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="bg-zinc-800 text-gray-300 px-2 py-1 rounded text-sm border border-zinc-600"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
} 