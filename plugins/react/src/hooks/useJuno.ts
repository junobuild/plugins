import {useContext} from 'react';
import {junoContext} from '../components/junoProvider';

function useJuno() {
  const authContext = useContext(junoContext);
  if (!authContext) {
    throw new Error('is not valid');
  }
  return authContext;
}
export default useJuno;
