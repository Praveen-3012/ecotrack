import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const OPTIONS = [
  // Waste Management
  { value: 'Recycled', label: '♻️ Recycled (10 pts)', category: 'Waste Management' },
  { value: 'Composted', label: '🌱 Composted Organic Waste (15 pts)', category: 'Waste Management' },
  { value: 'AvoidedPlastic', label: '🚫 Avoided Single-Use Plastic (20 pts)', category: 'Waste Management' },
  { value: 'ReusedContainer', label: '📦 Reused Container/Jar (8 pts)', category: 'Waste Management' },
  { value: 'DonatedItems', label: '🎁 Donated Unused Items (12 pts)', category: 'Waste Management' },
  { value: 'RepairedInsteadOfBuying', label: '🔧 Repaired Instead of Buying New (18 pts)', category: 'Waste Management' },
  { value: 'UsedReusableBag', label: '🛍️ Used Reusable Shopping Bag (5 pts)', category: 'Waste Management' },
  { value: 'RefusedDisposables', label: '🥤 Refused Disposable Items (10 pts)', category: 'Waste Management' },
  
  // Transportation
  { value: 'PublicTransport', label: '🚌 Used Public Transport (15 pts)', category: 'Transportation' },
  { value: 'Biked', label: '🚴 Biked Instead of Driving (20 pts)', category: 'Transportation' },
  { value: 'Walked', label: '🚶 Walked Instead of Driving (18 pts)', category: 'Transportation' },
  { value: 'Carpooled', label: '🚗 Carpooled (12 pts)', category: 'Transportation' },
  { value: 'ElectricVehicle', label: '⚡ Used Electric Vehicle (25 pts)', category: 'Transportation' },
  { value: 'WorkedFromHome', label: '🏠 Worked From Home (15 pts)', category: 'Transportation' },
  { value: 'CombinedTrips', label: '🗺️ Combined Multiple Trips (10 pts)', category: 'Transportation' },
  
  // Energy
  { value: 'UsedSolarPower', label: '☀️ Used Solar Power (40 pts)', category: 'Energy' },
  { value: 'UnpluggedDevices', label: '🔌 Unplugged Unused Devices (10 pts)', category: 'Energy' },
  { value: 'UsedNaturalLight', label: '💡 Used Natural Light (8 pts)', category: 'Energy' },
  { value: 'EnergyEfficientAppliance', label: '⚙️ Used Energy Efficient Appliance (30 pts)', category: 'Energy' },
  { value: 'ReducedHeatingCooling', label: '🌡️ Reduced Heating/Cooling (15 pts)', category: 'Energy' },
  { value: 'UsedColdWater', label: '❄️ Washed with Cold Water (10 pts)', category: 'Energy' },
  { value: 'AirDried', label: '🌬️ Air Dried Clothes (12 pts)', category: 'Energy' },
  
  // Water Conservation
  { value: 'ShortShower', label: '🚿 Took Short Shower (10 pts)', category: 'Water' },
  { value: 'FixedLeak', label: '🔧 Fixed Water Leak (20 pts)', category: 'Water' },
  { value: 'RainwaterHarvesting', label: '🌧️ Harvested Rainwater (25 pts)', category: 'Water' },
  { value: 'WateredPlantsEfficiently', label: '💧 Watered Plants Efficiently (8 pts)', category: 'Water' },
  { value: 'UsedDishwasherFull', label: '🍽️ Used Full Dishwasher Load (10 pts)', category: 'Water' },
  { value: 'InstalledLowFlowFixture', label: '🚰 Installed Low-Flow Fixture (22 pts)', category: 'Water' },
  
  // Food & Diet
  { value: 'VegetarianMeal', label: '🥗 Ate Vegetarian Meal (15 pts)', category: 'Food' },
  { value: 'VeganMeal', label: '🌿 Ate Vegan Meal (20 pts)', category: 'Food' },
  { value: 'LocalFood', label: '🏪 Bought Local Food (12 pts)', category: 'Food' },
  { value: 'OrganicFood', label: '🌾 Bought Organic Food (15 pts)', category: 'Food' },
  { value: 'ReducedFoodWaste', label: '🗑️ Reduced Food Waste (10 pts)', category: 'Food' },
  { value: 'MealPrepped', label: '🍱 Meal Prepped (8 pts)', category: 'Food' },
  { value: 'GrewOwnFood', label: '🌻 Grew Own Food (25 pts)', category: 'Food' },
  { value: 'AvoidedProcessedFood', label: '🥦 Avoided Processed Food (10 pts)', category: 'Food' },
  
  // Nature & Environment
  { value: 'PlantedTree', label: '🌳 Planted a Tree (50 pts)', category: 'Nature' },
  { value: 'PlantedFlowers', label: '🌺 Planted Flowers/Plants (15 pts)', category: 'Nature' },
  { value: 'CreatedBirdHabitat', label: '🐦 Created Bird Habitat (20 pts)', category: 'Nature' },
  { value: 'CleanedPark', label: '🏞️ Cleaned Park/Trail (25 pts)', category: 'Nature' },
  { value: 'BeachCleanup', label: '🏖️ Beach Cleanup (30 pts)', category: 'Nature' },
  { value: 'WildlifeConservation', label: '🦋 Wildlife Conservation Activity (35 pts)', category: 'Nature' },
  { value: 'CommunityGarden', label: '🌻 Worked in Community Garden (20 pts)', category: 'Nature' },
  
  // Shopping & Consumption
  { value: 'BoughtSecondhand', label: '👕 Bought Secondhand (15 pts)', category: 'Shopping' },
  { value: 'ChoseEcoFriendlyProduct', label: '🌍 Chose Eco-Friendly Product (12 pts)', category: 'Shopping' },
  { value: 'MinimalistPurchase', label: '✨ Minimalist Purchase Decision (10 pts)', category: 'Shopping' },
  { value: 'SupportedLocalBusiness', label: '🏪 Supported Local Business (10 pts)', category: 'Shopping' },
  { value: 'BoughtInBulk', label: '📦 Bought in Bulk (8 pts)', category: 'Shopping' },
  { value: 'AvoidedFastFashion', label: '👗 Avoided Fast Fashion (18 pts)', category: 'Shopping' },
  
  // Education & Advocacy
  { value: 'EducatedOthers', label: '📚 Educated Others About Environment (20 pts)', category: 'Advocacy' },
  { value: 'AttendedEcoEvent', label: '🎪 Attended Eco Event (15 pts)', category: 'Advocacy' },
  { value: 'SignedPetition', label: '✍️ Signed Environmental Petition (10 pts)', category: 'Advocacy' },
  { value: 'VolunteeredForEnvironment', label: '🤝 Volunteered for Environment (30 pts)', category: 'Advocacy' },
  { value: 'SharedEcoTips', label: '💬 Shared Eco Tips (12 pts)', category: 'Advocacy' },
  { value: 'ParticipatedInEcoCampaign', label: '📢 Participated in Eco Campaign (25 pts)', category: 'Advocacy' }
];

