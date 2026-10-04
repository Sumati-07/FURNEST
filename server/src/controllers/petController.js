const Pet = require("../models/Pet");

// GET /api/pets/mine
async function getMyPets(req, res) {
    const pets = await Pet.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(pets);
}

// POST /api/pets
async function createPet(req, res) {
    try {
        const { name, species, breed, age, healthNotes, photo, tags } = req.body;
        const pet = await Pet.create({
            owner: req.userId,
            name,
            species,
            breed,
            age,
            healthNotes,
            photo,
            tags
        });
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: "Could not create pet profile", error: error.message });
    }
}

module.exports = { getMyPets, createPet };
