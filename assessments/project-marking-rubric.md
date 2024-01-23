
# Marking Rubric

### Functionality: RESTful API - 20%

| **Criteria**                                             | **10-9**                                                 | **8-7**                                                  | **6-5**                                                  | **4-0**                                                  |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| **User: User Types and Information**     | Clearly defined two user types (super admin and basic) with required information. | Minor inconsistencies or missing details in defining user types. | Significant issues or unclear definition of user types.   | Missing or inadequate definition of user types.            |
| **User: User Operations**               | Accurate description of user operations (register, login, get information, update information, delete). | Minor inconsistencies or missing details in describing user operations. | Significant issues or unclear description of user operations. | Missing or inadequate description of user operations.     |
| **User: Error Checking for Registration** | Comprehensive error checking for registration using Joi or conditional statements. | Minor issues or gaps in error checking for registration.   | Significant issues or incomplete error checking for registration. | Missing or no error checking for registration.            |
| **User: Response Messages and Status Codes** | Clear and appropriate response messages and status codes for various requests. | Minor inconsistencies or less clarity in response messages and status codes. | Significant issues or lack of clarity in response messages and status codes. | Missing or inadequate response messages and status codes. |
| **User: Seeding of Users**               | Successful seeding of super admin and basic users using scripts and external data sources. | Minor issues or inconsistencies in seeding users.        | Significant issues or omissions in seeding users.          | No seeding of users or critical omissions in the process.   |
| **User: Security Measures**              | Adequate security measures for login (JWT usage), password requirements, and unique constraints. | Minor gaps or inconsistencies in security measures.      | Significant issues or critical gaps in security measures. | No or inadequate security measures implemented.          |
| **Quiz: Quiz Information and Operations**           | Clear definition of quiz information and operations.      | Minor inconsistencies or missing details in defining quiz information and operations. | Significant issues or unclear definition of quiz information and operations. | Missing or inadequate definition of quiz information and operations. |
| **Quiz: Error Checking for Quiz Creation**          | Comprehensive error checking for quiz creation using Joi or conditional statements. | Minor issues or gaps in error checking for quiz creation. | Significant issues or incomplete error checking for quiz creation. | Missing or no error checking for quiz creation.            |
| **Quiz: Error Checking for Quiz Participation**     | Comprehensive error checking for quiz participation using Joi or conditional statements. | Minor issues or gaps in error checking for quiz participation. | Significant issues or incomplete error checking for quiz participation. | Missing or no error checking for quiz participation.      |
| **Quiz: Response Messages and Status Codes**        | Clear and appropriate response messages and status codes for various quiz requests. | Minor inconsistencies or less clarity in response messages and status codes. | Significant issues or lack of clarity in response messages and status codes. | Missing or inadequate response messages and status codes. |
| **Other Security Measures**       | Implementation of versioning, Helmet, CORS, rate limiting, caching, and compression. | Minor issues or gaps in implementing other security measures. | Significant issues or incomplete implementation of other security measures. | No or inadequate implementation of other security measures. |

### Functionality: Frontend Application - Quiz - 15%

| **Criteria**                                 | **10-9**                                                 | **8-7**                                                  | **6-5**                                                  | **4-0**                                                  |
| -------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| **Registration and Login Pages Functionality**       | Implementation of a well-functioning user registration page and login page. | Minor issues or inconsistencies in user registration and login. | Significant issues or incomplete implementation in user registration and login. | No or critical omissions in user registration and login.  |
| **User Pages Functionality**           | Successful creation of user pages with accurate functionality for super admin and basic users. | Minor issues or inconsistencies in user page functionality. | Significant issues or incomplete implementation in user page functionality. | No or critical omissions in user page functionality.       |
| **Quiz Pages Functionality**           | Successful creation of quiz pages with accurate functionality for super admin and basic users. | Minor issues or inconsistencies in quiz page functionality. | Significant issues or incomplete implementation in quiz page functionality. | No or critical omissions in quiz page functionality.       |
| **Navigation and Footer**             | Implementation of a navigation bar and footer that meets the specified requirements. | Minor issues or inconsistencies in navigation bar and footer. | Significant issues or incomplete implementation in navigation bar and footer. | No or critical omissions in navigation bar and footer.     |
| **Form Validation and UI Styling**    | Graceful handling of incorrectly formatted form field values with validation error messages. UI is visually attractive with Tailwind CSS. | Minor issues or inconsistencies in form validation and UI styling. | Significant issues or incomplete implementation in form validation and UI styling. | No or critical omissions in form validation and UI styling.  |

