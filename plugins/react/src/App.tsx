import  { JunoProvider }  from "./components/junoProvider";
import { initJuno } from "@junobuild/core";
//import AuthContext from "./components/junoProvider";

initJuno({
  satelliteId: ''
})

function App() {
  
  return (
  <JunoProvider satelliteId={"myId"}>
  <App />
  </JunoProvider>
  );
  
}
export default App;


