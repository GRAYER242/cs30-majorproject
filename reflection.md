1. What advice would you give to yourself if you were to start a project like this again?

If I were to start this project again, I would spend more time planning the overall structure before coding. Features such as pathfinding, car spawning, and traffic management became more complicated as the project grew. Creating a clearer design plan and testing each feature individually before combining them would have made development smoother and reduced debugging time.

2. Did you complete everything in your “needs to have” list?

Yes, I completed all of the features from my "needs to have" list:

Grid-Based Map – The game uses a 2D grid system for roads, houses, and destinations.
Road Placement System – Players can place and remove roads using the mouse and drag to draw continuously.
Car Movement – Cars move automatically along paths using smooth interpolation.
Pathfinding Algorithm – BFS (Breadth-First Search) is used to find routes from houses to matching destinations.
Traffic System – Houses build up queues of waiting cars, creating congestion when routes are unavailable.
Game Over Condition – The game ends when too many cars accumulate at a house.
User Interface – The game displays score, high score, timer, menus, instructions, pause functionality, and a game-over screen.

I also completed several "nice to have" features, including multiple house/destination pairs, sound effects, background engine sounds, a start menu, restart functionality, improved visuals using images, and a pause system.

3. What was the hardest part of the project?

The hardest part of the project was implementing the BFS pathfinding system. Cars needed to find valid routes across roads while matching the correct destination color. It took careful debugging to make sure paths were found correctly and that cars behaved properly when roads were added or removed. Managing all the interactions between roads, cars, houses, and destinations was also challenging.

4. Were there any problems you could not solve?

There were a few features from my "nice to have" list that I did not complete, such as traffic lights, roundabouts, highways, bridges, increasing difficulty mechanics, and smoother traffic congestion where cars physically block one another. While I was able to create a functioning traffic system using house queues, implementing realistic vehicle interactions would have required significantly more time and complexity. However, I was able to solve all of the major problems necessary to create a fully playable game that met the project requirements.