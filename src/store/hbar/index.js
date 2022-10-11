import create from "zustand";
import produce from "immer";
import { HashConnect } from "hashconnect";
<<<<<<< HEAD
import { AccountId, HbarUnit, Hbar, TransferTransaction, TokenAssociateTransaction, TokenCreateTransaction, PublicKey, TransactionReceipt } from "@hashgraph/sdk";
import { AwesomeQR } from "awesome-qr";
=======
import { AccountId, HbarUnit, Hbar, TransferTransaction } from "@hashgraph/sdk";
// import { AwesomeQR } from "awesome-qr";
>>>>>>> dc1e919aa10a81cf822cbd902f79f55e5ee25a3a
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

      const initData = await hashConnect.init(appMetadata, `${process.env.REACT_APP_HASHCONNECT_NETWORK}` , false);

<<<<<<< HEAD
=======
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
      

>>>>>>> dc1e919aa10a81cf822cbd902f79f55e5ee25a3a
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

      const accountInfo = await fetch(`${process.env.REACT_APP_HEDERA_ACCOUNT_VERIFY}api/v1/accounts?account.id=${accountId}`)
      const accountResponse = await accountInfo.json()

      console.log(accountResponse);
      console.log(accountResponse.accounts[0].key.key)
      
      const key = PublicKey.fromString(accountResponse.accounts[0].key.key);
      console.log('Key: ', key);

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
<<<<<<< HEAD
        .addTokenTransfer('0.0.46035403', AccountId.fromString(accountId), -4)
        .addTokenTransfer('0.0.46035403', AccountId.fromString(walletAddress.data.walletAddress), 4)
=======
        .addHbarTransfer(
          AccountId.fromString(accountId),
          Hbar.from(-lookHbarPrice, HbarUnit.TINYBAR)
        )
        .addHbarTransfer(
          AccountId.fromString(walletAddress.data.walletAddress),
          Hbar.from(lookHbarPrice, HbarUnit.TINYBAR)
        )
>>>>>>> dc1e919aa10a81cf822cbd902f79f55e5ee25a3a
        .freezeWithSigner(signer);

      // const transferReceipt = await trans.getReceipt(signer);
      console.log('Transfer tx receipt: ', trans);
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
  hbarCreateToken: async ({ topic, accountId, network }) => {
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

      let accountInfo = await fetch(
        "https://testnet.mirrornode.hedera.com/api/v1/accounts/" + accountId,
        { method: "GET" }
      );
      let account = await accountInfo.json();
      console.log(account);

      let key = PublicKey.fromString(account.key.key);
      console.log(key);

      const createTokenTx = await new TokenCreateTransaction()
        .setTokenName("example 1")
        .setTokenSymbol("exe1")
        .setDecimals(0)
        .setInitialSupply(5)
        .setTreasuryAccountId(accountId)
        .setAdminKey(key)
        .setSupplyKey(key)
        .setWipeKey(key)
        .setAutoRenewAccountId(accountId)
        .freezeWithSigner(signer);

      const createReceipt = await createTokenTx.executeWithSigner(signer);
      console.log("Created Receipt: ", createReceipt);

      let txId = createReceipt.transactionId;
      let respId = txId.replace(/[^\d+]/g, "-");
      let respid = respId.replace("-", ".");
      let transId = respid.replace("-", ".");

      console.log("Transaction Id: ", transId);
      try {
        let transactionResponse = await fetch(
          `https://testnet.mirrornode.hedera.com/api/v1/transactions/${transId}`, // getting CORS Error on this API Call
          { method: "GET" }
        )

        console.log(transactionResponse);
      } catch (error) {
        console.log(error);
      }

      
     
    } catch (error) {
      console.log(error)
    }
  },
}));

export default useHABRStore;
