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
- Click and Drag: Combining mousePressed() and mouseDragged() filters into straightforward grid position calculations makes the click-to-draw path controls incredibly responsive.

- Clear Win/Loss: The boundaries (h.queue > 6 triggering an instant menu state override) offer a simple example of state machines.

- Coordinate Mapping: Multiplying simple grid index positions directly against fixed pixel metrics (cellSize + 15) makes it easy to understand coordinate translation math.

- Right-Click Override: Using browser block hooks like document.oncontextmenu = () => false is a clever way to handle custom user inputs without third-party libraries.

What to Improve:
- Queue Variables: The game does not visually show how close a house is to its 6-car limit, leaving players confused as to why they suddenly hit an unexpected game-over screen.

- Incomplete Target Path: Cars disappear instantly at the edge of destinations rather than driving directly into the middle of the tiles, creating a slightly choppy visual transition.

- Fallback for Images: If local audio streams or external images (grass.jpg) fail to load over slow connections, the script crashes completely instead of executing vector fallbacks.
