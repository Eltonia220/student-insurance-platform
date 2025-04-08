const Plan = require('../models/Plan');

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll(req.query);
    res.status(200).json({
      status: 'success',
      results: plans.length,
      data: { plans }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch plans'
    });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { plan }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to create plan'
    });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.update(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: { plan }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to update plan'
    });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.delete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to delete plan'
    });
  }
};