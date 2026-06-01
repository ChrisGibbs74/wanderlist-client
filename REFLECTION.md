# REFLECTION.md — WanderList

## Q1 — Scope Decisions

Comparing my original BRIEF.md to what I actually built, the core features remained largely intact. I successfully built user authentication, country card browsing, visit logging with four rating categories, a personal travel list with edit and delete, and a public leaderboard. 

The one feature I cut was an AI chatbot I had considered adding that would give personalised travel recommendations based on your ratings. I cut this because the scope was already ambitious enough and adding an AI integration would have required additional API keys, costs, and complexity that was beyond the four week timeline. The decision to cut it was the right one — a finished app without the chatbot is better than a broken app with one. The leaderboard and authentication system took significantly more time than expected, which confirmed that cutting the chatbot was necessary.

## Q2 — Technical Challenge

The single hardest technical problem was building the leaderboard. The challenge was writing a MongoDB aggregation pipeline that grouped visits by country across all users, calculated average ratings, summed total visits, and sorted the results in a single database query. The initial attempt returned no data because the aggregation syntax was incorrect — specifically the `$group` stage was not structured properly.

The fix was rewriting the aggregation pipeline step by step:

```javascript
const mostVisited = await Visit.aggregate([
  {
    $group: {
      _id: '$country',
      totalVisits: { $sum: '$timesVisited' },
      avgOverall: { $avg: '$overallRating' }
    }
  },
  { $sort: { totalVisits: -1 } },
  { $limit: 10 }
])
```

The key insight was that `$sum: '$timesVisited'` adds up the timesVisited field across all documents for each country, rather than just counting documents. Once that clicked the leaderboard worked correctly.

## Q3 — AI and Vibe-Coding

I used Claude throughout this project for planning, code generation, debugging, and deployment.

**Example where AI worked well with minimal changes:**

The Pinia store (`useWanderStore.js`) was generated almost entirely by AI and worked correctly on the first attempt. The store structure — with state for token, userEmail, and visits, and actions for register, login, logout, fetchVisits, addVisit, updateVisit, deleteVisit, and fetchLeaderboard — was clean and complete. I pasted it in, tested it, and it connected to the back-end immediately without needing changes. This worked well because the pattern was clear and the AI had all the context it needed from our conversation about the data model and API routes.

**Example where I had to debug significantly:**

The `server.js` file caused repeated problems throughout the project. When copying code from the AI chat into VS Code, the text `app.post` was automatically converted to a markdown hyperlink `[app.post](http://app.post)` by the chat interface rendering. This meant Node.js could not parse the file and all POST routes returned `Cannot POST`. Fixing this took a long time — we tried sed commands, Python scripts, nano editing, and VS Code find and replace before finally resolving it by typing the affected lines manually. The lesson was that copying code from a rendered markdown interface can silently corrupt it, and that verifying the raw file contents with `cat` after every edit is essential.

## Q4 — Architecture

When a logged-in user clicks a country card and saves a visit, the following happens:

1. The user fills in ratings and clicks **Save Visit** in the modal in `HomeView.vue`
2. The `handleSubmit` method calls `store.addVisit(visitData)` in the Pinia store
3. The store sends a `POST` request to `https://wanderlist-server-production.up.railway.app/api/visits` with the visit data in the request body and the JWT token in the Authorization header
4. Express receives the request and passes it through the `verifyToken` middleware, which checks the JWT signature against `JWT_SECRET` and attaches the decoded user ID to `req.user`
5. The visits route handler creates a new Visit document in MongoDB Atlas using `Visit.create()`, with the `userId` taken from `req.user.userId`
6. MongoDB saves the document and returns it with a generated `_id` and `createdAt` timestamp
7. The server sends a `201` response with the saved document
8. The store receives the response, pushes the new visit to `this.visits`, and the Vue template reactively updates to show the country as visited with the rating displayed on the card

## Q5 — If I Had Two More Weeks

The first thing I would add is a friends or study abroad group feature. Right now WanderList is personal — you can see the public leaderboard but you cannot see what specific friends have visited or compare your travels directly with classmates. 

The technical approach would be to add a `friendships` collection in MongoDB with `userId` and `friendId` fields, a `GET /api/friends/:id/visits` route protected by JWT, and a new **Friends** view in Vue that fetches and displays a selected friend's travel list. I would also add a search-by-email feature so users can find and add friends.

The second improvement would be photo uploads — allowing users to attach a photo to each visit entry. This would use a service like Cloudinary for image storage, adding a `photoUrl` field to the Visit model and a file upload input to the add visit modal. This would make the personal travel list feel much more like a real travel diary and significantly increase the appeal for study abroad students who want to document their trips visually.