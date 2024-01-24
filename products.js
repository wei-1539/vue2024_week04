import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.13/vue.esm-browser.min.js';


// model
let productMyModal = null;
let delMyModal = null;

const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            path: 'wei_rio',
            // 抓api的資料
            products: [],
            // 用於判斷是 『新增 ＆ 編輯』
            isNew: false,
            //蒐集當下資料『新增 ＆ 編輯』
            tempProduct: {
                imagesUrl: [],
            },
            // 分頁
            pagination: {},
        }
    },
    mounted() {
        // 取出token
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexSchool\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        //  當axios 發出api請求時 自動全部將header加入上去
        axios.defaults.headers.common['Authorization'] = token;
        //當網頁都準備好去執行【確認帳號是正常的】
        this.checkUser()
    },
    methods: {
        // 判斷帳號登入成功才把資料取出來
        checkUser() {
            const url = `${this.apiUrl}/v2/api/user/check`
            axios.post(url)
                .then(res => {
                    // alert("登入成功囉～")x
                    this.getData()
                })
                .catch(err => {
                    alert(err.data.message)
                    window.location = "login.html"
                })
        },
        // 取得後台資料
        getData(page=1) {
            const url = `${this.apiUrl}/v2/api/${this.path}/admin/products?page=${page}`
            // console.log(url)
            axios.get(url)
                .then(res => {
                    // console.log(res);
                    this.pagination = res.data.pagination
                    this.products = res.data.products;
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        // 控制modal事件
        openModal(modalStatus, item) {
            // 新增
            if (modalStatus === 'add') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true,
                    productMyModal.show();
            } else if (modalStatus === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false,
                    productMyModal.show();

            } else if (modalStatus === "del") {

                this.tempProduct = item;
                delMyModal.show()
            }
        },
    },

})


// 分頁元件
app.component('pagination', {
    template: "#pagination",
    props: ['pages'],
    methods: {
        emitPages(item){
            this.$emit('emit-pages',item)
        }
    },
})

// 產品新增 / 編輯 元件
app.component('productModal', {
    template: '#productModal',
    // item = 抓tempProduct
    props: ['item', 'isNew'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            path: 'wei_rio',
        }
    },
    mounted() {
        productMyModal = new bootstrap.Modal(document.querySelector("#productModal"));

    },
    methods: {

        // 整合 編輯 ＆ 新增
        updateData() {
            let url = `${this.apiUrl}/v2/api/${this.path}/admin/product`;
            let http = 'post';

            // 利用 isNew 來確認是哪個功能 true ＝post新增  false = put修改
            if (!this.isNew) {
                url = `${this.apiUrl}/v2/api/${this.path}/admin/product/${this.item.id}`
                http = 'put';
            }
            axios[http](url, { data: this.item })
                .then((res) => {
                    alert(res.data.message);
                    productMyModal.hide();
                    this.$emit('upData')
                })
                .catch((err) => {
                    alert(err.data.message)
                })
        },
        // 新增多張圖片
        createImages() {
            this.item.imagesUrl = [];
            this.item.imagesUrl.push('')
        }
    },
})

// 產拼刪除元件
app.component('delModal', {
    template: '#delModal',
    // 抓取外層資料 供元件使用的屬性
    props: ['outItem'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            path: 'wei_rio',
        }
    },
    // 當元素建立好設定modal設定
    mounted() {
        delMyModal = new bootstrap.Modal(document.querySelector("#delProductModal"));
    },
    methods: {
        // 刪除商品
        removeData() {
            const url = `${this.apiUrl}/v2/api/${this.path}/admin/product/${this.outItem.id}`
            axios.delete(url)
                .then(res => {
                    delMyModal.hide()
                    // this.getData()
                    //傳送需求給外層
                    this.$emit('upData')
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // openModal() {
        //     delMyModal.show();
        // }
    },
})
app.mount('#app')