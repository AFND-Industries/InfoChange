import Price from './components/Price';
import { BitcoinProvider } from './context/BitcoinContext';

import './App.css';

function App() {
  return (
    <BitcoinProvider>
      <Price />
    </BitcoinProvider>
  );
}

export default App;
