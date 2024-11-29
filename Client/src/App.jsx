import { Route, Routes } from "react-router";
import CreateGroup from "./Components/Work/Icons/CreateGroup";
import Login from "./Components/Pages/Auth/Login";
import Work from "./Components/Work/work";
import Main from "./Components/Pages/main";
import YourGroups from "./Components/Work/Icons/YourGroups";
import OnlineUsers from "./Components/Work/Icons/OnlineUser";
import MobileConversations from "./Components/Sidebar/ConversationsMobile";
import Welcome from "./Components/Pages/Welcome";
import SignUp from "./Components/Pages/Auth/SignUp";
import axios from "axios";
import AuthenticateUser from "./Components/Pages/AuthenticateUser";

function App() {
  
  axios.defaults.baseURL = 'http://localhost:5000/';
 

  return (
    <>
      <Routes>
      <Route path="/" element={<AuthenticateUser />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />


        <Route path="/home" element={<Main />}>
          <Route path="/home" element={<Welcome/>} />
          <Route path="/home/createGroup" element={<CreateGroup />} />
          <Route path="/home/YourGroups" element={<YourGroups />} />
          <Route path="/home/OnlineUsers" element={<OnlineUsers />} />
          <Route path="/home/conversations" element={<MobileConversations />} />
          <Route path="/home/chat" element={<Work />} />




        </Route>
      </Routes>
    </>
  );
}

export default App;
