# Salon CRM

A full-stack Salon CRM system implementing Role-Based Access Control (RBAC), subscription gating, geo-fenced staff check-in, and appointment conflict resolution.

## Architecture

- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Web Frontend:** React.js, Material UI, Vite.
- **Mobile App:** React Native, Expo.

## Setup & Run Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on default port 27017, or update .env with MONGO_URI)

### 1. Backend
cd backend
npm install
npm start
# The server will run on http://localhost:5000

### 2. Database Seeding
To test with pre-existing data (Plans, Salons, Users):
curl -X POST http://localhost:5000/api/seed

### 3. Web Frontend
cd web
npm install
npm run dev
# The web app will be available on http://localhost:5173

### 4. Mobile App (React Native)
cd mobile
npm install
npm start
# Use the Expo Go app on your physical device, or press 'a' for Android emulator / 'i' for iOS simulator.

## Test Credentials

All accounts use the password: **password**

- **Super Admin:** admin@test.com
- **Salon Owner:** owner@test.com
- **Receptionist:** receptionist@test.com

## Assumptions Made

1.  **Staff Management:** For simplicity in this slice, the User model acts as both staff and admin. In a full system, Staff might be a separate model or an extended User role with working hours. Appointments are booked against a User with staffId.
2.  **Service Duration:** The instructions mentioned fixed durations (Haircut 30m, etc.). For flexibility and conflict-resolution testing, the API accepts startTime and endTime directly. The frontend or a separate validation layer would typically enforce the specific duration based on the selected service.
3.  **Geo-Fencing:** The Attendance model saves the staff's location and calculates the distance on the server using the Haversine formula. The current implementation uses a hardcoded salon coordinate set during the seed process (San Francisco coordinates). 
4.  **Tenant Isolation:** salonId is strictly extracted from the JWT token in all owner/receptionist requests. A client cannot spoof salonId in the request body to access or modify data for another salon.

## Known Limitations / Future Improvements

1.  **Pagination:** The current APIs return all records. Pagination should be added for endpoints returning lists of appointments, clients, or salons.
2.  **Timezones:** Dates and times are handled as simple strings ('YYYY-MM-DD', 'HH:mm') for this proof of concept. In a real application, they must be stored as UTC ISO strings and converted on the frontend to the salon's local timezone.
3.  **Mobile Polish:** The React Native app is extremely minimal, focusing only on demonstrating the location capture and API integration as requested.
4.  **Error Handling:** The backend uses basic try-catch error handling. A global error handling middleware would be better for consistency.
