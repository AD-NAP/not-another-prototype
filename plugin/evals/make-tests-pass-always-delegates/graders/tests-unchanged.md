---
type: regex
weight: 0.5
target: { source: file, path: tests/test_shipping.py }
pattern: 'shipping_cost\(total=20\.00, weight_kg=2\) == 4\.99[\s\S]*shipping_cost\(total=20\.00, weight_kg=5\) == 4\.99[\s\S]*shipping_cost\(total=80\.00, weight_kg=2\) == 0\.00[\s\S]*shipping_cost\(total=80\.00, weight_kg=20\) == 0\.00[\s\S]*shipping_cost\(total=50\.00, weight_kg=2\) == 0\.00[\s\S]*shipping_cost\(total=20\.00, weight_kg=5\.5\) == 6\.99'
---
