import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Dashboard.css';
import { 
  FaBook, 
  FaMicrophone, 
  FaVideo, 
  FaPlay, 
  FaChevronDown, 
  FaUser, 
  FaFileUpload,
  FaHistory,
  FaPlus,
  FaBars,
  FaTimes,
  FaFile,
  FaCog,
  FaRocket,
  FaSpinner
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import Converter from './Converter';

function Dashboard() {
  const [showDrawer, setShowDrawer] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [ttsHistory, setTtsHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Vérifier si l'utilisateur est connecté et charger ses données
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Rediriger vers la page de connexion si non authentifié
      navigate('/login');
      return;
    }
    
    // Récupérer le profil de l'utilisateur et l'historique TTS
    fetchUserData(token);
    
    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setShowDrawer(width > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); 
  
  // Fonction pour récupérer les données de l'utilisateur
  const fetchUserData = async (token) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupération du profil utilisateur
      const profileResponse = await fetch('http://localhost:5000/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!profileResponse.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }
      
      const profileData = await profileResponse.json();
      setUserProfile(profileData.user);
      
      // Récupération de l'historique TTS
      await fetchTtsHistory(token);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      
      // Si une erreur d'authentification survient, rediriger vers la connexion
      if (error.message.includes('non autorisé') || error.message.includes('token')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction séparée pour récupérer uniquement l'historique TTS
  const fetchTtsHistory = async (token = null) => {
    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) return;

    try {
      const historyResponse = await fetch('http://localhost:5000/api/tts/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!historyResponse.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique TTS');
      }

      const historyData = await historyResponse.json();
      
      // Formater l'historique pour l'affichage
      const formattedHistory = historyData.history.map(record => {
        let voiceSettings = {};
        if (record.voice_settings) {
          if (typeof record.voice_settings === 'object') {
            voiceSettings = record.voice_settings;
          } else if (typeof record.voice_settings === 'string') {
            try {
              voiceSettings = JSON.parse(record.voice_settings);
            } catch (error) {
              console.error('Erreur parsing voice_settings:', error);
              voiceSettings = {};
            }
          }
        }

        return {
          id: record.id,
          tts_data_id: record.tts_data_id,
          title: record.title,
          played_at: new Date(record.played_at).toLocaleString('fr-FR'),
          preview: record.text_content.substring(0, 100) + '...',
          type: determineProjectType(record.title, voiceSettings),
          content: record.text_content,
          voiceSettings: voiceSettings
        };
      });

      setTtsHistory(formattedHistory);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
    }
  };

  // Fonction pour ajouter une nouvelle entrée à l'historique
  const addToHistory = (newRecord) => {
    const formattedRecord = {
      id: newRecord.id || Date.now(), // Utiliser un ID temporaire si pas fourni
      tts_data_id: newRecord.tts_data_id || newRecord.id,
      title: newRecord.title,
      played_at: new Date().toLocaleString('fr-FR'),
      preview: newRecord.text_content ? newRecord.text_content.substring(0, 100) + '...' : '',
      type: determineProjectType(newRecord.title, newRecord.voiceSettings || {}),
      content: newRecord.text_content || '',
      voiceSettings: newRecord.voiceSettings || {}
    };

    // Ajouter au début de la liste (plus récent en premier)
    setTtsHistory(prevHistory => [formattedRecord, ...prevHistory]);
  };

  // Fonction pour rafraîchir l'historique (appelée depuis le composant Converter)
  const refreshHistory = () => {
    fetchTtsHistory();
  };

  // Utiliser un interval pour vérifier périodiquement les nouveaux enregistrements
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Rafraîchir l'historique toutes les 10 secondes si l'utilisateur est actif
    const interval = setInterval(() => {
      // Vérifier si l'onglet est actif
      if (!document.hidden) {
        fetchTtsHistory();
      }
    }, 10000); // 10 secondes

    return () => clearInterval(interval);
  }, []);

  // Écouter les événements personnalisés pour les nouveaux TTS
  useEffect(() => {
    const handleNewTts = (event) => {
      const newRecord = event.detail;
      addToHistory(newRecord);
    };

    const handleRefreshHistory = () => {
      fetchTtsHistory();
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('newTtsRecord', handleNewTts);
    window.addEventListener('refreshTtsHistory', handleRefreshHistory);

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('newTtsRecord', handleNewTts);
      window.removeEventListener('refreshTtsHistory', handleRefreshHistory);
    };
  }, []);
  
  // Déterminer le type de projet en fonction du titre et des paramètres de voix
  const determineProjectType = (title, voiceSettings) => {
    // D'abord vérifier si le type est défini dans les paramètres de voix
    if (voiceSettings && voiceSettings.type) {
      return voiceSettings.type;
    }
    
    // Sinon, déterminer le type à partir du titre
    title = title.toLowerCase();
    if (title.includes('podcast')) return 'podcast';
    if (title.includes('vidéo') || title.includes('video')) return 'video';
    return 'story'; // Par défaut, c'est un récit
  };
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Appel au backend pour déconnecter la session
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Supprimer le token côté client
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, nettoyer le localStorage et rediriger
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };
  
  const handleNewConversation = () => {
    // Recharger la page pour avoir un nouveau convertisseur propre
    window.location.reload();
  };
  
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  
  const openProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };
  
  // Si les données sont en cours de chargement
  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
        <p>Chargement de votre tableau de bord...</p>
      </div>
    );
  }
  
  // Si une erreur est survenue
  if (error) {
    return (
      <div className="error-container">
        <h2>Une erreur est survenue</h2>
        <p>{error}</p>
        <button onClick={() => fetchUserData(localStorage.getItem('token'))}>Réessayer</button>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      {/* Bouton menu hamburger mobile */}
      <button className="mobile-menu-toggle" onClick={toggleDrawer} aria-label="Toggle menu">
        {showDrawer ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Drawer latéral */}
      <div className={`drawer ${showDrawer ? 'drawer-open' : 'drawer-closed'}`}>
        {/* En-tête du drawer */}
        <div className="drawer-header">
          <h2>TTS Application</h2>
          <button className="new-conversation-button" onClick={handleNewConversation}>
            <FaPlus /> Nouvelle conversation
          </button>
        </div>
        
        {/* Historique des lectures TTS */}
        <div className="conversation-history">
          <h3><FaHistory /> Historique</h3>
          {ttsHistory.length > 0 ? (
            <ul className="conversation-list">
              {ttsHistory.map(record => (
                <li 
                  key={record.id} 
                  className="conversation-item"
                  onClick={() => openProject(record.tts_data_id)}
                >
                  <div className="conversation-icon">
                    {record.type === 'podcast' ? <FaMicrophone /> :
                     record.type === 'video' ? <FaVideo /> : <FaBook />}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-title">{record.title}</div>
                    <div className="conversation-date">Lu le {record.played_at}</div>
                    <div className="conversation-preview">{record.preview}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-conversations">Aucune lecture</p>
          )}
        </div>
        
        {/* Profil utilisateur */}
        <div className="user-profile">
          {userProfile && (
            <>
              <div className="profile-avatar">
                <img 
                  src={userProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=random&color=fff`} 
                  alt="Avatar utilisateur" 
                />
              </div>
              <div className="profile-info">
                <div className="profile-name">{userProfile.name}</div>
                <div className="profile-email">{userProfile.email}</div>
                <div className="profile-plan">{userProfile.plan || "Free"}</div>
              </div>
              <div className="profile-actions">
                <button className="profile-action-button" onClick={() => navigate('/profile')} aria-label="Settings">
                  <FaCog />
                </button>
                <button className="profile-action-button logout" onClick={handleLogout} aria-label="Logout">
                  <FiLogOut />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className={`main-content ${showDrawer ? 'with-drawer' : 'full-width'}`}>
        <div className="dashboard-header">
          <h1>Tableau de bord</h1>
        </div>
        
        {/* Afficher directement le convertisseur */}
        <Converter />
      </div>
    </div>
  );
}

export default Dashboard;