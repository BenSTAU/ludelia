import jwt from 'jsonwebtoken';
import passport from 'passport';

export async function registerAndLoginWithGoogle(req, res, next) {
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
}

export async function googleCallback(req, res, next) {
  passport.authenticate('google', {
    session: false // On utilise JWT, pas les sessions
  }, (err, user) => {
    if (err) {
      console.error('Google callback error:', err);
      return res.status(400).redirect(`${process.env.CLIENT_URL}/?google=false`);
    }
    
    if (!user) {
      return res.status(400).redirect(`${process.env.CLIENT_URL}/?google=false`);
    }

    // Générer un JWT
    const token = jwt.sign(
      { id: user.id_utilisateur },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Définir le cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Rediriger vers le frontend
    res.redirect(`${process.env.CLIENT_URL}/landing`);
    
  })(req, res, next);
}