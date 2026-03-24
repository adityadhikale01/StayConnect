const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    coordinates: {
      longitude: -118.7798,
      latitude: 34.0259,
    },
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    coordinates: {
      longitude: -74.006,
      latitude: 40.7128,
    },
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin.",
    image: {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    coordinates: {
      longitude: -106.8175,
      latitude: 39.1911,
    },
  },
  {
    title: "Historic Villa in Tuscany",
    description: "Experience the charm of Tuscany.",
    image: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    coordinates: {
      longitude: 11.2558,
      latitude: 43.7696,
    },
  },
  {
    title: "Secluded Treehouse Getaway",
    description: "Live among the treetops.",
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 800,
    location: "Portland",
    country: "United States",
    coordinates: {
      longitude: -122.6784,
      latitude: 45.5152,
    },
  },
  {
    title: "Beachfront Paradise",
    description: "Step out onto the sandy beach.",
    image: {
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    coordinates: {
      longitude: -86.8515,
      latitude: 21.1619,
    },
  },
  {
    title: "Rustic Cabin by the Lake",
    description: "Perfect for outdoor enthusiasts.",
    image: {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    coordinates: {
      longitude: -120.0324,
      latitude: 39.0968,
    },
  },
  {
    title: "Luxury Penthouse",
    description: "Panoramic city views.",
    image: {
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    coordinates: {
      longitude: -118.2437,
      latitude: 34.0522,
    },
  },
  {
    title: "Safari Lodge",
    description: "Experience the wild.",
    image: {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 4000,
    location: "Serengeti",
    country: "Tanzania",
    coordinates: {
      longitude: 34.8333,
      latitude: -2.3333,
    },
  },
  {
    title: "Private Island",
    description: "Exclusive vacation experience.",
    image: {
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "listing[image]",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    coordinates: {
      longitude: 178.065,
      latitude: -17.7134,
    },
  },
];

export default { data: sampleListings };
