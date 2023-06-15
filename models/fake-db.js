
const user_db = {
  1: {
    id: 1,
    uname: 'alice',
    password: 'alpha',
    role: 'user',
  },
  2: {
    id: 2,
    uname: 'bob',
    password: 'bravo',
    role: 'user',
  },
  3: {
    id: 3,
    uname: 'carol',
    password: 'charlie',
    role: 'user',
  },
  4: {
    id: 4,
    uname: 'dave',
    password: 'delta',
    role: 'user',
  },
  5: {
    id: 5,
    uname: 'jim',
    password: 'jim',
    role: 'admin',
  },
};

const posts = {
  101: {
    id: 101,
    title: "Fishsticks",
    link: "https://www.smithsonianmag.com/innovation/surprising-success-story-fish-sticks-180977578/",
    description: "I actually really do not like fish sticks",
    creator: 1,
    subgroup: 'food',
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "Charlie the Unicorn",
    link: "https://www.youtube.com/watch?v=CsGYh8AacgY",
    description: "",
    creator: 2,
    subgroup: 'documentaries',
    timestamp: 1642611742010,
  },
  103: {
    id: 103,
    title: "Test post pls ignore",
    link: "https://www.youtube.com/watch?v=CsGYh8AacgY",
    description: "",
    creator: 3,
    subgroup: 'test',
    timestamp: 1642611742007,
  },
};

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  }
}

const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
]

function debug() {
  console.log("==== DB DEBUGING ====")
  console.log("users", user_db)
  console.log("posts", posts)
  console.log("comments", comments)
  console.log("votes", votes)
  console.log("==== DB DEBUGING ====")
}

function getUser(id) {
  return user_db[id];
}

function getUserByUsername(uname) {
  return getUser(Object.values(user_db).filter(user => user.uname === uname)[0].id);
}

function getVotesForPost(post_id) {
  return votes.filter(vote => vote.post_id === post_id);
}

function decoratePost(post) {
  post = {
    ...post,
    uname: user_db[post.creator].uname,
    votes: getVotesForPost(post.id),
    comments: Object.values(comments).filter(comment => comment.post_id === post.id).map(comment => ({ ...comment, creator: user_db[comment.creator].uname })).sort((a, b) => b.timestamp - a.timestamp),
  }
  return post;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub = undefined) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter(post => post.subgroup === sub);
  }
  allPosts.sort((a, b) => b.timestamp - a.timestamp);
  
  allPosts.forEach(post => {
    post.uname = user_db[post.creator].uname
  });
  return allPosts.slice(0, n);
}

function getPost(id) {
  return decoratePost(posts[id]);
}

function addPost(title, link, creator, description, subgroup) {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator: Number(creator),
    subgroup,
    timestamp: Date.now(),
  }
  posts[id] = post;
  return post;
}

function editPost(post_id, changes = {}) {
  // let post = posts[post_id];
  if (changes.title) {
    posts[post_id].title = changes.title;
  }
  if (changes.link) {
    posts[post_id].link = changes.link;
  }
  if (changes.description) {
    posts[post_id].description = changes.description;
  }
  if (changes.subgroup) {
    posts[post_id].subgroup = changes.subgroup;
  }
  return posts[post_id];
}

function deletePost(post_id) {
  delete posts[post_id];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map(post => post.subgroup))).sort()
}

function addComment(post_id, creator, description) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: Number(post_id),
    creator: Number(creator),
    description,
    timestamp: Date.now(),
  }
  comments[id] = comment;
  return comment;
}

module.exports = {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  user_db,
};

