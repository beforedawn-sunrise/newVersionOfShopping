<template>
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="modal-container">
        <div class="modal">
            <div class="modal-head">
                <p>建立自己的產品</p>
                <XMarkIcon class="x-icon" @click="closeModal()"></XMarkIcon>
            </div>
            <div class="modal-body">
                <div class="img-space">
                    <p>輸入圖片網址:</p>
                    <input type="text" placeholder="請輸入圖片網址" v-model="tempProduct.imageUrl">

                    <p>或上傳圖片:</p>
                    <input type="file" @change="uploadImg">

                    <img :src="tempProduct.imageUrl" alt="">
                </div>
                <div class="main-space">
                    <p>標題</p>
                    <input type="text" placeholder="請輸入標題" v-model="tempProduct.title">
                    <div class="flex">
                        <div class="calc-50">
                            <p>分類</p>
                            <input type="text" placeholder="請輸入分類" v-model="tempProduct.category">
                        </div>
                        <div class="w-50">
                            <p>單位</p>
                            <input type="text" placeholder="請輸入單位" v-model="tempProduct.unit">
                        </div>
                    </div>
                    <div class="flex">
                        <div class="calc-50">
                            <p>原價</p>
                            <input type="number" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                        </div>
                        <div class="w-50">
                            <p>售價</p>
                            <input type="number" placeholder="請輸入售價" v-model="tempProduct.price">
                        </div>
                    </div>
                    <p>產品描述</p>
                    <textarea placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                    <p>說明內容</p>
                    <textarea placeholder="請輸入說明內容" v-model="tempProduct.content"></textarea>
                    <div class="btn-container">
                        <button type="button" class="cancel-btn" @click="closeModal()">取消</button>
                        <button type="button" class="confirm-btn" @click="confirm()">確認</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;

    @include md {
        justify-content: flex-start;
    }

    .modal {
        width: 900px;
        height: 650px;
        background-color: #fff;
        z-index: 9999;
        border-radius: 20px;


        .modal-head {
            background-color: #009edc;
            // width: 100%;
            height: 45px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0px 20px;

            p {
                color: #fff;
                font-weight: bold;
                font-size: 22px;
                font-family: Microsoft JhengHei;
            }

            .x-icon {
                color: #fff;
                width: 25px;
                height: 25px;
                cursor: pointer;
            }
        }

        .modal-body {
            // width: 100%;
            height: calc(100% - 65px);
            padding: 10px;
            display: flex;
            overflow-y: auto;



            input {
                width: 100%;
                height: 35px;
                border-radius: 5px;
                outline: none;
                border: 1px solid gray;
                font-size: 18px;

                @include md {
                    height: 25px;
                    font-size: 16px;
                }
            }

            textarea {
                width: 100%;
                height: 60px;
                border-radius: 5px;
                outline: none;
                border: 1px solid gray;
                font-size: 18px;

                @include md {
                    height: 50px;
                    font-size: 16px;
                }
            }

            p {
                // font-weight: bold;
                font-size: 16px;
                font-family: Microsoft JhengHei;
            }


            .img-space {
                width: calc(35% - 20px);
                height: 100%;
                margin-right: 20px;
                // background-color: pink;


                img {
                    width: 100%;
                    object-fit: contain;
                }
            }

            .main-space {
                width: 65%;
                height: 100%;

                // background-color: #d2abde;
                .btn-container {
                    margin-top: 20px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;

                    .cancel-btn {
                        background-color: gray;
                        color: #fff;
                        font-size: 18px;
                        outline: none;
                        border: none;
                        margin-right: 20px;
                        padding: 7px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    }

                    .confirm-btn {
                        background-color: #009edc;
                        color: #fff;
                        font-size: 18px;
                        outline: none;
                        border: none;
                        padding: 7px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }

            }

            @include md {
                flex-direction: column;

                .img-space {
                    width: 200px;
                    height: auto;
                    // height: 200px;

                    img {
                        width: 100%;
                        object-fit: cover;
                    }

                }

                .main-space {
                    width: 100%;
                }
            }
        }
    }
}
</style>

