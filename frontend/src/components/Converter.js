import React, { useState, useEffect } from 'react';
import { 
  FaFileUpload, 
  FaSpinner, 
  FaDownload, 
  FaPlay, 
  FaPause,
  FaBook,
  FaMicrophone,
  FaVideo,
  FaRocket
} from 'react-icons/fa';
import '../style/Converter.css';

function Converter() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('fr');
  const [voice, setVoice] = useState('female1');
  const [quality, setQuality] = useState('standard');
  const [contentType, setContentType] = useState('story');
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [error, setError] = useState('');

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
    if (!inputText.trim()) {
      setError('Veuillez entrer du texte à convertir.');
      return;
    }

    setIsConverting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tts/convert', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          text: inputText, 
          lang: language,
          voice: voice,
          quality: quality,
          type: contentType
        })
      });

      const data = await response.json();

      if (data.success) {
        // Ajouter un timestamp pour éviter la mise en cache du navigateur
        const newAudioUrl = `http://localhost:5000${data.audioUrl}?t=${new Date().getTime()}`;
        setAudioUrl(newAudioUrl);
      } else {
        setError(data.message || 'Erreur lors de la conversion.');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion au serveur.');
    } finally {
      setIsConverting(false);
    }
  };

  const togglePlayPause = () => {
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
      player.addEventListener('ended', () => setIsPlaying(false));
      player.addEventListener('error', (e) => {
        console.error('Erreur de lecture audio:', e);
        setError('Erreur de lecture audio. Veuillez réessayer.');
        setIsPlaying(false);
      });
      
      player.play().then(() => {
        setIsPlaying(true);
        setAudioPlayer(player);
      }).catch(err => {
        console.error('Erreur lors du démarrage de la lecture:', err);
        setError('Impossible de lire l\'audio. Veuillez réessayer.');
      });
    }
  };

  const setActiveContentType = (type) => {
    setContentType(type);
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
              <option value="female1">Femme - Standard</option>
              <option value="male1">Homme - Standard</option>
            </select>
          </div>
          
          
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