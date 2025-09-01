import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import FlujoCaja from './pages/flujo-caja/FlujoCaja';
import DataEntry from './pages/data-entry/DataEntry';
import Feriados from './pages/feriados/Feriados';
import Input from './pages/input/Input';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<FlujoCaja />} />
            <Route path="/flujo-caja" element={<FlujoCaja />} />
            <Route path="/data-entry" element={<DataEntry />} />
            <Route path="/feriados" element={<Feriados />} />
            <Route path="/input" element={<Input />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