<script setup lang="ts">
import { onMounted, ref, PropType } from 'vue';
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { productManageModel } from '../interface/productManageModel';
import ConnectApi from "../api/connect";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import axios from 'axios';
import _ from 'lodash';

const props = defineProps({
    isEdit: {
        type: Boolean,
        required: true
    },
    closeModal: {
        type: Function,
        required: true
    },
    singleProduct: {
        type: Object as PropType<productManageModel>, // 指定類型
        default: () => ({} as productManageModel)
    },
    getProducts: {
        type: Function,
        required: true
    }
});
const tempProduct = ref({
    category: '',
    title: '',
    origin_price: 0,
    price: 0,
    description: '',
    unit: '',
    content: '',
    id: '',
    imageUrl: ''
});
onMounted(() => {
    console.log('singleProduct', props.singleProduct);
    console.log(props.isEdit);
    if (props.isEdit == true) {
        tempProduct.value = _.cloneDeep(props.singleProduct);
        console.log('a', tempProduct.value);
    } else {
        tempProduct.value = {
            category: '',
            title: '',
            origin_price: 0,
            price: 0,
            description: '',
            unit: '',
            content: '',
            id: '',
            imageUrl: ''
        };
    }
})

const isLoading = ref(false);

const uploadImg = async (event: Event) => {
    isLoading.value = true;
    const uploadedFile = (event.target as HTMLInputElement).files?.[0];
    if (uploadedFile) {
        // 利用formData物件來模擬表單上傳
        const formData = new FormData();
        // 將圖片欄位新增進去
        formData.append('file-to-upload', uploadedFile);
        const instance = axios.create();
        // 在這裡直接修改 instance 的 headers
        instance.defaults.headers['Content-Type'] = 'multipart/form-data';

        try {
            // 使用自定義的 Axios instance 進行請求
            const response = await ConnectApi("POST", "https://vue-course-api.hexschool.io/api/lucy104/admin/upload", formData);

            // 如果取得資料成功，就...
            console.log("上傳圖片");
            console.log(response.data);

            if (response.data.success) {
                // 取得圖片網址
                isLoading.value = false;
                // this.$set(this.tempProduct, 'imageUrl', response.data.imageUrl);
                tempProduct.value.imageUrl = response.data.imageUrl;
            }
        } catch (error) {
            console.error(error);
        } finally {
            // 在這裡恢復 instance 的 headers，避免影響其他請求
            delete instance.defaults.headers['Content-Type'];
        }
    }
}


const confirm = async () => {
    if (props.isEdit) {
        isLoading.value = true;
        const requestModel = {
            data: tempProduct.value
        }
        await ConnectApi("PUT", `https://vue-course-api.hexschool.io/api/lucy104/admin/product/${tempProduct.value.id}`, requestModel).then(response => {
            // 如果取得資料成功,就...
            console.log("更新產品");
            console.log(response.data);
            if (response.data.success) {
                isLoading.value = false;
                props.closeModal();
                props.getProducts();
            }
        })
    } else {
        isLoading.value = true;
        const requestModel = {
            data: tempProduct.value
        };
        await ConnectApi("POST", "https://vue-course-api.hexschool.io/api/lucy104/admin/product", requestModel).then(response => {
            // 如果取得資料成功,就...
            console.log("建立產品");
            console.log(response.data);
            if (response.data.success) {
                isLoading.value = false;
                tempProduct.value = {
                    category: '',
                    title: '',
                    origin_price: 0,
                    price: 0,
                    description: '',
                    unit: '',
                    content: '',
                    id: '',
                    imageUrl: ''
                };
                props.closeModal();
                props.getProducts();
            }
        })
    }
}
</script>