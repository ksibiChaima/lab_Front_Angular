# ProjetAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## 🔐 Security Configuration

**IMPORTANT**: This project contains sensitive Firebase configuration. Follow these steps:

### 1. Environment Setup
```bash
# Copy the template file (FIRST TIME SETUP ONLY)
cp src/app/environment.ts.template src/app/environment.ts
```

### 2. Configure Firebase
Edit `src/app/environment.ts` with your actual Firebase credentials:
```typescript
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 3. Git Protection
The `.gitignore` file is configured to protect:
- `src/app/environment.ts` (contains Firebase keys)
- All Firebase configuration files
- Certificate files (*.p8, *.p12, *.key, *.pem)
- Environment files (.env*)

**⚠️ NEVER commit your actual Firebase keys to version control!**

### 4. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication (Email/Password)
4. Enable Realtime Database
5. Copy your config to `src/app/environment.ts`
6. Update Firebase Realtime Database rules (see below)

### 5. Database Rules
Set these rules in Firebase → Realtime Database → Rules:
```json
{
  "rules": {
    "userRoles": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('userRoles').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('userRoles').child(auth.uid).child('role').val() === 'admin'",
        ".validate": "newData.hasChildren(['uid', 'email', 'role', 'createdAt']) && newData.child('uid').isString() && newData.child('email').isString() && newData.child('role').isString() && (newData.child('role').val() === 'admin' || newData.child('role').val() === 'member' || newData.child('role').val() === 'guest') && newData.child('createdAt').isString()"
      }
    },
    ".read": "auth !== null",
    ".write": "auth !== null",
    "$other": {
      ".validate": false
    }
  }
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

**Prerequisites**: Make sure you have completed the Firebase setup above before running the application.

## Project Features

### 🔐 Authentication System
- **Firebase Auth**: Email/password authentication
- **Role-based Access**: Admin vs Member permissions
- **Backend Integration**: Spring Boot API for member data

### 👥 Member Management
- **Create Members**: Add new users with Firebase Auth + Backend sync
- **Edit Members**: Update existing member information
- **Role Assignment**: Automatic Firebase role assignment based on member type
  - `enseignant` → `admin` role
  - `etudiant` → `member` role

### 📚 Content Management
- **Tools**: Create and assign tools to members
- **Publications**: Create and assign publications to members
- **Events**: Event management system

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular App   │────│  Firebase Auth  │────│ Firebase Roles  │
│   (Frontend)    │    │                 │    │ (Realtime DB)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Spring Boot API │
                    │   (Backend)     │
                    └─────────────────┘
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
