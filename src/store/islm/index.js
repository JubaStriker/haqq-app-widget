import create from "zustand";
import produce from "immer";
import Web3 from 'web3';


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
                islmPaymentState: INITIAL_ISLM_STATE,
            }))
        );
    },
    postIslmPayment: async ({ cryptoReceiver, price, sender, provider }) => {
        set(
            produce((state) => ({
                ...state,
                islmPaymentState: {
                    ...state.islmPaymentState,
                    post: {
                        ...INITIAL_ISLM_STATE.post,
                        loading: true,
                    },
                },
            }))
        );

        const etherAmount = price;
        const weiAmount = Web3.utils.toWei(etherAmount.toString(), 'ether');
        var intNumber = parseInt(weiAmount);
        var hexNumber = intNumber.toString(16);

        const to = cryptoReceiver;
        const transactionParameters = {
            to,
            from: sender,
            value: `0x${hexNumber}`,
        };

        try {
            const txHash = await provider?.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });
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
                                data: txHash,
                            },
                        },
                    },
                }))
            );
            return txHash;

        } catch (e) {
            console.log(e);
            set(
                produce((state) => ({
                    ...state,
                    islmPaymentState: {
                        ...state.islmPaymentState,
                        post: {
                            ...INITIAL_ISLM_STATE.post,
                            loading: false,
                            failure: {
                                error: true,
                                message: e.message,
                            },
                        },
                    },
                }))
            );
        }
    },
}));

export default useISLMStore;
