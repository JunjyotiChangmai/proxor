const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Codechef data handle
async function getCodeChefData( username ) {
        const targetUrl = `https://www.codechef.com/users/${username}`;
        const codechefAPI = `https://codechef-api.vercel.app/handle/${username}`;

        const response = await fetch(targetUrl);
        const CCProfile = await fetch(codechefAPI).then(response => response.json()).then(data => data);

        if (response.ok && CCProfile.status != 404) {
            const d = await response.text();
            const data = { data: d };
            const dom = new JSDOM(data.data);
            const document = dom.window.document;
            const problemSolvedElement = document.querySelector('.rating-data-section.problems-solved').lastElementChild;
            const totalProb = problemSolvedElement.innerHTML.split(" ")[3];

            const newData = { problemSolve: parseInt(totalProb), };

            const userProfileData = { ...newData, ...CCProfile };

            return userProfileData;
        }
        else {
            return {"message": "not found", "status": 404};
        }
}

module.exports = getCodeChefData;
