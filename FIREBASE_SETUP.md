# Firebase Setup Instructions

## Manual Steps Required

Before the application can work, you need to complete these Firebase setup steps:

### 1. Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/qa-ka-practice/firestore)
2. Click **"Create Database"** if not already created
3. Choose **"Start in production mode"** (we have custom security rules)
4. Select a Cloud Firestore location (choose closest to Vietnam, e.g., `asia-southeast1`)
5. Click **"Enable"**

### 2. Enable Authentication with Email/Password

1. Go to [Firebase Authentication](https://console.firebase.google.com/project/qa-ka-practice/authentication)
2. Click **"Get started"** if not already enabled
3. Click on **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable **"Email/Password"** (first toggle)
6. Click **"Save"**

### 3. Create User Accounts

You need to create two user accounts for the students:

**Option A: Using Firebase Console (Easier)**

1. Go to [Firebase Authentication > Users](https://console.firebase.google.com/project/qa-ka-practice/authentication/users)
2. Click **"Add user"**
3. For **Quỳnh Anh**:
   - Email: `quynhanh@math.com`
   - Password: `quynhanh`
   - Click **"Add user"**
4. Click **"Add user"** again
5. For **Khánh An**:
   - Email: `khanhan@math.com`
   - Password: `khanhan`
   - Click **"Add user"**

**Option B: Using Firebase CLI**

Run these commands:

```bash
# Create Quỳnh Anh's account
npx -y firebase-tools@13.24.2 auth:import users.json --project qa-ka-practice

# Or manually via console as shown above
```

### 4. Deploy Security Rules

The Firestore security rules have been created in `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

### 5. Deploy Updated Code

```bash
firebase deploy --only hosting
```

---

## Verification Steps

After completing the setup:

1. Go to https://qa-ka-practice.web.app
2. Enter username `quynhanh` and click "Start Adventure!"
3. Play a level and answer some questions correctly
4. Refresh the page
5. Login again - your score should be preserved!

Check Firebase Console to see:
- **Authentication**: The user is signed in
- **Firestore**: A document in `users/{uid}` with your score data

---

## Security

- ✅ Users can only update their own scores
- ✅ Everyone can read all scores (for leaderboard)
- ✅ Offline data is cached locally
- ✅ Network failures won't lose data (auto-retry)
