import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_LOOKS_STATE = {
	get: {
		loading: false,
		success: {
			ok: false,
			data: [],
		},
		failure: {
			error: false,
			message: "",
		}
	},
	post: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
	patch: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
	destroy: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	}
};

const useLooksStore = create((set, get) => ({
	looks: INITIAL_LOOKS_STATE,
	getLooks: async({ id = '', shop = window.lookbook.shop } = {}) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				get: {
					...INITIAL_LOOKS_STATE.get,
					loading: true,
				}
			}
		})))

		try {

			// Parse.Cloud.run('get_looks', {
			// 	shop, id
			// })
		
			const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_looks?shop=${shop}&id=${id}`);
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					get: {
						...INITIAL_LOOKS_STATE.get,
						success: {
							ok: true,
							data: data,
						}
					}
				}
			})));
			// console.log(id)
			return data;

		} catch (e) {
			console.error(e)
		
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					get: {
						...INITIAL_LOOKS_STATE.get,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR,
						}
					}
				}
			})))
		}
	},
	postLooks: async ({ id, shop = window.lookbook.shop, name, medias, products = [] }) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				post: {
					...INITIAL_LOOKS_STATE.post,
					loading: true,
				}
			}
		})))

		try {
			
			const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_looks`, {
				shop,
				name,
				medias,
				products
			});
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					post: {
						...INITIAL_LOOKS_STATE.post,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;

		} catch (e) {
			console.error(e)
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					post: {
						...INITIAL_LOOKS_STATE.post,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
	patchLooks: async ({ id, shop = window.lookbook.shop, name, medias, products = [] }) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				patch: {
					...INITIAL_LOOKS_STATE.patch,
					loading: true,
				}
			}
		})))
		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_looks`, {
				id,
				shop,
				name,
				medias,
				products
			});

			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					patch: {
						...INITIAL_LOOKS_STATE.patch,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					patch: {
						...INITIAL_LOOKS_STATE.patch,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
	destroyLooks: async (id) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				destroy: {
					...INITIAL_LOOKS_STATE.destroy,
					loading: true,
				}
			}
		})))

		try {
			const { data } = await axios.delete(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/destroy_looks?id=${id}`);


			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					destroy: {
						...INITIAL_LOOKS_STATE.destroy,
						success: {
							ok: true,
							data,
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					destroy: {
						...INITIAL_LOOKS_STATE.destroy,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	}
}));

export default useLooksStore;
	
