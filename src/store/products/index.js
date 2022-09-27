import create from "zustand";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import axios from "axios";

const INITIAL_PRODUCTS_STATE = {
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
};

const useProductsStore = create((set, get) => ({
	products: INITIAL_PRODUCTS_STATE,
	getProducts: async({ products = [], shop } = {}) => {
		set(produce(state => ({
			...state,
			products: {
				...state.products,
				get: {
					...INITIAL_PRODUCTS_STATE.get,
					loading: true,
				}
			}
		})))

		try {
			const ids = products.map(p => {
				if (typeof p === "string") {
					return p.split('/')?.pop()
				}
				return undefined
			}).filter(Boolean);

			const { data } = await axios.get(
				`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_products?shop=${shop}&ids=${ids}`
			);
			set(produce(state => ({
				...state,
				products: {
					...state.products,
					get: {
						...INITIAL_PRODUCTS_STATE.get,
						success: {
							ok: true,
							data,
						}
					}
				}
			})));

			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				products: {
					...state.products,
					get: {
						...INITIAL_PRODUCTS_STATE.get,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR,
						}
					}
				}
			})))
		}
	},
}));

export default useProductsStore;
	
