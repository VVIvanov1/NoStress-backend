const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.sendStatus(401);
  } else {
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const foundUser = await User.findOne({ token: refreshToken });
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403); //Forbidden
          // Delete refresh tokens of hacked user
          const hackedUser = await User.findOne({
            username: decoded.name,
          }).exec();
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
        }
      );
      return res.sendStatus(403); //Forbidden
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          // expired refresh token
          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
        }
        if (err || foundUser.name !== decoded.name) return res.sendStatus(403);

        // Refresh token was still valid

        const accessToken = jwt.sign(
          {
            UserInfo: {
              name: decoded.name,
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: "10s" }
        );

        const newRefreshToken = jwt.sign(
          {
            name: foundUser.name,
            email: foundUser.email,
            id: foundUser._id,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "1d" }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken, name: result.name, email: result.email });
      }
    );
    // return res.sendStatus(403); //Forbidden
  }
};

module.exports = handleRefreshToken;
