# Firebase Deployment Instructions

## ✅ GitHub Status
Your code has been successfully pushed to: **https://github.com/sonmhust/QuynhAnh-KhanhAn-Practice**

## 🔥 Firebase Hosting Deployment

### Option 1: Deploy from Another Machine (Recommended)

If you have access to another computer with Node.js 20 or higher:

1. **Install Node.js 20+** from https://nodejs.org/

2. **Clone your repository**:
   ```bash
   git clone https://github.com/sonmhust/QuynhAnh-KhanhAn-Practice.git
   cd QuynhAnh-KhanhAn-Practice
   ```

3. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

4. **Login to Firebase**:
   ```bash
   firebase login
   ```

5. **Deploy to hosting**:
   ```bash
   firebase deploy --only hosting
   ```

Your app will be live at: **https://qa-ka-practice.web.app** or **https://qa-ka-practice.firebaseapp.com**

---

### Option 2: Deploy via Firebase Console (Web Interface)

1. Go to **https://console.firebase.google.com**

2. Select your project **qa-ka-practice**

3. Click on **Hosting** in the left sidebar

4. Click **Get Started** or **Add Another Site**

5. You can connect your GitHub repo to auto-deploy, or manually upload files

---

### Option 3: Upgrade Node.js on This Machine

Your current Node.js version is **v18.19.1**, but Firebase CLI requires **v20.0.0+**.

**To upgrade Node.js using nvm** (if installed):
```bash
nvm install 20
nvm use 20
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

**To upgrade Node.js using apt** (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

---

## 📁 Configuration Files Created

I've created the necessary Firebase configuration files:

- [firebase.json](file:///mnt/data/Code/HTML/math-kingdom/firebase.json) - Hosting configuration
- [.firebaserc](file:///mnt/data/Code/HTML/math-kingdom/.firebaserc) - Project configuration

These files are ready for deployment whenever you run the Firebase CLI.

---

## 🎯 Next Steps

1. Choose one of the deployment options above
2. Once deployed, test your app at the live URL
3. Both **quynhanh** and **khanhan** will be able to log in and have their progress saved to Firebase!

---

## 🔗 Links

- **GitHub Repository**: https://github.com/sonmhust/QuynhAnh-KhanhAn-Practice
- **Firebase Console**: https://console.firebase.google.com/project/qa-ka-practice
- **Expected Live URL**: https://qa-ka-practice.web.app
