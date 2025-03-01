<template>
    <div>
        <Carousel v-bind="carouselConfig">
            <Slide v-for="slide in frontStage.productList" :key="slide" class="slide">
                <div class="img-container" :style="{ backgroundImage: 'url(' + slide.imageUrl + ')' }"></div>
            </Slide>

            <template #addons>
                <Navigation />
                <Pagination />
            </template>
        </Carousel>
    </div>
    <div class="container">
        <div class="product-space">
            <div class="product-container">
                <div class="product-card" v-for="(item, index) in frontStage.productList" :key="item.id">
                    <div class="product-img" :style="{ backgroundImage: 'url(' + item.imageUrl + ')' }"
                        @click="getProductId(item.id)"></div>
                    <button type="button" class="wishlist-btn">
                        <HeartIcon class="icon" v-if="item.isInWishList == false" @click="joinToWishList(item.title)" />
                        <HeartSolid class="icon" v-if="item.isInWishList == true" @click="outOfWishList(item.title)" />
                    </button>
                    <div class="product-name">{{ item.title }}</div>
                    <div class="product-name">{{ item.price }}</div>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import { HeartIcon } from "@heroicons/vue/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";
import { useFrontStageStore } from '../../stores/frontStage';
import type { productManageModel } from "../../interface/productManageModel";
import router from '../../router/index';

const frontStage = useFrontStageStore();

const carouselConfig = {
    itemsToShow: 1,
    wrapAround: true
}

const getProductId = (id: string) => {
    router.push({ path: '/singleProduct', query: { productId: `${id}` } });
    frontStage.SingleProductId = id;
}

onMounted(() => {
    // product.value.forEach((item) => {
    //     {
    //         ...item,
    //         isInWishList: false
    //     }
    // });
    nextTick(() => {
        wishList.value = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const newWishList = JSON.parse(localStorage.getItem("wishlist") || "[]");
        for (let item of newWishList) {
            const findIndex = frontStage.productList.findIndex(product => product.id == item.id);
            if (findIndex !== -1) {
                frontStage.productList[findIndex].isInWishList = newWishList[findIndex].isInWishList;
            }
        }
    })
    // console.log(frontStage.productList);
})
const wishList = ref([] as productManageModel[]);

const joinToWishList = (productName: string) => {
    const findIndex = frontStage.productList.findIndex(item => item.title == productName);
    // 這是讓該項的isInWishList愛心亮燈
    frontStage.productList[findIndex].isInWishList = true;
    // 如給該願望清單沒有此項,就push進去
    const wishListIndex = wishList.value.findIndex(item => item.title == frontStage.productList[findIndex].title)
    if (wishListIndex == -1) {
        wishList.value.push(frontStage.productList[findIndex]);
    }

    console.log(wishList.value);
    localStorage.setItem('wishlist', JSON.stringify(wishList.value));
}


const outOfWishList = (productName: string) => {
    const findIndex = frontStage.productList.findIndex(item => item.title == productName);
    // product.value.forEach((item)=>{
    //     return {
    //         ...item,
    //         isInWishList:false
    //     }
    // });
    frontStage.productList[findIndex].isInWishList = false;
    const wishListIndex = wishList.value.findIndex((item: any) => item.title == frontStage.productList[findIndex].title);
    // 如給該願望清單有此項,就slice掉
    if (wishListIndex != -1) {
        wishList.value.splice(wishListIndex, 1);
        localStorage.clear();
        localStorage.setItem('wishlist', JSON.stringify(wishList.value));
    }
    console.log(wishList.value);
}



</script>

<style scoped lang="scss">
.slide {
    width: 100% !important;
    height: 500px;

    .img-container {
        width: 100%;
        height: 100%;
        background-position: center center;
        -webkit-background-size: cover;
        background-size: cover;
    }

}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    background-color: #D0104C;


    .product-space {
        width: 75%;

        @include xxxl {
            width: 95%;
        }

        .product-container {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            .product-card {
                width: calc(25% - 30px);
                height: 325px;
                // background-color: #fff;
                background-color: #FEDFE1;
                padding: 5px;
                border-radius: 20px;
                margin-right: 20px;
                margin-top: 20px;
                position: relative;

                // @include md {
                //     width: calc(33% - 30px);
                // }

                @include md {
                    width: calc(50% - 30px);
                }

                @include xs {
                    width: 100%;
                }

                .wishlist-btn {
                    border: 1px solid gray;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    border-top-right-radius: 20px;

                    .icon {
                        color: #D0104C;
                        width: 35px;
                        height: 35px;
                        margin-left: 5px;
                    }
                }

                .product-img {
                    width: 100%;
                    height: 250px;
                    background-position: center center;
                    -webkit-background-size: cover;
                    background-size: cover;
                    border-radius: 20px;
                    cursor: pointer;

                    &:hover {
                        background-color: #fff;
                        opacity: 0.5;
                    }
                }

                .product-name {
                    color: #D0104C;
                    width: 90%;
                    font-size: 25px;
                    text-align: center;
                    margin-bottom: 10px;
                    font-family: Microsoft JhengHei;

                }
            }
        }
    }

}
</style>