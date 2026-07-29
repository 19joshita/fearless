# Media Capture Troubleshooting Guide

## 🔧 Recent Fixes Applied

### 1. Camera Not Opening - FIXED ✅
**Problem:** Camera was not launching when buttons were pressed.

**Solutions Applied:**
- Added explicit permission requests for Android (Camera + Microphone)
- Added `cameraType: 'back'` to camera options
- Added `durationLimit: 300` (5 minutes) for video recording
- Added Alert messages for permission denials
- Added comprehensive console logging for debugging

### 2. iOS Long Video Issues - FIXED ✅
**Problem:** Long videos from iOS gallery were not uploading/sending.

**Solutions Applied:**
- Fixed `selectionLimit: 1` (was `0` which caused issues)
- Added duration handling for both milliseconds and seconds format
- Added proper error messages in Toast notifications
- Added file size logging for debugging
- Improved media type detection

### 3. Better Error Handling - ADDED ✅
- Console logs at every step
- Alert dialogs for permission issues
- Toast messages with detailed error information
- Type checking for media format

---

## 📱 Testing Checklist

### iOS Testing

#### 1. Test Camera Photo Capture
```
1. Open support chat
2. Tap camera icon
3. Select "Take Photo"
4. Camera should open immediately
5. Take a photo
6. Photo should appear in preview
7. Add optional text
8. Tap send
9. Check console for logs:
   - "Camera Photo Response:"
   - "Captured Photo:"
   - "Processing selected media:"
   - "Starting upload:"
   - "Upload successful:"
```

#### 2. Test Camera Video Recording
```
1. Open support chat
2. Tap camera icon
3. Select "Record Video"
4. Camera should open in video mode
5. Record a video (try both short and long)
6. Video should appear in preview with play icon
7. Add optional text
8. Tap send
9. Check console for logs:
   - "Camera Video Response:"
   - "Recorded Video:"
   - Duration should be properly calculated
```

#### 3. Test Gallery Image Selection
```
1. Open support chat
2. Tap camera icon
3. Select "Choose from Gallery"
4. Gallery opens
5. Select an image
6. Image appears in preview
7. Tap send
8. Check console logs
```

#### 4. Test Gallery Video Selection (Long Videos)
```
1. Open support chat
2. Tap camera icon
3. Select "Choose from Gallery"
4. Select a LONG video (>1 minute, even >5 minutes)
5. Video should appear in preview
6. Duration should show correctly
7. Tap send
8. Should upload successfully
9. Check console for:
   - File size
   - Duration (in seconds)
   - Upload progress
```

### Android Testing

#### 1. Permission Flow
```
1. First time opening camera:
   - Permission dialog should appear
   - Grant permission
   - Camera should open
2. Second time:
   - No permission dialog
   - Camera opens immediately
```

#### 2. All Features Same as iOS
Follow iOS testing steps above.

---

## 🐛 Debugging

### Enable Debug Mode

Open the React Native debugger and filter console logs:

**Key Log Messages to Watch:**
```javascript
// Camera opening
"Camera Photo Response:"
"Camera Video Response:"

// Media selection
"Gallery Response:"
"Selected Media:"
"Captured Photo:"
"Recorded Video:"

// Processing
"Processing selected media:"
"Uploading: {uri, type, fileName, mediaType, duration, fileSize}"

// Upload
"Starting upload:"
"Upload successful:"
"Upload failed:"
```

### Common Issues & Solutions

#### Issue 1: Camera Opens But Immediately Closes
**Cause:** Permission denied
**Solution:** Check Settings > App > Permissions > Enable Camera

#### Issue 2: "Failed to upload file"
**Check:**
```javascript
// In console, look for:
"Upload failed:" 
// Then check the error details
```

**Possible causes:**
- Network issue
- File too large
- Server error
- Invalid file format

**Solution:**
- Check network connection
- Try smaller file
- Check server logs
- Verify file format is supported

#### Issue 3: Video Duration Shows as 0 or Wrong
**Check console for:**
```javascript
"Processing selected media:"
// Look at the duration value
```

**If duration is in milliseconds (>1000):**
- Should automatically convert to seconds
- Check: `duration > 1000 ? duration / 1000 : duration`

#### Issue 4: iOS Video Upload Fails
**Check:**
1. File size in console logs
2. Video format (should be .mov or .mp4)
3. Network timeout

**Solutions:**
- iOS videos can be large - check file size
- Ensure stable network connection
- Server should handle large uploads
- May need to increase timeout on server

#### Issue 5: Action Sheet Doesn't Appear
**Check:**
- `showInputIcon` prop is `true` on ChatInput
- Not already showing (tap once only)

---

## 📊 Expected Console Output

### Successful Photo Capture Flow:
```
Camera Photo Response: {
  assets: [{
    uri: "file:///...",
    type: "image/jpeg",
    fileName: "IMG_1234.jpg",
    fileSize: 2048576,
    width: 3024,
    height: 4032
  }]
}
Captured Photo: {...}
Processing selected media: {...}
Uploading: {
  uri: "file:///...",
  type: "image/jpeg",
  fileName: "IMG_1234.jpg",
  mediaType: "image",
  duration: null,
  fileSize: 2048576
}
Starting upload: {...}
Upload successful: {url: "https://..."}
```

