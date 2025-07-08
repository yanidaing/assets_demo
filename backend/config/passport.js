const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "88269374553-sb106mprjjkgu2nk4n0rroo907htts8b.apps.googleusercontent.com", // TODO: ใส่ client id จริง
      clientSecret: "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", // TODO: ใส่ client secret จริง
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // 1. หา user จาก provider+id
        let user = await userModel.findUserByProvider("google", profile.id);
        if (!user) {
          // 2. ถ้าไม่มี user ให้สร้างใหม่ (role=user by default)
          user = await userModel.createUserWithIdentity({
            email: profile.emails[0].value,
            full_name: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            profile_picture_url: profile.photos[0]?.value,
            provider: "google",
            provider_user_id: profile.id,
            role: "user",
          });
        } else {
          // 3. ถ้ามี user แล้ว อัปเดตข้อมูลล่าสุด
          await userModel.updateUserProfile({
            id: user.id,
            full_name: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            profile_picture_url: profile.photos[0]?.value,
          });
        }
        // 4. คืน user object พร้อม role
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
