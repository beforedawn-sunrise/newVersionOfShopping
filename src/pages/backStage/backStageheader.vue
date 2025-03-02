<template>
    <nav>
        <Bars3Icon class="icon hamburger" @click="isSlide = !isSlide" />
        <p class="mobile-title">管理系統</p>
        <div class="md-backdrop" @click="isSlide = false" v-if="isSlide == true"></div>
        <ul :class="{ 'active': isSlide == true }">
            <li>
                <p class="pc-title">管理系統</p>
            </li>
            <li @click="router.push('/backStage/products'), isSlide = false">產品管理</li>
            <li @click="router.push('/backStage/order'), isSlide = false">訂單管理</li>
        </ul>
        <button type="button" class="logout-btn" @click="adminLogout">登出</button>
    </nav>
    <router-view></router-view>
</template>
<style scoped lang="scss">
nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: black;
    width: 100%;
    height: 68px;
    margin: 0px !important;

    @include md {
        .md-backdrop {
            position: fixed;
            top: 68px;
            left: 0;
            width: 100%;
            height: 100vh;
            min-height: 100vh;
            background-color: rgba($color: #ffffff, $alpha: 0.5);
            z-index: 999;
        }
    }

    .hamburger {
        display: none;

        @include sm {
            display: block;
        }
    }

    .icon {
        color: white;
        width: 35px;
        height: 35px;
        margin-left: 20px;
        cursor: pointer;

        @include xs {
            width: 20px;
            height: 20px;
        }
    }


    .pc-title {
        color: white;
        font-size: 30px;
        font-weight: bold;
        font-family: Microsoft JhengHei;

        @include sm {
            display: none;
        }
    }

    .mobile-title {
        display: none;
        color: white;
        font-size: 30px;
        font-weight: bold;
        font-family: Microsoft JhengHei;

        @include sm {
            display: block;
        }

        @include xs {
            font-size: 20px;
        }
    }

    ul {
        display: flex;
        align-items: center;

        &.active {
            left: 0px;
        }

        li {
            list-style: none;
            font-size: 16px;
            color: white;
            margin-right: 20px;
            cursor: pointer;
        }

        @include sm {
            position: fixed;
            top: 50px;
            left: -55%;
            width: 45%;
            min-height: 100%;
            flex-direction: column;
            // align-items: flex-start;
            justify-content: flex-start;
            background-color: black;
            transition: all 0.8s ease-in;
            z-index: 999999;

            li {
                display: block;
                font-size: 25px;
                width: 100%;
                margin-top: 10px;

                &:hover {
                    background-color: gray;
                }
            }


        }
    }



    .logout-btn {
        background-color: gray;
        color: white;
        font-size: 20px;
        padding: 5px 10px;
        margin-right: 20px;
        border-radius: 5px;
        cursor: pointer;

        @include xs {
            font-size: 16px;
            padding: 5px;
        }
    }
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import router from '../../router/index'
import { Bars3Icon } from "@heroicons/vue/24/solid";
import ConnectApi from '../../api/connect';
import { useSignInStore } from '../../stores/signInStore';

const login = useSignInStore();

const isSlide = ref(false);

const adminLogout = async () => {
    await ConnectApi("POST", "https://vue-course-api.hexschool.io/logout", "").then((response) => {
        if (response.data.success) {
            // 狀態碼為0，表示「成功取得資料」
            // this.$reset();
            login.isLogin = false;
            sessionStorage.clear();
            console.log('登出成功');
            router.push('/');
        }
    })
}
</script>