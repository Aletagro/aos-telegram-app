import './App.css';
import { useEffect } from 'react';
import {Route, Routes} from 'react-router-dom';
import Main from './components/Main';
import Catalog from './components/Catalog';
import Army from './components/Army';
import Units from './components/Units';
import Warscroll from './components/Warscroll';

const tg = window.Telegram.WebApp

function App() {
  useEffect(() => {
    tg.ready()
  }, []);

  return <div>
    <Routes>
      <Route index element={<Main />} />
      <Route path={'catalog'} element={<Catalog />} />
      <Route path={'catalog/army'} element={<Army />} />
      <Route path={'catalog/army/units'} element={<Units />} />
      <Route path={'catalog/army/units/warscroll'} element={<Warscroll />} />
    </Routes>
  </div>
}

export default App;