/*
🟡 First, Let's understand how "versions" works in bun, With "react": "^18.2.1"
    1️⃣. "18" --> (Major) --> A full redesign, New Feature Add, Older code might not code
    2️⃣. "2" --> (Minor) --> New Feature Added, But nothing breaks
    3️⃣. "3" --> (Patch) --> Bugs fixes only, safe to update

🟡 Symbols with "Package Names"
    1️⃣. "^ (Crete)"  --> During "bun/npm/pnpm install" if that package has "Major, Minor" version available, It automatically install that version. If no ".lock" file there.
    2️⃣. "~ (Tilde)"  --> It's same as "Crete"
    3️⃣. ">=, <=, >, < (range)"  --> Install based on change if version is available and If no ".lock" file there.
    4️⃣. "Exact Version"  --> Install exact version
    5️⃣ "*"  --> What ever the latest version
    5️⃣ "latest"  --> What ever the latest version

🟡 "Package Manger", will give more priority to ".lock" file if it's there. 
⚠️ When we run "npm/bun/pnpm install", It's install but behind the senses package manage sees those symbol and automatically install "latest", "minor updated version", "patched" version based on above symbols.
👉 How to see versions:
    "bun pm ls"
    "npm list [express] --depth=0"
    "pnpm list [express]"
*/
