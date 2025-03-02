<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="login-container">
        <div class="login-card">
            <div class="hint" v-if="warningMessage != ''">{{ warningMessage }}</div>
            <div class="input-container">
                <p class="login-text">帳號:</p>
                <input type="text" v-model="loginData.username">
            </div>

            <div class="input-container">
                <p class="login-text">密碼:</p>
                <input type="password" v-model="loginData.password">
            </div>
            <div class="input-container">
                <button type="button" class="loginBtn" @click="adminLogin">登入</button>
            </div>
            <hr>

            <div class="input-container">
                <p class="hint-text">一般訪客請用google登入</p>
            </div>
            <div class="input-container">
                <GoogleLogin :callback="callback" />
            </div>
            <!--<div class="input-container">
                <button type="button" class="facebook-btn" @click="facebookLogin">
                    <img src="/facebook.png" class="facebook-logo" alt="">
                    <p>Facebook 登入</p>
                </button>
            </div>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { jwtDecode } from "jwt-decode";
import { useSignInStore } from '../stores/signInStore';
import { useFrontStageStore } from '../stores/frontStage';
import { googleInfoModel } from "../interface/googleSignInModel";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import ConnectApi from '../api/connect';
import router from "../router/index"
import { openDB, cursorGetData } from '../composables/indexedDB'

const login = useSignInStore();
const frontStage = useFrontStageStore();
const loginData = ref({
    username: '',
    password: ''
})
const isLoading = ref(false);

const warningMessage = ref('');

const adminLogin = async () => {
    isLoading.value = true;
    await ConnectApi("POST", "https://vue-course-api.hexschool.io/admin/signin", loginData.value).then((response) => {
        if (response.data.success) {
            login.isLogin = true;
            isLoading.value = false;
            // 將token存入sessionStorage中
            sessionStorage.setItem("userToken", JSON.stringify(response.data.token));
            router.push('/backStage/products');
        } else {
            isLoading.value = false;
            warningMessage.value = response.data.message;
        }
    })
}

const callback = async (response: any) => {
    if (response.credential) {
        const credential: googleInfoModel = jwtDecode(response.credential);
        console.log(credential);
        login.googleInfo = {
            name: credential.name,
            picture: credential.picture,
            email: credential.email,
            tel: '',
            address: ''
        }
        login.isLogin = true;
        sessionStorage.setItem('sessionIsLogin', JSON.stringify(true));
        sessionStorage.setItem('sessionGoogleInfo', JSON.stringify(login.googleInfo));
        window.dispatchEvent(new Event('sessionUpdated'));

        let database;
        await openDB('orderDB', 2).then(async (db: any) => {
            database = db;
            const orderData = await cursorGetData(database, 'orders');
            frontStage.myPiniaOrder.push(...orderData); // 展開陣列
        });
        location.reload();
    }

    // This callback will be triggered when the user selects or login to
    // his Google account from the popup
    //   console.log("Handle the response", response)
}
</script>
<style scoped lang="scss">
.login-container {
    position: fixed;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;

    .login-card {
        width: 400px;
        height: 400px;
        padding: 10px;
        background-color: #FEDFE1;
        border: 1px solid #D0104C;
        z-index: 999;


        @include sm {
            width: 80%;
        }

        .hint {
            background-color: rgba(205, 127, 79, 0.8);
            color: brown;
            font-size: 16px;
            font-weight: bold;
        }

        .facebook-btn {
            margin-top: 20px;
            border: none;
            border-radius: 3px;
            width: 190px;
            height: 38px;
            background-color: #1877f2;
            display: flex;
            align-items: center;
            cursor: pointer;

            img {
                width: 25px;
                height: 25px;
            }

            p {
                margin-left: 20px;
                color: white;
                font-size: 14px;
            }

        }

        .input-container {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            // padding: 10px;

            .login-text {
                color: #D0104C;
                font-size: 22px;
                font-weight: bold;
                margin-right: 10px;
            }

            .hint-text {
                color: #D0104C;
                font-size: 18px;
                font-weight: bold;
                font-family: Microsoft JhengHei;
            }

            input {
                border: none;
                width: 60%;
                height: 35px;
                border-radius: 10px;
                outline: none;
                color: #D0104C;
                padding-left: 20px;
                // font-weight: bold;
                font-size: 16px;
            }

            .loginBtn {
                border: none;
                outline: none;
                width: 80%;
                background-color: #D0104C;
                color: white;
                font-size: 20px;
                border-radius: 5px;
                padding: 5px 0px;
                cursor: pointer;
            }

        }

        hr {
            background-color: #D0104C;
        }
    }
}
</style>