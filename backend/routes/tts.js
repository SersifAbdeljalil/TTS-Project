const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const fsSync = require('fs');
const pdfParse = require('pdf-parse');
const gTTS = require('gtts');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tts_app',
};

// Créer les dossiers s'ils n'existent pas
const uploadsDir = path.join(__dirname, '../uploads');
const audioDir = path.join(__dirname, '../audio');
const ensureDirExists = async (dir) => {
  if (!fsSync.existsSync(dir)) await fs.mkdir(dir, { recursive: true });
};
ensureDirExists(uploadsDir);
ensureDirExists(audioDir);

// Configuration Multer pour upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Route pour extraire le texte depuis fichier
router.post('/extract', authMiddleware, upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });

  try {
    const ext = path.extname(file.originalname).toLowerCase();
    let text = '';
    if (ext === '.txt') text = fsSync.readFileSync(file.path, 'utf-8');
    else if (ext === '.pdf') {
      const pdfBuffer = fsSync.readFileSync(file.path);
      const data = await pdfParse(pdfBuffer);
      text = data.text;
    } else return res.status(400).json({ success: false, message: 'Format non pris en charge.' });

    fsSync.unlinkSync(file.path);
    res.json({ success: true, text });
  } catch (err) {
    console.error('Erreur extraction:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'extraction du texte.' });
  }
});

// Route pour convertir du texte en audio et stocker dans la base de données
router.post('/convert', authMiddleware, async (req, res) => {
  const { text, lang } = req.body;
  const userId = req.userData.id;

  if (!text || !lang) return res.status(400).json({ success: false, message: 'Données incomplètes.' });

  try {
    // Générer l'audio avec gTTS
    const gtts = new gTTS(text, lang);
    const fileName = `audio_${userId}_${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, fileName);

    // Sauvegarder l'audio
    await new Promise((resolve, reject) => {
      gtts.save(audioPath, (err) => {
        if (err) {
          console.error('Erreur gTTS:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Créer une connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);

    // Préparer les données pour l'insertion dans tts_data
    const title = text.substring(0, 50) + (text.length > 50 ? '...' : '');
    const voiceSettingsJson = JSON.stringify({ lang });

    // Insérer dans la table tts_data
    const [result] = await connection.execute(
      'INSERT INTO tts_data (user_id, title, text_content, audio_path, voice_settings, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, title, text, audioPath, voiceSettingsJson]
    );

    // Insérer dans la table tts_history pour marquer la lecture
    const ttsDataId = result.insertId;
    await connection.execute(
      'INSERT INTO tts_history (user_id, tts_data_id, played_at) VALUES (?, ?, NOW())',
      [userId, ttsDataId]
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Audio généré et projet créé avec succès',
      audioUrl: `/api/tts/audio/${fileName}`,
      project: {
        id: ttsDataId,
        title,
        audioPath: fileName
      }
    });
  } catch (error) {
    console.error('Erreur lors de la conversion:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Route pour créer un nouveau projet TTS (peut être utilisé pour des projets sans conversion immédiate)
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, text_content, voice_settings } = req.body;
    const userId = req.userData.id;
    const connection = await mysql.createConnection(dbConfig);
    const audioFileName = `${uuidv4()}.mp3`;
    const audioFilePath = path.join(__dirname, '../uploads', audioFileName);

    let voiceSettingsJson = '{}';
    try {
      voiceSettingsJson = typeof voice_settings === 'object' ? JSON.stringify(voice_settings) : JSON.stringify(JSON.parse(voice_settings));
    } catch (e) {
      console.error('Erreur parsing voice_settings:', e);
    }

    const [result] = await connection.execute(
      'INSERT INTO tts_data (user_id, title, text_content, audio_path, voice_settings, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, title, text_content, audioFilePath, voiceSettingsJson]
    );
    await connection.end();
    await fs.writeFile(audioFilePath, 'Placeholder');
    res.status(201).json({ success: true, message: 'Projet créé', project: { id: result.insertId, title, audioPath: audioFileName } });
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création du projet' });
  }
});

// Route pour récupérer les projets
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const userId = req.userData.id;
    const connection = await mysql.createConnection(dbConfig);
    const [projects] = await connection.execute(
      'SELECT id, title, text_content, audio_path, voice_settings, created_at FROM tts_data WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    await connection.end();
    const formattedProjects = projects.map(p => ({ ...p, voice_settings: JSON.parse(p.voice_settings || '{}') }));
    res.json({ success: true, projects: formattedProjects });
  } catch (error) {
    console.error('Erreur projets:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des projets' });
  }
});

// Route pour récupérer l'historique
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userData.id;
    const connection = await mysql.createConnection(dbConfig);
    const [history] = await connection.execute(
      `SELECT h.id, h.user_id, h.tts_data_id, h.played_at, d.title, d.text_content, d.audio_path, d.voice_settings 
       FROM tts_history h 
       JOIN tts_data d ON h.tts_data_id = d.id 
       WHERE h.user_id = ? 
       ORDER BY h.played_at DESC`,
      [userId]
    );
    await connection.end();
    const formattedHistory = history.map(r => ({
      id: r.id,
      user_id: r.user_id,
      tts_data_id: r.tts_data_id,
      played_at: r.played_at,
      title: r.title,
      text_content: r.text_content,
      audio_path: r.audio_path,
      voice_settings: JSON.parse(r.voice_settings || '{}')
    }));
    res.json({ success: true, history: formattedHistory });
  } catch (error) {
    console.error('Erreur historique:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'historique' });
  }
});

// Route pour télécharger
router.get('/download/:projectId', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.userData.id;
    const connection = await mysql.createConnection(dbConfig);
    const [projects] = await connection.execute(
      'SELECT * FROM tts_data WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );
    await connection.end();
    if (projects.length === 0) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    res.download(projects[0].audio_path, `${projects[0].title}.mp3`, (err) => {
      if (err) {
        console.error('Erreur téléchargement:', err);
        res.status(500).json({ success: false, message: 'Erreur téléchargement' });
      }
    });
  } catch (error) {
    console.error('Erreur download:', error);
    res.status(500).json({ success: false, message: 'Erreur téléchargement projet' });
  }
});
// Dans tts.js
router.get('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.userData.id;
    const connection = await mysql.createConnection(dbConfig);
    const [projects] = await connection.execute(
      'SELECT * FROM tts_data WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );
    await connection.end();
    if (projects.length === 0) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    const project = projects[0];
    project.voice_settings = JSON.parse(project.voice_settings || '{}');
    res.json({ success: true, project });
  } catch (error) {
    console.error('Erreur récupération projet:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});
// Dans tts.js
router.put('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.userData.id;
    const { title, text_content } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'UPDATE tts_data SET title = ?, text_content = ? WHERE id = ? AND user_id = ?',
      [title, text_content, projectId, userId]
    );
    await connection.end();
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    res.json({ success: true, message: 'Projet mis à jour' });
  } catch (error) {
    console.error('Erreur mise à jour projet:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route pour supprimer
router.delete('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.userData.id;
    const connection = await mysql.createConnection(dbConfig);
    const [projects] = await connection.execute(
      'SELECT audio_path FROM tts_data WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );
    if (projects.length === 0) {
      await connection.end();
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    await connection.execute('DELETE FROM tts_data WHERE id = ? AND user_id = ?', [projectId, userId]);
    await connection.end();
    try { await fs.unlink(projects[0].audio_path); } catch (e) { console.warn('Erreur suppression fichier:', e); }
    res.json({ success: true, message: 'Projet supprimé' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ success: false, message: 'Erreur suppression projet' });
  }
});

module.exports = router;