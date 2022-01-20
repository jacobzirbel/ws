const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const apiRoutes = require("./app/routes/api-routes");
const htmlRoutes = require("./app/routes/html-routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "app/public")));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.get("*", function (req, res) {
	res.redirect("/home");
});

app.listen(PORT, () => {
	console.log("on " + PORT);
});