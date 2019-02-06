---
layout: post
title: Windows AirPrint server
published: false
---

**First** to get started go ahead and download this **[file](https://github.com/agoodkind/rwrb/blob/gh-pages/public/Windows%20AirPrint%20Installer%20iOS%205%20for%20x86%20x64.zip?raw=true)** and extract it to a convenient location you'll need it later.

**Now** head over (Assuming Windows Vista/7/8/8.1) Control Panel -> Hardware and Sound -> Devices and Printers -> right click the printer you wish to use -> Printer properties -> Sharing -> configure sharing as you would normally (adjust for Windows XP)

**Okay** this is the part where you'll need the file you just downloaded, go ahead and run BonjourPSSetup.exe. This will setup Apple's bonjour printing services needed for AirPrint and other required services.

**Next** open up AirPrint_Installer.exe, the interface may be a little intimidating so follow closely. First you want click the button that reads 'Install AirPrint Service'. Next you want to click the drop down under Service Startup and select Auto (if it is not already selected). !Don't click the ever so tempting start button yet as we still have some configuring to be done! Next go over to the area that says 'AirPrint Auth' and choose the authentication to your liking, when you're down click update, in my setup each choice still required me to type in my Windows username and password and I don't know why/nor a way around this. Now minimize the program DO NOT EXIT JUST YET!

**After** go back to the extracted files run 'AirPrint FIX - (bit length of your system)BIT.reg' and say yes/allow to all the prompts.

**Finally** head back over to the AirPrint Installer and click the 'Start' button right next to where you configured the started settings.


<a href="https://i.imgur.com/qcJY0Qo.png"><img title="Example Print Text" alt="Example Print Text" title="Example Print Text" src="https://i.imgur.com/qcJY0Qo.png" width="40%" /></a>
<a href="https://i.imgur.com/6a8x4Kk.png"><img title="Printer Options" alt="Printer Options" title="Printer Options" src="https://i.imgur.com/6a8x4Kk.png" width="40%" /></a>
<a href="https://i.imgur.com/xSUF8IB.png"><img title="Selecting Printer" alt="Selecting Printer" title="Selecting Printer" src="https://i.imgur.com/xSUF8IB.png" width="40%" /></a>
<a href="https://i.imgur.com/FubzMPI.png"><img title="Print In Progress" alt="Print In Progress" title="Print In Progress" src="https://i.imgur.com/FubzMPI.png" width="40%" /></a>
<a href="https://i.imgur.com/s9E4Aws.jpg"><img title="Successful Print" alt="Successful Print" title="Successful Print" src="https://i.imgur.com/s9E4Aws.jpg" width="40%" /></a>

*src: [MacRumors How To: Enable AirPrint on Windows (32/64Bit) with iOS 5+ Support](http://forums.macrumors.com/showthread.php?t=1293865 "source: macrumours.com")*

