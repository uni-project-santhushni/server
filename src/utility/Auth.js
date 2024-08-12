export const checkUserAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    next();
};

export const isAdmin = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        return res.status(401).json({message: 'Unauthorized'});
    }

    next();
};