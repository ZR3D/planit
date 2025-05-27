🪐 Planit

Planit is a simple, modular, offline-friendly productivity suite designed to help individuals and small households organize everyday tasks. Each component of Planit—like Taskit, Shopit, Menuit, and more—is a focused tool that works independently or together through the Viewit dashboard.

Planit is designed with clarity, lightness, and balance in mind, encouraging consistent routines without overwhelming users.

✨ Features
🗂 Taskit – Weekly to-do list with copy-forward for recurring tasks

🛒 Shopit – Shopping list builder (planned)

🍽 Menuit – Menu planner (planned)

🧑‍🌾 Growit – Garden and seasonal planning (planned)

📆 Buildit – Project timeline with Gantt-style tracking

🧭 Viewit – Daily dashboard with one-task focus and encouraging feedback

Each app is written in lightweight HTML+JavaScript with no backend dependencies—perfect for low-energy, off-grid, or privacy-conscious environments.

🌐 Live Demo
https://zr3d.github.io/planit/

🔧 Installation
You can run Planit directly in your browser:

Visit the GitHub Pages link

Bookmark the page or save it offline for regular use

Or to run locally on a python server to avoid CORS issues (file-based fetch is used to load Javascript etc.): <br />
git clone https://github.com/zr3d/planit.git <br />
cd planit <br />
python3 -m http.server 8000 <br />
Then open your browser and go to: <br />
http://localhost:8000/ <br />

🛠 Developer Notes
This is a work-in-progress project with a modular structure. Each card (app) is being built and tested individually before integration into the Viewit dashboard. Feedback, forks, and collaboration are welcome.
