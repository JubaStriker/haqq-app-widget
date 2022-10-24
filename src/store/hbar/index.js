import create from "zustand";
import produce from "immer";
import { HashConnect } from "hashconnect";
import {
  AccountId,
  TransferTransaction,
  PublicKey,
  TokenAssociateTransaction,
} from "@hashgraph/sdk";

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

const INITIAL_TOKEN_STATE = {
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

      const initData = await hashConnect.init(
        appMetadata,
        `${process.env.REACT_APP_HASHCONNECT_NETWORK}`,
        false
      );

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

      const accountInfo = await fetch(
        `${process.env.REACT_APP_HEDERA_ACCOUNT_VERIFY}api/v1/accounts?account.id=${accountId}`
      );
      const accountResponse = await accountInfo.json();

      console.log(accountResponse);
      console.log(accountResponse.accounts[0].key.key);

      const key = PublicKey.fromString(accountResponse.accounts[0].key.key);
      console.log("Key: ", key);

      //   const createTokenTx = await new TokenCreateTransaction()
      //   .setTokenName('Sampel Test Token')
      //   .setTokenSymbol('STT')
      //   .setDecimals(0)
      //   .setInitialSupply(10)
      //   .setTreasuryAccountId(accountId)
      //   .setAdminKey(key)
      //   .setSupplyKey(key)
      //   .setWipeKey(key)
      //   .freezeWithSigner(signer);

      //  const submitAssociateTx = await createTokenTx.executeWithSigner(signer);
      //   // const associateReceipt = await submitAssociateTx.getReceipt(signer);

      //   console.log('associate tx Receipt: ', submitAssociateTx);

      // const submitAssociateTx = await associateTx.executeWithSigner(signer);
      // const associateReceipt = await submitAssociateTx.getReceipt(signer);

      // console.log('associate tx Receipt: ', submitAssociateTx);

      const trans = await new TransferTransaction()

        .addTokenTransfer("0.0.46035403", AccountId.fromString(accountId), -4)
        .addTokenTransfer(
          "0.0.46035403",
          AccountId.fromString(walletAddress.data.walletAddress),
          4
        )

        // .addHbarTransfer(
        //   AccountId.fromString(accountId),
        //   Hbar.from(-lookHbarPrice, HbarUnit.TINYBAR)
        // )
        // .addHbarTransfer(
        //   AccountId.fromString(walletAddress.data.walletAddress),
        //   Hbar.from(lookHbarPrice, HbarUnit.TINYBAR)
        // )

        .freezeWithSigner(signer);

      // const transferReceipt = await trans.getReceipt(signer);
      console.log("Transfer tx receipt: ", trans);
      const resp = await trans.executeWithSigner(signer);

      // set(
      //   produce((state) => ({
      //     ...state,
      //     hbarPaymentState: {
      //       ...state.hbarPaymentState,
      //       post: {
      //         ...INITIAL_HBAR_STATE.post,
      //         loading: false,
      //         success: {
      //           data: resp,
      //           ok: true,
      //         },
      //       },
      //     },
      //   }))
      // );
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
  hbarTokenState: INITIAL_TOKEN_STATE,
  hbarAssociateToken: async ({ accountId, network, topic, shop }) => {
    set(
      produce((state) => ({
        ...state,
        hbarTokenState: {
          ...state.hbarTokenState,
          get: {
            ...INITIAL_TOKEN_STATE.get,
            loading: true,
          },
        },
      }))
    );
    try {
      console.log(accountId, network, topic, shop);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`
      );

      console.log(data.walletToken);

      const provider = hashConnect.getProvider(network, topic, accountId);
      const signer = hashConnect.getSigner(provider);

      console.log(signer);

      const associateToken = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([data.walletToken])
        .freezeWithSigner(signer);

      const associateResp = await associateToken.executeWithSigner(signer);

      console.log(associateResp);
      set(
        produce((state) => ({
          ...state,
          hbarTokenState: {
            ...state.hbarTokenState,
            get: {
              ...INITIAL_TOKEN_STATE.get,
              success: {
                ok: true,
                data: {
                  network,
                  topic,
                  accountId,
                  tokenId: data.walletToken,
                  walletAddress: data.walletAddress,
                },
              },
            },
          },
        }))
      );
    } catch (error) {
      set(
        produce((state) => ({
          ...state,
          hbarTokenState: {
            ...state.hbarTokenState,
            get: {
              ...INITIAL_TOKEN_STATE.get,
              failure: {
                error: true,
                message: error.message,
              },
            },
          },
        }))
      );
    }
  },
  hbarPayToken: async ({ network, topic, accountId, tokenId, merchantId }) => {
    set(
      produce((state) => ({
        ...state,
        hbarTokenState: {
          ...state.hbarTokenState,
          get: {
            ...INITIAL_TOKEN_STATE.get,
            loading: true,
          },
        },
      }))
    );
    try {
      const provider = hashConnect.getProvider(network, topic, accountId);
      const signer = hashConnect.getSigner(provider);

      const tokenTransferTx = await new TransferTransaction()
      .addTokenTransfer(tokenId, accountId, -1 )
      .addTokenTransfer(tokenId, merchantId, 1)
      .freezeWithSigner(signer);

      const resp = await tokenTransferTx.executeWithSigner(signer);
      console.log("Finally transfered Token", resp);

      set(
        produce((state) => ({
          ...state,
          hbarTokenState: {
            ...state.INITIAL_TOKEN_STATE,
            get:{
              ...INITIAL_TOKEN_STATE.get,
              success: {
                ok: true,
                data: resp
              }
            }
          }
        }))
      )
    } catch (error) {
      set(
        produce((state) => ({
          ...state,
          hbarTokenState: {
            ...state.hbarTokenState,
            get: {
              ...INITIAL_TOKEN_STATE.get,
              failure: {
                error: true,
                message: error.message,
              },
            },
          },
        }))
      );
    }
  },
}));

export default useHABRStore;
