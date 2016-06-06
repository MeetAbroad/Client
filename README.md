# Client

This is the mobile application repository of MeetAbroad.

It's an ionic+cordova application.

# Configuring server API address
Open www/js/app.js and find:
```
url : 'http://147.83.7.163:3000'
```

Change it.


# Running

You can run it on a web browser using `ionic serve`.
To test it using the Android emulator (assuming you have the emulator setup):
```
ionic platform android
ionic build android
ionic emulate android
```