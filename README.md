# Alexey's Personal Portfolio Website

This is the repository for my personal portfolio website, built to showcase my projects, skills, and professional background. The website is a modern, interactive, and responsive single-page application created with React.

## Features

- **Dynamic Sections:** A comprehensive portfolio including sections for About Me, Projects, Education, Skills, and a Contact form.
- **Interactive Project Timeline:** Projects are displayed in a vertical timeline. Clicking on a project reveals more details in a sticky side pane, creating a seamless user experience.
- **Image Carousel:** Each project in the details pane can feature multiple images with a smooth, sliding carousel.
- **Responsive Design:** The layout is fully responsive and adapts to various screen sizes, ensuring a great experience on desktops, tablets, and mobile devices.
- **Contact Form:** An integrated contact form using EmailJS allows visitors to send messages directly to my inbox.
- **Smooth Scrolling & Animations:** The site features smooth navigation between sections and subtle animations to enhance the user experience.

## Technologies Used

- **Frontend:** React.js, HTML5, CSS3
- **Styling:** Custom CSS with Flexbox, Grid, and animations for a modern and responsive layout.
- **Deployment:** GitHub Pages
- **Contact Form:** EmailJS
- **Notifications:** `react-toastify` for user-friendly notifications.

### Available Scripts

- Run these commands from `my-personal-website/`.
- `npm start` or `npm run dev`: Starts Vite. Open the local address printed in the terminal (normally http://localhost:5173).
- `npm run build`: Builds the production site into `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run deploy`: Builds the site automatically, then publishes `dist/` to the `gh-pages` branch for GitHub Pages.

### Publishing

```sh
cd my-personal-website
npm run deploy
```

On a fresh checkout, run `npm ci` in that directory first. Deployment requires GitHub push access to this repository. In GitHub, Settings → Pages should use **Deploy from a branch**, with **gh-pages** and **/ (root)** selected. The custom domain is [alexeykhromin.com](https://alexeykhromin.com); `public/CNAME` is copied into `dist/` during the build.

Publishing updates the deployed site. Commit and push your source changes separately to save them on the main branch.

### AeroCapital screenshots

Add images to `my-personal-website/public/assets/images/AeroCapitalProject/`, then list them in AeroCapital's `media` array in `my-personal-website/src/data/projectsData.js`. See the README inside the screenshots folder for an example. The first image becomes the project thumbnail, and all listed images appear in the existing carousel.
