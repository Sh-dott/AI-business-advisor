import React from 'react';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import BusinessTechAdvisor from './BusinessTechAdvisor';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BusinessTechAdvisor />
      </div>
    </LanguageProvider>
  );
}

export default App;
