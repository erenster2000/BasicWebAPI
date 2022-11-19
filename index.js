const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const articles = []
app.get('/', (req, res) => {
    res.json('Hello, please change containing of "a" in index.js file with your topic to search.')
})

app.get('/sabah', (req, res) => {
    axios.get('https://www.sabah.com.tr/gundem')
        .then((response) =>{
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("TBMM")',html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url
                })
            })
            res.json(articles)
        }).catch((err) => console.log(err))
})
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))