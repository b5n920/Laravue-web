import { ref } from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import { compileTemplate } from "vue/compiler-sfc";
import VueCookies from 'vue-cookies'


const user = ref('');
export default function userSession() {
    
    const errors = ref({});
    const router = useRouter();
    const postUser = ref([]);



    const loginUser = async (data) => {
        try {
            axios.defaults.headers['Authorization'] = `Bearer null`;
            let response = await axios.post('login/', data)
            axios.defaults.withCredentials = true
            console.log(response.data);
            VueCookies.set('Token' , response.data.access_token, "2h") 
            axios.defaults.headers['Authorization'] = `Bearer ${VueCookies.get('Token')}`;
            user.value = response.data.user;
            console.log(user.value);
            // let test = await axios.get("me/"+ response.data.access_token)
            // console.log(test.value);
            await router.push({name:"home"});
            
        } catch(error) {
            if (error.response.status !=200 ){
                errors.value = error.response.data.errors;
            }
        }
    }
    const logoutUser = async (data) => {
        try {
            VueCookies.set('Token' , '.', "1h");
            axios.defaults.headers['Authorization'] = `Bearer null`;
            await axios.post('logout/', data)
            localStorage.clear();
            user.value = '';
            console.log('test')
            
        } catch(error) {
            if (error.response.status == 422){
                errors.value = error.response.data.errors;
            }
        }
    }
    const getUser = async () => {
        if (VueCookies.get('Token')) {
            const response = await axios.get('me');
            user.value = response.data.data;
            console.log(postUser.value);
        }
    
    }

    

    return {
        postUser,
        user,
        loginUser,
        getUser,
        logoutUser,
        errors,
    };
}