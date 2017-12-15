//Dependencias
const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000

//Express Configuration
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

//Ejs Configuration
app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'ejs')

app.get('/', (request,response) =>{
    response.render('index')
})

app.listen(PORT, () => { 
    console.log('Server is running on port ' + PORT)
})