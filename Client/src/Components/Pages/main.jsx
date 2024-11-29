import Sidebar from "../Sidebar/sidebar"
import Work from "../Work/work"
import { Outlet } from "react-router"
const Main =()=>{

    return(
        <div className="w-[100vw] h-[100vh] bg-light flex rounded-[20px] overflow-hidden ">
            <Sidebar/>

            <Outlet/>         
        </div>
    )
}

export default Main