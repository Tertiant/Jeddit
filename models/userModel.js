const database = require("../models/fake-db").user_db

const userModel = {
  findOne: (username) => {
    const user = database.find((user) => user.uname === username);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with username: ${username}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  findOrCreate: (githubProfile, callback) => {
    const user = database.find((user) => user.id === `${githubProfile.username}#${githubProfile.id}`);
    if (user) {
      callback(null, user);
    } else {
      const githubUser = 
          {
            id: `${githubProfile.username}#${githubProfile.id}`, 
            uname: githubProfile.username,
            password: null,
            role: 'user'
          };
      database.push(githubUser);
      callback(null, githubUser);
    };
  }
};

module.exports = { database, userModel };
