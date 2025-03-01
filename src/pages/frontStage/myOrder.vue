<template>
    <div>
        <div class="container">
            <p class="title">我的訂單</p>
            <p class="hint" v-if="myOrder.length == 0">您目前沒有訂單</p>
            <template v-if="myOrder.length > 0">
                <div class="table-container" v-for="(item, index) in myOrder" :key="index">
                    <p class="order-index">訂單 {{ index + 1 }}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>品名</th>
                                <th>數量</th>
                                <th>總價</th>
                                <th>送貨地址</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in item.products" :key="item.id">
                                <td>{{ product.product.title }}</td>
                                <td>{{ product.qty }}</td>
                                <td>{{ product.final_total }}</td>
                                <td>{{ item.user.address }}</td>
                            </tr>
                            <tr>
                                <td>總計:</td>
                                <td></td>
                                <td>{{ item.finalTotal }}</td>
                                <td v-if="item.isPaid == false">
                                    <button type="button" class="confirm-btn"
                                        @click="updatePaidStatus(item)">確認付款</button>
                                </td>
                                <td v-if="item.isPaid">
                                    <p class="text-success">付款完成</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>

    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    // min-width: 600px;
    // overflow-x: auto;
    min-height: calc(100vh - 68px);
    background-color: #D0104C;
    display: flex;
    align-items: center;
    flex-direction: column;

    .title {
        font-size: 35px;
        color: white;
        font-weight: bold;
        text-align: center;
    }

    .hint {
        margin-top: 20px;
        font-size: 35px;
        color: white;
        font-weight: bold;
        text-align: center;
    }

    .table-container {
        margin-top: 30px;
        width: 90%;
        min-width: 90%;
        background-color: #a90337;
        // min-width: 517px;
        // height: calc(100% - 30px);
        // display: flex;
        // justify-content: center;
        // align-items: center;
        border-radius: 20px;
        // overflow-y: auto;
        // overflow-x: scroll;

        .order-index {
            font-size: 20px;
            font-weight: bold;
            font-family: Microsoft JhengHei;
            color: #fff;
            text-align: center;
        }

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
                // position: sticky;
                // top: 0;
                // right: 0;
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


                    .confirm-btn {
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

                    .text-success {
                        font-size: 16px;
                        font-weight: bold;
                        color: green;
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
import { ref, onMounted, nextTick, toRaw } from 'vue';
import { useSignInStore } from '../../stores/signInStore'
import { orderModel } from '../../interface/productManageModel'
import _ from 'lodash';
import { openDB, cursorGetData, cursorGetDataByIndex, updateDB } from '../../composables/indexedDB'
import { useFrontStageStore } from '../../stores/frontStage';


const isLoading = ref(false);
const signIn = useSignInStore();
const frontStage = useFrontStageStore();

const myOrder = ref([] as orderModel[])
const googleInfo = ref({
    name: "",
    picture: "",
    email: "",
    tel: "",
    address: ""
});
onMounted(() => {
    nextTick(async () => {
        let database;

        // const db = await openDB('order', 1);
        // if (cursorGetData(db, 'order') != null) {
        //     const orderData = await cursorGetData(db, 'order');
        //     myOrder.value.push(...orderData);
        // }
        if (frontStage.myPiniaOrder.length === 0) {
            console.log('hello there!');
            await openDB('orderDB', 2).then(async (db: any) => {
                database = db;
                const orderData = await cursorGetData(database, 'orders');
                myOrder.value.push(...orderData); // 展開陣列
                console.log('filter之前', myOrder.value);
                const sessionGoogleInfo = sessionStorage.getItem('sessionGoogleInfo');
                if (sessionGoogleInfo !== null) {
                    googleInfo.value = JSON.parse(sessionGoogleInfo);
                    myOrder.value = myOrder.value.filter(item => item.user.email == googleInfo.value.email);
                    console.log('filter之後', myOrder.value);
                }
            });
        } else {
            myOrder.value = [];
            myOrder.value.push(...frontStage.myPiniaOrder);
            const sessionGoogleInfo = sessionStorage.getItem('sessionGoogleInfo');
            if (sessionGoogleInfo !== null) {
                googleInfo.value = JSON.parse(sessionGoogleInfo);
                myOrder.value = myOrder.value.filter(item => item.user.email == googleInfo.value.email);
                console.log('filter之後', myOrder.value);
            }

        }


    });
})


const updatePaidStatus = async (item: orderModel) => {
    let database;
    const db = await openDB('orderDB', 2);  // 等待數據庫打開
    database = db;
    console.log('x', item);
    const rawItem = toRaw(item);
    rawItem.isPaid = true;
    await updateDB(database, 'orders', rawItem);  // 確保數據存入
    const orderData = await cursorGetData(database, 'orders');
    myOrder.value = [];
    myOrder.value.push(...orderData); // 展開陣列
    myOrder.value = myOrder.value.filter(item => item.user.email == googleInfo.value.email);

}
</script>