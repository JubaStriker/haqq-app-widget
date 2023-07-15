import create from "zustand";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import axios from "axios";

const INITIAL_COUPONS_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: {},
    },
    failure: {
      error: false,
      message: "",
    },
  },
  post: {
    loading: false,
    success: {
      ok: false,
      data: {},
    },
    failure: {
      error: false,
      message: "",
    },
  }
};

const useCouponsStore = create((set, get) => ({
  couponState: INITIAL_COUPONS_STATE,
  getCouponAction: async ({ txid, shop, lookId } = {}) => {
    set(
      produce((state) => ({
        ...state,
        couponState: {
          ...state.couponState,
          get: {
            ...INITIAL_COUPONS_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_coupon`,
        { txid, shop, lookId }
      );
      set(
        produce((state) => ({
          ...state,
          couponState: {
            ...state.couponState,
            get: {
              ...INITIAL_COUPONS_STATE.get,
              loading: false,
              success: {
                ok: true,
                data,
              },
            },
          },
        }))
      );
      console.log("Coupon store", data);
      return data;
    }
    catch (e) {
      console.error(e);
      set(
        produce((state) => ({
          ...state,
          coupons: {
            ...state.couponState,
            get: {
              ...INITIAL_COUPONS_STATE.get,
              loading: false,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
    }
  },
  postCouponAction: async (code, walletAddress) => {
    set(
      produce((state) => ({
        ...state,
        couponState: {
          ...state.couponState,
          post: {
            ...INITIAL_COUPONS_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/customers_wallet`,
        {
          code: code,
          walletAddress: walletAddress
        }
      );
      set(
        produce((state) => ({
          ...state,
          couponState: {
            ...state.couponState,
            post: {
              ...INITIAL_COUPONS_STATE.get,
              loading: false,
              success: {
                ok: true,
                data,
              },
            },
          },
        }))
      );
      return data;
    }
    catch (e) {
      console.error(e);
      set(
        produce((state) => ({
          ...state,
          coupons: {
            ...state.couponState,
            get: {
              ...INITIAL_COUPONS_STATE.get,
              loading: false,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
    }
  }
}));

export default useCouponsStore;
