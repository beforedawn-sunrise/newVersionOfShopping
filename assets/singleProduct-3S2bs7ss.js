import{d as f,r as i,h,c as u,o as r,b as m,a as t,u as y,K as S,t as s,w as b,L as x,F as d,J as P,_ as k}from"./index-CG6kTogK.js";import{C as p}from"./connect-DGni7-7n.js";import{u as w}from"./frontStage-D6rMD0PX.js";import{L as C}from"./index-Bi20vY9r.js";const L={class:"container"},q={class:"product-container"},B={class:"right-side"},F={class:"title"},I={class:"description"},M={class:"origin-price"},U={class:"price"},V={class:"content"},D={class:"flex"},E=["value"],N={class:"total"},T=f({__name:"singleProduct",setup(z){const v=w(),l=i(!1),e=i({}),n=i(1);h(async()=>{await _()});const _=async()=>{await p("GET",`https://vue-course-api.hexschool.io/api/lucy104/product/${v.SingleProductId}`,"").then(c=>{console.log("取得單一產品資料"),c.data.success&&(l.value=!1,e.value=c.data.product,console.log(e.value))})},g=async()=>{l.value=!0;const c={data:{product_id:e.value.id,qty:n.value}};await p("POST","https://vue-course-api.hexschool.io/api/lucy104/cart",c).then(a=>{console.log("加入購物車"),console.log(a.data),a.data.success&&(l.value=!1,alert("已經加入購物車"))})};return(c,a)=>(r(),u(d,null,[m(y(C),{active:l.value,"onUpdate:active":a[0]||(a[0]=o=>l.value=o),"can-cancel":!0,"is-full-page":!0},null,8,["active"]),t("div",L,[t("div",q,[t("div",{class:"product-img",style:S({backgroundImage:"url("+e.value.imageUrl+")"})},null,4),t("div",B,[t("p",F,s(e.value.title),1),t("p",I,s(e.value.description),1),t("span",M,"原價:"+s(e.value.origin_price),1),t("span",U,"售價:"+s(e.value.price),1),t("p",V,s(e.value.content),1),t("div",D,[a[2]||(a[2]=t("p",{class:"quantity"},"數量:",-1)),b(t("select",{"onUpdate:modelValue":a[1]||(a[1]=o=>n.value=o)},[(r(),u(d,null,P(10,o=>t("option",{value:o,key:o},s(o)+s(e.value.unit),9,E)),64))],512),[[x,n.value]])]),t("p",N,"小計 台幣: "+s(e.value.price*n.value)+" 元",1),t("button",{type:"button",onClick:g},"加入購物車")])])])],64))}}),O=k(T,[["__scopeId","data-v-b5cb4f39"]]);export{O as default};
