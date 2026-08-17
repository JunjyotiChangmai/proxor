const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Codeforce data handle
async function getCodeforcesData(username) {
        // Official API of Codeforces
        const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;
        const userSubmissionHistoryUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1`;
        const userRatingListUrl = `https://codeforces.com/api/user.rating?handle=${username}`;

        // Get user data from official API of Codeforces
        const userData = await fetch(getUserdataUrl).then(response => response.json()).then(data => data);
        
        if (userData.status === 'FAILED') {
            return {"message": "not found", "status": 404};
        }

        const userSubHistory = await fetch(userSubmissionHistoryUrl).then(response => response.json()).then(data => data);
        const userRatingList = await fetch(userRatingListUrl).then(response => response.json()).then(data => data);

        // Create heatmap from submission history
        const formatDate = (timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toISOString().split('T')[0];
        };

        // Count submissions per date
        const dateCounts = {};
        
        // Track unique solved problems safely
        const solvedProblemIds = new Set();

        userSubHistory.result.forEach(sub => {
            const date = formatDate(sub.creationTimeSeconds);
            dateCounts[date] = (dateCounts[date] || 0) + 1;

            if (sub.verdict === "OK" && sub.problem) {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedProblemIds.add(problemId);
            }
        });

        const uniqueDates = Object.keys(dateCounts).sort();
        const heatMapData = uniqueDates.map((date) => ({
            date: date,
            value: dateCounts[date]
        }));

        const userProfileData = {
            userInfo: userData.result,
            heatMap: heatMapData,
            ratingData: userRatingList.result,
        };

        userProfileData.userInfo[0].problemSolved = solvedProblemIds.size;

        return userProfileData;
}

module.exports = getCodeforcesData;