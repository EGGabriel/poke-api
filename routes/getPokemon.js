const express = require('express')
const router = express.Router()
const pokemonController = require('../controllers/listPokemons')

router.get('/', pokemonController.listPokemons)
router.get('/info/:name', pokemonController.infoPokemon)
router.get('/info', pokemonController.infoQueryPokemon)

module.exports = router