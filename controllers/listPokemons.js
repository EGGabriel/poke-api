const request = require('request-promise')
const redis = require("redis");
const redisClient = redis.createClient();

const getCache = key => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(value));
            }
        });
    });
};

const setCache = (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, "EX", 3600, err => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};


const listPokemons = async(req, res) => {
    const limit = 'limit' in req.query ? req.query.limit : 1
    res.header('Cache-control', 'public, max-age=3600')
    const results = await request({
        url: limit == 1 ? "https://pokeapi.co/api/v2/pokemon/?limit=20" : "https://pokeapi.co/api/v2/pokemon/?limit=20&&offset=" + ((limit - 1) * 20),
        method: 'get',
        json: true
    })

    res.locals.limit = limit
    res.render('listPokemons', {
        results,

    })

}

const infoPokemon = async(req, res) => {
    res.header("Cache-control", "public, max-age=3600");
    let info = {}
    try {
        info = await request({
            url: "https://pokeapi.co/api/v2/pokemon/" + req.params.name,
            method: 'get',
            json: true
        })
    } catch (e) {
        res.render('notFound')
        return false
    }
    res.render('pokemons', {
        info
    })
}

const infoQueryPokemon = async(req, res) => {
    let info = {}
    let linkPokemon = "https://pokeapi.co/api/v2/pokemon/" + req.query.name;

    if (req.query.name === '') {
        res.redirect('/')
        return false
    }

    info = await getCache(linkPokemon)
    if (info) {
        res.render('pokemons', { info })
    } else {
        try {
            info = await request({
                url: linkPokemon,
                method: 'get',
                json: true
            })
        } catch (e) {
            res.render('notFound')
            return false
        }
        await setCache(linkPokemon, JSON.stringify(info))
        res.render('pokemons', {
            info
        })
    }
}

module.exports = {
    listPokemons,
    infoPokemon,
    infoQueryPokemon
}