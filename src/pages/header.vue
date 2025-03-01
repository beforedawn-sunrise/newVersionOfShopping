<template>
    <signInModal v-if="sessionIsLogin == false"></signInModal>
    <!-- <signInModal v-if="isOpenSignIn"></signInModal> -->
    <nav>
        <Bars3Icon class="icon hamburger" @click="isSlide = !isSlide" />
        <p class="md-title" @click="router.push('/')">雲購物</p>
        <ul class="hamburger-menu" :class="{ 'menu-flex': isSlide }">
            <li>
                <p class="pc-title" @click="router.push('/')">雲購物</p>
            </li>
            <li>
                <input type="text" v-model="searchText">
                <button type="button" class="searchBtn" @click="toSearch">
                    <MagnifyingGlassIcon style="color:white; width:20px; height:20px;" />
                </button>
            </li>
        </ul>
        <ul>
            <li>
                <HeartIcon class="icon" @click="router.push('/wishlist')" />
            </li>
            <li>
                <ShoppingBagIcon class="icon" @click="router.push('/cart')" />

            </li>
            <li>
                <img :src="googleInfo.picture" class="google-picture" alt=""
                    v-if="googleInfo.picture !== ''" @click="isOpenPersonalInfo = !isOpenPersonalInfo">
                <UserCircleIcon class="icon" v-if="googleInfo.picture === ''"/>
            </li>
            <!-- <li>
                <p class="hello-name" v-if="google.googleInfo.name != ''">{{ google.googleInfo.name }},您好</p>
            </li> -->
        </ul>
    </nav>
    <div class="personal-container" v-if="isOpenPersonalInfo">
        <p>{{ googleInfo.name }},您好</p>
        <p @click="router.push('/myOrder')">我的訂單</p>
        <p @click="logout">登出</p>
    </div>
    <router-view></router-view>
</template>
<style scoped lang="scss">
nav {
    width: 100%;
    height: 68px;
    background-color: #FEDFE1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px;



    .hamburger {
        display: none;
    }


    .icon {
        color: #D0104C;
        width: 35px;
        height: 35px;
        margin-right: 5px;
        cursor: pointer;

        @include md {
            width: 30px;
            height: 30px;
        }

        @include xs {
            width: 20px;
            height: 20px;
        }
    }

    .md-title {
        font-size: 36px;
        color: #D0104C;
        font-weight: bold;
        margin-right: 20px;
        display: none;

        @include md {
            display: block;
            font-size: 30px;
        }

        @include xs {
            font-size: 25px;
        }
    }

    .pc-title {
        font-size: 36px;
        color: #D0104C;
        font-weight: bold;
        margin-right: 20px;

        @include md {
            display: none;
        }
    }


    @include md {
        justify-content: space-between;

        .hamburger {
            display: block;
        }


        .hamburger-menu {
            position: fixed;
            left: -120%;
            top: 68px;
            width: 75%;
            min-height: 100%;
            // display: none;
            flex-direction: column;
            align-items: start;
            justify-content: flex-start;
            z-index: 9999;
            background-color: #FEDFE1;
            padding: 16px 0px 0px 20px;
            transition: all 0.8s ease-in;

            &.menu-flex {
                // display: flex;
                left: 0;
            }

            li {
                display: flex;
                width: 100%;

                input {
                    width: 80%;
                }
            }


        }
    }

    ul {
        display: flex;

        li {

            list-style: none;
            display: flex;
            align-items: center;

            input {
                height: 35px;
                outline: none;
                border: none;
                background-color: #fff;
                color: #D0104C;
                font-size: 25px;
                padding-left: 15px;
                font-weight: bold;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }

            .searchBtn {
                background-color: #D0104C;
                border: none;
                height: 35px;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
            }

            .google-picture {
                width: 35px;
                height: 35px;
                border-radius: 50%;
                margin-right: 20px;
                cursor: pointer;
            }

            .hello-name {
                color: #D0104C;
                font-size: 16px;
                font-weight: bold;
                font-family: Microsoft JhengHei;

            }


        }


    }
}

.personal-container {
    position: absolute;
    top: 68px;
    right: 5%;
    width: 120px;
    padding: 10px;
    height: 120px;
    background-color: black;
    border-radius: 10px;
    color: #fff;
    z-index: 999999;

    p {
        text-align: center;
        font-size: 16px;

        &:hover {
            background-color: gray;
        }
    }
}
</style>
<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import { MagnifyingGlassIcon, ShoppingBagIcon, UserCircleIcon, Bars3Icon } from "@heroicons/vue/24/solid";
import { HeartIcon } from "@heroicons/vue/24/outline";
import signInModal from '../components/signInModal.vue';
import { useSignInStore } from '../stores/signInStore';
import { useFrontStageStore } from '../stores/frontStage';
import ConnectApi from '../api/connect';
import router from '../router/index';
import { orderModel } from "../interface/productManageModel";


const frontStage = useFrontStageStore();

const isOpenSignIn = ref(false);

const login = useSignInStore();
// const { loginSubmit } = login;
const isOpenPersonalInfo = ref(false);
const isSlide = ref(false);

const searchText = ref('');

const isLoading = ref(false);

// const products = ref([] as productManageModel[])

// 撈一次資料
const getProducts = async () => {
    isLoading.value = true;
    await ConnectApi("GET", "https://vue-course-api.hexschool.io/api/lucy104/products/all", "").then(response => {
        // 如果取得資料成功,就...
        console.log("取得產品");
        console.log(response.data);
        if (response.data.success) {
            // vm.isLoading = false;
            /* 取得產品資料 */
            isLoading.value = false;
            frontStage.productList = response.data.products;

            for (let item of frontStage.productList) {
                item.isInWishList = false;
            }
        }
    })
}

const sessionIsLogin = ref(false);
const googleInfo = ref({
    name: '',
    picture: '',
    email: '',
    tel: '',
    address: ''
})
function updateSession() {
    const login = sessionStorage.getItem('sessionIsLogin');
    if(login !== null){
        console.log('a');
        sessionIsLogin.value = true;
    }
    const info = sessionStorage.getItem('sessionGoogleInfo');
    if(info !== null){
        console.log('b');
        googleInfo.value = JSON.parse(info);
    }
}
onMounted(async () => {
    updateSession();
    window.addEventListener('sessionUpdated', updateSession);
    await getProducts();
})


onUnmounted(() => {
    window.removeEventListener('sessionUpdated', updateSession);
});
// watchEffect(() => {
// });

const logout = ()=>{
    sessionIsLogin.value = false ;
    googleInfo.value = {
        name: '',
        picture: '',
        email: '',
        tel: '',
        address: ''
    };
    sessionStorage.clear();
    localStorage.clear();
    frontStage.myPiniaOrder = [] as orderModel[];
}
const toSearch = () => {
    isSlide.value = false;
    // for (let item of product.value) {
    //     if (searchText.value.includes(item.productName)) {

    //     }
    // }

    frontStage.productList = frontStage.productList.filter(item => item.title.includes(searchText.value));
}
</script>