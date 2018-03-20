<template>
	<div class="todo">
		<h1>Keep Track of Birthday Gifts!</h1>
		<main class="main-content-container">
			<div class="image-container">
				<img src="../assets/birthday.jpg"/>
				<p id="photo-credit">
					Photo by <a href="https://unsplash.com/photos/AbLybXyktlk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Bambi Corro</a>
					on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
				</p>
			</div>
			<div class="birthday-list">
				<form v-on:submit.prevent="addItem">
					<input type="text" v-model="text">
					<button type="submit">Add a Birthday</button>
				</form>
				<div class="controls">
					<button v-on:click="showAll()">See All Gifts</button>
					<button v-on:click="showUpcoming()">Gifts To Buy</button>
					<button v-on:click="showPrevious()">Gifts Already Bought</button>
					<button v-on:click="removePrevious()">Remove Bought Gifts</button>
				</div>
				<ul>
					<li v-for="item in filteredItems" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)">
						<input type="checkbox" v-model="item.completed" v-on:click="completeItem(item)" />
						<label v-bind:class="{ completed: item.completed }">{{ item.text }}</label>
						<button v-on:click="deleteItem(item)" class="delete">X</button>
					</li>
				</ul>
				<footer>
					<a href="https://github.com/amaciasjr/CP4">Creative Project 4 Github Repo</a>
				</footer>
			</div>
		</main>

	</div>

</template>

<script>
	export default {
		name: 'Todo',
		data () {
			return {
				text: '',
				show: 'all',
				drag: {},
			}
		},
		computed: {
			items: function() {
				return this.$store.getters.items;
			},
			activeItems: function() {
				return this.items.filter(function(item) {
					return !item.completed;
				});
			},
			filteredItems: function() {
				if (this.show === 'active')
					return this.items.filter(function(item) {
						return !item.completed;
					});
				if (this.show === 'completed')
					return this.items.filter(function(item) {
						return item.completed;
					});
				return this.items;
			},
		},
		created: function() {
			this.getItems();
		},
		methods: {
			getItems: function() {
				this.$store.dispatch('getItems');
			},
			addItem: function() {
				this.$store.dispatch('addItem',{
					text: this.text,
					completed: false
				});
				this.text = "";
			},
			completeItem: function(item) {
				this.$store.dispatch('updateItem',{
					id: item.id,
					text: item.text,
					completed: !item.completed,
					orderChange: false,
				});
			},
			deleteItem: function(item) {
				this.$store.dispatch('deleteItem',{
					id: item.id
				});
			},
			showAll: function() {
				this.show = 'all';
			},
			showUpcoming: function() {
				this.show = 'active';
			},
			showPrevious: function() {
				this.show = 'completed';
			},
			removePrevious: function() {
				this.items.forEach(item => {
					if (item.completed)
						this.deleteItem(item)
				});
			},
			dragItem: function(item) {
				this.drag = item;
			},
			dropItem: function(item) {
				this.$store.dispatch('updateItem',{
					id: this.drag.id,
					text: this.drag.text,
					completed: this.drag.completed,
					orderChange: true,
					orderTarget: item.id
				}).then(response => {
					this.getItems();
					return true;
				}).catch(err => {
				});
			},
		}
	}
</script>

<style scoped>
	h1 {
		text-align: center;
		color: darkred;
	}
	.main-content-container {
		height: fit-content;
		width: fit-content;
		margin-right: auto;
		margin-left: auto;
	}

	.todo .image-container,
	.todo .birthday-list {
		float: left;
	}

	.image-container {
		margin-right: 30px;
	}

	.birthday-list {
		text-align: center;
	}

	ul {
		list-style: none;
		width: fit-content;
		padding: 0;
		margin-right: auto;
		margin-left: auto;
	}

	li {
		background: darkgreen;
		width: 500px;
		min-height: 30px;
		padding: 10px;
		margin-bottom: 10px;
		font-size: 1em;
		display: flex;
		align-items: center;
	}

	.delete {
		display: none;
		margin-left: auto;
	}

	li:hover .delete {
		display: block;
	}

	label {
		width: 400px;
	}

	.completed {
		text-decoration: line-through;
	}

	/* Form */

	input[type=checkbox] {
		transform: scale(1.5);
		margin-right: 10px;
	}

	input[type=text] {
		font-size: 1em;
		width: 350px;
	}

	button {
		background-color: peachpuff;
		font-family: 'Arvo';
		font-size: 1em;
	}
	.controls {
		margin-top: 20px;
	}

	.image-container p {
		margin-top: 0;
		text-align: center;
	}

	footer {
		text-align: center;
	}

	a {
		color: darkblue;
	}
</style>
