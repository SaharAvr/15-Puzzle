require('dotenv').config({ path: '.env' });

const _ = require('lodash');
const path = require('path');
const express = require('express');
const dbUtils = require('./dbUtils');

const app = express();
const port = process.env.PORT;
const root = path.join(__dirname, '..', 'client', 'build');

app.use(express.json({ extended: false }));

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    next();

});

app.get('/api/configuration', (req, res) => {

    const randomConfiguration = _.shuffle(_.times(16, num => num));

    res.send({ data: randomConfiguration });
    res.end();

});

app.post('/api/record', async (req, res) => {
    
    const record = _.get(req.body, ['data']) || {};
    const { username, moves, time } = record;

    if (!username || !moves || !time) {
        res.sendStatus(403);
        return;
    }

    try {
        await dbUtils.pushRecord(record);
        await dbUtils.updateLeaderboardIfNeeded(record);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }

});

app.get('/api/leaderboard', async (req, res) => {

    try {
        const leaderboard = await dbUtils.getLeaderboard();
        res.send({ data: leaderboard });
    } catch (err) {
        res.sendStatus(500);
    }

});

if (process.env.NODE_ENV === 'production') {  

    app.use(express.static(root));
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root });
    });

}

app.listen(port, () => {
    console.log('Server listening on port', port);
});
