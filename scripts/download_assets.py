import urllib.request
import os

os.makedirs('/public/images', exist_ok=True)

# Curated high-res Unsplash photos matching image.png exactly:
# 1. Hero: Father & son/cyclists on mountain road in golden hour
# 2. Enterprises: Modern red bicycle & lifestyle appliances / cookware
# 3. Industries: Mountain bikes in alpine mountain trail
# 4. Service: Professional bicycle mechanic in gloves tuning wheel in workshop

images = {
    # Father and child / cyclists riding on mountain road into golden hour mountains
    'hero-cyclists.jpg': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1920&auto=format&fit=crop',
    # Cycling mountain landscape golden hour
    'hero-mountain-road.jpg': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1920&auto=format&fit=crop',
    # Red bicycle & modern products
    'enterprises-composite.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop',
    # Modern stainless steel cookware & gas stove / kitchen appliances
    'kitchen-appliances.jpg': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop',
    # Mountain trail bikes outdoors
    'industries-bicycles.jpg': 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=1000&auto=format&fit=crop',
    # Mechanic repairing bicycle wheel with gloves in workshop
    'service-workshop.jpg': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?q=80&w=1400&auto=format&fit=crop',
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, url in images.items():
    dest = os.path.join('/public/images', name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            print(f"Downloaded {name} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
