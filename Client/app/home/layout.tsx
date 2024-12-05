import Sidebar from "../(Components)/Sidebar/sidebar";
import { JoinGroup } from "../(Components)/models/join-group";
const ViewLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-light flex  overflow-hidden ">
        <Sidebar />
        {children}
      </div>
      <JoinGroup />
    </>
  );
};

export default ViewLayout;
