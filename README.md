![GT Nexus](https://github.com/AppXpress/ToDoListMobileApp/blob/master/images/GT%20Nexus%20Inbox%20Header.jpg)

ReportingApp
==============

The code on this repository is a completed phonegap project of a mobile application that showcases the ability to
create charts from reports generated on the GTNexus platform and served over over a RESTful web service. The purpose
of the app is to emphasize the power and flexibility of the GTNexus API service as well as the usefulness and ease
of reporting on data that is stored on GTNexus's cloud. 

## About

Applications built on the GTNexus platform allow developers
to enhance and extend the core GT Nexus process and integrate 
with their existing systems in real time using an application 
platform and an open data API. This repository provides an example
of an application that is deployable to any mobile device and 
displays the power of the AppXpress API. The AppXpress API allows
flexibility and accessibility to the vast data stored on the GTNexus
platform through an easy to use RESTful service. 

## Information

This repository contains source code for an App that is designed to
be built on the open source technology framework PhoneGap. PhoneGap allows
mobile apps to be web based and then built to be deployed on specific 
devices in order to utilize the devices native features. This app, however, is
only currently available on android device and emulators.

### Installation
================

To be able to deploy the code in this repository into a mobile app, 
there are a couple of steps that must be followed to be able to build the 
app on the operating system of your choice. Ultimately, free 
open source software PhoneGap will do the majority of the heavily lifting 
of converting our web based source code into platform specific code.

	
#### Step 1 - Install Phonegap & Android Studio 

Firstly, you must install phonegap and android studio and add them to your path. If your using nodejs' package
manager npm, you can run the following commands to install phonegap.
 
On Windows:           `npm install -g phonegap`
                      &    
                      `npm install -g cordova`

On Mac or Linux:      `sudo npm install -g phonegap`
                      &
					  `sudo npm install -g cordova`

This might take a few moments, while PhoneGap & Cordova downloads and installs. If this throws an error,
make sure node js is configured in your PATH.

To compile and run your app, you must first download the necessary sdk.

* For Android Studio, follow download from->        [Android SDK] (http://developer.android.com/sdk/index.html)


#### Step 2 - Pull Source Code from Git

Create a new git repository

Run->     `git init`

Now, all you have to do is pull down the source code in this GIT repository. 

Run->      `git pull https://github.com/AppXpress/ReportingApp.git`

This will pull down the source code found on this git repository. The source code is a complete
phonegap project.

#### Step 3 - Run the app

Since this source code is already a completed phonegap project, all you have to do is build and run the
project. Phonegaps run command does both of these for us, and will launch an emulator from the android studio.

Run->      `phonegap run`

And thats it! The app should launch in the android emulator or onto your android device if you have one connected
to your computer. 

### Additional Notes

- The App uses the AngularJs framework along with Ionic framework. More information on angular can be found [here](https://angularjs.org/) abd
information on Ionic can be found [here](http://ionicframework.com/docs/).


*Andrew Reynolds* <br>
*GTNexus* <br>
*December 1, 2015* <br>
 

