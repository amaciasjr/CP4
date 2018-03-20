import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		items: [],
	},
	getters: {
		items: state => state.items,
	},
	mutations: {
		setItems (state, items) {
			state.items = items;
		},
	},
	actions: {
		getItems(context) {
			// console.log("getting items");
			axios.get(":3001/api/items").then(response => {
				context.commit('setItems', response.data);
				return true;
			}).catch(err => {
			});
		},
		addItem(context, item) {
			axios.post(":3001/api/items", item).then(response => {
				return context.dispatch('getItems');
			}).catch(err => {
			});
		},
		updateItem(context, item) {
			axios.put(":3001/api/items/" + item.id, item).then(response => {
				return true;
			}).catch(err => {
			});
		},
		deleteItem(context, item) {
			axios.delete(":3001/api/items/" + item.id).then(response => {
				return context.dispatch('getItems');
			}).catch(err => {
			});
		}
	}
});
