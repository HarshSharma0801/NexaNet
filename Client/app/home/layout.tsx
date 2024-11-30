import Sidebar from "../(Components)/Sidebar/sidebar";
const ViewLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-light flex  overflow-hidden ">
        <Sidebar />
        {children}
      </div>
    </>
  );
};

export default ViewLayout;
