import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.13/vue.esm-browser.min.js';

const app = createApp({
    data() {
        return {
            name: {
                username: '',
                password: '',
            }
        }
    },
    methods: {
        login() {
            const api = `https://vue3-course-api.hexschool.io/v2/admin/signin`
            axios.post(api,this.name)
                .then(res=>{
                    const {token,expired} = res.data
                    document.cookie = `hexSchool=${token}; expires=${new Date(expired)}; path=/`;
                    window.location= "products.html"
                })
                .catch(err=>{
                    alert(err.data.message)
                })
        }


    },
    mounted() {

    },
})

app.mount('#app')