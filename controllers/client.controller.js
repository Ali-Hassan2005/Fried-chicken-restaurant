const Client = require("../models/Client");
const generateToken = require("../configs/generateToken");

exports.Signup = async (req, res, next) => {
  const client = new Client(req.body);
  try {
    await client.save();
    res.status(201).json({
      msg: "Client created successfully",
      client: client,
    });
  } catch (err) {
    const error = new Error("Could not create an email");
    error.statusCode = 500;
    return next(error);
  }
};

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;
  const error = new Error("password or email not correct");
  error.statusCode = 404;
  let client;
  try {
    client = await Client.findOne({ email: email });
  } catch (err) {
    return next(err);
  }
  if (!client) {
    return next(error);
  }
  if (!client.isPasswordMatched(password)) {
    return next(error);
  }
  const token = await generateToken.Login(client._id.toString());
  res.status(200).json({
    token: token,
  });
};
