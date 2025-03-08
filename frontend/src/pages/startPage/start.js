import "./start.css"
import bread from "../../assets/pastryicons/bread.png"
import tart from "../../assets/pastryicons/pie.png"
import cookies from "../../assets/pastryicons/cookies.png"
import pancakes from "../../assets/pastryicons/pancake.png"
import donut from "../../assets/pastryicons/donut.png"
import pretzel from "../../assets/pastryicons/pretzel.png"
import cake from "../../assets/pastryicons/cake.png"
import cinnamonRoll from "../../assets/pastryicons/cinnamon.png"
import cdIcon from "../../assets/pastryicons/cd.png"

function getRandomPosition() {
  // Random values for position within the 80% of container width and height
  const x = Math.random() * 80; // Between 0 and 80%
  const y = Math.random() * 80; // Between 0 and 80%
  return { x, y };
}

function Start() {
  const items = [
    { src: bread, alt: "Bread" },
    { src: tart, alt: "Tart" },
    { src: cookies, alt: "Cookies" },
    { src: pancakes, alt: "Pancakes" },
    { src: donut, alt: "Donut" },
    { src: pretzel, alt: "Pretzel" },
    { src: cake, alt: "Cake" },
    { src: cinnamonRoll, alt: "Cinnamon Roll" },
  ];

  return (
    <div className="game-container">
      <div className="bakery-items top-items">
        {items.slice(0, 4).map((item, index) => {
          const position = getRandomPosition();
          return (
            <img
              key={index}
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              className="bakery-item"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            />
          );
        })}
      </div>

      <div className="title-container">
        <h1 className="game-title">Dough-Re-Mi</h1>
        <div className="start-button">
          <span>Start</span>
          <img src={cdIcon || "/placeholder.svg"} alt="CD Icon" className="cd-icon" />
        </div>
      </div>

      <div className="bakery-items bottom-items">
        {items.slice(4).map((item, index) => {
          const position = getRandomPosition();
          return (
            <img
              key={index}
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              className="bakery-item"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Start;
