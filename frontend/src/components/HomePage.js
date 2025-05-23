import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Homepage.css';
import { 
  FaBook, 
  FaMicrophone, 
  FaPlay, 
  FaChevronDown, 
  FaFileUpload,
  FaHeadphones,
  FaRocket,
  FaLock,
  FaUnlock
} from 'react-icons/fa';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

function HomePage({ onLogin, onSignup }) {
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  const navigateToLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  };
 
  const navigateToSignup = () => {
    if (onSignup) {
      onSignup();
    } else {
      navigate('/signup');
    }
  };

  // Contenu pour tous les utilisateurs (anciennement UnauthenticatedContent)
  const MainContent = () => (
    <>
      {/* Bannière principale */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h2 className="banner-title">Transformez vos textes en audio avec l'IA</h2>
          <p className="banner-subtitle">Générez des narrations, podcasts et livres audio à partir de simples textes</p>
          <div className="banner-cta">
            <button className="cta-button signup" onClick={navigateToSignup}>
              <FiUserPlus className="cta-icon" />
              COMMENCER GRATUITEMENT
            </button>
            <button className="cta-button login" onClick={navigateToLogin}>
              <FiLogIn className="cta-icon" />
              SE CONNECTER
            </button>
          </div>
        </div>
        <div className="banner-image">
          {/* Emplacement pour une image d'illustration */}
        </div>
      </div>
      
      {/* Fonctionnalités */}
      <div className="features-section">
        <h2 className="section-title">Nos fonctionnalités audio</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaBook /></div>
            <h3>Narration professionnelle</h3>
            <p>Transformez vos textes en narrations avec différentes voix et styles vocaux.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaMicrophone /></div>
            <h3>Création de podcasts</h3>
            <p>Convertissez vos textes en podcasts avec des voix naturelles et multiples narrateurs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaHeadphones /></div>
            <h3>Production de livres audio</h3>
            <p>Générez des livres audio de qualité professionnelle à partir de vos manuscrits.</p>
          </div>
        </div>
      </div>
      
      {/* Démo limitée */}
      <div className="demo-section">
        <h2 className="section-title">Essayez notre démo audio</h2>
        <p className="demo-description">Testez notre technologie de synthèse vocale avec cette version limitée</p>
        <div className="demo-container">
          <div className="demo-input-container">
            <textarea
              className="demo-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={100}
              placeholder="Entrez un court texte à convertir en audio (limité à 100 caractères)..."
            />
            <div className="demo-input-actions">
              <div className="character-count">{inputText.length}/100</div>
            </div>
          </div>
          <div className="demo-options">
            <button className="demo-option-button">
              <FaBook className="demo-icon" />
              <span>Voix narrative</span>
            </button>
            <button className="demo-option-button">
              <FaMicrophone className="demo-icon" />
              <span>Voix podcast</span>
            </button>
            <button className="demo-option-button">
              <FaHeadphones className="demo-icon" />
              <span>Voix livre audio</span>
            </button>
          </div>
          <button className="demo-submit-button" onClick={() => {
            if(inputText.trim().length === 0) {
              alert("Veuillez entrer du texte pour essayer la démo audio");
            } else {
              alert("Fonctionnalité audio limitée. Inscrivez-vous pour accéder à toutes les options!");
              navigateToSignup();
            }
          }}>
            <FaPlay className="demo-submit-icon" />
            <span>ÉCOUTER LA DÉMO</span>
          </button>
        </div>
      </div>
      
      {/* Comparaison des fonctionnalités */}
      <div className="pricing-section">
        <h2 className="section-title">Nos forfaits audio</h2>
        <div className="pricing-table">
          <div className="pricing-column demo">
            <div className="pricing-header">
              <h3>Démo Audio</h3>
              <p className="price">Gratuit</p>
            </div>
            <ul className="pricing-features">
              <li><FaLock /> Limite de 100 caractères</li>
              <li><FaLock /> Qualité audio standard</li>
              <li><FaLock /> Sans sauvegarde</li>
              <li><FaLock /> Voix limitées</li>
            </ul>
            <button className="pricing-cta demo" onClick={() => {
              document.querySelector('.demo-section').scrollIntoView({ behavior: 'smooth' });
            }}>Essayer maintenant</button>
          </div>
          <div className="pricing-column premium highlight">
            <div className="pricing-header">
              <h3>Audio Premium</h3>
              <p className="price">19,99€ / mois</p>
            </div>
            <ul className="pricing-features">
              <li><FaUnlock /> Textes illimités</li>
              <li><FaUnlock /> Audio haute fidélité</li>
              <li><FaUnlock /> Sauvegarde des fichiers audio</li>
              <li><FaUnlock /> Toutes les voix disponibles</li>
              <li><FaUnlock /> Support prioritaire</li>
            </ul>
            <button className="pricing-cta premium" onClick={navigateToSignup}>S'inscrire</button>
          </div>
        </div>
      </div>
      
      {/* Call to action final */}
      <div className="final-cta-section">
        <h2>Prêt à transformer vos textes en contenus audio professionnels ?</h2>
        <p>Rejoignez des milliers d'utilisateurs qui créent du contenu audio de qualité en quelques clics</p>
        <button className="final-cta-button" onClick={navigateToSignup}>
          <FaRocket className="final-cta-icon" />
          COMMENCER MAINTENANT
        </button>
      </div>
    </>
  );

  // Rendu principal du composant
  return (
    <div className="home-page">
      {/* Contenu principal */}
      <div className="main-content full-width">
        <div className="content-wrapper">
          {/* En-tête commun */}
          <div className="app-header">
            <h1 className="app-title">Générateur de contenu audio IA</h1>
            <p className="app-subtitle">Transformez vos textes en contenus audio professionnels</p>
          </div>
          
          {/* Afficher uniquement le contenu principal */}
          <MainContent />
          
          {/* Footer commun */}
          <div className="main-footer">
            <p>© 2025 TTS Application - Tous droits réservés</p>
            <div className="footer-links">
              <a href="/about">À propos</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Confidentialité</a>
              <a href="/terms">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;