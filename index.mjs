import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
//root route
app.get('/', async (req, res) => {
    let randomeImage = await fetch('https://pixabay.com/api/?key=20426927-497d14db9c234faf7d0df8317&per_page=50&orientation=horizontal&q=solar%20system');
    let randomeImageData = await randomeImage.json();
    let randomImageURL = randomeImageData.hits[Math.floor(Math.random() * randomeImageData.hits.length)].webformatURL;
    res.render("home.ejs", {image: randomImageURL});
});

app.get('/planetInfo', (req, res) => {
    let planet = req.query.planet;
    let planetInfo = planets[`get${planet}`]();
    if (planet === 'Meteorite') {
        planetInfo.description = planetInfo.meteors;
    } else if (planet === 'Comets' || planet === 'Asteroids') {
        planetInfo.description = planetInfo.def;
    }
    res.render('planet.ejs', { planetInfo, planet })
});

// app.get('/mercury', (req, res) => {
//    let mercuryInfo = planets.getMercury();
//    console.log(mercuryInfo);
//    res.render('mercury.ejs', {mercuryInfo})
// });
app.get('/nasapod', async (req, res) => {
    let today = new Date()
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const dateStr = `${year}-${month}-${day}`;
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${dateStr}`);
    const data = await response.json();


    res.render('planet.ejs', {
        planetInfo: {
            image: data.url,
            description: data.explanation
        },
        planet: 'NASA Picture of the Day'
    });
});

app.listen(3000, () => {
    console.log('server started');
});