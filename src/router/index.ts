import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home-layout",
    component: () => import("../pages/header.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../pages/frontStage/index.vue"),
      },
      {
        path: "singleProduct",
        name: "singleProduct",
        component: () => import("../pages/frontStage/singleProduct.vue"),
      },
      {
        path: "cart",
        name: "cart",
        component: () => import("../pages/frontStage/cart.vue"),
      },
      {
        path: "wishlist",
        name: "wishlist",
        component: () => import("../pages/frontStage/wishlist.vue"),
      },
      {
        path: "myOrder",
        name: "myOrder",
        component: () => import("../pages/frontStage/myOrder.vue"),
      },
    ],
  },
  {
    path: "/backStage",
    name: "backStage-layout",
    component: () => import("../pages/backStage/backStageheader.vue"),
    children: [
      {
        path: "products",
        name: "products",
        component: () => import("../pages/backStage/products.vue"),
      },
      {
        path: "order",
        name: "order",
        component: () => import("../pages/backStage/order.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // const isLogin = sessionStorage.getItem('userToken');
  // if (isLogin) {
  //   next();
  //   if(to.path == '/login') {
  //     alert('已登入')

  //   }
  // } else {
  //   if( to.path !== '/login' && to.path !== '/')
  //     next('/')
  //   else
  //     next()
  // }
  //   next();
  next();
});

export default router;
