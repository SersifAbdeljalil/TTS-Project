import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import StoryPage from './components/StoryPage';
import PodcastPage from './components/PodcastPage';
import VideoPage from './components/VideoPage';
import AuthSuccess from './components/AuthSuccess';
import Project from './components/Project';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/project/:projectId" element={<Project />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;