### Functionality: Frontend Application - RESTful API - 5%

| **Criteria**                                 | **10-9**                                                 | **8-7**                                                  | **6-5**                                                  | **4-0**                                                  |
| -------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| **RESTful API Page Functionality**     | Implementation of a page allowing an unauthenticated user to retrieve RESTful API information. | Minor issues or inconsistencies in the implementation.   | Significant issues or incomplete implementation.        | No or critical omissions in implementation.              |
| **UI Styling**    | UI is visually attractive with Tailwind CSS. | Minor issues or inconsistencies in UI styling. | Significant issues or incomplete implementation in UI styling. | No or critical omissions in UI styling.  |

### Functionality: Testing - 5%

| **Criteria**                                | **10-9**                                                 | **8-7**                                                  | **6-5**                                                   | **4-0** 
| ------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **Registering a Basic User**       | Successfully implement and pass the Cypress test for registering a basic user. | Minor issues or gaps in implementing and passing the test for registering a basic user. | Significant issues or incomplete implementation of the test for registering a basic user. | No or inadequate implementation of the test for registering a basic user. |
| **Logging in a Super Admin and Creating a Quiz** | Successfully implement and pass the Cypress test for logging in a super admin and creating a quiz. | Minor issues or gaps in implementing and passing the test for logging in a super admin and creating a quiz. | Significant issues or incomplete implementation of the test for logging in a super admin and creating a quiz. | No or inadequate implementation of the test for logging in a super admin and creating a quiz. |
| **Logging in a Basic User and Participating in a Quiz** | Successfully implement and pass the Cypress test for logging in a basic user and participating in a quiz. | Minor issues or gaps in implementing and passing the test for logging in a basic user and participating in a quiz. | Significant issues or incomplete implementation of the test for logging in a basic user and participating in a quiz. | No or inadequate implementation of the test for logging in a basic user and participating in a quiz. |

### Functionality: Scripts - 5%

| **Criteria**                                  | **10-9**                                                 | **8-7**                                                  | **6-5**                                                   | **4-0**                                                 |
| --------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **Run RESTful API and Frontend Locally** | Provide clear instructions and scripts that successfully run both the RESTful API and frontend application locally. | Minor issues or gaps in the provided instructions and scripts for running the RESTful API and frontend locally. | Significant issues or incomplete instructions/scripts for running the RESTful API and frontend locally. | No or inadequate instructions/scripts for running the RESTful API and frontend locally. |
| **Run End-to-End Tests Using Cypress** | Provide clear instructions and scripts that successfully run end-to-end tests using Cypress. | Minor issues or gaps in the provided instructions and scripts for running end-to-end tests using Cypress. | Significant issues or incomplete instructions/scripts for running end-to-end tests using Cypress. | No or inadequate instructions/scripts for running end-to-end tests using Cypress. |
| **Create and Apply Migration Using Prisma** | Provide clear instructions and scripts that successfully create and apply a migration using Prisma. | Minor issues or gaps in the provided instructions and scripts for creating and applying a migration using Prisma. | Significant issues or incomplete instructions/scripts for creating and applying a migration using Prisma. | No or inadequate instructions/scripts for creating and applying a migration using Prisma. |
| **Reset Database Using Prisma**       | Provide clear instructions and scripts that successfully reset the database using Prisma. | Minor issues or gaps in the provided instructions and scripts for resetting the database using Prisma. | Significant issues or incomplete instructions/scripts for resetting the database using Prisma. | No or inadequate instructions/scripts for resetting the database using Prisma. |
| **Seed Super Admin Users**            | Provide clear instructions and scripts that successfully seed super admin users. | Minor issues or gaps in the provided instructions and scripts for seeding super admin users. | Significant issues or incomplete instructions/scripts for seeding super admin users. | No or inadequate instructions/scripts for seeding super admin users. |
| **Open Prisma Studio**               | Provide clear instructions and scripts that successfully open Prisma Studio. | Minor issues or gaps in the provided instructions and scripts for opening Prisma Studio. | Significant issues or incomplete instructions/scripts for opening Prisma Studio. | No or inadequate instructions/scripts for opening Prisma Studio. |
| **Lint Code Using ESLint**           | Provide clear instructions and scripts that successfully lint the code using ESLint. | Minor issues or gaps in the provided instructions and scripts for linting the code using ESLint. | Significant issues or incomplete instructions/scripts for linting the code using ESLint. | No or inadequate instructions/scripts for linting the code using ESLint. |
| **Format Code Using Prettier**       | Provide clear instructions and scripts that successfully format the code using Prettier. | Minor issues or gaps in the provided instructions and scripts for formatting the code using Prettier. | Significant issues or incomplete instructions/scripts for formatting the code using Prettier. | No or inadequate instructions/scripts for formatting the code using Prettier. |