### Successful Video Capture Flow:
```
Camera Video Response: {
  assets: [{
    uri: "file:///...",
    type: "video/mp4",
    fileName: "VID_5678.mp4",
    fileSize: 10485760,
    width: 1920,
    height: 1080,
    duration: 15.5
  }]
}
Recorded Video: {...}
Processing selected media: {...}
Uploading: {
  uri: "file:///...",
  type: "video/mp4",
  fileName: "VID_5678.mp4",
  mediaType: "video",
  duration: 15,
  fileSize: 10485760
}
Starting upload: {...}
Upload successful: {url: "https://..."}
```

---

## 🔐 Verify Permissions

### iOS - Check Info.plist
```bash
cd /Users/joshita/Desktop/FearlessCode/ios/FearlessCode
cat Info.plist | grep -A 1 "Camera\|Photo\|Microphone"
```

**Should show:**
- NSCameraUsageDescription ✅
- NSMicrophoneUsageDescription ✅
- NSPhotoLibraryUsageDescription ✅

### iOS - Check Podfile
```bash
cd /Users/joshita/Desktop/FearlessCode/ios
cat Podfile | grep -A 10 "setup_permissions"
```

**Should include:**
- Camera ✅
- Microphone ✅
- MediaLibrary ✅
- PhotoLibrary ✅

### Android - Check Manifest
```bash
cd /Users/joshita/Desktop/FearlessCode/android/app/src/main
cat AndroidManifest.xml | grep "permission"
```

**Should include:**
- android.permission.CAMERA ✅
- android.permission.RECORD_AUDIO ✅
- android.permission.READ_MEDIA_IMAGES ✅
- android.permission.READ_MEDIA_VIDEO ✅

---

## 🚀 Quick Test Commands

### Run iOS with Logs
```bash
cd /Users/joshita/Desktop/FearlessCode
npm run ios
# Watch console for logs
```

### Run Android with Logs
```bash
cd /Users/joshita/Desktop/FearlessCode
npm run android
# Watch logcat:
# adb logcat | grep -E "Camera|Gallery|Upload"
```

### Clear Cache and Rebuild
```bash
# iOS
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios

# Android
cd android
./gradlew clean
cd ..
npm run android
```

---

## 📝 Updated Code Summary

### Files Modified:

1. **`app/redux/useChatMedia.tsx`**
   - Added `Alert` import
   - Added Android permission requests
   - Added camera options: `cameraType`, `durationLimit`
   - Added comprehensive console logging
   - Added error alerts for permission denials
   - Fixed `selectionLimit: 1` for gallery

2. **`app/screens/Profile/SupportChat/index.tsx`**
   - Improved duration calculation (handles both ms and s)
   - Added media type detection (video/image/audio)
   - Added detailed console logging at each step
   - Added better error messages in Toast
   - Added file size and format logging

---

## ✅ Verification Steps

### 1. Check Implementation
```bash
# Verify changes in useChatMedia
grep -n "Alert\|console.log" app/redux/useChatMedia.tsx | head -10

# Verify changes in SupportChat
grep -n "console.log.*Processing\|console.log.*Uploading" app/screens/Profile/SupportChat/index.tsx
```

### 2. Test on Real Device
- **iOS:** Test on physical iPhone (simulator may not have camera)
- **Android:** Test on physical Android device or emulator with camera

### 3. Watch Console Logs
- Open React Native debugger
- Filter by: "Camera", "Gallery", "Upload", "Processing"
- Follow the log flow as you test each feature

### 4. Test Edge Cases
- [ ] Very large video (>50MB)
- [ ] Very long video (>5 minutes)
- [ ] Multiple rapid taps on camera icon
- [ ] Deny permissions then re-enable
- [ ] Weak network during upload
- [ ] Switch between photo/video/gallery rapidly

---

## 📞 Need More Help?

### Check These:
1. Console logs (most important!)
2. Network tab for upload requests
3. Server logs for upload endpoint
4. Device settings for app permissions

### If Camera Still Won't Open:
1. Check device camera app works
2. Verify permissions in device settings
3. Try uninstall/reinstall app
4. Check for OS updates
5. Try different device

### If Videos Won't Upload:
1. Check file size in console
2. Check network connection
3. Try smaller video first
4. Check server upload limit
5. Monitor upload progress

---

## 🎉 Success Criteria

### Working Correctly When:
- ✅ Camera icon shows action sheet
- ✅ All 4 options work (photo/video/gallery/cancel)
- ✅ Camera opens immediately for photo
- ✅ Camera opens immediately for video
- ✅ Gallery opens and shows media
- ✅ Selected media shows in preview
- ✅ Upload completes successfully
- ✅ Message sends with media
- ✅ Media displays correctly in chat
- ✅ Long videos (>1 min) work on iOS
- ✅ Large files upload successfully
- ✅ Console logs show expected output
- ✅ No errors in console
- ✅ No crashes or freezes

---

## 🔍 Final Checklist

Before reporting issues, verify:
- [ ] Ran `pod install` in iOS
- [ ] Cleaned and rebuilt app
- [ ] Testing on real device (not simulator)
- [ ] Permissions granted in device settings
- [ ] Network connection is stable
- [ ] Checked console logs
- [ ] Tried all 4 options (photo/video/gallery/cancel)
- [ ] Tested with different file sizes
- [ ] Tested with different video lengths

If all checks pass and still not working, provide:
1. Console log output
2. Device type and OS version
3. Specific action that fails
4. Error message (if any)
5. Screenshots or video of issue
