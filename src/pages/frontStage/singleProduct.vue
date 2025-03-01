<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="container">
        <div class="product-container">
            <div class="product-img" :style="{ backgroundImage: 'url(' + singleProduct.imageUrl + ')' }"></div>
            <div class="right-side">
                <p class="title">{{ singleProduct.title }}</p>
                <p class="description">{{ singleProduct.description }}</p>
                <span class="origin-price">原價:{{ singleProduct.origin_price }}</span>
                <span class="price">售價:{{ singleProduct.price }}</span>
                <p class="content">{{ singleProduct.content }}</p>
                <div class="flex">
                    <p class="quantity">數量:</p>
                    <select v-model="quantity">
                        <option v-for="item in 10" :value="item" :key="item">{{ item }}{{ singleProduct.unit }}</option>
                    </select>
                </div>
                <p class="total">小計 台幣: {{ singleProduct.price * quantity }} 元</p>
                <button type="button" @click="addtoCart">加入購物車</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConnectApi from '../../api/connect';
import { useFrontStageStore } from '../../stores/frontStage';
import { productManageModel } from '../../interface/productManageModel'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const frontStage = useFrontStageStore();
const isLoading = ref(false);
const singleProduct = ref({} as productManageModel);
const quantity = ref(1);

onMounted(async () => {
    await getSingleProduct();
});

const getSingleProduct = async () => {
    await ConnectApi("GET", `https://vue-course-api.hexschool.io/api/lucy104/product/${frontStage.SingleProductId}`, "").then(response => {
        // 如果取得資料成功,就...
        console.log("取得單一產品資料");
        // console.log(response.data);
        if (response.data.success) {
            // vm.isLoading = false;
            /* 取得產品資料 */
            isLoading.value = false;
            singleProduct.value = response.data.product;
            console.log(singleProduct.value);

        }
    })
}

const addtoCart = async () => {
    isLoading.value = true;

    const cartModel = {
        data: {
            product_id: singleProduct.value.id,
            qty: quantity.value,
        }
    }

    await ConnectApi("POST", "https://vue-course-api.hexschool.io/api/lucy104/cart", cartModel).then(response => {
        // 如果取得資料成功,就...
        console.log("加入購物車");
        console.log(response.data);
        if (response.data.success) {
            // vm.isLoading = false;
            /* 取得產品資料 */

            isLoading.value = false;
            alert("已經加入購物車");
        }
    })
}
</script>
<style scoped lang="scss">
.container {
    width: calc(100% - 40px);
    min-height: calc(100% - 40px);
    padding: 20px;
    display: flex;
    justify-content: center;

    .product-container {
        width: 90%;
        display: flex;

        


        .product-img {
            width: calc(65% - 20px);
            height: 520px;
            margin-right: 20px;
            background-position: center center;
            -webkit-background-size: cover;
            background-size: cover;
            // border-radius: 20px;
            cursor: pointer;
        }


        
        .right-side {
            width: 35%;
            height: 100%;

            button {
                width: 100%;
                padding: 5px 0px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #009edc;
                font-size: 16px;
                border: none;
                border-radius: 5px;
                color: #fff;
                font-family: Microsoft JhengHei;
                cursor: pointer;
            }

            .title {
                font-size: 25px;
                font-weight: bold;
                font-family: Microsoft JhengHei;
            }

            .description {
                color: gray;
                font-size: 16px;
                // font-weight: bold;
                font-family: Microsoft JhengHei;
            }

            .content {
                font-size: 20px;
                font-family: Microsoft JhengHei;
            }

            .price {
                font-size: 20px;
                font-weight: bold;
                font-family: Microsoft JhengHei;

            }

            .quantity {
                font-size: 20px;
                margin-right: 10px;
                font-family: Microsoft JhengHei;

            }

            select {
                height: 25px;
                border: 1px solid black;
                border-radius: 5px;
                background-color: #fff;
                font-size: 16px;
                font-family: Microsoft JhengHei;

                option {
                    background-color: #fff;
                    font-size: 20px;
                    font-family: Microsoft JhengHei;

                }
            }

            .origin-price {
                font-family: Microsoft JhengHei;
                color: gray;
                font-size: 16px;
                text-decoration: line-through;
            }

            .total {
                font-size: 20px;

            }

        }

        @include md{
            flex-direction :column;
            .product-img{
                width:100%;
            }

            .right-side {
                width: 100%;
            }
        }

    }

   
}
</style>