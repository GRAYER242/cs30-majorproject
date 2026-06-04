CS30 Major Project Beta Testing


Experienced Coder:

What they Liked:
- Separation of Search Responsibilities: Splitting algorithmic concerns into a macro-check (isReachable for map spawns) and a micro-check (findPath for roads) is an excellent structural design pattern.

- Array State Tracking: Storing unique properties (road, house, destination)  inside a clean 2D array grid object maps makes spatial queries very effective.

- Vector Interpolation: Using linear interpolation (lerp) with array destination filtering gives the car movement a smooth feel.

- JavaScript Audio: Scaling dynamic soundscapes directly using .cloneNode() duplication shows a good understanding of browser memory allocation.

What to Improve:
- Loop String Conversions: Using .toString() on p5.js color elements inside nested while loops triggers garbage collection spikes and will lag under heavy traffic.

- Array-Spreading Performance Drops: Recreating arrays via [...current.path] inside every single BFS step forces continuous memory reallocation; tracking steps using linked index parents would be faster.

- Destructive Resize Events: Resetting the map entirely inside windowResized() wipes active score parameters and map arrays, which frustrates players who change window scales mid-game.

Inexperienced Coder:

What they Liked:
- 

What to Improve:
- 