### Code Quality and Best Practices - 45%

| **Criteria**                                      | **10-9**                                              | **8-7**                                               | **6-5**                                               | **4-0**                                               |
| -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **.gitignore and env.example**               | Proper use of Node.js .gitignore file. Environment variables are stored in env.example. | Minor issues in .gitignore or env.example.        | Significant issues in .gitignore or env.example. | Missing .gitignore or env.example.                    |
| **Appropriate Naming**                       | Clear and meaningful names for files, variables, functions, and resource groups following best practices. | Minor issues in naming conventions or clarity.        | Significant naming issues impacting readability.     | Naming conventions are not followed.   
| **Efficient Algorithmic Approach**           | Implementation demonstrates a highly efficient algorithmic approach. | Some areas could be optimised for better efficiency.  | Significant optimisation opportunities are missed.   | Inefficient algorithmic approach throughout.          |
| **Sufficient Modularity**                    | Code is well-organised and modular, enhancing maintainability and readability. | Some modules could be better organised for clarity.  | Significant issues in modularity and organisation.   | Lack of modularity, impacting code maintainability.   |
| **JSDoc Comments**                           | Each file includes clear and comprehensive JSDoc header comments. | Minor issues or missing JSDoc comments in some files. | Significant issues with JSDoc comments throughout.   | No JSDoc comments in files.                         |
| **Code Formatting**                         | Code is formatted using Prettier. Prettier is installed as a development dependency. | Minor issues in code formatting or Prettier setup. | Significant issues in code formatting or Prettier setup. | Code lacks proper formatting and Prettier setup.      |
| **Code Linting**                         | Code is linted using ESLint. ESLint is installed as a development dependency. | Minor issues in code linting or ESLint setup. | Significant issues in code linting or ESLint setup. | Code lacks proper linting and ESLint setup.      |
| **Dependency Installation**                  | Prettier, ESLint, and Cypress are correctly installed as development dependencies. | Minor issues in dependency installation.             | Significant problems in installing required dependencies. | Missing or incorrect installation of dependencies.    |
| **No Dead or Unused Code**                    | Codebase contains no dead or unused code.              | Minor instances of dead or unused code.              | Significant dead or unused code in the project.      | Extensive dead or unused code affecting the project.  |

### Documentation - 5%

| **Criteria**                                      | **10-9**                                              | **8-7**                                               | **6-5**                                               | **4-0**                                               |
| -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **GitHub Project Board**                    | Consistent and effective use of GitHub project board for organising and prioritising development work. | Minor inconsistencies in GitHub project board usage. | Significant issues in GitHub project board usage.   | GitHub project board is not used or poorly maintained. |
| **README Content**                    | Well-documented repository README.md with required information. | Minor issues in documentation or missing some details. | Significant issues in documentation or missing key information. | README.md lacks essential information or is poorly structured. |
| **Markdown Usage**                          | Effective use of Markdown, including headings, bold text, code blocks, etc. | Some Markdown elements are used, but inconsistencies are present. | Limited use of Markdown or improper formatting.      | Markdown is not used or severely misformatted.         |
| **Spelling and Grammar**                    | Correct spelling and grammar throughout the documentation. | Minor spelling or grammatical errors are present.     | Significant spelling or grammatical issues.          | Numerous spelling and grammatical errors.            |
| **Git Commit Messages**                     | Commit messages reflect the context of each functional requirement change. | Some commit messages lack clarity or context.        | Commit messages are unclear or unrelated to changes. | Lack of meaningful commit messages.                   |

# Marking Cover Sheet

**Course Title:** [Course Title]

**Assignment Title:** [Assignment Title]

**Learner Name:** [Learner Name]

**Learner ID:** [Learner ID]

**Date Submitted:** [Date]

# Overall Comments:

[Insert overall comments and feedback here.]

**Functionality: RESTful API: [x/20]**

**Functionality: Frontend Application: [x/20]**

**Functionality: Testing: [x/5]**

**Functionality: Scripts: [x/5]**

**Code Quality and Best Practices: [x/45]**

**Documentation: [x/5]**

**Total Marks (100%):** [Total Marks]

**Assessor's Name:** [Assessor's Name]

**Assessor's Signature:** ___________________

*Note: This cover sheet is to be completed and submitted with the assignment.*
