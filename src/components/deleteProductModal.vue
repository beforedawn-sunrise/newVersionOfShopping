<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="modal-container">
        <div class="modal">
            <div class="modal-header">
                <p>刪除產品</p>
            </div>
            <div class="modal-body">
                <p>是否要刪除 {{ productName }}?</p>
                <div class="flex-end">
                    <button type="button" class="cancel-btn" @click="closeDeleteModal()">取消</button>
                    <button type="button" class="delete-btn" @click="deleteProduct()">刪除</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConnectApi from '../api/connect';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { productManageModel } from '../interface/productManageModel';


const isLoading = ref(false);
const props = defineProps({
    closeDeleteModal: {
        type: Function,
        required: true
    },
    getProducts: {
        type: Function,
        required: true
    },
    deleteId: {
        type: String, // 指定類型
        required: true
    },
    products: {
        type: Array as () => productManageModel[],
        default: () => ([])
    },
});
const productName = ref('');
onMounted(() => {
    productName.value = props.products.filter(item => item.id === props.deleteId)[0].title;
});
const deleteProduct = async () => {
    isLoading.value = true;

    await ConnectApi("DELETE", `https://vue-course-api.hexschool.io/api/lucy104/admin/product/${props.deleteId}`, "").then(async (response) => {
        // 如果取得資料成功,就...
        console.log("刪除產品");
        console.log(response.data);
        if (response.data.success) {
            isLoading.value = false;
            await props.closeDeleteModal();
            await props.getProducts();
        }
    })
}
</script>
<style scoped lang="scss">
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;

    .modal {
        background-color: #fff;
        width: 350px;
        height: 150px;
        border-radius: 10px;

        .modal-header {
            width: calc(100% - 15px);
            height: 45px;
            background-color: red;
            // border-radius: 10px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            padding-left: 15px;
            display: flex;
            align-items: center;

            p {
                color: #fff;
                font-weight: bold;
                font-size: 20px;
            }
        }

        .modal-body {
            width: 100%;
            height: calc(100% - 45px);

            p {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                font-family: 'Microsoft JhengHei',
            }

            .flex-end {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .cancel-btn {
                    outline: none;
                    border: none;
                    padding: 5px 20px;
                    background-color: gray;
                    color: #fff;
                    margin-right: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .delete-btn {
                    outline: none;
                    border: none;
                    padding: 5px 20px;
                    background-color: red;
                    color: #fff;
                    margin-right: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>