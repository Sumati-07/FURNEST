const Post = require("../models/Post");
const Application = require("../models/Application");

/**
 * These four endpoints are the "Big Data Analytics" layer for the admin
 * dashboard — real aggregation over the operational data, computed on
 * demand rather than pre-built with Hadoop/Spark. That infrastructure adds
 * real value once you have millions of records and need distributed
 * processing; at this project's scale, MongoDB's aggregation pipeline does
 * the same analytical job honestly, and the queries below could later feed
 * into a Spark job unchanged if the dataset outgrows this.
 */

// GET /api/analytics/species-demand
// Example 1 from the plan: most demanded species.
async function speciesDemand(req, res) {
    const result = await Post.aggregate([
        { $lookup: { from: "pets", localField: "pet", foreignField: "_id", as: "pet" } },
        { $unwind: "$pet" },
        { $group: { _id: "$pet.species", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.json(result);
}

// GET /api/analytics/city-demand
// Example 2: geographic demand.
async function cityDemand(req, res) {
    const result = await Post.aggregate([
        { $match: { city: { $exists: true, $ne: null } } },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.json(result);
}

// GET /api/analytics/seasonal-demand
// Example 3: requests per month.
async function seasonalDemand(req, res) {
    const result = await Post.aggregate([
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.json(result);
}

// GET /api/analytics/price-by-city
// Example 4: average temporary-care price by city.
async function priceByCity(req, res) {
    const result = await Post.aggregate([
        { $match: { type: "temporary", pricePerDay: { $exists: true, $ne: null }, city: { $exists: true } } },
        { $group: { _id: "$city", avgPrice: { $avg: "$pricePerDay" }, count: { $sum: 1 } } },
        { $sort: { avgPrice: -1 } }
    ]);
    res.json(result);
}

// GET /api/analytics/application-outcomes
// A version of example 5 — application acceptance/rejection rates, standing
// in for cancellation analysis until Booking data accumulates.
async function applicationOutcomes(req, res) {
    const result = await Application.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(result);
}

module.exports = { speciesDemand, cityDemand, seasonalDemand, priceByCity, applicationOutcomes };
