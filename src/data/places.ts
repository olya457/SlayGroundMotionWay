export type PlaceItem = {
  id: string;
  title: string;
  coords: { latitude: number; longitude: number };
  description: string;
  image: any;
};

export const PLACES: Record<string, PlaceItem> = {
  'kahnawake-sports-complex': {
    id: 'kahnawake-sports-complex',
    title: 'Kahnawake Sports Complex',
    coords: { latitude: 45.3974, longitude: -73.7128 },
    description:
      'The main sports heart of Kahnawake. Here you can always hear the sound of the ball, the smell of coffee from the machine and the feeling of lively energy. Inside there is an ice arena, rooms for team training, a fitness area and spectator stands. In the evening, under warm lighting, local teams practice until the last throw, and children watch their heroes.',
    image: require('../assets/kahnawake.png'),
  },
  'turtle-fields-arena': {
    id: 'turtle-fields-arena',
    title: 'Turtle Fields Arena',
    coords: { latitude: 45.3932, longitude: -73.7065 },
    description:
      'An open field where lacrosse and baseball are played. Dust, grass and red stands create the atmosphere of old sports legends. When the sun sets behind the trees, floodlights flood the field with warm light, and it becomes clear — here they play not for victory, but for respect for the game.',
    image: require('../assets/turtle_fields.png'),
  },
  'river-edge-running-track': {
    id: 'river-edge-running-track',
    title: 'River Edge Running Track',
    coords: { latitude: 45.3886, longitude: -73.7039 },
    description:
      'A track along the St. Lawrence River. The water shimmers nearby, and the fresh air makes every step easy. Runners stop here not because they are tired — but to watch the sun rise over the water. This place reminds us: movement is not about speed, but about the rhythm of life.',
    image: require('../assets/river_edge.png'),
  },
  'mohawk-fitness-park': {
    id: 'mohawk-fitness-park',
    title: 'Mohawk Fitness Park',
    coords: { latitude: 45.3908, longitude: -73.7131 },
    description:
      'A street strength zone — horizontal bars, handrails, ropes and concrete underfoot. You can always hear music from smartphones and short shouts of support. People come here after work, in any weather. In the dark, spotlights cast red glare on the metal, and everything looks like a nightly ritual of endurance.',
    image: require('../assets/mohawk_fitness.png'),
  },
  'peace-hill-trail': {
    id: 'peace-hill-trail',
    title: 'Peace Hill Trail',
    coords: { latitude: 45.3947, longitude: -73.7209 },
    description:
      'A short but busy trail that leads up a hill overlooking Kanawha. The scent of pine trees is all around, and in the distance you can see the glitter of the river. It’s the perfect place to recover from a workout or a quiet walk. Even the wind seems to breathe more slowly here.',
    image: require('../assets/peace_hill.png'),
  },
  'iron-bridge-crosspoint': {
    id: 'iron-bridge-crosspoint',
    title: 'Iron Bridge Crosspoint',
    coords: { latitude: 45.3920, longitude: -73.7294 },
    description:
      'A point where runners and cyclists intersect. The bridge with its metal arches, the light sound of cars and footsteps — all this creates a unique rhythm of movement. In the evening, when the sun paints the metal red, it seems that the very air here is charged with energy.',
    image: require('../assets/iron_bridge.png'),
  },
  'south-field-court': {
    id: 'south-field-court',
    title: 'South Field Court',
    coords: { latitude: 45.3851, longitude: -73.7115 },
    description:
      'A basketball court where someone is always playing. The surface is black, the rings are a little worn, but the atmosphere is real. It doesn’t matter who wins here — the main thing is that the ball doesn’t stop. Red lights burn on the poles, and evening matches look like a movie.',
    image: require('../assets/south_field.png'),
  },
  'old-riverside-gym': {
    id: 'old-riverside-gym',
    title: 'Old Riverside Gym',
    coords: { latitude: 45.3952, longitude: -73.7012 },
    description:
      'A small gym in an old brick building by the river. Inside you can hear the clatter of dumbbells and the smell of chalk on hands. This place has a soul — those who train here are not looking for convenience, but for strength. Old mirrors, metal benches and people who have been coming here for years.',
    image: require('../assets/old_riverside_gym.png'),
  },
  'windlane-skate-spot': {
    id: 'windlane-skate-spot',
    title: 'Windlane Skate Spot',
    coords: { latitude: 45.3895, longitude: -73.7173 },
    description:
      'A skate park between residential blocks. Gray concrete, graffiti on the walls and the sounds of wheels that echo until the night. Young people come here not only to skate — but to feel freedom. When the shadows of the streetlights fall in the evening, the park turns into a stage for stunts.',
    image: require('../assets/windlane_skate.png'),
  },
  'morning-flow-court': {
    id: 'morning-flow-court',
    title: 'Morning Flow Court',
    coords: { latitude: 45.3873, longitude: -73.7159 },
    description:
      'A quiet corner by the river with wooden decks for stretching and yoga. In the morning, it is light, the wind brings the smell of water, and it seems that the city is still sleeping. People come here in silence to start the day with breathing, not noise.',
    image: require('../assets/morning_flow.png'),
  },
  'red-maple-track': {
    id: 'red-maple-track',
    title: 'Red Maple Track',
    coords: { latitude: 45.3968, longitude: -73.7098 },
    description:
      'A running track among red maples, which paint the air with fire in autumn. Even a simple step here seems special. Local athletes say that if you run here every morning, your thoughts become clearer.',
    image: require('../assets/red_maple_track.png'),
  },
  'black-hawk-stadium': {
    id: 'black-hawk-stadium',
    title: 'Black Hawk Stadium',
    coords: { latitude: 45.3979, longitude: -73.7163 },
    description:
      'A large arena that can be seen even from the track. Black metal, red seats, the light of searchlights in the night fog. You can feel the power of the community here — when people stand together, shout, support, live in the moment. Even without a match, the stadium breathes energy.',
    image: require('../assets/black_hawk_stadium.png'),
  },
};

export default PLACES;
