const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Codeforce data handle
async function getCodeforcesData( username ) {
        // Official API of Codeforces
        const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;
        const userSubmissionHistoryUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1`;
        const userRatingListUrl = `https://codeforces.com/api/user.rating?handle=${username}`;

        // Geting user data from official api of Codeforces
        const userData = await fetch(getUserdataUrl).then(response => response.json()).then(data => data);
        
        if(userData.status === 'FAILED') {
            return {"message": "not found", "status": 404};
        }

        const userSubHistory = await fetch(userSubmissionHistoryUrl).then(response => response.json()).then(data => data);
        const userRatingList = await fetch(userRatingListUrl).then(response => response.json()).then(data => data);

        //create heatmap from submission history...................
        // to make submission time into date formate
        const formatDate = (timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toISOString().split('T')[0];
        };

        // Count submissions per date
        const dateCounts = {};
        userSubHistory.result.forEach(sub => {
            const date = formatDate(sub.creationTimeSeconds);
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        const uniqueDates = Object.keys(dateCounts).sort();
        const heatMapData = uniqueDates.map((date) => ({
            date: date,
            value: dateCounts[date]
        }));


        const targetUrl = `https://codeforces.com/profile/${username}`;
        const response = await fetch(targetUrl);
        const d = await response.text();
        const data = { data: d };
        const dom = new JSDOM(data.data);
        const document = dom.window.document;
        const problemSolvedElement = document.querySelector('._UserActivityFrame_counterValue').innerHTML.split(" ")[0];

        
        const problemSolved = parseInt(problemSolvedElement);

        const userProfileData = {
            userInfo: userData.result,
            heatMap: heatMapData,
            ratingData: userRatingList.result,
        };

        userProfileData.userInfo[0].problemSolved = problemSolved || 0

        return userProfileData;
}

module.exports = getCodeforcesData;