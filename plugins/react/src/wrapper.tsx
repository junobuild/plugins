import useAuth from './hooks/useAuth';
import Layout from './Layout';

interface Props {
  user?: any;
  children: React.ReactNode;
}

function Wrapper({children}: Props, {}) {
  const user = useAuth();

  return <Layout user={user}>{children}</Layout>;
}
export default Wrapper;
