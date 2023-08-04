import create from "zustand";
import produce from "immer";


const nearAPI = require('near-api-js');
const { connect, KeyPair, keyStores, utils } = nearAPI;




const INITIAL_NEAR_STATE = {

    send: {
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

const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();


const useNearStore = create((set) => ({
    nearState: INITIAL_NEAR_STATE,
    sendNear: async (amount, sender, receiver) => {

        set(
            produce((state) => ({
                ...state,
                nearState: {
                    ...state.nearState,
                    send: {
                        ...INITIAL_NEAR_STATE.send,
                        loading: true,
                    },
                },
            }))
        );

        try {
            if (amount && sender) {
                const networkId = 'testnet';
                const nearAmount = utils.format.parseNearAmount(amount);

                const obj = myKeyStore.localStorage;
                const keys = Object.keys(obj);
                const nearAccountKey = obj[keys[0]];
                // sets up an empty keyStore object in memory using near-api-js
                const keyStore = new keyStores.InMemoryKeyStore();
                // creates a keyPair from the private key provided in your .env file
                const keyPair = KeyPair.fromString(nearAccountKey);
                // adds the key you just created to your keyStore which can hold multiple keys
                await keyStore.setKey(networkId, sender, keyPair);

                // configuration used to connect to NEAR
                const config = {
                    networkId,
                    keyStore,
                    nodeUrl: `https://rpc.${networkId}.near.org`,
                    walletUrl: `https://wallet.${networkId}.near.org`,
                    helperUrl: `https://helper.${networkId}.near.org`,
                    explorerUrl: `https://explorer.${networkId}.near.org`
                };

                // connect to NEAR! :) 
                const near = await connect(config);
                // create a NEAR account object
                const senderAccount = await near.account(sender);

                try {
                    // here we are using near-api-js utils to convert octo NEAR back into a floating point
                    console.log(`Sending ${utils.format.formatNearAmount(nearAmount)}Ⓝ from ${sender} to ${receiver}...`);
                    // send those tokens! :)
                    const result = await senderAccount.sendMoney(receiver, nearAmount);
                    // console results
                    console.log('Transaction Results: ', result.transaction);
                    console.log('--------------------------------------------------------------------------------------------');
                    console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
                    console.log(`${config.explorerUrl}/transactions/${result.transaction.hash}`);
                    console.log('--------------------------------------------------------------------------------------------');
                    set(
                        produce(
                            (state) => ({
                                ...state,
                                nearState: {
                                    ...state.nearState,
                                    send: {
                                        ...INITIAL_NEAR_STATE.send,
                                        loading: false,
                                        success: {
                                            ok: true,
                                            data: result.transaction,
                                            link: `${config.explorerUrl}/transactions/${result.transaction.hash}`
                                        },
                                    }
                                },
                            })
                        )
                    );

                    return result;
                } catch (error) {
                    // return an error if unsuccessful
                    console.log(error);
                    (set)(
                        produce(
                            (state) => ({
                                ...state,
                                nearState: {
                                    ...state.nearState,
                                    send: {
                                        ...INITIAL_NEAR_STATE.send,
                                        loading: false,
                                        success: {
                                            ok: false,
                                            data: {},

                                        },
                                        failure: {
                                            error: true,
                                            message: error.message,
                                        }
                                    }
                                },
                            })
                        )
                    );
                }


            }
        }
        catch (e) {
            console.error(e);
            localStorage.clear()
            set(
                produce(
                    (state) => ({
                        ...state,
                        nearState: {
                            ...state.nearState,
                            send: {
                                ...INITIAL_NEAR_STATE.send,
                                loading: false,
                                success: {
                                    ok: false,
                                    data: {},

                                },
                                failure: {
                                    error: true,
                                    message: e.message,
                                }
                            }
                        },
                    })
                )
            )
        }
    },


}));

export default useNearStore;