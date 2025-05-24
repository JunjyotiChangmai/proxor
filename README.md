# 👨‍💻 proxor

Extract user profile data from popular competitive programming platforms:  
**GeeksforGeeks**, **CodeChef**, **Codeforces**, and **LeetCode** — with simple function calls.

## 📦 Installation

```bash
npm install proxor
```

## 🚀 Features

- 📘 Get profile data from **GeeksforGeeks**
- 🍛 Extract stats from **CodeChef**
- 🏆 Scrape ratings from **Codeforces**
- 🧠 Fetch user data from **LeetCode**

## 🛠️ Usage

```javascript
const {
  getCodeChefData,
  getCodeforcesData,
  getGFGData,
  getLeetcodeData
} = require("proxor");

getGFGData("gfg_username").then(res => console.log("GeeksforGeeks:", res));
getCodeforcesData("codeforces_username").then(res => console.log("Codeforces:", res));
getCodeChefData("codechef_username").then(res => console.log("CodeChef:", res));
getLeetcodeData("leetcode_username").then(res => console.log("LeetCode:", res));
```

## 📘 API Reference

Each function accepts a **single parameter**: the `username` as a `string`.  
It returns a `Promise` that resolves to an object containing the user's public profile data.

| Function                  | Platform       | Parameter           |
|---------------------------|----------------|---------------------|
| `getGFGData(username)`        | GeeksforGeeks   | `username` *(string)* |
| `getCodeforcesData(username)` | Codeforces      | `username` *(string)* |
| `getCodeChefData(username)`   | CodeChef        | `username` *(string)* |
| `getLeetcodeData(username)`   | LeetCode        | `username` *(string)* |

> **Note**: Ensure that the usernames are correct and publicly accessible.

## 📌 Example Output

```json
{
  "username": "johndoe",
  "totalSolved": 350,
  "ranking": "Expert",
  "countryRank": 120
  "more like heatmap, contestDetails, topicWiseProblems"
}
```

*Output structure may vary depending on the platform.*

## 🧾 License

Apache License 2.0  
© 2025 Junjyoti Changmai
