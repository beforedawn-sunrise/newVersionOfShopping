import { googleInfoModel } from "../interface/googleSignInModel";

export interface productManageModel {
  category: string;
  title: string;
  origin_price: number;
  price: number;
  description: string;
  unit: string;
  content: string;
  id: string;
  imageUrl: string;
  isInWishList: boolean;
  num: number;
}

export interface cartModel {
  final_total: number;
  id: string;
  product: productManageModel;
  product_id: string;
  qty: number;
  total: number;
}
export interface orderModel {
  id: number;
  products: cartModel[];
  user: googleInfoModel;
  isPaid: boolean;
  finalTotal: number;
}
export interface orderProductModel {
  final_total: number;
  id: string;
  product_id: string;
  qty: number;
  total: number;
  product: productDetailsModel;
}

export interface productDetailsModel {
  category: string;
  description: string;
  id: string;
  imageUrl: string;
  origin_price: string;
  price: string;
  title: string;
  unit: string;
}
