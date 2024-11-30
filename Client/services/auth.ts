import axios from "axios";

interface User {
  name: string;
  email: string;
  password: string;
  username: string;
}

interface LoginUser {
  data: {
    password: string;
    username: string;
  };
  load: () => void;
}

axios.defaults.baseURL = "http://localhost:7070";

export const SignUpService = async (Userdata: User): Promise<boolean> => {
  try {
    const { data } = await axios.post("/signup", Userdata);
    return data.valid;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const LoginService = async (values: LoginUser): Promise<boolean> => {
  try {
    const { data } = await axios.post("/login", values.data);
    values.load();
    if (data.valid) {
      localStorage.setItem("UserData", JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
