# Quick Test Guide - Media Capture

## 🎯 What Was Fixed

### Problem 1: Camera Not Opening ❌
**Fixed:** ✅
- Added explicit permission handling for Android
- Added camera configuration options
- Added Alert dialogs for permission denials
- Added detailed logging

### Problem 2: iOS Long Videos Not Working ❌
**Fixed:** ✅
- Fixed gallery selection limit
- Fixed duration calculation (handles both formats)
- Added better error handling
- Added file size handling for large videos

---

## 🚀 Quick Test (5 Minutes)

### Step 1: Build & Run
```bash
# iOS
cd /Users/joshita/Desktop/FearlessCode
npm run ios

# OR Android
npm run android
```

### Step 2: Open Support Chat
1. Navigate to Profile tab
2. Tap on Support/Help
3. Open chat screen

### Step 3: Test Camera Icon
**Tap the camera icon 📷**

Should see action sheet with:
- Take Photo
- Record Video  
- Choose from Gallery
- Cancel

### Step 4: Test Each Option

#### A. Take Photo (30 seconds)
1. Select "Take Photo"
2. Camera opens? ✅
3. Take photo
4. Preview appears? ✅
5. Tap send
6. Message sent? ✅

#### B. Record Video (1 minute)
1. Select "Record Video"
2. Camera opens in video mode? ✅
3. Record 10-15 seconds
4. Stop recording
5. Preview with play icon? ✅
6. Tap send
7. Message sent? ✅

#### C. Gallery Photo (30 seconds)
1. Select "Choose from Gallery"
2. Gallery opens? ✅
3. Select an image
4. Preview appears? ✅
5. Tap send
6. Message sent? ✅

#### D. Gallery Video - SHORT (30 seconds)
1. Select "Choose from Gallery"
2. Select a SHORT video (<30 seconds)
3. Preview appears with duration? ✅
4. Tap send
5. Uploads and sends? ✅

#### E. Gallery Video - LONG (Important!) (1 minute)
1. Select "Choose from Gallery"
2. Select a LONG video (>1 minute, ideally >2 minutes)
3. Preview appears with duration? ✅
4. Duration shown correctly? ✅
5. Tap send
6. **Check console for upload progress**
7. Upload completes? ✅
8. Message sent? ✅

---

## 📊 Watch Console Output

### Expected Logs:

When you select from gallery:
```
Gallery Response: {assets: [...]}
Selected Media: {...}
Processing selected media: {uri, type, fileName, duration, fileSize}
Uploading: {uri, type, fileName, mediaType, duration: XX, fileSize: XXXXX}
Starting upload: {...}
Upload successful: {url: "https://..."}
```

When you capture photo:
```
Camera Photo Response: {assets: [...]}
Captured Photo: {...}
Processing selected media: {...}
Starting upload: {...}
Upload successful: {...}
```

When you record video:
```
Camera Video Response: {assets: [...]}
Recorded Video: {...}
Processing selected media: {duration: XX}
Starting upload: {fileSize: XXXXX}
Upload successful: {...}
```

---

## 🚨 If Something Doesn't Work

### Camera Won't Open?
**Check console for:**
- "Camera permission denied" → Go to Settings > App > Permissions
- "Camera Error:" → Check error message

### Upload Fails?
**Check console for:**
- "Upload failed:" → Look at error details
- "No URI provided" → Media selection issue
- "Failed to upload file" → Network or server issue

### Video Shows Wrong Duration?
**Check console for:**
- "Processing selected media: {duration: XXX}"
- If duration is very large (>1000), it's in milliseconds
- Should automatically convert to seconds

---

## ✅ Success Checklist

After 5-minute test, you should have:
- [ ] Camera icon tapped successfully
- [ ] Action sheet appeared with 4 options
- [ ] Photo capture worked
- [ ] Video recording worked
- [ ] Gallery image selection worked
- [ ] Gallery SHORT video worked
- [ ] Gallery LONG video worked (MOST IMPORTANT!)
- [ ] All uploads completed
- [ ] All messages sent
- [ ] No errors in console
- [ ] No crashes

---

## 📱 Test on Both Platforms

### iOS Priority Tests:
1. ✅ Long video from gallery (>2 minutes)
2. ✅ Large video file (>10MB)
3. ✅ Camera permissions work
4. ✅ Duration shows correctly

### Android Priority Tests:
1. ✅ Permission dialogs appear
2. ✅ Camera opens immediately after permission
3. ✅ Video recording works
4. ✅ Gallery access works

---

## 🎉 Expected Results

### ALL Should Work:
- ✅ Camera opens instantly
- ✅ Photos captured and sent
- ✅ Videos recorded and sent
- ✅ Gallery images selected and sent
- ✅ Gallery videos selected and sent
- ✅ **LONG videos from iOS gallery work!**
- ✅ Duration calculated correctly
- ✅ File sizes handled properly
- ✅ Uploads complete successfully
- ✅ Messages appear in chat

---

## 🆘 Quick Fixes

### If STILL not working after all fixes:

#### Clean Everything:
```bash
# iOS
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
rm -rf node_modules
npm install
npm run ios

# Android
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

#### Check Permissions Manually:
- iOS: Settings > [App Name] > Check Camera, Photos, Microphone
- Android: Settings > Apps > [App Name] > Permissions

#### Test with Simple Video First:
1. Record a 5-second video using device camera
2. Try uploading that short video first
3. If works, try longer videos

---

## 📞 Report Results

### If Working: ✅
Report:
- "All features working!"
- Platform tested: iOS/Android
- Longest video tested: XX minutes
- Largest file tested: XX MB

### If Not Working: ❌
Report:
- Specific feature that fails
- Platform: iOS/Android
- Error message from console
- Steps to reproduce
- Screenshots if possible

---

## 💡 Tips

1. **Always test on real device** (simulator might not have camera)
2. **Watch console logs** (most helpful for debugging)
3. **Test long videos on WiFi first** (faster upload)
4. **Try different file sizes** (small, medium, large)
5. **Grant all permissions** (check device settings)

---

## 🎯 Bottom Line

### These Should All Work Now:
1. ✅ Camera photo capture
2. ✅ Camera video recording
3. ✅ Gallery image selection
4. ✅ Gallery video selection
5. ✅ **iOS long video upload** (main fix!)
6. ✅ Large file handling
7. ✅ Proper duration calculation
8. ✅ Permission handling
9. ✅ Error messages
10. ✅ Console logging

**Total test time: ~5 minutes**

**Just need to verify it works on your device!** 🚀
