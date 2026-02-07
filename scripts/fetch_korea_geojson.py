import requests
import json

url = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson"
print(f"Downloading {url}...")
response = requests.get(url)
data = response.json()

print("Filtering for South Korea (KOR)...")
korea_feature = None
for feature in data['features']:
    if feature['properties'].get('ADM0_A3') == 'KOR':
        korea_feature = feature
        break

if korea_feature:
    print("Found South Korea data.")
    # Create a FeatureCollection with just South Korea
    korea_data = {
        "type": "FeatureCollection",
        "features": [korea_feature]
    }
    
    output_path = "public/south-korea-border.json"
    with open(output_path, 'w') as f:
        json.dump(korea_data, f)
    print(f"Saved to {output_path}")
else:
    print("Could not find South Korea data.")
