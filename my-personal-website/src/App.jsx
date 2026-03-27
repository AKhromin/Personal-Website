import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { DesktopProvider } from './context/DesktopContext';
import Desktop from './components/Desktop';

function App() {
  return (
    <DesktopProvider>
      <div className="App">
        <ToastContainer />
        <Desktop />
      </div>
    </DesktopProvider>
  );
}

export default App;
