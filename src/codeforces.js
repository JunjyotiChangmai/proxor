// Codeforce data handle
async function getCodeforcesData( username ) {
        // Official API of Codeforces
        const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;
        const userSubmissionHistoryUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1`;
        const userRatingListUrl = `https://codeforces.com/api/user.rating?handle=${username}`;

        // Geting user data from official api of Codeforces
        const userData = await fetch(getUserdataUrl).then(response => response.json()).then(data => data);
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

        const userProfileData = {
            userInfo: userData.result,
            heatMap: heatMapData,
            ratingData: userRatingList.result,
        };

        console.log(userProfileData)
        return userProfileData;
}

module.exports = getCodeforcesData;