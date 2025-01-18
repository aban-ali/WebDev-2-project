# Library Management Web Application
### Name: Mohammad Aban Ali
The Library Management WebApp, named `Mistborn`, is a small-scale web application designed to provide 
users with a platform to read books. End users can register as students or faculty members. This app provides 
librarians with a digital platform to manage and access library resources efficiently.  This project report provides an 
overview of the features, architecture, technologies used, implementation details, and future enhancements.

### FEATURES: 
The Library Management System Web Application offers the following key features: 
- User Authentication: Secure login and registration for patrons and staff members. 
- Search and Browse: Search for books by title, genre, or release date. Browse books by categories. 
- Admin Dashboard: Centralized dashboard for admin to manage users, books and genres. 
- Book Management: Add, edit, and delete books with details such as title, genre, and description. 
- Book Checkout and Return: Users can borrow/download books and return them within the due date. 
- Notifications: Automated email notifications for users who missed reading book. 
- Reports and Analytics: Generate reports on user and books for admin at the end of every month. 

### ARCHITECTURE: 
The composition of Library Management WebApp Architecture is as follows: 
- Frontend: The user interface is built using HTML, CSS, Bootstrap, JavaScript, and Vue.js framework for 
interactive and responsive design. 
- Backend: The backend logic is implemented in Python using Flask framework to handle routing and business 
logic, Flask-SQLAlchemy for database operations. 
- API: A hybrid of restful and graphql APIs have been used. Flask for restful API and Ariadne for Graphql APIs. 
- Database: SQLite is used to store book details, user information and system configurations. Reddis (accessed 
through Docker) has been used for caching and as a broker for celery. 
- Authentication: JWT (JSON Web Token) is used for user authentication and session management. 
- Email Integration: SMTP protocol is used for sending email notifications to users. Gmail services have been used 
for the same.

### TECHNOLOGIES USED: 
- Frontend: HTML, CSS, Bootstrap, JavaScript, Vue.js 
- Backend: Python, Flask framework, Ariadne (for Graphql)
- Database: SQLite and Reddis 
- Authentication: JWT (JSON Web Tokens) 
- Email Integration: SMTP protocol

### IMPLEMENTATION DETAILS: 
The Library Management System Web Application is implemented with the following modules and functionalities: 
1. User Management: Registration, login, profile management, and role-based access control (librarian, 
student, faculty). 
2. Book Management: CRUD operations for books, search option, book detail’s view. 
3. Membership Management: Users can register as premium members to hold up to 10 books. 
4. Email Notifications: Automated email notifications for users if they missed reading on a particular 
day.   
5. Admin Dashboard: Centralized dashboard for admin to manage users, books, memberships and 
reports.
