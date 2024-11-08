# AngularAssignment

1. Initial Project Setup
1.1 Clone the Repository
•	git clone https://github.com/ma675/angular_assignment_08_11_2024.git
1.2 Install Dependencies
•	npm install / npm install --force
1.3 Install json-server
•	npm install -g json-server
1.4 Set Up the Mock Backend
•	The project uses json-server to simulate a REST API. The dbData.json file in the root directory contains the mock data for the application
2. Running the Project
•	To start the backend, run the following command in the root directory where dbData.json is
•	json-server --watch dbData.json --port 5200
2.1	Start the Angular Application
•	ng serve