export default function AddAction(){
  const [category, setCategory] = useState('Recycled');
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const navigate = useNavigate();

  // Initialize selected action on mount
  React.useEffect(() => {
    const action = OPTIONS.find(o => o.value === category);
    setSelectedAction(action);
  }, []);

  const handleActionSelect = (value) => {
    setCategory(value);
    const action = OPTIONS.find(o => o.value === value);
    setSelectedAction(action);
  };

  const submit = async (e) => {
    e.preventDefault();
    try{
      console.log('Submitting action:', { category, note });
      const response = await api.post('/actions', { category, note });
      console.log('Action added successfully:', response.data);
      navigate('/');
    }catch(e){ 
      console.error('Error adding action:', e.response?.data || e.message); 
      alert('Failed to add action: ' + (e.response?.data?.message || e.message));
    }
  }

  // Group options by category
  const groupedOptions = OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) acc[option.category] = [];
    acc[option.category].push(option);
    return acc;
  }, {});

  // Filter options based on search
  const filteredOptions = OPTIONS.filter(o => 
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="add-action-container">
      <form onSubmit={submit}>
        <h2>Add Eco Action</h2>
        
        {/* Selected Action Display */}
        {selectedAction && (
          <div className="selected-action-card">
            <div className="selected-action-header">
              <span className="selected-action-emoji">{selectedAction.label.split(' ')[0]}</span>
              <div className="selected-action-info">
                <h3>{selectedAction.label.split(' ').slice(1).join(' ')}</h3>
                <span className="selected-action-category">{selectedAction.category}</span>
              </div>
            </div>
          </div>
        )}

        <div className="form-row">
          <label>🔍 Search Action</label>
          <input 
            type="text"
            placeholder="Type to search actions..."
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)} 
            className="search-input"
          />
        </div>

        <div className="form-row">
          <label>📋 Select Action</label>
          <select 
            value={category} 
            onChange={e=>handleActionSelect(e.target.value)}
            size="8"
            className="action-select"
          >
            {searchTerm ? (
              // Show filtered results
              filteredOptions.map(o=> 
                <option key={o.value} value={o.value}>{o.label}</option>
              )
            ) : (
              // Show grouped by category
              Object.entries(groupedOptions).map(([cat, options]) => (
                <optgroup key={cat} label={`━━ ${cat} ━━`}>
                  {options.map(o=> 
                    <option key={o.value} value={o.value}>{o.label}</option>
                  )}
                </optgroup>
              ))
            )}
          </select>
        </div>

        <div className="form-row">
          <label>📝 Note (Optional)</label>
          <textarea 
            placeholder="Add any additional details about this action..."
            value={note} 
            onChange={e=>setNote(e.target.value)}
            rows="4"
            className="note-textarea"
          />
        </div>
        
        <button className="btn btn-submit" type="submit">
          <span className="btn-icon">✓</span>
          Add Action
        </button>
      </form>
    </div>
  )
}
