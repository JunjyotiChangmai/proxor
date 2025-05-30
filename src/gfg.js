const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// GFG data handle
async function getGFGData( username ) {
    const gfgURL = `https://www.geeksforgeeks.org/user/${username}`;

    const response = await fetch(gfgURL);

    if (response.status != 404) {
        const d = await response.text();
        const data = { data: d };
        const dom = new JSDOM(data.data);
        const document = dom.window.document;

        const nextDataScript = document.getElementById("__NEXT_DATA__");
        const nextData = JSON.parse(nextDataScript.textContent);
        const userData = nextData.props.pageProps;

        // Creating heatMap data
        const createHeatMap = userData.heatMapData.result;
        function convertHeatMapToDateAndValue(heatMap) {
            return Object.entries(heatMap).map(([date, value]) => ({
                date,
                value
            }));
        }
        const heatMap = convertHeatMapToDateAndValue(createHeatMap);

        // Extracting user contest data
        const contest_rating_data = {
            contest_user_global_rank: userData.contestData.user_global_rank,
            contest_total_users: userData.contestData.total_users,
            contest_user_position: userData.contestData.user_position,
            contest_user_stars: userData.contestData.user_stars,
            contest_current_rating: userData.contestData.user_contest_data.current_rating,
            contest_star_colour_codes: userData.contestData.star_colour_codes,
        }

        const userHandle = {
            userHandle: userData.userHandle,
        }

        const userProfileData = {
            userInfo: ({ ...userHandle, ...userData.userInfo, ...contest_rating_data }),
            userSubmissionsInfo: userData.userSubmissionsInfo,
            heatMap: heatMap,
            ratingData: userData.contestData.user_contest_data.contest_data,
        }

        return userProfileData;
    }
    else {
        return {"message": "not found", "status": 404};
    }
}

module.exports = getGFGData;