const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsername) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        if (user === null) {
            return done(null, false, {message: 'No user with this username'})
        }

        try {
            if (await bcrypt.compare(password, user.passwordHash)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Incorrect password'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser))
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
}

module.exports = initialize