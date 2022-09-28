import react from 'react';
import { Route, Routes } from "react-router-dom"
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/verification/:token' element={<VerificationPage/>}/>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
