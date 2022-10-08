import create from "zustand";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import axios from "axios";

const INITIAL_COUPONS_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: [],
    },
    failure: {
      error: false,
      message: "",
    },
  },
};

const useCouponsStore = create((set, get) => ({
  couponState: INITIAL_COUPONS_STATE,
  postCouponsAction: async ({ shop } = {}) => {
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
        { shop }
      );
      set(
        produce((state) => ({
          ...state,
          couponState: {
            ...state.couponState,
            get: {
              ...INITIAL_COUPONS_STATE.get,
              success: {
                ok: true,
                data,
              },
            },
          },
        }))
      );

      return data;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          coupons: {
            ...state.couponState,
            get: {
              ...INITIAL_COUPONS_STATE.get,
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
}));

export default useCouponsStore;
