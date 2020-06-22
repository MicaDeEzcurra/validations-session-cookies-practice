const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	root: (req, res) => {
		let visited = products.filter(function(product){
			return product.category == 'visited'
		});

		let inSale = products.filter(function (product) {
			return product.category == 'in-sale'
		});
		
		res.render('index', {visited, inSale, toThousand})
	},
	search: (req, res) => {
		let productoBuscado = req.query.keywords;

		let productsArray = products.filter(e => e.name == productoBuscado);

		res.render('results', {products: productsArray});
	},
};

module.exports = controller;
