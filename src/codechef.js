const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Codechef data handle
async function getCodeChefData(username) {
    try {
        const targetUrl = `https://www.codechef.com/users/${username}`;
        const response = await fetch(targetUrl);

        if (response.ok) {
            const d = await response.text();
            const data = { data: d };
            const dom = new JSDOM(data.data);
            const document = dom.window.document;

            //to extract total problem solved count
            const problemSolvedElement = document.querySelector('.rating-data-section.problems-solved').lastElementChild;
            const totalProb = problemSolvedElement.innerHTML.split(" ")[3];

            //to extract heatmap data
            const script = [...document.scripts].find(s => s.textContent.includes("userDailySubmissionsStats"));
            const match = script.textContent.match(/userDailySubmissionsStats\s*=\s*(\[[^\]]*\])/);
            const heatMapData = match ? JSON.parse(match[1]) : [];

            //to extract rating data
            const ratingScript = [...document.scripts].find(s => s.textContent.includes("all_rating"));
            const ratingMatch = ratingScript?.textContent.match(/all_rating\s*=\s*(\[[\s\S]*?\]);/);
            const ratingData = ratingMatch ? JSON.parse(ratingMatch[1]) : [];

            //Extraction basic user details
            const profile = document.querySelector(".user-details-container").children[0].children[0].src;
            const name = document.querySelector(".user-details-container").children[0].children[1].textContent;
            const currentRating = parseInt(document.querySelector(".rating-number")?.textContent);
            const highestRating = parseInt(document.querySelector(".rating-number")?.parentNode?.children[4]?.textContent?.split("Rating")[1]);
            const countryFlag = document.querySelector(".user-country-flag").src;
            const countryName = document.querySelector(".user-country-name").textContent;
            const globalRank = parseInt(document.querySelector(".rating-ranks")?.children[0]?.children[0]?.children[0]?.children[0]?.innerHTML);
            const countryRank = parseInt(document.querySelector(".rating-ranks")?.children[0]?.children[1]?.children[0]?.children[0]?.innerHTML);
            const stars = document.querySelector(".rating")?.textContent || "unrated";

            //final user data that is going to return
            const userProfileData = {
                profile,
                name,
                currentRating,
                highestRating,
                countryFlag,
                countryName,
                countryRank,
                globalRank,
                stars,
                problemSolved: parseInt(totalProb),
                heatMap: heatMapData,
                ratingData: ratingData,
            };
            return userProfileData;

        }
        else {
            return { "message": "not found", "status": 404 };
        }
    } catch (error) {
        return { "message": "not found", "status": 404 };
    }
}

module.exports = getCodeChefData;
