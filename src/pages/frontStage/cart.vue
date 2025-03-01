<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="container">
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>品名</th>
                        <th>數量</th>
                        <th>單價</th>
                        <th>總價</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cart" :key="item.id">
                        <td><button type="button" class="delete-btn" @click="deleteCarts(item.id)">刪除</button></td>
                        <td>{{ item.product.title }}</td>
                        <td>{{ item.qty }}</td>
                        <td>{{ item.product.price }}</td>
                        <td>{{ item.final_total }}</td>
                    </tr>
                    <tr>
                        <td>總計:</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{ finalTotal }}元</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="details-container">
            <p class="order-details">請填寫: 訂單聯絡人資料</p>
            <p class="details-label">Email :</p>
            <input type="email" v-model="googleInfo.email" readonly>
            <p class="details-label">收件人姓名 :</p>
            <input type="text" v-model="googleInfo.name" readonly>
            <p class="details-label">收件人電話 :</p>
            <input type="tel" v-model="googleInfo.tel">
            <p class="details-label">收件人地址 :</p>
            <input type="text" v-model="googleInfo.address">
            <div class="flex-end">
                <button type="button" @click="createOrder">送出</button>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.container {
    width: 100%;
    min-height: calc(100vh - 68px);
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #D0104C;

    .details-container {
        width: 70%;

        @include sm {
            width: 85%;
        }

        .details-label {
            font-size: 18px;
            color: #fff;
            font-family: Microsoft JhengHei;
        }

        input {
            width: calc(100% - 15px);
            height: 25px;
            font-size: 20px;
            border-radius: 5px;
            border: none;
            outline: none;
            padding-left: 15px;
        }

        textarea {
            width: calc(100% - 15px);
            padding-left: 15px;
            font-size: 20px;
            height: 70px;
            border: none;
            outline: none;
            border-radius: 5px;
        }

        .flex-end {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 20px;
            margin-bottom: 20px;

            button {
                background-color: #FEDFE1;
                outline: none;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                color: #D0104C;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }


    .order-details {
        font-size: 28px;
        color: #fff;
        font-weight: bold;

        @include sm {
            font-size: 20px;
        }
    }

    .table-container {
        margin-top: 30px;
        width: 90%;
        // min-width: 517px;
        height: calc(100% - 30px);
        // display: flex;
        // justify-content: center;
        // align-items: center;
        border-radius: 20px;
        overflow-y: auto;

        @include sm {
            width: 95%;
        }

        table {
            width: 100%;
            height: 80%;
            border-collapse: separate;
            border-spacing: 0;
            position: relative;
            overflow-x: scroll !important;

            // 表格頭樣式
            th {
                background-color: #a90337;
                color: white;
                vertical-align: middle;
                border-bottom: 2px solid white !important;
                width: 100px;
                height: 45px;
                white-space: nowrap;
                position: sticky;
                top: 0;
                right: 0;
                z-index: 1;
                font-size: 16px;
            }

            // 表格主體樣式
            tbody {

                // 表格行樣式
                tr {
                    background-color: white;
                    color: black;


                    &:nth-child(even) {
                        background-color: #FEDFE1;
                        color: black;
                    }

                    &:hover {
                        background-color: #ffc9cd;
                        color: black;
                        // opacity: 0.8;
                    }
                }

                // 表格單元格樣式
                td {
                    padding: 10px 0px;
                    width: 100px;
                    white-space: nowrap;
                    text-align: center;
                    // 調整內邊距和邊框
                    border-bottom: 1px dotted #D0104C;
                    // border: 1px solid #009edc;


                    .edit-btn {
                        // background-color: transparent;
                        // border: 1px solid #009edc;
                        // color: #009edc;
                        font-size: 14px;
                        padding: 3px 10px;
                        background-color: #D0104C;
                        color: white;
                        border: none;
                        outline: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }

                    .delete-btn {
                        // background-color: transparent;
                        // border: 1px solid #dc0000;
                        // color: #dc0000;
                        font-size: 14px;
                        padding: 3px 10px;
                        background-color: #dc0000;
                        color: white;
                        border: none;
                        outline: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import ConnectApi from '../../api/connect';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { productManageModel, cartModel, orderModel } from '../../interface/productManageModel';
import router from '../../router/index';
import { useFrontStageStore } from '../../stores/frontStage'
import { useSignInStore } from '../../stores/signInStore';
import { openDB, addData, cursorGetData, cursorGetDataByIndex } from '../../composables/indexedDB'
import _ from 'lodash';
const signIn = useSignInStore();
const frontStage = useFrontStageStore();
const isLoading = ref(false);

const cart = ref([] as cartModel[]);
const total = ref(0);
const finalTotal = ref(0);

const getCart = async () => {
    isLoading.value = true;
    await ConnectApi("GET", "https://vue-course-api.hexschool.io/api/lucy104/cart", "").then(response => {
        // 如果取得資料成功,就...
        console.log("取得購物車列表");
        console.log(response.data);
        if (response.data.success) {
            // vm.isLoading = false;
            /* 取得產品資料 */
            isLoading.value = false;
            cart.value = response.data.data.carts;
            total.value = response.data.data.total;
            finalTotal.value = response.data.data.final_total;
            //  console.log("cart:" + this.cart)
        }
    })
}
const order = ref([] as orderModel[]);


const orderObject = ref({} as orderModel);
const googleInfo = ref({
    name: "",
    picture: "",
    email: "",
    tel: "",
    address: ""
});
onMounted(() => {
    nextTick(async () => {
        const sessionGoogleInfo = sessionStorage.getItem('sessionGoogleInfo');
        if (sessionGoogleInfo !== null) {
            googleInfo.value = JSON.parse(sessionGoogleInfo);
        }

        await getCart();
    })
})

const createOrder = async () => {
    // isLoading.value = true;
    const data = _.cloneDeep({
        id: Math.floor(Math.random() * 1000),
        products: cart.value,
        user: googleInfo.value,
        isPaid: false,
        finalTotal: finalTotal.value
    });

    console.log('letting go', data);
    let database;

    // await openDB('orderDB', 2).then(async (db: IDBDatabase) => {
    //     database = db;
    //     await addData(db, 'orders', data);
    //     await router.push('/myOrder');
    // });

    try {
        const db = await openDB('orderDB', 2);
        database = db;
        await addData(database, 'orders', data);
        await router.push('/myOrder');      // 確保頁面跳轉
        console.log("Navigation successful!");
    } catch (error) {
        console.error("Error storing data or navigating:", error);
    }

}

const deleteCarts = async (id: string) => {
    isLoading.value = true;

    await ConnectApi("DELETE", `https://vue-course-api.hexschool.io/api/lucy104/cart/${id}`, "").then(async (response) => {
        // 如果取得資料成功,就...
        console.log("移除購物車項目");
        console.log(response.data);
        if (response.data.success) {
            // vm.isLoading = false;
            /* 取得產品資料 */
            isLoading.value = false;
            await getCart();
        }
    })
}
</script>