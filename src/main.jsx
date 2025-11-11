import { createRoot } from 'react-dom/client';

// fonts
import './assets/fonts/inter/index.css'

// scroll bar
import 'simplebar/dist/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// third-party
import './assets/third-party/apex-chart.css'


// project-imports
import App from './App';
import { ConfigProvider } from './contexts/ConfigContext';

const container = document.getElementById('root');
const root = createRoot(container);

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);