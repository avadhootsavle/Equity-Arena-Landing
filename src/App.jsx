import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { BrochurePage } from './pages/BrochurePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/brochure" element={<BrochurePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
