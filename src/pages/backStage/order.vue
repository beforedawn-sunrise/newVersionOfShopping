<template>
    <div>
        <h1 style="text-align: center;">所有訂單</h1>
        <h1 class="hint" v-if="order.length == 0">您目前沒有訂單</h1>

        <div class="filter-space">
            <div class="flex">
                <p>下訂單者姓名搜尋:</p>
                <input type="text" placeholder="請輸入下訂單者姓名" v-model="nameSearch">
            </div>
            <!-- <div class="flex">
                <p>排序:</p>
                <select v-model="sort">
                    <option value="0">售價由高至低</option>
                    <option value="1">售價由低至高</option>
                    <option value="2">按產品分類排序</option>
                </select>
            </div> -->

            <!-- <button type="button" class="add-btn" @click="addProduct">新增產品</button> -->
        </div>
        <div class="container">
            <template v-if="order.length > 0">
                <div class="table-container" v-for="(item, index) in filterOrder" :key="index">
                    <p class="order-index">訂單 {{ index + 1 }}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>email</th>
                                <th>電話</th>
                                <th>地址</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ item.user.name }}</td>
                                <td id="email">{{ item.user.email }}</td>
                                <td>{{ item.user.tel }}</td>
                                <td>{{ item.user.address }}</td>
                            </tr>
                        </tbody>
                    </table>
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
                                <td class="text-suceess" v-if="item.isPaid">已付款完成</td>
                                <td class="text-unPaid" v-if="!item.isPaid">未付款</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
    </div>
</template>
<style scoped lang="scss"></style>
<script setup lang="ts">
import { ref, onMounted ,nextTick,computed } from 'vue';
import { openDB, cursorGetData, cursorGetDataByIndex, updateDB } from '../../composables/indexedDB'
import { orderModel } from '../../interface/productManageModel'

const order = ref([] as orderModel[]);
const nameSearch = ref('');
onMounted(() => {
    nextTick(async () => {
        let database;

        // const db = await openDB('order', 1);
        // if (cursorGetData(db, 'order') != null) {
        //     const orderData = await cursorGetData(db, 'order');
        //     myOrder.value.push(...orderData);
        // }
        await openDB('orderDB', 2).then(async (db: any) => {
            database = db;
            const orderData = await cursorGetData(database, 'orders');
            order.value.push(...orderData); // 展開陣列
        });
    });
})


const filterOrder = computed(() => {
    const filter = order.value.filter(item => item.user.name.includes(nameSearch.value));
    return filter;
});
</script>

<style scoped lang="scss">
.filter-space {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
    margin: 10px;

    @include md {
        flex-direction: column;
        align-items: flex-end;
    }

    @include sm {

        .flex{
            flex-direction: column;
            align-items: flex-end;
        }
    }

    p {
        // color: white;
        font-size: 16px;
        margin-right: 5px;
    }

    input {
        height: 30px;
        color: black;
        outline: none;
        padding-left: 10px;
        margin-right: 20px;
        border-radius: 5px;
    }

    select {
        // width:200px;
        height: 35px;
        border-radius: 5px;
        border: 1px solid #009edc;
        margin-right: 20px;
        outline: none;
    }

    .add-btn {
        height: 35px;
        background-color: #009edc;
        color: white;
        font-weight: bold;
        font-size: 14px;
        padding: 5px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 2px;
    }
}
.container {
    width: 100%;
    // min-width: 600px;
    // overflow-x: auto;
    min-height: calc(100vh - 68px);
    // background-color: #D0104C;
    display: flex;
    align-items: center;
    flex-direction: column;

    .title {
        font-size: 35px;
        color: black;
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
        // min-width: 90%;
        // background-color: #a90337;
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
            // color: #fff;
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
                background-color: #009edc;
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
                        background-color: #caedfb;
                        color: black;
                    }

                    &:hover {
                        background-color: #9de1f2;
                        color: black;
                        // opacity: 0.8;
                    }
                }
                @include xs{
                    #email{
                        width:35px !important;
                        white-space:wrap;
                        word-break: break-all;
                    }
                }
                
                // 表格單元格樣式
                td {
                    padding: 10px 0px;
                    // width: 100px;
                    // white-space: nowrap;
                    text-align: center;
                    // 調整內邊距和邊框
                    border-bottom: 1px dotted #009edc;
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
                        color: green !important;
                    }
                    .text-unPaid {
                        font-size: 16px;
                        font-weight: bold;
                        color: red !important;
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