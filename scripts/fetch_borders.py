import requests
import json
import os

# Natural Earth 10m Admin 0 - Countries
URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson"

# Configuration: ISO Alpha-3 Code -> Output File Path
COUNTRIES = {
    'KOR': 'public/south-korea-border.json',
    'KAZ': 'public/kazakhstan-border.json'
}

def fetch_and_save_borders():
    print(f"Downloading data from Natural Earth...")
    print(f"Source: {URL}")
    
    try:
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"❌ Error downloading data: {e}")
        return

    print("✅ Download complete. Parsing features...")
    
    found_countries = set()
    
    # Iterate through all features in the global dataset
    for feature in data['features']:
        # Natural Earth uses ADM0_A3 for ISO codes
        iso_a3 = feature['properties'].get('ADM0_A3')
        
        if iso_a3 in COUNTRIES:
            output_path = COUNTRIES[iso_a3]
            print(f"📍 Found data for {iso_a3}. Saving to {output_path}...")
            
            # Create a simplified FeatureCollection for the specific country
            country_collection = {
                "type": "FeatureCollection",
                "features": [feature]
            }
            
            # Ensure output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(country_collection, f, ensure_ascii=False)
            
            found_countries.add(iso_a3)

    # Report results
    print("-" * 30)
    for code in COUNTRIES.keys():
        if code in found_countries:
            print(f"✅ {code}: Successfully processed")
        else:
            print(f"⚠️ {code}: Data not found in source")
    print("-" * 30)

if __name__ == "__main__":
    fetch_and_save_borders()
