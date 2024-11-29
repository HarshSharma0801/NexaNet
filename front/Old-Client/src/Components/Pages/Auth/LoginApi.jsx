import axios from "axios";


const LoginApi = async(data , load , navigate)=>{

try {
 
    await axios.post('/login' , data).then(res=>{
         
        load();
        const main = res.data;
        console.log(main);
        if(main.valid){
           localStorage.setItem("UserData" ,  JSON.stringify(main));
           navigate()
        }
        else{
            return false

        }
      

    })
  
    
} catch (error) {
    console.log(error)
}

}

export default LoginApi