//Dependencias
const express = require('express')
const app = express()
const PORT = 3000
const compression = require('compression')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

//Definindo uma pasta Publica
app.use(express.static('public'))

//Facilitando as Rotas
const index = require('./routes/index')
const getPokemon = require('./routes/getPokemon')
const listItems = require('./routes/listItems')

//Configuando Ejs
app.set('view engine', 'ejs')

app.use('/', index)
app.use('/pokemons', getPokemon)
app.use('/items', listItems)

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})