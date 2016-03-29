/**
 * Created by root on 29.03.16.
 */
exports.post = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};