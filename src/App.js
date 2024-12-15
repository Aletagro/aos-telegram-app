import { useEffect } from 'react';
import {Route, Routes} from 'react-router-dom';
import Main from './screens/Main';
import MainRules from './screens/MainRules';
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
import SinglePlayer from './singlePlayer/SinglePlayer';
import ChooseBattleplan from './singlePlayer/ChooseBattleplan';
import ChooseTactics from './singlePlayer/ChooseTactics';
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
      <Route path={'mainRules'} element={<MainRules />} />
      <Route path={'mainRules/catalog'} element={<Catalog />} />
      <Route path={'mainRules/catalog/army'} element={<Army />} />
      <Route path={'mainRules/catalog/army/units'} element={<Units />} />
      <Route path={'mainRules/catalog/army/units/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/units/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/armyInfo'} element={<ArmyInfo />} />
      <Route path={'mainRules/catalog/army/armyOfRenown'} element={<Army />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/units'} element={<Units />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/units/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/units/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/armyInfo'} element={<ArmyInfo />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder'} element={<Builder />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/addUnit'} element={<AddUnit />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/addUnit/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/addUnit/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/chooseOption'} element={<ChooseOption />} />
      <Route path={'mainRules/catalog/army/armyOfRenown/builder/chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'mainRules/catalog/army/builder'} element={<Builder />} />
      <Route path={'mainRules/catalog/army/builder/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/builder/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/builder/armyInfo'} element={<ArmyInfo />} />
      <Route path={'mainRules/catalog/army/builder/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'mainRules/catalog/army/builder/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/builder/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/builder/addUnit'} element={<AddUnit />} />
      <Route path={'mainRules/catalog/army/builder/addUnit/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/catalog/army/builder/addUnit/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/catalog/army/builder/chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'mainRules/catalog/army/builder/chooseOption'} element={<ChooseOption />} />
      <Route path={'mainRules/catalog/army/builder/chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'mainRules/regimentOfRenownList'} element={<RegimentsOfRenownList />} />
      <Route path={'mainRules/regimentOfRenownList/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'mainRules/regimentOfRenownList/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/regimentOfRenownList/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'search'} element={<Search />} />
      <Route path={'search/warscroll'} element={<Warscroll />} />
      <Route path={'search/warscroll/calculator'} element={<Calculator />} />
      <Route path={'mainRules/coreDocuments'} element={<CoreDocuments />} />
      <Route path={'mainRules/coreDocuments/ruFAQ'} element={<RuFAQ />} />
      <Route path={'mainRules/coreDocuments/ruleSections'} element={<RuleSections />} />
      <Route path={'mainRules/coreDocuments/ruleSections/ruleChapters'} element={<RuleChapters />} />
      <Route path={'mainRules/coreDocuments/ruleSections/ruleChapters/rules'} element={<Rules />} />
      <Route path={'mainRules/coreDocuments/ruleSections/ruleChapters/battleplan'} element={<Battleplan />} />
      <Route path={'mainRules/manifestations'} element={<Manifestations />} />
      <Route path={'mainRules/manifestations/warscroll'} element={<Warscroll />} />
      <Route path={'mainRules/manifestations/warscroll/calculator'} element={<Calculator />} />
      <Route path={'lists'} element={<Lists />} />
      <Route path={'builder'} element={<Builder />} />
      <Route path={'builder/armyInfo'} element={<ArmyInfo />} />
      <Route path={'builder/warscroll'} element={<Warscroll />} />
      <Route path={'builder/warscroll/calculator'} element={<Calculator />} />
      <Route path={'builder/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'builder/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'builder/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'builder/addUnit'} element={<AddUnit />} />
      <Route path={'builder/chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'builder/chooseOption'} element={<ChooseOption />} />
      <Route path={'builder/chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'chooseGrandAlliance'} element={<ChooseGrandAlliance />} />
      <Route path={'chooseGrandAlliance/chooseFaction'} element={<ChooseFaction />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder'} element={<Builder />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/armyInfo'} element={<ArmyInfo />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/warscroll'} element={<Warscroll />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/warscroll/calculator'} element={<Calculator />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/regimentOfRenown'} element={<RegimentOfRenown />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/regimentOfRenown/warscroll'} element={<Warscroll />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/regimentOfRenown/warscroll/calculator'} element={<Calculator />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/addUnit'} element={<AddUnit />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/addUnit/warscroll'} element={<Warscroll />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/addUnit/warscroll/calculator'} element={<Calculator />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/chooseEnhancement'} element={<ChooseEnhancement />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/chooseOption'} element={<ChooseOption />} />
      <Route path={'chooseGrandAlliance/chooseFaction/builder/chooseWeapon'} element={<ChooseWeapon />} />
      <Route path={'export'} element={<Export />} />
      <Route path={'calculator'} element={<Calculator />} />
      <Route path={'singlePlayer'} element={<SinglePlayer />} />
      <Route path={'singlePlayer/battleplan'} element={<Battleplan />} />
      <Route path={'singlePlayer/chooseTactics'} element={<ChooseTactics />} />
      <Route path={'singlePlayer/chooseBattleplan'} element={<ChooseBattleplan />} />
      <Route path={'singlePlayer/chooseBattleplan/battleplan'} element={<Battleplan />} />
      <Route path={'singlePlayer/army'} element={<Army />} />
      <Route path={'singlePlayer/army/units'} element={<Units />} />
      <Route path={'singlePlayer/army/units/warscroll'} element={<Warscroll />} />
      <Route path={'singlePlayer/army/units/warscroll/calculator'} element={<Calculator />} />
      <Route path={'singlePlayer/army/armyInfo'} element={<ArmyInfo />} />
      <Route path={'singlePlayer/army/armyOfRenown'} element={<Army />} />
      <Route path={'singlePlayer/army/armyOfRenown/units'} element={<Units />} />
      <Route path={'singlePlayer/army/armyOfRenown/units/warscroll'} element={<Warscroll />} />
      <Route path={'singlePlayer/army/armyOfRenown/armyInfo'} element={<ArmyInfo />} />
      <Route path={'developer'} element={<Developer />} />
    </Routes>
  </div>
}

export default App;