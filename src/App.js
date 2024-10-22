import { useEffect } from 'react';
import {Route, Routes} from 'react-router-dom';
import Main from './screens/Main';
import Catalog from './screens/Catalog';
import Army from './screens/Army';
import Units from './screens/Units';
import Warscroll from './screens/Warscroll';
import ArmyInfo from './screens/ArmyInfo';
import RegimentsOfRenownList from './screens/RegimentsOfRenownList';
import RegimentOfRenown from './screens/RegimentOfRenown';
import Search from './screens/Search';
import CoreDocuments from './screens/CoreDocuments';
import RuleSections from './screens/RuleSections';
import RuleChapters from './screens/RuleChapters';
import Manifestations from './screens/Manifestations';
import Rules from './screens/Rules';
import Battleplan from './screens/Battleplan';
import Header from './components/Header'
import './App.css';

const tg = window.Telegram.WebApp

function App() {
  useEffect(() => {
    tg.ready()
  }, []);

  return <div>
    <Header />
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
      <Route path={'coreDocuments/ruleSections/ruleChapters/battleplan'} element={<Battleplan />} />
      <Route path={'manifestations'} element={<Manifestations />} />
      <Route path={'manifestations/warscroll'} element={<Warscroll />} />
    </Routes>
  </div>
}

export default App;