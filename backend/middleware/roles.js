const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access restricted to admins.' });
  }
  next();
};

const requireOrganizer = (req, res, next) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access restricted to organizers.' });
  }
  next();
};

const requireStudent = (req, res, next) => {
  if (!['student', 'organizer', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied.' });
  }
  next();
};

module.exports = { requireAdmin, requireOrganizer, requireStudent };
