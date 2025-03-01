<template>
    <AddProductModal v-if="openProductModal" :closeModal="closeProductModal" :isEdit="isEdit"
        :singleProduct="singleProduct" :getProducts="getProducts">
    </AddProductModal>
    <DeleteProductModal v-if="isOpenDeleteModal" :closeDeleteModal="closeDeleteModal" :getProducts="getProducts"
        :deleteId="deleteId" :products="filterProducts">
    </DeleteProductModal>
    <div>
        <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
        <h1 style="text-align: center;">產品列表</h1>
        <div class="filter-space">
            <div class="flex">
                <p>產品名稱搜尋:</p>
                <input type="text" placeholder="請輸入產品名稱" v-model="productNameSearch">
            </div>
            <div class="flex">
                <p>排序:</p>
                <select v-model="sort">
                    <option value="0">售價由高至低</option>
                    <option value="1">售價由低至高</option>
                    <!-- <option value="2">按產品分類排序</option> -->
                </select>
            </div>

            <button type="button" class="add-btn" @click="addProduct">新增產品</button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>分類</th>
                        <th>產品名稱</th>
                        <th>原價</th>
                        <th>售價</th>
                        <th>編輯</th>
                        <th>刪除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filterProducts" :key="item.id">
                        <td>{{ item.category }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.origin_price }}</td>
                        <td>{{ item.price }}</td>
                        <td><button type="button" class="edit-btn" @click="edit(item.id)">編輯</button></td>
                        <td><button type="button" class="delete-btn" @click="openDeleteModal(item.id)">刪除</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-container">
            <button type="button" v-if="pagination.has_pre"> 上一頁 </button>
            <button type="button" v-for="item in pagination.total_pages" @click="getProducts(item)"> {{ item }}</button>
            <button type="button" v-if="pagination.has_next">下一頁</button>
        </div>
    </div>
</template>
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

.table-container {
    margin-top: 30px;
    width: 100%;
    min-width: 517px;
    height: calc(100% - 30px);
    // display: flex;
    // justify-content: center;
    // align-items: center;
    border-radius: 20px;
    overflow-y: auto;

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
                    background-color: #caedfb;
                    color: black;
                }

                &:hover {
                    background-color: #9de1f2;
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
                border-bottom: 1px dotted #009edc;
                // border: 1px solid #009edc;


                .edit-btn {
                    // background-color: transparent;
                    // border: 1px solid #009edc;
                    // color: #009edc;
                    font-size: 14px;
                    padding: 3px 10px;
                    background-color: #009edc;
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

.pagination-container {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
        padding: 5px 20px;
        background-color: #fff;
        color: #009edc;
        border: 1px solid #009edc;
        margin: 10px;
        cursor: pointer;
    }


}
</style>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import ConnectApi from '../../api/connect';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { productManageModel } from '../../interface/productManageModel';
import AddProductModal from '../../components/addProductModal.vue';
import DeleteProductModal from '../../components/deleteProductModal.vue';
import _ from 'lodash';

const openProductModal = ref(false);
const products = ref([] as productManageModel[]);
const isLoading = ref(false);
const pagination = ref({
    category: null,
    current_page: 1,
    has_next: true,
    has_pre: false,
    total_pages: 1
});
const getProducts = async (page = 1) => {
    isLoading.value = true;
    await ConnectApi("GET", `https://vue-course-api.hexschool.io/api/lucy104/admin/products?page=${page}`, "").then(response => {
        // 如果取得資料成功,就...
        console.log("取得產品");
        console.log(response.data);
        if (response.data.success) {
            // vm.isLoading = false;
            /* 取得產品資料 */
            isLoading.value = false;
            products.value = response.data.products;
            /* 取得所在分頁 */
            pagination.value = response.data.pagination;
        }
    })
}
onMounted(async () => {
    await getProducts();
});

const productNameSearch = ref('');
const sort = ref(0);
const isEdit = ref(false);
const singleProduct = ref({} as productManageModel);

const addProduct = () => {
    openProductModal.value = true;
    isEdit.value = false;
}

const edit = (id: string) => {
    isEdit.value = true;
    openProductModal.value = true;

    const findIndex = products.value.findIndex(item => item.id == id);
    singleProduct.value = _.cloneDeep(products.value[findIndex]);
    console.log(singleProduct.value);
}
const isOpenDeleteModal = ref(false);
const deleteId = ref('');
const openDeleteModal = (id: string) => {
    isOpenDeleteModal.value = true;
    deleteId.value = id;
}


const filterProducts = computed(() => {
    const filter = products.value.filter(item => item.title.includes(productNameSearch.value));
    console.log(sort.value);
    switch (Number(sort.value)) {
        case 0:
            return [...filter].sort((a: any, b: any) => b.price - a.price);
            break;
        case 1:
            return [...filter].sort((a: any, b: any) => a.price - b.price);
            break;
        // case 2:
        //     const categoryOrder = ["生活用品", "美妝", "數位"];
        //     return [...filter].sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
        //     break;
        default:
            console.log('default');
            return filter; // 預設不排序
    }

});

const closeProductModal = () => {
    openProductModal.value = false;
}
const closeDeleteModal = () => {
    isOpenDeleteModal.value = false;
}
</script>