import{u as k}from"./signInStore-BFyBjlz4.js";import{o as v,c as m,u as S}from"./indexedDB-C2533RPs.js";import{u as b}from"./frontStage-D6rMD0PX.js";import{d as I,r as f,h as D,E as w,c as n,o as r,a as e,e as c,F as g,J as y,t as i,M as B,_ as O}from"./index-CG6kTogK.js";const x={class:"container"},P={key:0,class:"hint"},G={class:"order-index"},C={key:0},N=["onClick"],F={key:1},J=I({__name:"myOrder",setup(E){f(!1),k();const p=b(),l=f([]),d=f({name:"",picture:"",email:"",tel:"",address:""});D(()=>{w(async()=>{let u;if(p.myPiniaOrder.length===0)console.log("hello there!"),await v("orderDB",2).then(async t=>{u=t;const s=await m(u,"orders");l.value.push(...s),console.log("filter之前",l.value);const a=sessionStorage.getItem("sessionGoogleInfo");a!==null&&(d.value=JSON.parse(a),l.value=l.value.filter(o=>o.user.email==d.value.email),console.log("filter之後",l.value))});else{l.value=[],l.value.push(...p.myPiniaOrder);const t=sessionStorage.getItem("sessionGoogleInfo");t!==null&&(d.value=JSON.parse(t),l.value=l.value.filter(s=>s.user.email==d.value.email),console.log("filter之後",l.value))}})});const _=async u=>{let t;t=await v("orderDB",2),console.log("x",u);const a=B(u);a.isPaid=!0,await S(t,"orders",a);const o=await m(t,"orders");l.value=[],l.value.push(...o),l.value=l.value.filter(h=>h.user.email==d.value.email)};return(u,t)=>(r(),n("div",null,[e("div",x,[t[4]||(t[4]=e("p",{class:"title"},"我的訂單",-1)),l.value.length==0?(r(),n("p",P,"您目前沒有訂單")):c("",!0),l.value.length>0?(r(!0),n(g,{key:1},y(l.value,(s,a)=>(r(),n("div",{class:"table-container",key:a},[e("p",G,"訂單 "+i(a+1),1),e("table",null,[t[3]||(t[3]=e("thead",null,[e("tr",null,[e("th",null,"品名"),e("th",null,"數量"),e("th",null,"總價"),e("th",null,"送貨地址")])],-1)),e("tbody",null,[(r(!0),n(g,null,y(s.products,o=>(r(),n("tr",{key:s.id},[e("td",null,i(o.product.title),1),e("td",null,i(o.qty),1),e("td",null,i(o.final_total),1),e("td",null,i(s.user.address),1)]))),128)),e("tr",null,[t[1]||(t[1]=e("td",null,"總計:",-1)),t[2]||(t[2]=e("td",null,null,-1)),e("td",null,i(s.finalTotal),1),s.isPaid==!1?(r(),n("td",C,[e("button",{type:"button",class:"confirm-btn",onClick:o=>_(s)},"確認付款",8,N)])):c("",!0),s.isPaid?(r(),n("td",F,t[0]||(t[0]=[e("p",{class:"text-success"},"付款完成",-1)]))):c("",!0)])])])]))),128)):c("",!0)])]))}}),L=O(J,[["__scopeId","data-v-97634d07"]]);export{L as default};
