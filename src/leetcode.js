const axios = require('axios');

// Leetcode data handle
async function getLeetcodeData( username ) {
        // leetcode user data fetching using leetcode graphQL
        const userResponse = await axios.post(
            'https://leetcode.com/graphql',
            {
                query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        profile {
                            realName
                            ranking
                            userAvatar
                            reputation
                            aboutMe
                            school
                            countryName
                            company
                            skillTags
                        }
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                        userCalendar(year: 0) {
                            activeYears
                            streak      
                            totalActiveDays      
                            dccBadges {        
                                timestamp        
                                badge {          
                                    name          
                                    icon
                                }
                            }
                            submissionCalendar 
                        }
                        tagProblemCounts {
                            advanced {
                                tagName
                                problemsSolved
                            }
                            intermediate {
                                tagName
                                problemsSolved
                            }
                            fundamental {
                                tagName
                                problemsSolved
                            }
                        }
                    }
                }
                `,
                variables: { username }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Referer': `https://leetcode.com/${username}/`,
                }
            }
        );

        if(userResponse.data.data.matchedUser === null) {
            return {"message": "not found", "status": 404};
        }

        // leetcode user contest data fetching using leetcode graphQL
        const contetResponse = await axios.post(
            'https://leetcode.com/graphql',
            {
                query: `
                    query getUserContestRankingInfo($username: String!) {
                        userContestRanking(username: $username) {
                            attendedContestsCount
                            rating
                            globalRanking
                            totalParticipants
                            topPercentage
                            badge {
                                name
                                icon
                            }
                        }
                        userContestRankingHistory(username: $username) {
                            attended
                            trendDirection
                            problemsSolved
                            totalProblems
                            finishTimeInSeconds
                            rating
                            ranking
                            contest {
                                title
                                startTime
                            }
                        }
                    }
        `,
                variables: { username }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Referer': `https://leetcode.com/${username}/`,
                }
            }
        );

        if(contetResponse.data.data.matchedUser === null) {
            return {"message": "not found", "status": 404};
        }

        // leetcode userdata
        const userResData = userResponse.data.data.matchedUser;
        const userContestResData = contetResponse.data.data;

        const userProfileData = ({...userResData, ...userContestResData});

        userProfileData.profile.problemSolved = userProfileData.submitStats.acSubmissionNum.find(
            stat => stat.difficulty === 'All'
        )?.count || 0;

        return userProfileData;
}

module.exports = getLeetcodeData;