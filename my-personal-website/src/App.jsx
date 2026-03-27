import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './mobile.css';
import useDeviceType from './hooks/useDeviceType';
import { DesktopProvider } from './context/DesktopContext';
import Desktop from './components/Desktop';
import MobileLayout from './components/MobileLayout';
import TabletLayout from './components/TabletLayout';

function App() {
  const { deviceType } = useDeviceType();

  if (deviceType === 'phone') {
    return (
      <div className="App">
        <ToastContainer />
        <MobileLayout />
      </div>
    );
  }

  if (deviceType === 'tablet') {
    return (
      <div className="App">
        <ToastContainer />
        <TabletLayout />
      </div>
    );
  }

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
