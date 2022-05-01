const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const Ques = require('./models/question.model');

//Require .env
require('dotenv').config();

//database URL
const mongoURL = process.env.mongoURL;

//Making Secure Connection Use This Connection String
//var mongoURL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_NAME}`

mongoose.connect( mongoURL, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() =>
    console.log('MongoDB Connected')
).catch(err =>
    console.log(err)
);

// for(let i = 1; i <= 450306; i++) {

    const URL = "https://stackoverflow.com/questions?tab=newest&pagesize=50&page=1";// + i;

    request(URL, async (err, res, out) => {
        
        if(err) {
            console.log(err);

        } else {
            // console.log(out);
            
            let $ = cheerio.load(out);
            

            $('div.flush-left > div.s-post-summary').each((i, el) => {

                let docs = {
                    view: null,
                    answer: null,
                    vote: null,
                    url: null
                }
                var value="";
                $(el).find('div.s-post-summary--stats > div.s-post-summary--stats-item > span.s-post-summary--stats-item-number').each((i, el) => {
                    value = $(el).text();
                    if(i == 0) {
                        docs.vote = value;
                    } else if(i == 1) {
                        docs.answer = value;
                    } else {
                        docs.view = value;
                    }
                })

                value = $(el).find('div.s-post-summary--content > h3.s-post-summary--content-title > a').attr('href');
                docs.url = 'https://stackoverflow.com' + value;
                // console.log(docs);
                
                Ques.create(docs, (err, doc) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Successfully stored: ", doc);
                    }
                });
                   
            });
        }
        return;
    });
// }
