import  useAuth  from "./hooks/useAuth";

export default function Wrapper({children}: {
  children: React.ReactNode;
}) {

  const  user  = useAuth();

  return (
    <>
      {children}
    </>
  ); 
}