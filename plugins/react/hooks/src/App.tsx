import { useContext } from "react";
import { AuthContext  } from "./context/authContext";
//import AuthContext from "./components/junoProvider";

function App() {
  
  const  user = useContext(AuthContext);
  
  return  <div>[user]</div>
  
}
export default App;


