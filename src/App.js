import { useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Main from './components/Main';
import Catalog from './components/Catalog';
import Army from './components/Army';
import Units from './components/Units';
import Warscroll from './components/Warscroll';
import ArmyInfo from './components/ArmyInfo';
import './App.css';

const tg = window.Telegram.WebApp

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    tg.ready()
  }, []);

  return <div>
    <div className="header" id="myHeader">
    <button type="button" onClick={() => {navigate(-1)}}>
        Назад
      </button>
    </div>
    <Routes>
      <Route index element={<Main />} />
      <Route path={'catalog'} element={<Catalog />} />
      <Route path={'catalog/army'} element={<Army />} />
      <Route path={'catalog/army/units'} element={<Units />} />
      <Route path={'catalog/army/units/warscroll'} element={<Warscroll />} />
      <Route path={'catalog/army/armyInfo'} element={<ArmyInfo />} />
      <Route path={'catalog/army/armyOfRenown'} element={<Army />} />
      <Route path={'catalog/army/armyOfRenown/armyInfo'} element={<ArmyInfo />} />
    </Routes>
  </div>
}

export default App;