const { v4: uuidv4 } = require("uuid");
const TokenGenerator = require("uuid-token-generator");
const User = require("../models/user.model");
const { atob, btoa } = require("b2a");
// Login functionality
exports.login = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(400).json({ message: "Invalid authorization header." });
    }

    const encodedCredentials = authHeader.split(" ")[1];
    const credentials = atob(encodedCredentials);
    const [username, password] = credentials.split(":");

    // Check user credentials
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate and assign access token
    const tokenGen = new TokenGenerator();
    const accessToken = tokenGen.generate();
    user.accesstoken = accessToken;

    // Generate UUID for the session
    const uuid = uuidv4();
    user.uuid = uuid; // Set UUID during login

    user.isLoggedIn = true;

    await user.save();

    // Send JSON response with access token and UUID
    res.status(200).json({ accessToken, id: uuid });
  } catch (error) {
    // Log error for debugging
    console.error("Error during login:", error);

    // Send JSON response with error message
    res.status(500).json({ message: error.message || "Error logging in." });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, first_name, last_name, contact, password } = req.body;

    // Ensure all required fields are provided
    if (!email || !first_name || !last_name || !contact || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Generate username
    const username = `${first_name} ${last_name}`;

    // Generate a new userid automatically (example: incrementing number)
    const lastUser = await User.findOne().sort({ userid: -1 }).exec();
    const newUserId = lastUser ? lastUser.userid + 1 : 1; // Starting from 1 if no users exist

    // Create a new user
    const user = new User({
      userid: newUserId, // Auto-generated userid
      username,
      email,
      first_name,
      last_name,
      contact,
      password,
      role: "user",
      uuid: "", // Leave UUID empty
      accesstoken: "", // Leave accessToken empty
      isLoggedIn: false, // Default to false on signup
    });

    // Save user to the database
    await user.save();

    res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error signing up." });
  }
};

// Logout functionality
exports.logout = async (req, res) => {
  try {
    // Validate request
    if (!req.body.uuid) {
      return res.status(400).json({ message: "UUID not provided." });
    }

    // Find the user by UUID
    const { uuid } = req.body;
    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Clear user session
    user.accesstoken = ""; // Clear the access token
    user.isLoggedIn = false; // Set logged-in status to false
    user.uuid = ""; // Optionally clear the UUID
    await user.save();

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: error.message || "Error logging out." });
  }
};

// Get coupon codes
exports.getCouponCode = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Invalid authorization header." });
    }

    const accessToken = authHeader.split(" ")[1];
    const user = await User.findOne({ accesstoken: accessToken });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const couponCode = parseInt(req.query.code, 10); // Ensure code is an integer
    if (isNaN(couponCode)) {
      return res.status(400).json({ message: "Invalid coupon code format." });
    }

    // Find coupon code in the user's coupons array
    const coupon = user.coupens.find((c) => c.id === couponCode);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon code not found." });
    }

    // Return the discount value of the coupon
    res.status(200).json({ discountValue: coupon.discountValue });
  } catch (error) {
    console.error("Error retrieving coupon code:", error);

    // Ensure response is JSON in case of error
    res.status(500).json({ message: "Error retrieving coupon code." });
  }
};

// Book a show

exports.bookShow = async (req, res) => {
  try {
    // Validate request
    if (!req.body.customerUuid) {
      return res.status(400).send({ message: "ID Not Found!" });
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Invalid authorization header." });
    }

    const accessToken = authHeader.split(" ")[1];

    // Find the user
    const user = await User.findOne({
      uuid: req.body.customerUuid,
      accesstoken: accessToken,
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found or invalid token.",
      });
    }

    const newRefNo =
      new Date().getTime().toString() +
      Math.floor(Math.random() * 100).toString();
    req.body.bookingRequest.reference_number = newRefNo;

    user.bookingRequests.push(req.body.bookingRequest);

    const updatedUser = await user.save();

    if (!updatedUser) {
      return res.status(500).send({
        message: "Some error occurred, please try again later.",
      });
    }

    const bookingSummary = {
      location: req.body.bookingRequest.location || "Default Location",
      theatre: req.body.bookingRequest.theatre || "Default Theatre",
      language: req.body.bookingRequest.language || "Default Language",
      showDate: req.body.bookingRequest.showDate || "Default Date",
      tickets: req.body.bookingRequest.tickets || [],
      unitPrice: req.body.bookingRequest.unitPrice || 0,
      reference_number: newRefNo,
    };

    res.send({
      reference_number: newRefNo,
      bookingSummary: bookingSummary,
    });
  } catch (error) {
    console.error("Error during booking:", error);
    res.status(500).send({
      message: "Error validating token or updating booking requests.",
    });
  }
};
