"""
Species-specific daily care task templates. 

Each species has a list of tasks with:
- id: unique key
- title: human-friendly display title
- icon: SVG file name (without extension) to load from assets/icons/
- question: contextual question shown on the task card
- confirm_text: positive action button text
- skip_text: negative action button text
- suggested_time: rough time of day for ordering
"""


DOG_TASKS = [
    {
        "id": "morning_walk",
        "title": "Morning Adventure",
        "icon": "icon-walk",
        "question": "Did {pet_name} enjoy a walk?",
        "confirm_text": "Yes, We Went",
        "skip_text": "Not Today",
        "suggested_time": "07:00",
    },
    {
        "id": "water",
        "title": "Fresh Water Check",
        "icon": "icon-water",
        "question": "Is {pet_name}'s water bowl refilled?",
        "confirm_text": "Refilled",
        "skip_text": "Forgot",
        "suggested_time": "08:00",
    },
    {
        "id": "breakfast",
        "title": "Breakfast Time",
        "icon": "icon-food",
        "question": "Has {pet_name} had breakfast?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "08:30",
    },
    {
        "id": "playtime",
        "title": "Play Session",
        "icon": "icon-play",
        "question": "Did {pet_name} have some fun?",
        "confirm_text": "Had Fun",
        "skip_text": "Not Yet",
        "suggested_time": "12:00",
    },
    {
        "id": "evening_walk",
        "title": "Evening Walk",
        "icon": "icon-walk",
        "question": "Did {pet_name} get an evening walk?",
        "confirm_text": "Yes, We Went",
        "skip_text": "Not Today",
        "suggested_time": "18:00",
    },
    {
        "id": "dinner",
        "title": "Dinner Time",
        "icon": "icon-food",
        "question": "Has {pet_name} had dinner?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "19:00",
    },
]


CAT_TASKS = [
    {
        "id": "litter_box",
        "title": "Clean Litter Box",
        "icon": "icon-clean",
        "question": "Is {pet_name}'s litter box clean?",
        "confirm_text": "All Clean",
        "skip_text": "Not Yet",
        "suggested_time": "07:00",
    },
    {
        "id": "water",
        "title": "Fresh Water Check",
        "icon": "icon-water",
        "question": "Is {pet_name}'s water bowl fresh?",
        "confirm_text": "Refilled",
        "skip_text": "Forgot",
        "suggested_time": "08:00",
    },
    {
        "id": "breakfast",
        "title": "Breakfast Time",
        "icon": "icon-food",
        "question": "Has {pet_name} had breakfast?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "08:30",
    },
    {
        "id": "interactive_play",
        "title": "Play Session",
        "icon": "icon-play",
        "question": "Did {pet_name} have some playtime?",
        "confirm_text": "Had Fun",
        "skip_text": "Not Yet",
        "suggested_time": "12:00",
    },
    {
        "id": "scratching",
        "title": "Scratch Enrichment",
        "icon": "icon-scratch",
        "question": "Did {pet_name} use the scratch post?",
        "confirm_text": "Yes, Used It",
        "skip_text": "Skipped",
        "suggested_time": "15:00",
    },
    {
        "id": "dinner",
        "title": "Dinner Time",
        "icon": "icon-food",
        "question": "Has {pet_name} had dinner?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "19:00",
    },
]


RABBIT_TASKS = [
    {
        "id": "hay_refill",
        "title": "Hay Refill",
        "icon": "icon-hay",
        "question": "Is {pet_name}'s hay topped up?",
        "confirm_text": "Refilled",
        "skip_text": "Not Yet",
        "suggested_time": "07:00",
    },
    {
        "id": "water",
        "title": "Fresh Water Check",
        "icon": "icon-water",
        "question": "Is {pet_name}'s water bottle fresh?",
        "confirm_text": "Refilled",
        "skip_text": "Forgot",
        "suggested_time": "08:00",
    },
    {
        "id": "exercise",
        "title": "Exercise Time",
        "icon": "icon-exercise",
        "question": "Did {pet_name} get some exercise?",
        "confirm_text": "Yes, Hopped Around",
        "skip_text": "Not Today",
        "suggested_time": "10:00",
    },
    {
        "id": "veggies",
        "title": "Veggies",
        "icon": "icon-veggies",
        "question": "Did {pet_name} get fresh veggies?",
        "confirm_text": "Yes, Munching",
        "skip_text": "Skipped",
        "suggested_time": "12:00",
    },
    {
        "id": "habitat_cleaning",
        "title": "Habitat Cleaning",
        "icon": "icon-clean",
        "question": "Is {pet_name}'s habitat clean?",
        "confirm_text": "All Clean",
        "skip_text": "Not Yet",
        "suggested_time": "16:00",
    },
    {
        "id": "evening_feeding",
        "title": "Evening Feeding",
        "icon": "icon-food",
        "question": "Has {pet_name} had evening food?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "19:00",
    },
]


