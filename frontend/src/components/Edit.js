// frontend/src/components/Edit.js
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function Edit() {
  const { projectId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState(state?.title || '');
  const [content, setContent] = useState(state?.content || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/tts/project/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, text_content: content })
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du projet');
    }
  };

  return (
    <div className="edit-page">
      <h2>Modifier le projet</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enregistrer</button>
        <button type="button" onClick={() => navigate('/dashboard')}>Annuler</button>
      </form>
    </div>
  );
}

export default Edit;