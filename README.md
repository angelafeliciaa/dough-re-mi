# Dough-Re-Mi
<img width="430" height="400" alt="Screenshot 2025-03-10 at 13 06 22" src="https://github.com/user-attachments/assets/fa60fd8c-e07a-44f9-9c75-58ab4187e2e4" />


![gallery](https://github.com/user-attachments/assets/78f3f1a0-d411-4716-9f21-4a82824c74b4)


Dough-Re-Mi is a dual-player web app that brings karaoke and racing into one awesome experience. Two players belt out their favorite tunes, and the louder and more on-pitch they are, the faster their car goes in this pixel art racing game. The better your voice, the better your ride! 🎤🚗 Your score helps propel your car to the finish line, and once you're done, you get to see where you rank on the leaderboard. Oh, and don’t worry—there’s a cute little sidekick ready to offer some silly feedback on your performance. 😉

# How we built it

Front-End: We wanted to keep that nostalgic arcade charm while keeping it smooth and modern. So, we used React and CSS to make the front-end pop with vibrant pixel art vibes. We also utilized framer motion to make the cars moving animation.

Back-End: We mainly used JavaScript for our backend, utilizing the PitchFinder.js library to implement the score analysis based on pitch accuracy. First, we extracted pitch data from the player recording and Sabrina Carpenter's vocals using the YIN algorithm, which detects frequency at different points in time. Then we aligns these pitch sequences and compares them frame by frame. It calculates a pitch accuracy score based on how many notes you hit within 50 cents (half a semitone) of the original. It also evaluates how well you follow melodic contours (note transitions) and whether you maintain notes properly (note sustain). These three metrics are combined with different weights (60% pitch accuracy, 30% note transitions, 10% note sustain) to create the final score from, representing how accurately the singers matched the original performance.

# Challenges we ran into

Building the scoring system was like trying to hit the right note in a song—it took a lot of trial and error! We had to get creative with the logic to make sure the scoring matched the vocal performance. And, of course, like any good duet, our web app had lots of interdependent parts, which led to so many merge conflicts. 😅 Version control became our best friend and our biggest challenge all at once.

# Accomplishments that we're proud of

For the first time ever, we built a game with solid, working logic! 🎮 We're super proud of how everything turned out—especially the UI. We poured a lot of effort into designing the assets and building a fun, immersive baking themed world where your voice really comes to life. It was also our first time dealing with audio processing (real-time, on top of that), and while there was definitely a lot of need for troubleshooting, it was a really rewarding experience as a whole!

# What we learned

From audio processing to game logic and even animation, we learned a ton along the way. It's been a journey of discovery that has made us better developers and gave us a chance to get creative.

# What's next for Dough-Re-Mi

Next up: let’s make this a true vocal showdown! We’re planning to have two people singing at once, analyzing their audio and scores simultaneously. This means double the fun and double the competition! 🎤🔥

Devpost: https://devpost.com/software/dough-re-mi