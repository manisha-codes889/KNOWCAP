const express = require("express");
const router = express.Router();

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// Admin-only dashboard
router.get(
    "/dashboard",
    verifyToken,
    allowRoles("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to Admin Dashboard",
            user: req.user
        });
    }
);

module.exports = router;