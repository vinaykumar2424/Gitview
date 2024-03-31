# GitView

## Introduction
GitView is a web application built with React.js for the frontend and Express.js for the backend. It facilitates easy exploration and documentation generation for GitHub repositories. With GitView, users can discover repositories, view user profiles, and generate comprehensive documentation effortlessly.

## Features
- **User Profile Exploration**: Users can search for GitHub users by username and view their profiles.
- **Repository Documentation Generation**: GitView automates the process of generating documentation for GitHub repositories. It analyzes code files and READMEs to create comprehensive documentation.
- **Search History**: GitView keeps track of search history, allowing users to revisit previously searched profiles and repositories.
- **Responsive Design**: The application is designed to be responsive and accessible across various devices and screen sizes.

## Note
- **Rate Limit**: The application is subject to rate limits imposed by the GitHub API. Please use it responsibly and for small application which don't have large tokens.
- **API Key**: Ensure you have a valid OpenAI API key set up for generating documentation.

## Components
- **Home**: The landing page of the application where users can search for GitHub users and repositories.
- **User Details**: Displays detailed information about a GitHub user, including their repositories.
- **Description**: Generates documentation for a selected GitHub repository based on its contents.

## Packages Used
- **Frontend Dependencies**:
  - `axios`: Library for making HTTP requests.
  - `react-router-dom`: Library for routing in React applications.
  - `react-paginate`: Library for pagination in React applications.
  - `react-syntax-highlighter`: Library for syntax highlighting in React applications.
  - `sanitize-html`: Library for sanitizing HTML input.
- **Backend Dependencies**:
  - `express`: Web framework for Node.js.
  - `axios`: HTTP client for making requests.
  - `cors`: Middleware for enabling Cross-Origin Resource Sharing.
  - `dotenv`: Library for loading environment variables.
  - `compression`: Middleware for compressing HTTP responses.

## Usage
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd gitview`
3. Install dependencies: `npm install`
4. Start the frontend server: `npm start`
5. Start the backend server: `node server.js`
6. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Component Structure
![Component Structure](./component-structure.png)

## Conclusion
GitView simplifies the process of exploring GitHub repositories and generating documentation. Its user-friendly interface and powerful features make it a valuable tool for developers and researchers alike.

## Contributing
Contributions are welcome! Please follow the guidelines outlined in the CONTRIBUTING.md file.

## License
This project is licensed under the [MIT License](LICENSE).
