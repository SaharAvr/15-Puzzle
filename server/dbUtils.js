const _ = require('lodash');
const levelup = require('levelup');
const leveldown = require('leveldown');
const encode = require('encoding-down');

const db = levelup(encode(leveldown('./database'), { valueEncoding: 'json' }));

const getCreateEntry = async entryName => {
    try {
        return (await db.get(entryName));
    } catch (err) {
        await db.put(entryName, []);
        return [];
    }
};

const getRecords = () => getCreateEntry('records');

const getLeaderboard = () => getCreateEntry('leaderboard');

const pushRecord = async record => {
    const records = await getRecords();
    records.push(record);
    await db.put('records', records);
};

const updateLeaderboard = async newLeaderboard => {
    await db.put('leaderboard', newLeaderboard);
};

const updateLeaderboardIfNeeded = async record => {

    const leaderboard = await getLeaderboard();

    const pushToLeadeboard = async record => {
        leaderboard.push(record);
        const sortedLeaderboard = _.sortBy(leaderboard, ['time']);
        await updateLeaderboard(sortedLeaderboard);
        return;
    };
    
    if (_.size(leaderboard) < 10) {
        await pushToLeadeboard(record);
        return;
    }

    const shouldEnterLeaderboard = _.some(leaderboard, ({ time }) => time > record.time);
    if (!shouldEnterLeaderboard) {
        return;
    }

    leaderboard.splice(-1, 1);
    await pushToLeadeboard(record);

};

module.exports = {
    getRecords,
    getLeaderboard,
    pushRecord,
    updateLeaderboardIfNeeded,
};
