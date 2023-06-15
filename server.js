const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const port = process.env.port || 3000;

const app = express();
require('dotenv').config();

app.set("view engine", "ejs");
app.set('view options', { layout:'layout.ejs' });
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");
const postRoute = require("./routes/postRoute");
const subsRoute = require("./routes/subsRoute");


// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Intercept the request...look at the url..and forward to appropriate file
app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/posts", postRoute);
app.use("/subs", subsRoute);


app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
