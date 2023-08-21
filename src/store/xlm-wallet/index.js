import create from "zustand";
import produce from "immer";
import axios from "axios";
import albedo from "@albedo-link/intent";

const INITIAL_XLM_STATE = {
    post: {
        loading: false,
        success: {
            ok: false,
            data: null,
        },
        failure: {
            error: false,
            message: "",
        },
    },
    get: {
        loading: false,
        success: {
            ok: false,
            data: null,
        },
        failure: {
            error: false,
            message: "",
        },
    },
};

const useXLMStore = create((set, get) => ({
    xlmPaymentState: INITIAL_XLM_STATE,
    resetxlmPaymentState: () => {
        set(
            produce((state) => ({
                ...state,
                xlmPaymentState: INITIAL_XLM_STATE,
            }))
        );
    },
    postXLMpayment: async ({ price }) => {
        console.log(price);
        set(
            produce((state) => ({
                ...state,
                xlmPaymentState: {
                    ...state.xlmPaymentState,
                    post: {
                        ...INITIAL_XLM_STATE.post,
                        loading: true,
                    },
                },
            }))
        );
        try {
            const payment = await albedo.pay({
                amount: price,
                network: process.env.REACT_APP_XLM_TRANSACTION,
                destination: "GAAHE4VBEAU34QXS5PUIX6KQRVM67Z6CSJDX5PFLKA5WASI7BS6MTPDA",
                submit: true,
            });
            set(
                produce((state) => ({
                    ...state,
                    xlmPaymentState: {
                        ...state.xlmPaymentState,
                        post: {
                            ...INITIAL_XLM_STATE.post,
                            loading: false,
                            success: {
                                ok: true,
                                data: {},
                            },
                        },
                    },
                }))
            );
        } catch (e) {
            console.error(e);
            set(
                produce((state) => ({
                    ...state,
                    xlmPaymentState: {
                        ...state.xlmPaymentState,
                        post: {
                            ...INITIAL_XLM_STATE.post,
                            loading: false,
                            success: {
                                ok: false,
                            },
                            failure: {
                                error: false,
                                message: "Please Verify the Merchant Address",
                            },
                        },
                    },
                }))
            );
        }
    },
    verifyXlmPayment: async ({ txid } = {}) => {
        set(
            produce((state) => ({
                ...state,
                xlmPaymentState: {
                    ...state.xlmPaymentState,
                    get: {
                        ...INITIAL_XLM_STATE.post,
                        loading: true,
                    },
                },
            }))
        );
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/verify_xlm_payment?txid=${txid}`
            );

            console.log(data);

            set(
                produce((state) => ({
                    ...state,
                    xlmPaymentState: {
                        ...state.xlmPaymentState,
                        get: {
                            ...INITIAL_XLM_STATE.post,
                            loading: false,
                            success: {
                                data: data,
                                ok: true,
                            },
                        },
                    },
                }))
            );
            return data;
        } catch (e) {
            console.log(e.message);
            set(
                produce((state) => ({
                    ...state,
                    xlmPaymentState: {
                        ...state.xlmPaymentState,
                        get: {
                            ...INITIAL_XLM_STATE.post,
                            loading: false,
                            success: {
                                ok: false,
                            },
                            failure: {
                                error: false,
                                message: "Please Verify the Merchant Address",
                            },
                        },
                    },
                }))
            );
        }
    },
}));

export default useXLMStore;
