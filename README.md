# ZooVanna - Zoo Management System

<img src="https://i.imgur.com/d2nJnQj.png" width="90%">\
Elevate your zoo adventure with ZooVanna — an innovative management system designed to optimize animal care, resource allocation, and visitor engagement.

## Contents

- [System Overview](#system-overview)
  - [ZooVanna Admin Management System](#zoovanna-admin-management-system)
  - [ZooVanna Customer Portal](#zoovanna-customer-portal)
  - [Other Miscellaneous Helper Applications](#other-miscellaneous-helper-applications)
- [ZooVann's Advanced Features](#zoovannas-advanced-features)
- [Tech Stack](#tech-stack)
- [Other Repositories](#other-repositories)
- [How to Deploy ZooVanna](#how-to-deploy-zoovanna)
- [Gallery](#gallery)

## System Overview

ZooVanna is made up of two main front-end application systems that cater to two main stakeholders: Zoo Staff and Zoo Visitors. These applications share a common back-end.

### ZooVanna Admin Management System

The ZooVanna Admin Management System is designed to enable staff around the zoo to more efficiently perform their roles. With ZooVanna, zookeepers can effectively manage their species database, design habitat and enclosures, as well as monitor and care for their animals. ZooVanna also supports management of assets and facilities, zoo crowd monitoring, employing management and rostering, event management, ticketing and sales management. All these functionalities helps zoo holistically manage both their back-office and front-office operations.

### ZooVanna Customer Portal

ZooVanna Customer Portal is in the form of a webpage that customers can access on both their desktop and mobile devices, and focuses on enhancing the customer experience before, during and after their zoo visits. This portal provides crowd control analysis, QR ticketing, a secured payment gateway, itinerary advisory, and more!

### Other Miscellaneous Helper Applications

**Entrance ticket scanner**\
This is a native mobile app that allows zoo staff to scan the QR codes present on zoo tickets, thereby speeding up the customer admission process.

**Internet-of-Things Hubs**\
Multiple IOT hubs are available to facilitate the connection between the main Admin Management System and IOT sensors and devices such as light sensors, temperature sensors and cameras used for crowd monitoring.

## ZooVanna's Advanced Features

- Animal Family Tree and Breeding Recommendation
- Animal Automatic Weight Monitoring
- Smart Feeding Plan Planner
- Enclosure Layout Designing
- Predictive Maintenance for Assets & Facilities
- Smart Employee Rostering
- IOT-Assisted Crowd Monitoring
- Zoo Itinerary Advisory Based on Preferences

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: ExpressJS
- **Database**: MySQL
- **Object-Relational Mapping (ORM)**: Sequelize
- **IOT Hubs**: Python

## Other Repositories

- [Backend Server](https://github.com/Qingyi1115/ZooVannaServer)
- [Customer Mobile Application](https://github.com/Qingyi1115/ZooVanna)
- [Ticket Scanner App](https://github.com/Qingyi1115/ZooVannaScanner/)
- [IOT Hubs Server](https://github.com/Qingyi1115/ZooVannaIoTServer/)

## How To Deploy ZooVanna

1. **Database**

- Set up a MySQL server connection and create a local instance of MySQL
- Create a database/schema called "zoovanna"
- Data is automatically seeded by running the server (with .env value RESET_DB set to "True"). No SQL scripts are required.

2. **Server (Common Backend)**

- Create an .env file in the root folder of "ZooVannaServer", and add the following:

```env
MYSQL_PASSWORD=password
RESET_DB=TRUE #True/TRUE/true/1 (false otherwise)
SECRET_KEY=[secretKey]
MYSQL_HOST=[mysqlHostName] #default: localhost
MYSQL_USER=[mysqlUsername] #default: root
MYSQL_DB=[mysqlDatabaseName] #default: zoovanna
MYSQL_DB_PORT=[mysqlPort] #default: 3306

IMG_URL_ROOT = "img/"

EMAIL_USERNAME=[stripeAccountEmailAddress]
EMAIL_PASSWORD=[stripeAccountPassword]

STRIPE_PUBLISHABLE_KEY="[stripePublishableKey]"
STRIPE_SECRET_KEY="[stripeSecretKey]"

LOCALHOST_ADDRESS = "localhost"
```

- Replace `[secretKey]` with anything as your secret key
- Replace `[mysqlHostName]`, `[mysqlUsername]`, `[mysqlDatabaseName]`, and `[mysqlPort]` with your MySQL credentials and information
- Replace `[stripeAccountEmailAddress]`, `[stripeAccountPassword]`, `[stripePublishableKey]`, and `[stripeSecretKey]` with your Stripe account credentials and information
- For the first time running the server, leave the value for RESET_DB as `TRUE`.

- In the root folder of ZooVannaServer, run:

```bash
    npm install
```

- To start the server, run:

```bash
    npm start
```

3. Admin Management System

- In the root folder of ZooVannaAdmin, run:

```bash
    npm install
```

- To start the admin frontend application, run:

```bash
    npm run dev
```

- The application should be hosted at http:localhost:5173
- Open your internet browser (Google Chrome preferred) and go to the aforementioned link.
- Following is the account to be used to log into the admin system:

* Username/Email: marry@gmail.com
* Password: marry_password

4. Customer Portal

- In the root folder of ZooVanna, run:

```bash
    npm install
```

- To start the customer frontend application, run:

```bash
    npm run dev
```

- The application should be hosted at http:localhost:5174
- Open your internet browser (Google Chrome preferred) and go to the aforementioned link. For best experience, use Reponsive Viewport Mode and select any mobile phone layout (e.g., iPhone 12 Pro)

## Gallery

<img src="https://i.imgur.com/XVKuwZA.png" alt="ZooVanna Admin Home Page" width="90%">
<img src="https://i.imgur.com/pvUtakR.png" alt="Animal Lineage Tree" width="90%">
<img src="https://i.imgur.com/bTWzZ4Y.png" alt="Animal Enclosure Diagram" width="90%">
<img src="https://i.imgur.com/YHcsbTE.png" alt="Enclosure Environmental Conditions" width="90%">
<img src="https://i.imgur.com/j827dez.png" alt="Sales Dashboard" width="90%">
<img src="https://i.imgur.com/gUlgqz9.png" alt="Customer Portal Home Page" width="22%">
<img src="https://i.imgur.com/wXj7Sg9.png" alt="Customer Event Info" width="22%">
<img src="https://i.imgur.com/eNjHLIV.png" alt="Customer Zoo Map" width="22%">
<img src="https://i.imgur.com/5wGB2cR.png" alt="Customer Shop Info" width="22%">
