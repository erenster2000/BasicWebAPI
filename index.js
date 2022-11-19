const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [
    {
        name: "sabah",
        address: "https://www.sabah.com.tr/son-dakika-haberleri",
        base: "https://www.sabah.com.tr"
    },
    {
        name: "halktv",
        address: "https://halktv.com.tr/gundem",
        base: "https://halktv.com.tr"
    },
    {
        name: "tele1",
        address: "https://tele1.com.tr/son-dakika/",
        base: ""
    }
]

const app = express()

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address,)
        .then(response =>{
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("İstanbul")',html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url:newspaper.base +url,
                    source: newspaper.name
                })
            })

        } )

})

app.get('/', (req, res) => {
    res.json('Hello, please change containing of "a" in index.js file with your topic to search.')
})

app.get('/news', (req, res) => {

    res.json(articles)

})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("İstanbul")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))