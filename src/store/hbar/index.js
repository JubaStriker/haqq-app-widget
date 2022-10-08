import create from "zustand";
import produce from "immer";
import { HashConnect } from "hashconnect";
import { AccountId, HbarUnit, Hbar, TransferTransaction } from "@hashgraph/sdk";
// import { AwesomeQR } from "awesome-qr";
import axios from "axios";

const INITIAL_WALLET_STATE = {
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

const INITIAL_HBAR_STATE = {
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

let hashConnect = new HashConnect(); //variable to hold an instance of Hashconnect

const useHABRStore = create((set, get) => ({
  hbarWalletState: INITIAL_WALLET_STATE,
  hbarPaymentState: INITIAL_HBAR_STATE,
  resetHBARWalletSate: () => {
    set(
      produce((state) => ({
        ...state,
        hbarWalletState: INITIAL_WALLET_STATE,
      }))
    );
  },
  resetHBARPaymentState: () => {
    set(
      produce((state) => ({
        ...state,
        hbarPaymentState: INITIAL_HBAR_STATE,
      }))
    );
  },

  getHBARWalletConnect: async () => {
    set(
      produce((state) => ({
        ...state,
        hbarWalletState: {
          ...state.hbarWalletState,
          get: {
            ...INITIAL_WALLET_STATE.get,
            loading: true,
          },
        },
      }))
    );
    try {
      const appMetadata = {
        name: "Hbar Shopify Shop",
        description: "Shop the look using HBAR",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png",
      };

      const initData = await hashConnect.init(appMetadata, `${process.env.REACT_APP_HASHCONNECT_NETWORK}` , false);

      // let qrcode = ''
      // const ScanCode = await new AwesomeQR({
      //   text: initData.pairingString,
      //   size: 400,
      //   margin: 16,
      //   maskPattern: 110,
      //   colorLight: "#fff",
      // }).draw().then((dataURL) => {
      //   if(dataURL){
      //     qrcode = dataURL.toString();
      //   }
      // })
      // console.log(qrcode);
      // QR Code has been generated
      // need to display instead of loading spinner
      

      hashConnect.foundExtensionEvent.once((walletMetadata) => {
        hashConnect.connectToLocalWallet(
          initData.pairingString,
          walletMetadata
        );
      });

      let walletAccountID = "";
      hashConnect.pairingEvent.once((pairingData) => {
        pairingData.accountIds.forEach((id) => {
          walletAccountID = id;
        });
        set(
          produce((state) => ({
            ...state,
            hbarWalletState: {
              ...state.hbarWalletState,
              get: {
                ...INITIAL_WALLET_STATE.get,
                loading: false,
                success: {
                  data: {
                    topic: pairingData.topic,
                    accountId: walletAccountID,
                    network: pairingData.network,
                  },
                  ok: true,
                },
              },
            },
          }))
        );
      });
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          hbarWalletState: {
            ...state.hbarWalletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              loading: false,
              success: {
                ok: false,
              },
              failure: {
                error: false,
                message: "Please check your Hashpack wallet app",
              },
            },
          },
        }))
      );
    }
  },

  postHBARpayment: async ({
    topic,
    accountId,
    network,
    lookHbarPrice,
    shop,
  }) => {
    set(
      produce((state) => ({
        ...state,
        hbarPaymentState: {
          ...state.hbarPaymentState,
          post: {
            ...INITIAL_HBAR_STATE.post,
            loading: true,
          },
        },
      }))
    );
    try {
      console.log(lookHbarPrice);

      console.log(shop);
      const walletAddress = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`
      );
      console.log("Wallet Address: ", walletAddress.data.walletAddress);
      const provider = hashConnect.getProvider(network, topic, accountId);
      const signer = hashConnect.getSigner(provider);

      const trans = await new TransferTransaction()
        .addHbarTransfer(
          AccountId.fromString(accountId),
          Hbar.from(-lookHbarPrice, HbarUnit.TINYBAR)
        )
        .addHbarTransfer(
          AccountId.fromString(walletAddress.data.walletAddress),
          Hbar.from(lookHbarPrice, HbarUnit.TINYBAR)
        )
        .freezeWithSigner(signer);

      const resp = await trans.executeWithSigner(signer);
      console.log(resp);

      set(
        produce((state) => ({
          ...state,
          hbarPaymentState: {
            ...state.hbarPaymentState,
            post: {
              ...INITIAL_HBAR_STATE.post,
              loading: false,
              success: {
                data: resp,
                ok: true,
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
          hbarPaymentState: {
            ...state.hbarPaymentState,
            post: {
              ...INITIAL_HBAR_STATE.post,
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

export default useHABRStore;
