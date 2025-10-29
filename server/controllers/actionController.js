const Action = require('../models/Action');
const User = require('../models/User');

// Points assigned to each action category
// I balanced these based on environmental impact research
const CATEGORY_POINTS = {
  // Waste Management (5-20 points)
  'Recycled': 10,
  'Composted': 15,
  'AvoidedPlastic': 20,
  'ReusedContainer': 8,
  'DonatedItems': 12,
  'RepairedInsteadOfBuying': 18,
  'UsedReusableBag': 5,
  'RefusedDisposables': 10,
  
  // Transportation (10-30 points)
  'PublicTransport': 15,
  'Biked': 20,
  'Walked': 18,
  'Carpooled': 12,
  'ElectricVehicle': 25,
  'WorkedFromHome': 15,
  'CombinedTrips': 10,
  
  // Energy (10-40 points)
  'UsedSolarPower': 40,
  'UnpluggedDevices': 10,
  'UsedNaturalLight': 8,
  'EnergyEfficientAppliance': 30,
  'ReducedHeatingCooling': 15,
  'UsedColdWater': 10,
  'AirDried': 12,
  
  // Water Conservation (5-25 points)
  'ShortShower': 10,
  'FixedLeak': 20,
  'RainwaterHarvesting': 25,
  'WateredPlantsEfficiently': 8,
  'UsedDishwasherFull': 10,
  'InstalledLowFlowFixture': 22,
  
  // Food & Diet (5-35 points)
  'VegetarianMeal': 15,
  'VeganMeal': 20,
  'LocalFood': 12,
  'OrganicFood': 15,
  'ReducedFoodWaste': 10,
  'MealPrepped': 8,
  'GrewOwnFood': 25,
  'AvoidedProcessedFood': 10,
  
  // Nature & Environment (15-50 points)
  'PlantedTree': 50,
  'PlantedFlowers': 15,
  'CreatedBirdHabitat': 20,
  'CleanedPark': 25,
  'BeachCleanup': 30,
  'WildlifeConservation': 35,
  'CommunityGarden': 20,
  
  // Shopping & Consumption (5-30 points)
  'BoughtSecondhand': 15,
  'ChoseEcoFriendlyProduct': 12,
  'MinimalistPurchase': 10,
  'SupportedLocalBusiness': 10,
  'BoughtInBulk': 8,
  'AvoidedFastFashion': 18,
  
  // Education & Advocacy (10-40 points)
  'EducatedOthers': 20,
  'AttendedEcoEvent': 15,
  'SignedPetition': 10,
  'VolunteeredForEnvironment': 30,
  'SharedEcoTips': 12,
  'ParticipatedInEcoCampaign': 25
};

const addAction = async (req, res) => {
  try {
    const { category, note, date } = req.body;
    
    // Log for debugging
    console.log('Received action request:', { category, note, date });
    
    // Validate category exists in our points system
    if (!CATEGORY_POINTS[category]) {
      console.error('Invalid category:', category);
      return res.status(400).json({ message: `Invalid category: ${category}` });
    }

    const points = CATEGORY_POINTS[category];
    const action = new Action({ user: req.user.id, category, note, date: date || Date.now(), points });
    
    console.log('Attempting to save action:', action);
    await action.save();

    // Update user's total score atomically
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalScore: points } });

    console.log('Action saved successfully');
    res.json({ action });
  } catch (err) {
    console.error('Error in addAction:', err.message, err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const getActions = async (req, res) => {
  try {
    const actions = await Action.find({ user: req.user.id }).sort({ date: -1 }).limit(100);
    const user = await User.findById(req.user.id);
    res.json({ actions, totalScore: user.totalScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const stats = async (req, res) => {
  try {
    const actions = await Action.find({ user: req.user.id });

    // actions per category
    const counts = actions.reduce((acc, a) => { acc[a.category] = (acc[a.category]||0)+1; return acc; }, {});

    // weekly growth - group by week (start of week)
    const weekly = {};
    actions.forEach(a => {
      const wk = new Date(a.date);
      wk.setHours(0,0,0,0);
      const day = wk.getDate();
      // simple week key: yyyy-mm-dd of week start (mon)
      const dayOfWeek = wk.getDay();
      const diff = (dayOfWeek+6)%7; // make monday=0
      wk.setDate(wk.getDate()-diff);
      const key = wk.toISOString().slice(0,10);
      weekly[key] = (weekly[key]||0) + a.points;
    });

    // transform weekly to sorted array
    const weeklyArr = Object.keys(weekly).sort().map(k => ({ week: k, points: weekly[k] }));

    res.json({ counts, weekly: weeklyArr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addAction, getActions, stats };
