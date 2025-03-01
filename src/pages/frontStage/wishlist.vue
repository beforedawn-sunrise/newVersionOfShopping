<template>
    <div class="container">
        <div class="center-width">
            <p class="first-title">我的願望清單</p>
            <template v-if="wishList.length !== 0">
                <div class="wishlist-container" v-for="item in wishList">
                    <img :src="item.imageUrl" alt="">
                    <div>
                        <p class="title">{{ item.title }}</p>
                        <p class="content">{{ item.description }}</p>
                        <span class="origin-price">原價:{{ item.origin_price }}</span>
                        <span class="price">{{ item.price }}</span>
                        <p class="content">{{ item.content }}</p>
                    </div>
                    <p v-if="!item">目前沒有願望清單</p>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    min-height: calc(100vh - 68px);
    display: flex;
    justify-content: center;
    background-color: #D0104C;

    .center-width {
        width: 60%;

        .first-title {
            font-size: 30px;
            color: white;
            font-weight: bold;
            text-align: center;
        }

        @include md {
            width: 80%;
        }

        @include sm {
            width: 98%;
        }

        .wishlist-container {
            width: calc(100% - 40px);
            display: flex;
            align-items: center;
            margin: 20px 0px;
            background-color: #FEDFE1;
            border-radius: 10px;
            padding: 20px;



            img {
                width: 150px;
                height: 150px;
                margin-right: 20px;
                border-radius: 10px;
                object-fit: cover;
            }

            @include sm {
                width: calc(100% - 20px);
                padding: 10px;
                margin: 17px 0px;

                img {
                    width: 100px;
                    height: 100px;
                }
            }

            .title {
                font-size: 20px;
                font-weight: bold;
            }

            .content {
                font-size: 16px;
                color: gray;
            }

            .origin-price {
                font-size: 16px;
                text-decoration: line-through;
                color: gray;
            }

            .price {
                font-size: 16px;
            }


        }
    }

}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productManageModel } from '../../interface/productManageModel'

const wishList = ref([] as productManageModel[]);

onMounted(() => {
    wishList.value = JSON.parse(localStorage.getItem("wishlist") || "[]");
})

</script>