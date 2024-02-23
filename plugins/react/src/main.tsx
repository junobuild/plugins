import ReactDOM from 'react-dom/client';
import App from './App';
import Wrapper from './wrapper';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Wrapper>
    <App />
  </Wrapper>
);
