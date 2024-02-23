import {initJuno} from '@junobuild/core';
import {JunoProvider} from './components/junoProvider';
//import AuthContext from "./components/junoProvider";

initJuno({
  satelliteId: ''
});

function App() {
  return (
    <JunoProvider satelliteId={'myId'}>
      <App />
    </JunoProvider>
  );
}
export default App;
