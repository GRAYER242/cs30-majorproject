CS30 Major Project Beta Testing


Experienced Coder:

What they liked:
- Solid grid-based structure with clear separation of systems
- BFS pathfinding is implemented correctly
- Game state system (menu / instructions / playing / gameover) is clean and readable
- Car movement uses smooth interpolation, not rigid grid stepping
- Difficulty scaling via spawn interval creates steady pressure
- Road placement system is simple and easy to extend
- Update/render loop is separated clearly
- Instructions screen improves onboarding

What to improve:
- No visibility of house queue pressure → players can’t prioritize problems
- No high score system → weak replay incentive
- No survival timer → no sense of run length or progression
- No pause system → difficult to plan during busy moments
- No sound toggle → limited user control over audio
- No clear warning system for failing houses → loss feels abrupt
- UI doesn’t strongly communicate urgency or priorities
- House lookup uses repeated array searches (minor inefficiency)


Inexperienced Coder:

What they liked:
- Easy to start and understand (click → play immediately)
- Building roads feels responsive and interactive
- Cars moving automatically makes the world feel alive
- Colors help distinguish houses and destinations
- Instructions screen makes controls understandable
- Click-and-drag road building feels smooth
- Game naturally becomes more challenging over time
- Score gives a simple sense of progress

What to improve:
- Hard to see which houses are close to failing
- No way to tell how long a run has lasted
- No pause option to think during complex situations
- No sound controls
- No clear priority indicators for urgent houses
- Limited long-term motivation beyond score
- Feedback for success/failure is too minimal
- Instructions help, but in-game guidance is still limited
- Game can feel stressful because problems appear without warning