"""
Generates a unique PetOLife ID.
Format: POL-{PET_TYPE_SHORT}-{TIMESTAMP_BASE36}-{RANDOM}
Example: POL-DOG-LK3M2A-X9

Also encodes all provided pet IDs into the PetOLife ID as metadata
so one scan reveals everything.

Ported from: backend/utils/generatePetolifeId.js
"""

import time
import random
import string


def _to_base36(num: int) -> str:
    """Convert an integer to a base36 string."""
    chars = string.digits + string.ascii_lowercase
    if num == 0:
        return "0"
    result = []
    while num:
        num, remainder = divmod(num, 36)
        result.append(chars[remainder])
    return "".join(reversed(result)).upper()


def generate_petolife_id(pet_type: str, pet_ids: list[dict] | None = None) -> str:
    """
    Generate a unique PetOLife ID.

    Args:
        pet_type: e.g. "Dog", "Cat", "Bird"
        pet_ids: list of dicts with 'idName' and 'idNumber' keys

    Returns:
        String like "POL-DOG-LK3M2A-X9~KCI:ABC123"
    """
    type_short = pet_type[:3].upper()  # DOG, CAT, BRD etc
    time_part = _to_base36(int(time.time() * 1000))  # base36 timestamp (ms)
    random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))

    base_id = f"POL-{type_short}-{time_part}-{random_part}"

    # Append encoded external IDs if present (KCI, microchip, etc.)
    # Format appended: ~KCI:ABC123~MIC:XYZ789
    if pet_ids:
        valid_ids = [
            p for p in pet_ids
            if p.get("idName", "").strip() and p.get("idNumber", "").strip()
        ]
        if valid_ids:
            encoded = "~".join(
                f"{p['idName'].strip()[:5].upper()}:{p['idNumber'].strip()}"
                for p in valid_ids
            )
            return f"{base_id}~{encoded}"

    return base_id
