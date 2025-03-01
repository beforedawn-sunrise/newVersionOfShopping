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
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in orderProduct" :key="item.id">
                        <td>{{ item.product.title }}</td>
                        <td>{{ item.qty }}/{{ item.product.unit }}</td>
                        <td>{{ item.product.price }}</td>
                        <td>{{ item.final_total }}</td>
                    </tr>
                    <tr>
                        <td>總計</td>
                        <td></td>
                        <td></td>
                        <td>{{ orderFinalTotal }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-container">
            <table>
                <tbody>
                    <tr>
                        <th width="100">Email</th>
                        <td>{{ orderUser.email }}</td>
                    </tr>
                    <tr>
                        <th>姓名</th>
                        <td>{{ orderUser.name }}</td>
                    </tr>
                    <tr>
                        <th>收件人電話</th>
                        <td>{{ orderUser.tel }}</td>
                    </tr>
                    <tr>
                        <th>收件人地址</th>
                        <td>{{ orderUser.address }}</td>
                    </tr>
                    <tr>
                        <th>付款狀態</th>
                        <td>
                            <span v-if="!orderPaidStatus">尚未付款</span>
                            <span v-if="orderPaidStatus" class="text-success">付款完成</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="button" class="confirm-btn" v-if="orderPaidStatus == false" @click="payOrder">確認付款去</button>
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


                }
            }
        }
    }
}

.text-success {
    color: green;
}

.confirm-btn {
    // background-color: transparent;
    // border: 1px solid #dc0000;
    // color: #dc0000;
    font-size: 20px;
    padding: 5px 15px;
    background-color: #2364fa;
    color: white;
    border: none;
    outline: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 20px;
}

.green {
    background-color: green !important;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConnectApi from '../../api/connect';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useFrontStageStore } from '../../stores/frontStage'
import { orderProductModel } from '../../interface/productManageModel'


const frontStage = useFrontStageStore();



const orderFinalTotal = ref(0);
const orderPaidStatus = ref(false);
const orderProduct = ref([] as orderProductModel[])
const orderUser = ref({
    address: "",
    email: "",
    name: "",
    tel: ""
});
const isLoading = ref(false);
const getOrder = async () => {
    isLoading.value = true;

    await ConnectApi("GET", `https://vue-course-api.hexschool.io/api/lucy104/order/${frontStage.orderId}`, "").then(response => {
        // 如果取得資料成功,就...
        console.log("取得訂單");
        console.log(response.data);
        if (response.data.success) {
            /* 取得產品資料 */
            orderFinalTotal.value = response.data.order.total;
            orderPaidStatus.value = response.data.order.is_paid;
            orderProduct.value = response.data.order.products;
            orderUser.value = response.data.order.user;
            isLoading.value = false;
        }
    })
}


const payOrder = async () => {
    isLoading.value = true;

    await ConnectApi("POST", `https://vue-course-api.hexschool.io/api/lucy104/pay/${frontStage.orderId}`, "").then(response => {
        // 如果取得資料成功,就...
        console.log("結帳付款");
        console.log(response.data);
        if (response.data.success) {
            isLoading.value = false;
            orderPaidStatus.value = true;
        }
    })
}

onMounted(async () => {
    await getOrder();
})
</script>