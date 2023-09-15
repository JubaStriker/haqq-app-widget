import create from "zustand";
import produce from "immer";
import axios from "axios";

const INITIAL_XUMM_STATE = {
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

const useXummStore = create((set, get) => ({
    xummState: INITIAL_XUMM_STATE,
    getXummPaymentPromptAction: async ({ lookId, shop = 'jubair-development-store.myshopify.com' } = {}) => {

        set(
            produce((state) => ({
                ...state,
                xummState: {
                    ...state.xummState,
                    get: {
                        ...INITIAL_XUMM_STATE.get,
                        loading: true,
                    },
                },
            }))
        );
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_xrp_payment?shop=${shop}&id=${lookId}`
            );

            set(
                produce((state) => ({
                    ...state,
                    xummState: {
                        ...state.xummState,
                        get: {
                            ...INITIAL_XUMM_STATE.get,
                            loading: false,
                            success: {
                                data,
                                ok: true,
                            },
                            failure: {
                                error: false,
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
                    xummState: {
                        ...state.xummState,
                        get: {
                            ...INITIAL_XUMM_STATE.get,
                            loading: false,
                            success: {
                                ok: false,
                            },
                            failure: {
                                error: true,
                                message: "Please Verify the Merchant Address",
                            },
                        },
                    },
                }))
            );
        }
    },
    verifyXummPayment: async ({ txid } = {}) => {
        set(
            produce((state) => ({
                ...state,
                xummState: {
                    ...state.xummState,
                    get: {
                        ...INITIAL_XUMM_STATE.get,
                        loading: true,
                    },
                },
            }))
        );
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/verify_xrp_payment?txid=${txid}`
            );

            console.log(data);

            set(
                produce((state) => ({
                    ...state,
                    xummState: {
                        ...state.xummState,
                        get: {
                            ...INITIAL_XUMM_STATE.get,
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
                    xummState: {
                        ...state.xummState,
                        get: {
                            ...INITIAL_XUMM_STATE.get,
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

export default useXummStore;
