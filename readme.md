## Demo ##
![](https://github.com/swanzeyb/schedule-app-rn/blob/master/media/schedule_demo.gif)


## What ##
This app takes many pictures of my Starbucks work schedule, and uploads my shifts to Google Calendar.

## Tech ##
Using Google Vision OCR AI, it recognizes text within the photos. The work shifts are then parsed from the text.

The user is signed in using Google's Single Sign On platform on Firebase. This authentication is passed to a HTTPS call to Google Calendar's API to add the found shifts.