BIRD_TASKS = [
    {
        "id": "water",
        "title": "Fresh Water",
        "icon": "icon-water",
        "question": "Is {pet_name}'s water dish fresh?",
        "confirm_text": "Refilled",
        "skip_text": "Forgot",
        "suggested_time": "07:00",
    },
    {
        "id": "food_refill",
        "title": "Food Refill",
        "icon": "icon-food",
        "question": "Is {pet_name}'s food topped up?",
        "confirm_text": "Refilled",
        "skip_text": "Not Yet",
        "suggested_time": "08:00",
    },
    {
        "id": "out_of_cage",
        "title": "Out-of-Cage Time",
        "icon": "icon-freedom",
        "question": "Did {pet_name} fly around today?",
        "confirm_text": "Yes, Flying Free",
        "skip_text": "Not Today",
        "suggested_time": "10:00",
    },
    {
        "id": "toy_rotation",
        "title": "Toy Rotation",
        "icon": "icon-play",
        "question": "Did you rotate {pet_name}'s toys?",
        "confirm_text": "Done",
        "skip_text": "Skipped",
        "suggested_time": "12:00",
    },
    {
        "id": "social_interaction",
        "title": "Social Interaction",
        "icon": "icon-social",
        "question": "Did you spend time with {pet_name}?",
        "confirm_text": "Quality Time",
        "skip_text": "Not Yet",
        "suggested_time": "15:00",
    },
    {
        "id": "evening_check",
        "title": "Evening Check",
        "icon": "icon-night",
        "question": "Is {pet_name} settled for the night?",
        "confirm_text": "All Good",
        "skip_text": "Need to Check",
        "suggested_time": "20:00",
    },
]


# Default fallback for unknown species
DEFAULT_TASKS = [
    {
        "id": "water",
        "title": "Fresh Water",
        "icon": "icon-water",
        "question": "Is your pet's water fresh?",
        "confirm_text": "Refilled",
        "skip_text": "Forgot",
        "suggested_time": "08:00",
    },
    {
        "id": "feeding",
        "title": "Feeding",
        "icon": "icon-food",
        "question": "Has your pet been fed?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "08:30",
    },
    {
        "id": "playtime",
        "title": "Play Session",
        "icon": "icon-play",
        "question": "Did your pet have some fun?",
        "confirm_text": "Had Fun",
        "skip_text": "Not Yet",
        "suggested_time": "12:00",
    },
    {
        "id": "evening_feeding",
        "title": "Evening Feeding",
        "icon": "icon-food",
        "question": "Has your pet had dinner?",
        "confirm_text": "Yes, Fed",
        "skip_text": "Missed Feeding",
        "suggested_time": "19:00",
    },
]


def get_tasks_for_species(species: str) -> list[dict]:
    """Return the task template list for the given species."""
    species_lower = species.strip().lower()
    if species_lower == "dog":
        return DOG_TASKS
    elif species_lower == "cat":
        return CAT_TASKS
    elif species_lower == "rabbit":
        return RABBIT_TASKS
    elif species_lower == "bird":
        return BIRD_TASKS
    else:
        return DEFAULT_TASKS


def get_wellness_message(score: int, pet_name: str) -> str:
    """Return a dynamic feedback message based on the wellness score."""
    if score >= 100:
        return f"Perfect care streak maintained for {pet_name}!"
    elif score >= 70:
        return f"{pet_name} had an awesome day."
    elif score >= 40:
        return f"Almost there! One more task can boost {pet_name}'s score."
    elif score >= 20:
        return f"{pet_name} could use a little more love today."
    else:
        return f"{pet_name} is waiting for some care today."


def get_mood_level(score: int) -> str:
    """Return mood level string based on wellness score."""
    if score >= 90:
        return "ecstatic"
    elif score >= 70:
        return "happy"
    elif score >= 40:
        return "neutral"
    elif score >= 20:
        return "sad"
    else:
        return "worried"
