import axios from "axios";

// 定義instance
const instance = axios.create();

instance.interceptors.request.use(
  function (config) {
    if (sessionStorage.getItem("userToken") !== null) {
      // 定義token
      let token: string | undefined;

      // 定義userToken
      const userToken = sessionStorage.getItem("userToken");

      // // 判斷userToken是否為字串
      if (typeof userToken === "string") {
          token = JSON.parse(userToken);
      }
      if (config && config.headers) {
          config.headers["Authorization"] = token;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
 ,);

// 此處的instance為我們create的實體
instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );


  // 此處的instance為我們create的實體
instance.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      if (error.response){
        switch (error.response.status) {
          case 404:
            console.log("你要找的頁面不存在")
            break;
  
          case 500:
            console.log("程式發生問題")
            break;
  
          default:
            console.log(error.message)
        }
      } 
      if (!window.navigator.onLine) {
        alert("網路出了點問題，請重新連線後重整網頁");
        return;
      }
      return Promise.reject(error);
    }
  );

  // 此處的instance為我們create的實體
  //export default function(method, url, data = null, config) {
  export default <T>(method: string, url: string, data:T) => {
    method = method.toLowerCase();
    switch (method) {
      case "post":
        return instance.post(url, data);
      case "get":
        return instance.get(url, { params: data });
      case "delete":
        return instance.delete(url, { params: data });
      case "put":
        return instance.put(url, data);
      case "patch":
        return instance.patch(url, data);
      default:
        console.log(`未知的 method: ${method}`);
        return Promise.reject();
    }
  }