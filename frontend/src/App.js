import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from "./pages/SignUp";
import {AuthGuard} from "./helpers/AuthGuard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>

            <Route
              path='/'
              element={
                <AuthGuard>
                    <Home />
                </AuthGuard>
            }
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/signup'
              element={<SignUp />}
              />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
