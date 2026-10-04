const Pet = require("../models/Pet");

// GET /api/admin/pets?search=
async function getAllPets(req, res) {
    const { search = "" } = req.query;
    const filter = search ? { name: new RegExp(search, "i") } : {};
    const pets = await Pet.find(filter).populate("owner", "name username email").sort({ createdAt: -1 });
    res.json(pets);
}

// GET /api/admin/pets/:id
async function getPetDetails(req, res) {
    const pet = await Pet.findById(req.params.id).populate("owner", "name username email");
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
}

// PATCH /api/admin/pets/:id/moderate   { remove: true|false, reason }
async function moderatePet(req, res) {
    const { remove, reason } = req.body;
    const pet = await Pet.findByIdAndUpdate(
        req.params.id,
        { isRemoved: !!remove, removedReason: remove ? reason : undefined },
        { new: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
}

module.exports = { getAllPets, getPetDetails, moderatePet };
