import axios from 'axios'

const SignUpApi = async(data , navigate)=>{


    try {
        await axios.post('/signup' , data).then(res=>{

            const data = res.data;
            console.log(data);
            if(!data.valid){
               return false
            }
            if(data.valid){
                navigate();
               
            }
        })
    } catch (error) {
        console.log(error)
    }

}

export default SignUpApi

