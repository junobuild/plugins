import { ReactNode } from "react"

  interface Layout {
    children?: ReactNode
    user?: any;
  }
  
  function Layout({}: Layout) {
    return <div>Layout</div>
  
  }
  export default Layout