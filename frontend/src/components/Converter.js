import React, { useState, useEffect } from 'react';
import { 
  FaFileUpload, 
  FaSpinner, 
  FaDownload, 
  FaPlay, 
  FaPause,
  FaRocket
} from 'react-icons/fa';
import '../style/Converter.css';

function Converter() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('fr');
  const [voice, setVoice] = useState('female1');
  const [quality, setQuality] = useState('standard');
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [error, setError] = useState('');

  // Configuration des voix par langue - simplifié sans types de contenu
  const voiceConfig = {
    'fr': ['female1', 'male1'],
    'en': ['female1', 'male1'],
    'es': ['female1', 'male1'],
    'de': ['female1', 'male1']
  };

  // Fonction pour émettre un événement de mise à jour de l'historique
  const emitHistoryUpdate = (ttsData, responseData) => {
    const newRecord = {
      id: responseData.id || responseData.tts_data_id || Date.now(),
      tts_data_id: responseData.id || responseData.tts_data_id,
      title: generateTitle(ttsData.text),
      text_content: ttsData.text,
      voiceSettings: {
        voice: ttsData.voice,
        language: ttsData.lang,
        quality: ttsData.quality
      }
    };

    // Émettre l'événement pour mettre à jour l'historique
    const event = new CustomEvent('newTtsRecord', { detail: newRecord });
    window.dispatchEvent(event);
  };

  // Fonction pour générer un titre automatique basé sur le contenu
  const generateTitle = (text) => {
    const date = new Date().toLocaleDateString('fr-FR');
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    // Prendre les premiers mots du texte pour créer un titre
    const firstWords = text.substring(0, 50).trim();
    const title = firstWords.length < text.length ? firstWords + '...' : firstWords;
    
    return `Audio - ${title} (${date} ${time})`;
  };

  // Validation de la configuration avant envoi
  const validateConfiguration = () => {
    const errors = [];
    
    // Vérifier si la langue est supportée
    if (!voiceConfig[language]) {
      errors.push(`Langue "${language}" non supportée`);
    } else if (!voiceConfig[language].includes(voice)) {
      errors.push(`Voix "${voice}" non disponible pour la langue "${language}"`);
    }
    
    // Vérifier la longueur du texte
    if (inputText.trim().length < 10) {
      errors.push('Le texte doit contenir au moins 10 caractères');
    } else if (inputText.trim().length > 10000) {
      errors.push('Le texte ne peut pas dépasser 10 000 caractères');
    }
    
    return errors;
  };

  // Effet pour réinitialiser le lecteur audio quand l'URL de l'audio change
  useEffect(() => {
    // Arrêter l'ancienne lecture si elle existe
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.src = '';
      setIsPlaying(false);
    }
    
    // Réinitialiser le lecteur audio
    setAudioPlayer(null);
  }, [audioUrl]);

  // Effet pour ajuster la voix quand la langue change
  useEffect(() => {
    if (voiceConfig[language]) {
      if (!voiceConfig[language].includes(voice)) {
        setVoice(voiceConfig[language][0]); // Sélectionner la première voix disponible
      }
    }
  }, [language, voice]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      
      // Extraire automatiquement le texte si c'est un fichier texte ou PDF
      handleExtractText(e.target.files[0]);
    }
  };

  const handleExtractText = async (selectedFile) => {
    if (!selectedFile) {
      selectedFile = file;
    }
    
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }

    setIsExtracting(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tts/extract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setInputText(data.text);
      } else {
        setError(data.message || 'Erreur lors de l\'extraction du texte.');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion au serveur.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConvertToAudio = async () => {
    // Validation avant envoi
    const validationErrors = validateConfiguration();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('; '));
      return;
    }

    setIsConverting(true);
    setError('');

    // Préparer les données à envoyer avec validation
    const ttsData = { 
      text: inputText.trim(), 
      lang: language,
      voice: voice,
      quality: quality
    };

    console.log('Envoi des données TTS:', ttsData); // Debug

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tts/convert', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ttsData)
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data); // Debug

      if (data.success) {
        // Ajouter un timestamp pour éviter la mise en cache du navigateur
        const newAudioUrl = `http://localhost:5000${data.audioUrl}?t=${new Date().getTime()}`;
        setAudioUrl(newAudioUrl);
        
        // *** ÉMETTRE L'ÉVÉNEMENT POUR METTRE À JOUR L'HISTORIQUE ***
        emitHistoryUpdate(ttsData, data);
        
        // Message de succès
        console.log('Audio généré avec succès pour:', `${language}/${voice}`);
        
      } else {
        setError(data.message || 'Erreur lors de la conversion.');
        console.error('Erreur API:', data);
      }
    } catch (err) {
      console.error('Erreur de conversion:', err);
      setError(`Erreur de conversion: ${err.message || 'Problème de connexion au serveur'}`);
    } finally {
      setIsConverting(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioUrl) return;

    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause();
        setIsPlaying(false);
      } else {
        audioPlayer.play();
        setIsPlaying(true);
      }
    } else {
      // Créer un nouveau player
      const player = new Audio(audioUrl);
      player.addEventListener('ended', () => {
        setIsPlaying(false);
        // Enregistrer la lecture dans l'historique si nécessaire
        recordPlayEvent();
      });
      player.addEventListener('error', (e) => {
        console.error('Erreur de lecture audio:', e);
        setError('Erreur de lecture audio. Veuillez réessayer.');
        setIsPlaying(false);
      });
      
      player.play().then(() => {
        setIsPlaying(true);
        setAudioPlayer(player);
        // Enregistrer le début de la lecture
        recordPlayEvent();
      }).catch(err => {
        console.error('Erreur lors du démarrage de la lecture:', err);
        setError('Impossible de lire l\'audio. Veuillez réessayer.');
      });
    }
  };

  // Fonction pour enregistrer un événement de lecture (optionnel)
  const recordPlayEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !audioUrl) return;

      // Extraire l'ID du fichier audio de l'URL si possible
      const urlParts = audioUrl.split('/');
      const audioFile = urlParts[urlParts.length - 1].split('?')[0];

      await fetch('http://localhost:5000/api/tts/play-record', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioFile: audioFile,
          text: inputText,
          title: generateTitle(inputText)
        })
      });

      // Rafraîchir l'historique après l'enregistrement de la lecture
      const refreshEvent = new CustomEvent('refreshTtsHistory');
      window.dispatchEvent(refreshEvent);

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la lecture:', error);
      // Ne pas afficher d'erreur à l'utilisateur pour cela
    }
  };

  const setActiveContentType = (type) => {
    // Cette fonction peut être supprimée si plus utilisée
    setError(''); // Effacer les erreurs précédentes
  };

  // Obtenir les voix disponibles pour la langue actuelle
  const getAvailableVoices = () => {
    if (voiceConfig[language]) {
      return voiceConfig[language];
    }
    return ['female1', 'male1']; // Par défaut
  };

  return (
    <div className="converter-section">
      <h2>Générateur de contenu audio</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="text-editor-section">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="text-editor"
          placeholder="Entrez votre texte ici ou importez un fichier..."
        />
        
        <div className="input-actions">
          <div className="character-count">{inputText.length} caractères</div>
          <label className="file-upload-label">
            <FaFileUpload className="upload-icon" />
            <span>Importer un fichier (TXT, PDF)</span>
            <input 
              type="file" 
              accept=".txt,.pdf" 
              onChange={handleFileChange} 
              className="file-input" 
            />
          </label>
          {file && (
            <div className="file-info">
              Fichier : {file.name}
            </div>
          )}
        </div>
      </div>
      
      <div className="generation-options">
        <h3>Options de génération</h3>
        
        <div className="option-selectors">
          <div className="option-group">
            <label htmlFor="language-selector">Langue</label>
            <select 
              id="language-selector" 
              className="language-selector" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Sélection de langue"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="de">Allemand</option>
            </select>
          </div>
          
          <div className="option-group">
            <label htmlFor="voice-selector">Voix</label>
            <select 
              id="voice-selector" 
              className="voice-selector" 
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              aria-label="Sélection de voix"
            >
              {getAvailableVoices().map(voiceOption => (
                <option key={voiceOption} value={voiceOption}>
                  {voiceOption === 'female1' ? 'Femme - Standard' : 'Homme - Standard'}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Affichage de la configuration actuelle */}
        <div className="current-config">
          <small>Configuration: {language.toUpperCase()} / {voice.toUpperCase()}</small>
        </div>
        
        <button 
          className="generate-button" 
          onClick={handleConvertToAudio}
          disabled={isConverting || !inputText.trim()}
        >
          {isConverting ? <FaSpinner className="spinning-icon" /> : <FaRocket className="generate-icon" />}
          <span>GÉNÉRER LE CONTENU AUDIO</span>
        </button>
      </div>
      
      {audioUrl && (
        <div className="audio-player-section">
          <h3>Audio généré</h3>
          <div className="audio-controls">
            <button className="play-pause-button" onClick={togglePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>
            
            <a 
              href={audioUrl} 
              download="audio.mp3" 
              className="download-button"
            >
              <FaDownload /> Télécharger
            </a>
          </div>
          
          <audio 
            className="audio-player" 
            controls 
            src={audioUrl} 
            key={audioUrl} // Forcer la réinitialisation du lecteur lors du changement d'URL
          />
        </div>
      )}
    </div>
  );
}

export default Converter;