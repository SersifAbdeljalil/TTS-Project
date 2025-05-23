import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaMicrophone, FaVideo, FaDownload, FaShareAlt } from 'react-icons/fa';
import '../style/Project.css';

function Project() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch(`http://localhost:5000/api/tts/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Projet non trouvé');
        return response.json();
      })
      .then(data => {
        console.log('Données du projet:', data.project);
        setProject(data.project);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  }, [projectId]);

  const determineProjectType = () => {
    if (!project) return 'story';
    const voiceSettings = project.voice_settings || {};
    if (voiceSettings.type) return voiceSettings.type;
    const title = project.title.toLowerCase();
    if (title.includes('podcast')) return 'podcast';
    if (title.includes('vidéo') || title.includes('video')) return 'video';
    return 'story';
  };

 



  if (isLoading) return (
    <div className="loading-container">
      <FaArrowLeft className="loading-spinner" />
      <p>Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Erreur</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
    </div>
  );

  if (!project) return (
    <div className="error-container">
      <h2>Projet non trouvé</h2>
      <button onClick={() => navigate('/dashboard')}>Retour au tableau de bord</button>
    </div>
  );

  const fileName = project.audio_path ? project.audio_path.replace(/\\/g, '/').split('/').pop() || '' : '';
  const audioUrl = fileName ? `http://localhost:5000/api/tts/audio/${fileName}` : '';
  console.log('Audio URL:', audioUrl);

  const projectType = determineProjectType();

  return (
    <div className="project-page">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Retour
      </button>
      <div className="project-container">
        <div className="project-header">
          <div className="project-icon">
            {projectType === 'podcast' ? <FaMicrophone /> :
             projectType === 'video' ? <FaVideo /> : <FaBook />}
          </div>
          <h1 className="project-title">{project.title}</h1>
        </div>
        <div className="project-content-wrapper">
          <p className="project-content">{project.text_content}</p>
        </div>
        {audioUrl && (
          <div className="project-audio-player">
            <audio controls src={audioUrl}>
              Votre navigateur ne prend pas en charge l'élément audio.
            </audio>
          </div>
        )}
      
      </div>
    </div>
  );
}

export default Project;