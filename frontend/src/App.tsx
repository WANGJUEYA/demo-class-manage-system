import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Courses from './pages/Courses';
import Sections from './pages/Sections';
import Students from './pages/Students';
import Grades from './pages/Grades';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/courses" replace />} />
          <Route path="courses" element={<Courses />} />
          <Route path="sections" element={<Sections />} />
          <Route path="students" element={<Students />} />
          <Route path="grades" element={<Grades />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
