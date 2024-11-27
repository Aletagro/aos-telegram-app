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
import RuFAQ from './screens/RuFAQ';
import RuleChapters from './screens/RuleChapters';
import Manifestations from './screens/Manifestations';
import Rules from './screens/Rules';
import Battleplan from './screens/Battleplan';
import Header from './components/Header';
import Lists from './builder/Lists';
import ChooseGrandAlliance from './builder/ChooseGrandAlliance';
import ChooseFaction from './builder/ChooseFaction';
import Builder from './builder/Builder';
import AddUnit from './builder/AddUnit';
import ChooseEnhancement from './builder/ChooseEnhancement';
import ChooseOption from './builder/ChooseOption';
import ChooseWeapon from './builder/ChooseWeapon';
import Export from './builder/Export';
import Calculator from './calculator/Calculator';
import Developer from './screens/Developer';
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
      <Route path={'catalog/army/units/warscroll/calculator'} element={<Calculator />} />
      <Route path={'catalog/army/armyInfo'} element={<ArmyInfo />} />
      <Route path={'catalog/army/armyOfRenown'} element={<Army />} />
      <Route path={'catalog/army/armyOfRenown/armyInfo'} element={<ArmyInfo />} />
      <Route path={'regimentOfRenownList'} element={<RegimentsOfRenownList />} />
      <Route path={'regimentOfRenownList/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'regimentOfRenownList/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'regimentOfRenownList/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'search'} element={<Search />} />
      <Route path={'search/warscroll'} element={<Warscroll />} />
      <Route path={'search/warscroll/calculator'} element={<Calculator />} />
      <Route path={'coreDocuments'} element={<CoreDocuments />} />
      <Route path={'coreDocuments/ruFAQ'} element={<RuFAQ />} />
      <Route path={'coreDocuments/ruleSections'} element={<RuleSections />} />
      <Route path={'coreDocuments/ruleSections/ruleChapters'} element={<RuleChapters />} />
      <Route path={'coreDocuments/ruleSections/ruleChapters/rules'} element={<Rules />} />
      <Route path={'coreDocuments/ruleSections/ruleChapters/battleplan'} element={<Battleplan />} />
      <Route path={'manifestations'} element={<Manifestations />} />
      <Route path={'manifestations/warscroll'} element={<Warscroll />} />
      <Route path={'manifestations/warscroll/calculator'} element={<Calculator />} />
      <Route path={'lists'} element={<Lists />} />
      <Route path={'lists/builder'} element={<Builder />} />
      <Route path={'lists/builder'} element={<Builder />} />
      <Route path={'lists/builder/warscroll'} element={<Warscroll />} />
      <Route path={'lists/builder/warscroll/calculator'} element={<Calculator />} />
      <Route path={'lists/builder/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'lists/builder/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'lists/builder/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'lists/builder/addUnit'} element={<AddUnit />} />
      <Route path={'lists/builder/chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'lists/builder/chooseOption'} element={<ChooseOption />} />
      <Route path={'lists/builder/chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'lists/chooseGrandAlliance'} element={<ChooseGrandAlliance />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction'} element={<ChooseFaction />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder'} element={<Builder />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/warscroll'} element={<Warscroll />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/warscroll/calculator'} element={<Calculator />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/addUnit'} element={<AddUnit />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/chooseOption'} element={<ChooseOption />} />
      <Route path={'lists/chooseGrandAlliance/chooseFaction/builder/chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'export'} element={<Export />} />
      <Route path={'calculator'} element={<Calculator />} />
      <Route path={'developer'} element={<Developer />} />
    </Routes>
  </div>
}

export default App;