import { defineStore } from "pinia";
import type { productManageModel } from "../interface/productManageModel";
import { orderModel } from "../interface/productManageModel";

export const useFrontStageStore = defineStore("frontStageStore", {
  state: () => ({
    productList: [] as productManageModel[],
    SingleProductId: "",
    orderId: "",
    myPiniaOrder: [] as orderModel[],
  }),

  getters: {},

  actions: {
    // async getSingleProduct(id: string) {
    //   this.isLoading = true;
    //   router.push({ path: "/singleproduct", query: { productId: `${id}` } });
    //   await ConnectApi(
    //     "GET",
    //     `https://vue-course-api.hexschool.io/api/lucy104/product/${id}`,
    //     ""
    //   ).then((response) => {
    //     // 如果取得資料成功,就...
    //     console.log("取得單一產品資料");
    //     console.log(response.data);
    //     if (response.data.success) {
    //       // vm.isLoading = false;
    //       /* 取得產品資料 */
    //       this.isLoading = false;
    //       this.singleProduct = response.data.product;
    //       console.log(this.singleProduct);
    //     }
    //   });
    // },
  },
});
