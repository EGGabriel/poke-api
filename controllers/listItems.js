const request = require('request-promise')
const redis = require('redis')
const redisClient = redis.createClient()

const getCache = key => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(value))
            }
        })
    })
}


const setCache = (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', 3600, err => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

const listItems = async(req, res) => {
    const limit = "limit" in req.query ? req.query.limit : 1;
    res.header("Cache-control", "public, max-age=3600");

    let link = limit == 1 ?
        "https://pokeapi.co/api/v2/item/?limit=20" : "https://pokeapi.co/api/v2/item/?limit=20&&offset=" +
        (limit - 1) * 20

    let results = {}
    try {
        results = await request({
            url: link,
            method: "get",
            json: true
        })
    } catch (e) {
        res.render('notFound')
        return false
    }
    res.locals.limit = limit;
    res.render("listItems", { results });
}

const infoItems = async(req, res) => {

    let linkInfo = "https://pokeapi.co/api/v2/item/" + req.params.name
    let info = await getCache(linkInfo)

    if (info) {
        res.render("item", { info });
    } else {
        try {
            info = await request({
                url: linkInfo,
                method: "get",
                json: true
            })
        } catch (e) {
            res.render('notFound')
            return false
        }
        await setCache(linkInfo, JSON.stringify(info))
        res.render("item", { info });
    }
}

module.exports = {
    listItems,
    infoItems
}