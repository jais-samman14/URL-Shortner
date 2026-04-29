import React, { useState } from 'react';
import Header from './components/Header';
import URLForm from './components/URLForm';
import URLResult from './components/URLResult';
import URLHistory from './components/URLHistory';
import Footer from './components/Footer';

function App() {
  const [currentResult, setCurrentResult] = useState(null);

  const handleURLShortened = (result) => {
    setCurrentResult(result);
  };

  const handleCloseResult = () => {
    setCurrentResult(null);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <URLForm onURLShortened={handleURLShortened} />
          
          {currentResult && (
            <URLResult
              result={currentResult}
              onClose={handleCloseResult}
            />
          )}
          
          <URLHistory />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;