import { createApp } from "vue";
import router from "./router/index";
// @ts-ignore
import { createPinia } from "pinia";
// import i18n from "./i18n/index";
import App from "./App.vue";
import vue3GoogleLogin from "vue3-google-login";
// import "../src/style/public.scss";
const app = createApp(App);
const pinia = createPinia();

const GoogleLoginOptions = {
  clientId:
    "1060886382609-ijojcm74see9gffgq3mn54pa2d6701t5.apps.googleusercontent.com",
};
app.use(vue3GoogleLogin, GoogleLoginOptions);
app.use(router);
// app.use(i18n);
app.use(pinia);

app.mount("#app");
