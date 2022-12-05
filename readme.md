## Demo ##
![](https://github.com/swanzeyb/schedule-app-rn/blob/master/media/schedule_demo.gif)


## What ##
This app lets the user takes many pictures of their Starbucks work schedule, and uploads the shifts to their Google Calendar.

## Tech ##
When a user uploads an image, an API request is sent to a custom Firebase Cloud Function. This function calls Google's OCR AI to recognize text. A seperate function parses the text to find work shifts.

The user is then authenticated using Google's Single Sign On platform provided by Firebase. This authentication is passed with an HTTPS call to Google Calendar's API to add the found shifts.

## Design ##
This project's design files can be found on Figma here:
https://www.figma.com/file/sQ1iQeRQMbjDhaHxJr8Bj6/Schedule-to-Calendar?node-id=0%3A1