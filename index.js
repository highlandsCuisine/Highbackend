//Package Imports
const ENV = require("dotenv");
ENV.config(); // env configuration
const hpp = require("hpp");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const flash = require("express-flash");
const frameguard = require("frameguard");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
//Package Imports Ends

//Local Imports
const CsrfRoutes = require("./routes/csrfRoutes");
const UserRoutes = require("./routes/userRoutes");
const MenuRoutes = require("./routes/menuRoutes");
const EventRoutes = require("./routes/eventRoutes");
const PrintRoutes = require("./routes/printRoutes");
const RefundRoutes = require("./routes/refundRoutes");
const OrderRoutes = require("./routes/paymentRoutes");
const AdminRoutes = require("./routes/adminRoutes");
const { checkContentType } = require("./utils/allowedMedia");
const { corsOptionsDelegate } = require("./utils/allowedHost");
const { allowedMethods } = require("./utils/allowedMethods");
const { errorHandler } = require("./helpers/errrorHandling");
const sessionMiddleware = require("./middleware/sessionMiddleware");
const { doubleCsrfProtection } = require("./middleware/csrfMiddleware");
//Local Imports Ends

//server running port(if not default port 5000)
const PORT = process.env.PORT || 5000;

const app = express();
//session handling

//setup static files (all files inside public folder are accessable)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//middlewares
// to console all logs(only for development ||  PM2 for production)
app.use(morgan("dev"));
//cors policy
app.use(cors(corsOptionsDelegate));
// prevents from http parameter pollution
//(query string are ignored || parameters are allowed)
app.use(hpp());
//compress all data from its original size to handle server load
app.use(compression());
//accept only get,post.patch requests
app.use(allowedMethods);
//accepts only form data and file content
app.use(checkContentType);

// parser for raw or json type data only and payload size limit is 300kb
app.use(
  bodyParser.json({
    limit: "300kb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

//prevents browser caching sensitive pages(only for server-side-rendering)
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.header("X-XSS-Protection", "1");
  next();
});

//prevents from clickjacking attack
app.use(frameguard({ action: "deny" }));
// prevents from DDOS attack
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);
// prevents from xss,csrf and other normal attacks
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      "img-src": ["'self'", "https: data:"],
      scriptSrc: ["'self'", "https://www.google.com", "'nonce'"],
    },
  })
);
app.use(sessionMiddleware);
// app.use(csrfMiddleware.doubleCsrfProtection);

//Parser to get cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
//csrf not protected routes
app.use("/api/v1/paymenthook", EventRoutes);
//csrf protection (overwrite is true which may affect multiple tab browsers)
app.use(doubleCsrfProtection);
//errormessage popup
app.use(flash());
//local routes including apis
app.use("/api/v1/protection/csrf", CsrfRoutes);

app.get("/", (req, res) => {
  res.send("processing, please wait");
});
app.use("/admin/highlands/cuisine", AdminRoutes);
app.use("/api/v1/auth/user", UserRoutes);
app.use("/api/v1/menu", MenuRoutes);
app.use("/api/v1/payment", OrderRoutes);
app.use("/api/v1/refund", RefundRoutes);
app.use("/api/v1/print", PrintRoutes);

//404 handling(requested url not found)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found: Requested URL not found.",
  });
});

// error Handler
app.use(errorHandler);

//running server
app.listen(PORT, () => {
  console.log(`☘️  Server running on http://localhost:${PORT}`);
});
