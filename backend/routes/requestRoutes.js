// const Certificate = require("../models/Request");

// // ✅ Fetch all requests
// router.get("/", async (req, res) => {
//   try {
//     const requests = await Request.find();
//     res.json(requests);
//   } catch {
//     res.status(500).json({ error: "Failed to fetch requests" });
//   }
// });

// // ✅ Delete request by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const deleted = await Request.findOneAndDelete({ id: req.params.id });
//     if (!deleted) return res.status(404).json({ error: "Request not found" });
//     res.json({ message: "Request deleted successfully" });
//   } catch {
//     res.status(500).json({ error: "Failed to delete request" });
//   }
// });


// module.exports = router;
