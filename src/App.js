import { useEffect } from 'react';
import {Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import Main from './components/Main';
import Catalog from './components/Catalog';
import Army from './components/Army';
import Units from './components/Units';
import Warscroll from './components/Warscroll';
import ArmyInfo from './components/ArmyInfo';
import RegimentsOfRenownList from './components/RegimentsOfRenownList';
import RegimentOfRenown from './components/RegimentOfRenown';
import Search from './components/Search';
import CoreDocuments from './components/CoreDocuments';
import RuleSections from './components/RuleSections';
import RuleChapters from './components/RuleChapters';
import Rules from './components/Rules';
import Manifestations from './components/Manifestations';
import './App.css';

const tg = window.Telegram.WebApp

function App() {
  const {pathname} = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    tg.ready()
  }, []);

  return <div>
    <div className="header" id="myHeader">
      <button type="button" onClick={() => {navigate(-1)}}>
        Назад
      </button>
      {pathname !== '/search'
        ? <button type="button" onClick={() => {navigate('search')}}>
          Поиск
        </button>
        : null
      }
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
      <Route path={'regimentOfRenownList'} element={<RegimentsOfRenownList />} />
      <Route path={'regimentOfRenownList/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'regimentOfRenownList/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'search'} element={<Search />} />
      <Route path={'search/warscroll'} element={<Warscroll />} />
      <Route path={'coreDocuments'} element={<CoreDocuments />} />
      <Route path={'coreDocuments/ruleSections'} element={<RuleSections />} />
      <Route path={'coreDocuments/ruleSections/ruleChapters'} element={<RuleChapters />} />
      <Route path={'coreDocuments/ruleSections/ruleChapters/rules'} element={<Rules />} />
      <Route path={'manifestations'} element={<Manifestations />} />
      <Route path={'manifestations/warscroll'} element={<Warscroll />} />
    </Routes>
  </div>
}

export default App;