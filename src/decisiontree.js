const decisionTree = {
  start: {
    message: "Welcome to the Maize Farming Assistant! Have you prepared your land? (yes/no)",
    options: {
      yes: "month_check",
      no: "land_prep"
    }
  },
  land_prep: {
    message: "You should start by cleaning weeds and tilling the land deeply. Come back when you're ready to plant.",
    end: true
  },
  month_check: {
    message: "What month is it now? (March, April, other)",
    options: {
      March: "plant_now",
      April: "plant_now", // ✅ fixed typo here
      other: "wait_for_rains"
    }
  },
  plant_now: {
    message: "It's a good time to plant! Use 2-3 seeds per hole, spaced 2.5 cm deep, and apply DAP fertilizer at planting.",
    next: "pest_check"
  },
  wait_for_rains: {
    message: "It may not be the ideal time to plant. Wait for the rainy season, usually March or April in most regions.",
    end: true
  },
  pest_check: {
    message: "Do you know how to control pests like Fall Armyworm? (yes/no)",
    options: {
      yes: "end_good_luck",
      no: "pest_advice"
    }
  },
  pest_advice: {
    message: "Scout your maize weekly. For Fall Armyworm, use recommended insecticides early in the morning or evening.",
    next: "harvest_info"
  },
  end_good_luck: {
    message: "Great! You're on track. Remember to monitor your crop health weekly.",
    end: true
  },
  harvest_info: {
    message: "When maize leaves turn yellow and cobs are dry, it's time to harvest. Store in a dry, well-ventilated space.",
    end: true
  }
};

export default decisionTree;
