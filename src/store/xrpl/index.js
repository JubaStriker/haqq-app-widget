import create from "zustand";
import produce from "immer";


const client = new window.xrpl.Client("wss://s.altnet.rippletest.net:51233");
const wallet = window.xrpl.Wallet.fromSeed("spkKJ7x19doar9wzDMpBsAP9cnA4W");
/* buyyer Seed */
/* Buyyer Address = r9pMWAyz6PpCjRvogLoWmgnc7VVUTaKDRy */

const INITIAL_XRP_STATE = {
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

const useXRPStore = create((set, get) => ({
    xrpPaymentState: INITIAL_XRP_STATE,
    resetXRPPaymentState: () => {
        set(
            produce((state) => ({
                ...state,
                xrpPaymentState: INITIAL_XRP_STATE,
            }))
        );
    },
    postXRPpayment: async ({ XRPMerchantAddress }) => {
        set(
            produce((state) => ({
                ...state,
                xrpPaymentState: {
                    ...state.xrpPaymentState,
                    post: {
                        ...INITIAL_XRP_STATE.post,
                        loading: true,
                    },
                },
            }))
        );
        try {
            await client.connect();
            const prepared = await client.autofill({
                TransactionType: "Payment",
                Account: wallet.address /* buyer address */,
                Amount: window.xrpl.xrpToDrops("100"),
                Destination:
                    "rEDtgTeQZwv6Bf1eYgtBraP4jsSQdZv42C" /* shopify merchant address */,
            });
            const signed = wallet.sign(prepared);
            console.log("Identifying hash:", signed.hash);
            console.log("Signed blob:", signed.tx_blob);
            const tx = await client.submitAndWait(signed.tx_blob);
            console.log("Transaction result:", tx.result.meta.TransactionResult);
            console.log(
                "Balance changes:",
                JSON.stringify(window.xrpl.getBalanceChanges(tx.result.meta), null, 2)
            );
            // console.log(tx);
            set(
                produce((state) => ({
                    ...state,
                    xrpPaymentState: {
                        ...state.xrpPaymentState,
                        post: {
                            ...INITIAL_XRP_STATE.post,
                            loading: false,
                            success: {
                                ok: true,
                                data: {
                                    ...signed,
                                    ...tx,
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
                    xrpPaymentState: {
                        ...state.xrpPaymentState,
                        post: {
                            ...INITIAL_XRP_STATE.post,
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

export default useXRPStore;
