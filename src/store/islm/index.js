import create from "zustand";
import produce from "immer";


const INITIAL_ISLM_STATE = {
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
};

const useISLMStore = create((set, get) => ({
    islmPaymentState: INITIAL_ISLM_STATE,
    resetIslmPaymentState: () => {
        set(
            produce((state) => ({
                ...state,
                xrpPaymentState: INITIAL_ISLM_STATE,
            }))
        );
    },
    postIslmpayment: async ({ XRPMerchantAddress }) => {
        set(
            produce((state) => ({
                ...state,
                xrpPaymentState: {
                    ...state.xrpPaymentState,
                    post: {
                        ...INITIAL_ISLM_STATE.post,
                        loading: true,
                    },
                },
            }))
        );
        try {

            // console.log(tx);
            set(
                produce((state) => ({
                    ...state,
                    islmPaymentState: {
                        ...state.islmPaymentState,
                        post: {
                            ...INITIAL_ISLM_STATE.post,
                            loading: false,
                            success: {
                                ok: true,
                                data: {

                                },
                            },
                        },
                    },
                }))
            );
        } catch (e) {
            console.log(e.message);
            set(
                produce((state) => ({
                    ...state,
                    islmPaymentState: {
                        ...state.islmPaymentState,
                        post: {
                            ...INITIAL_ISLM_STATE.post,
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

export default useISLMStore;
